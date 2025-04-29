
import { crawlSite } from './linkCrawler';

// Start URL should be your local development server
const startUrl = 'http://localhost:8080'; // Updated to match vite config port

// Run the simplified crawler
console.log('Running simplified crawler without browser dependencies');
crawlSite(startUrl, {
  maxDepth: 2,
  timeout: 5000,
  concurrency: 1
}).catch(error => {
  console.error('Crawler failed:', error);
  process.exit(1);
});
