/**
 * News Plugin UI Component
 * Handles rendering and user interactions for the news plugin
 */

class NewsPluginUI {
  constructor(containerId, apiInstance) {
    this.container = document.getElementById(containerId);
    this.api = apiInstance;
    this.currentNewsIndex = null;
  }

  /**
   * Render news articles
   * @param {Array} news - Array of news articles
   */
  renderNews(news) {
    if (!this.container) {
      console.error('Container not found');
      return;
    }

    const newsHTML = news.map((article, index) => `
      <div class="news-card" data-index="${index}">
        <div class="news-header">
          <h3>${article.title}</h3>
          <span class="news-source">${article.source.name}</span>
        </div>
        <img src="${article.urlToImage || 'placeholder.jpg'}" alt="${article.title}" class="news-image">
        <p class="news-description">${article.description || ''}</p>
        <p class="news-date">${new Date(article.publishedAt).toLocaleDateString()}</p>
        <div class="news-actions">
          <a href="${article.url}" target="_blank" class="btn-read-more">Read Full Article</a>
          <button class="btn-add-opinion" data-index="${index}">Add Opinion</button>
        </div>
        <div class="opinions-section" id="opinions-${index}"></div>
      </div>
    `).join('');

    this.container.innerHTML = `<div class="news-container">${newsHTML}</div>`;
    this.attachEventListeners();
  }

  /**
   * Attach event listeners to dynamically rendered elements
   */
  attachEventListeners() {
    document.querySelectorAll('.btn-add-opinion').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const index = e.target.dataset.index;
        this.showOpinionForm(index);
      });
    });
  }

  /**
   * Show opinion form modal
   * @param {number} newsIndex - Index of the news article
   */
  showOpinionForm(newsIndex) {
    this.currentNewsIndex = newsIndex;
    const modalHTML = `
      <div class="opinion-modal" id="opinion-modal">
        <div class="modal-content">
          <span class="close-modal">&times;</span>
          <h2>Share Your Opinion</h2>
          <textarea id="opinion-text" placeholder="Write your opinion about this news..." rows="6"></textarea>
          <button id="submit-opinion" class="btn-submit">Submit Opinion</button>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    document.getElementById('submit-opinion').addEventListener('click', () => {
      this.submitOpinion();
    });

    document.querySelector('.close-modal').addEventListener('click', () => {
      document.getElementById('opinion-modal').remove();
    });
  }

  /**
   * Submit opinion and refresh the UI
   */
  submitOpinion() {
    const opinionText = document.getElementById('opinion-text').value.trim();
    
    if (!opinionText) {
      alert('Please write an opinion');
      return;
    }

    this.api.addOpinion(this.currentNewsIndex, opinionText);
    document.getElementById('opinion-modal').remove();
    this.renderOpinions(this.currentNewsIndex);
  }

  /**
   * Render opinions for a specific news article
   * @param {number} newsIndex - Index of the news article
   */
  renderOpinions(newsIndex) {
    const opinions = this.api.getOpinions(newsIndex);
    const opinionsContainer = document.getElementById(`opinions-${newsIndex}`);

    if (!opinionsContainer) return;

    const opinionsHTML = opinions.map(opinion => `
      <div class="opinion" data-opinion-id="${opinion.id}">
        <p class="opinion-text">${this.escapeHtml(opinion.text)}</p>
        <div class="opinion-meta">
          <span class="opinion-date">${new Date(opinion.createdAt).toLocaleDateString()}</span>
          <span class="opinion-likes">👍 ${opinion.likes}</span>
        </div>
        <div class="opinion-actions">
          <button class="btn-like" data-opinion-id="${opinion.id}">Like</button>
          <button class="btn-edit" data-opinion-id="${opinion.id}">Edit</button>
          <button class="btn-delete" data-opinion-id="${opinion.id}">Delete</button>
        </div>
      </div>
    `).join('');

    opinionsContainer.innerHTML = opinionsHTML ? `<div class="opinions-list">${opinionsHTML}</div>` : '';
    this.attachOpinionEventListeners(newsIndex);
  }

  /**
   * Attach event listeners to opinion buttons
   * @param {number} newsIndex - Index of the news article
   */
  attachOpinionEventListeners(newsIndex) {
    const opinionsContainer = document.getElementById(`opinions-${newsIndex}`);
    if (!opinionsContainer) return;

    opinionsContainer.querySelectorAll('.btn-like').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const opinionId = parseInt(e.target.dataset.opinionId);
        this.api.likeOpinion(opinionId);
        this.renderOpinions(newsIndex);
      });
    });

    opinionsContainer.querySelectorAll('.btn-delete').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const opinionId = parseInt(e.target.dataset.opinionId);
        if (confirm('Are you sure?')) {
          this.api.deleteOpinion(opinionId);
          this.renderOpinions(newsIndex);
        }
      });
    });

    opinionsContainer.querySelectorAll('.btn-edit').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const opinionId = parseInt(e.target.dataset.opinionId);
        this.showEditOpinionForm(opinionId, newsIndex);
      });
    });
  }

  /**
   * Show edit opinion form
   * @param {number} opinionId - Opinion ID
   * @param {number} newsIndex - Index of the news article
   */
  showEditOpinionForm(opinionId, newsIndex) {
    const opinion = this.api.opinions.find(o => o.id === opinionId);
    if (!opinion) return;

    const modalHTML = `
      <div class="opinion-modal" id="opinion-modal">
        <div class="modal-content">
          <span class="close-modal">&times;</span>
          <h2>Edit Your Opinion</h2>
          <textarea id="opinion-text" rows="6">${this.escapeHtml(opinion.text)}</textarea>
          <button id="update-opinion" class="btn-submit" data-opinion-id="${opinionId}">Update Opinion</button>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    document.getElementById('update-opinion').addEventListener('click', () => {
      const updatedText = document.getElementById('opinion-text').value.trim();
      if (updatedText) {
        this.api.updateOpinion(opinionId, updatedText);
        document.getElementById('opinion-modal').remove();
        this.renderOpinions(newsIndex);
      }
    });

    document.querySelector('.close-modal').addEventListener('click', () => {
      document.getElementById('opinion-modal').remove();
    });
  }

  /**
   * Escape HTML to prevent XSS
   * @param {string} text - Text to escape
   * @returns {string} Escaped text
   */
  escapeHtml(text) {
    const map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
  }

  /**
   * Show loading state
   */
  showLoading() {
    this.container.innerHTML = '<p class="loading">Loading news...</p>';
  }

  /**
   * Show error message
   * @param {string} message - Error message
   */
  showError(message) {
    this.container.innerHTML = `<p class="error">${message}</p>`;
  }
}

// Export for use in browser
if (typeof module !== 'undefined' && module.exports) {
  module.exports = NewsPluginUI;
}
