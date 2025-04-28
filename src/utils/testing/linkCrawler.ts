
import puppeteer from 'puppeteer';
import { LinkCrawler, CrawlerOptions } from './crawler';

export async function crawlSite(startUrl: string, options?: Partial<CrawlerOptions>): Promise<void> {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  const crawler = new LinkCrawler({
    baseUrl: startUrl,
    ...options
  });

  try {
    const report = await crawler.crawl(page, startUrl);
    
    console.log('\n📊 Crawl Report:');
    console.log(`✓ Visited URLs: ${report.visitedUrls}`);
    
    if (report.brokenLinks.length > 0) {
      console.error('\n🚨 Broken Links Found:');
      console.table(report.brokenLinks);
    }
    
    if (report.errors.length > 0) {
      console.error('\n⚠️ Crawl Errors:');
      console.table(report.errors);
    }

    if (report.brokenLinks.length === 0 && report.errors.length === 0) {
      console.log('\n✅ No broken links found!');
    } else {
      process.exit(1); // Exit with error if any issues found
    }
  } finally {
    await browser.close();
  }
}
