
export interface CrawlResult {
  url: string;
  status?: number;
  error?: string;
}

export interface CrawlReport {
  brokenLinks: CrawlResult[];
  errors: CrawlResult[];
  visitedUrls: number;
  timestamp: string;
}

export class ReportManager {
  private brokenLinks: CrawlResult[] = [];
  private errors: CrawlResult[] = [];
  private visitedCount = 0;

  addBrokenLink(url: string, status: number): void {
    this.brokenLinks.push({ url, status });
    this.visitedCount++;
  }

  addError(url: string, error: string): void {
    this.errors.push({ url, error });
    this.visitedCount++;
  }

  getReport(): CrawlReport {
    return {
      brokenLinks: this.brokenLinks,
      errors: this.errors,
      visitedUrls: this.visitedCount,
      timestamp: new Date().toISOString()
    };
  }

  clear(): void {
    this.brokenLinks = [];
    this.errors = [];
    this.visitedCount = 0;
  }
}
