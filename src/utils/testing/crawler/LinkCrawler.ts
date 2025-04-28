
import { Page } from 'puppeteer';
import { isInternalUrl, isValidUrl } from './urlUtils';
import { CrawlReport, ReportManager } from './ReportManager';

export interface CrawlerOptions {
  baseUrl: string;
  maxDepth?: number;
  timeout?: number;
  concurrency?: number;
}

export class LinkCrawler {
  private visitedUrls: Set<string> = new Set();
  private readonly reportManager: ReportManager;
  private readonly options: Required<CrawlerOptions>;

  constructor(options: CrawlerOptions) {
    this.reportManager = new ReportManager();
    this.options = {
      maxDepth: 10,
      timeout: 15000,
      concurrency: 5,
      ...options
    };
  }

  async crawl(page: Page, url: string, currentDepth = 0): Promise<CrawlReport> {
    if (currentDepth >= this.options.maxDepth || this.visitedUrls.has(url)) {
      return this.reportManager.getReport();
    }

    this.visitedUrls.add(url);
    console.log(`🌐 Crawling: ${url}`);

    try {
      const response = await page.goto(url, { 
        waitUntil: 'networkidle2', 
        timeout: this.options.timeout 
      });
      
      if (!response) {
        this.reportManager.addError(url, 'No response');
        return this.reportManager.getReport();
      }

      const status = response.status();
      if (status >= 400) {
        this.reportManager.addBrokenLink(url, status);
      }

      await this.processPageLinks(page, url, currentDepth);

    } catch (error) {
      this.reportManager.addError(url, error instanceof Error ? error.message : 'Unknown error');
    }

    return this.reportManager.getReport();
  }

  private async processPageLinks(page: Page, currentUrl: string, depth: number): Promise<void> {
    const links = await page.$$eval('a', anchors => 
      anchors.map(a => ({ href: a.href, text: a.textContent }))
    );

    const validLinks = links.filter(({ href }) => 
      isValidUrl(href) && isInternalUrl(href, this.options.baseUrl)
    );

    for (const { href } of validLinks) {
      if (!this.visitedUrls.has(href)) {
        await this.crawl(page, href, depth + 1);
      }
    }
  }

  getReport(): CrawlReport {
    return this.reportManager.getReport();
  }
}
