/**
 * News Plugin API
 * Handles daily news fetching and opinion management
 */

class NewsPluginAPI {
  constructor() {
    this.newsData = [];
    this.opinions = [];
    this.initStorageKeys();
  }

  initStorageKeys() {
    this.STORAGE_KEYS = {
      news: 'blog_news_data',
      opinions: 'blog_opinions_data',
      lastFetch: 'blog_news_last_fetch'
    };
  }

  /**
   * Fetch daily news from News API
   * @param {string} apiKey - News API key
   * @param {string} country - Country code (default: 'us')
   * @returns {Promise<Array>} Array of news articles
   */
  async fetchDailyNews(apiKey, country = 'us') {
    try {
      const response = await fetch(
        `https://newsapi.org/v2/top-headlines?country=${country}&apiKey=${apiKey}`
      );
      const data = await response.json();
      
      if (data.status === 'ok') {
        this.newsData = data.articles;
        localStorage.setItem(this.STORAGE_KEYS.news, JSON.stringify(this.newsData));
        localStorage.setItem(this.STORAGE_KEYS.lastFetch, new Date().toISOString());
        return this.newsData;
      } else {
        throw new Error(data.message || 'Failed to fetch news');
      }
    } catch (error) {
      console.error('Error fetching news:', error);
      return this.getCachedNews();
    }
  }

  /**
   * Get cached news from localStorage
   * @returns {Array} Cached news articles
   */
  getCachedNews() {
    const cached = localStorage.getItem(this.STORAGE_KEYS.news);
    return cached ? JSON.parse(cached) : [];
  }

  /**
   * Add an opinion to a news article
   * @param {number} newsIndex - Index of the news article
   * @param {string} opinionText - Opinion content
   * @returns {Object} Opinion object
   */
  addOpinion(newsIndex, opinionText) {
    const opinion = {
      id: Date.now(),
      newsIndex,
      text: opinionText,
      createdAt: new Date().toISOString(),
      likes: 0
    };
    
    this.opinions.push(opinion);
    localStorage.setItem(this.STORAGE_KEYS.opinions, JSON.stringify(this.opinions));
    return opinion;
  }

  /**
   * Get all opinions for a specific news article
   * @param {number} newsIndex - Index of the news article
   * @returns {Array} Opinions for the article
   */
  getOpinions(newsIndex) {
    return this.opinions.filter(opinion => opinion.newsIndex === newsIndex);
  }

  /**
   * Update an opinion
   * @param {number} opinionId - Opinion ID
   * @param {string} newText - Updated opinion text
   * @returns {Object|null} Updated opinion or null if not found
   */
  updateOpinion(opinionId, newText) {
    const opinion = this.opinions.find(o => o.id === opinionId);
    if (opinion) {
      opinion.text = newText;
      opinion.updatedAt = new Date().toISOString();
      localStorage.setItem(this.STORAGE_KEYS.opinions, JSON.stringify(this.opinions));
      return opinion;
    }
    return null;
  }

  /**
   * Delete an opinion
   * @param {number} opinionId - Opinion ID
   * @returns {boolean} True if deleted, false if not found
   */
  deleteOpinion(opinionId) {
    const index = this.opinions.findIndex(o => o.id === opinionId);
    if (index !== -1) {
      this.opinions.splice(index, 1);
      localStorage.setItem(this.STORAGE_KEYS.opinions, JSON.stringify(this.opinions));
      return true;
    }
    return false;
  }

  /**
   * Like an opinion
   * @param {number} opinionId - Opinion ID
   * @returns {Object|null} Updated opinion or null if not found
   */
  likeOpinion(opinionId) {
    const opinion = this.opinions.find(o => o.id === opinionId);
    if (opinion) {
      opinion.likes += 1;
      localStorage.setItem(this.STORAGE_KEYS.opinions, JSON.stringify(this.opinions));
      return opinion;
    }
    return null;
  }

  /**
   * Get all stored opinions
   * @returns {Array} All opinions
   */
  getAllOpinions() {
    return this.opinions;
  }

  /**
   * Load opinions from localStorage
   */
  loadStoredOpinions() {
    const stored = localStorage.getItem(this.STORAGE_KEYS.opinions);
    this.opinions = stored ? JSON.parse(stored) : [];
  }
}

// Export for use in browser
if (typeof module !== 'undefined' && module.exports) {
  module.exports = NewsPluginAPI;
}
