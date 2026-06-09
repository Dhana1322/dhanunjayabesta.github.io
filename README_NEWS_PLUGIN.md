# News Plugin API Documentation

## Overview
The News Plugin API allows you to display daily news articles on your blog and share your opinions about them. It fetches news from the NewsAPI and stores opinions locally.

## Features
- ✅ Fetch daily news from NewsAPI
- ✅ Display news articles in a grid layout
- ✅ Add, edit, and delete opinions
- ✅ Like opinions
- ✅ Local storage for persistence
- ✅ Responsive design

## Installation

### 1. Get NewsAPI Key
1. Visit [newsapi.org](https://newsapi.org)
2. Sign up for a free account
3. Copy your API key

### 2. Add to Your HTML
```html
<!-- Include the styles -->
<link rel="stylesheet" href="styles/news-plugin.css">

<!-- Create a container for news -->
<div id="news-plugin-container"></div>

<!-- Include the API scripts -->
<script src="api/news-plugin.js"></script>
<script src="api/news-plugin-ui.js"></script>
<script src="js/init-news-plugin.js"></script>
```

### 3. Set Your API Key
Edit `js/init-news-plugin.js` and replace `YOUR_API_KEY_HERE` with your actual NewsAPI key:
```javascript
const NEWS_API_KEY = 'your_actual_api_key_here';
```

## Usage

### Basic Setup
```javascript
// Initialize the API and UI
const newsAPI = new NewsPluginAPI();
const newsUI = new NewsPluginUI('news-plugin-container', newsAPI);

// Load stored opinions
newsAPI.loadStoredOpinions();

// Fetch and display news
const NEWS_API_KEY = 'YOUR_NEWSAPI_KEY_HERE';
newsUI.showLoading();

newsAPI.fetchDailyNews(NEWS_API_KEY, 'us').then(news => {
  newsUI.renderNews(news);
  
  // Render opinions for each article
  news.forEach((_, index) => {
    newsUI.renderOpinions(index);
  });
}).catch(error => {
  newsUI.showError('Failed to load news. Please try again later.');
});
```

### API Methods

#### NewsPluginAPI

**fetchDailyNews(apiKey, country)**
- Fetches top headlines from NewsAPI
- Parameters:
  - `apiKey` (string): Your NewsAPI key
  - `country` (string, optional): Country code (default: 'us')
- Returns: Promise<Array> of news articles

**getCachedNews()**
- Retrieves cached news from localStorage
- Returns: Array of cached articles

**addOpinion(newsIndex, opinionText)**
- Adds an opinion to a news article
- Parameters:
  - `newsIndex` (number): Index of the article
  - `opinionText` (string): Opinion content
- Returns: Opinion object

**getOpinions(newsIndex)**
- Retrieves all opinions for a specific article
- Parameters:
  - `newsIndex` (number): Index of the article
- Returns: Array of opinions

**updateOpinion(opinionId, newText)**
- Updates an existing opinion
- Parameters:
  - `opinionId` (number): Opinion ID
  - `newText` (string): Updated opinion text
- Returns: Updated opinion or null

**deleteOpinion(opinionId)**
- Deletes an opinion
- Parameters:
  - `opinionId` (number): Opinion ID
- Returns: boolean (true if deleted)

**likeOpinion(opinionId)**
- Increments like count for an opinion
- Parameters:
  - `opinionId` (number): Opinion ID
- Returns: Updated opinion or null

**getAllOpinions()**
- Retrieves all stored opinions
- Returns: Array of all opinions

**loadStoredOpinions()**
- Loads opinions from localStorage into memory

#### NewsPluginUI

**renderNews(news)**
- Renders news articles in the container
- Parameters:
  - `news` (Array): Array of news articles

**renderOpinions(newsIndex)**
- Renders opinions for a specific article
- Parameters:
  - `newsIndex` (number): Index of the article

**showLoading()**
- Displays loading state

**showError(message)**
- Displays error message
- Parameters:
  - `message` (string): Error message

## Supported Countries
US, UK, CA, AU, IN, DE, FR, IT, ES, NL, BR, RU, CN, JP, KR, MX, and more.

Country codes: ae, ar, at, au, be, bg, br, ca, ch, cn, co, cu, cz, de, eg, es, fr, gb, gr, hk, hu, id, ie, il, in, it, jp, kr, lt, lv, ma, mx, my, ng, nl, no, nz, ph, pl, pt, ro, rs, ru, sa, se, sg, si, sk, th, tr, tw, ua, us, ve, za

## Storage
- News articles are cached in localStorage under `blog_news_data`
- Opinions are stored in localStorage under `blog_opinions_data`
- Last fetch timestamp is stored under `blog_news_last_fetch`

## Security Notes
- Never expose your API key in client-side code in production
- Consider using a backend proxy for API calls in production
- Opinions are sanitized against XSS attacks

## Browser Support
- Modern browsers with localStorage support
- Chrome, Firefox, Safari, Edge (latest versions)

## Example HTML Page

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Blog - Daily News</title>
    <link rel="stylesheet" href="styles/news-plugin.css">
</head>
<body>
    <div class="container">
        <h1>Daily News & My Opinions</h1>
        <div id="news-plugin-container"></div>
    </div>

    <script src="api/news-plugin.js"></script>
    <script src="api/news-plugin-ui.js"></script>
    <script src="js/init-news-plugin.js"></script>
</body>
</html>
```

## Troubleshooting

**Issue: News not loading**
- Check your API key is correct
- Check browser console for errors
- Ensure you have internet connection
- NewsAPI free tier has rate limits

**Issue: Opinions not persisting**
- Check if browser has localStorage enabled
- Check browser console for storage errors
- Try clearing localStorage and reloading

**Issue: Styling not working**
- Ensure CSS file is linked correctly
- Check browser console for CSS errors
- Clear browser cache

## License
MIT

## Support
For issues or questions, please create an issue in the repository.
