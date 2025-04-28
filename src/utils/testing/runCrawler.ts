
import { crawlSite } from './linkCrawler';

// Start URL should be your local development server
const startUrl = 'http://localhost:5173'; // Vite's default port

// Run the crawler
crawlSite(startUrl, {
  maxDepth: 10,
  timeout: 15000,
  concurrency: 5
}).catch(error => {
  console.error('Crawler failed:', error);
  process.exit(1);
});
