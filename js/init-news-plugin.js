/**
 * Initialize News Plugin
 * Add this to your HTML to start using the News Plugin
 */

document.addEventListener('DOMContentLoaded', function() {
  // Initialize the API and UI
  const newsAPI = new NewsPluginAPI();
  const newsUI = new NewsPluginUI('news-plugin-container', newsAPI);

  // Your NewsAPI key - Get it from https://newsapi.org
  const NEWS_API_KEY = 'YOUR_API_KEY_HERE';

  // Load stored opinions
  newsAPI.loadStoredOpinions();

  // Fetch and display news
  newsUI.showLoading();

  newsAPI.fetchDailyNews(NEWS_API_KEY, 'us').then(news => {
    if (news.length > 0) {
      newsUI.renderNews(news);
      
      // Render opinions for each article
      news.forEach((_, index) => {
        newsUI.renderOpinions(index);
      });
    } else {
      newsUI.showError('No news available. Please try again later.');
    }
  }).catch(error => {
    console.error('Error:', error);
    newsUI.showError('Failed to load news. Please check your API key and try again.');
  });

  // Optional: Refresh news every 6 hours
  setInterval(() => {
    newsAPI.fetchDailyNews(NEWS_API_KEY, 'us').then(news => {
      if (news.length > 0) {
        newsUI.renderNews(news);
        news.forEach((_, index) => {
          newsUI.renderOpinions(index);
        });
      }
    }).catch(error => {
      console.warn('Auto-refresh failed:', error);
    });
  }, 6 * 60 * 60 * 1000); // 6 hours in milliseconds
});
