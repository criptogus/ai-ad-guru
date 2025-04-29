
// Use simple HTTP client instead of Puppeteer for link crawling
import axios from 'axios';
import { parse as parseHtml } from 'node-html-parser';
import { LinkCrawler, CrawlerOptions } from './crawler';

export async function crawlSite(startUrl: string, options?: Partial<CrawlerOptions>): Promise<void> {
  console.log('Starting text-based crawler (Puppeteer-free implementation)');
  
  // Create a simplified crawler that doesn't use Puppeteer
  const crawler = new LinkCrawler({
    baseUrl: startUrl,
    ...options
  });
  
  try {
    // Basic implementation without browser
    const report = {
      visitedUrls: 1,
      brokenLinks: [],
      errors: []
    };
    
    console.log('\n📊 Simplified Crawl Report:');
    console.log(`✓ Tested base URL: ${startUrl}`);
    
    // Simple connectivity test
    try {
      const response = await axios.get(startUrl);
      console.log(`✓ Base URL accessible (status: ${response.status})`);
      
      // Parse HTML to find links (simplified)
      const html = parseHtml(response.data);
      const links = html.querySelectorAll('a')
        .map(link => link.getAttribute('href'))
        .filter(href => href && !href.startsWith('#') && !href.startsWith('javascript:'));
      
      console.log(`✓ Found ${links.length} links on page`);
    } catch (error) {
      console.error(`✗ Error accessing ${startUrl}:`, error instanceof Error ? error.message : String(error));
      process.exit(1);
    }
    
    console.log('\n✅ Basic connectivity test passed!');
  } catch (error) {
    console.error('\n❌ Crawler error:', error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}
