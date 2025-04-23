
import { DOMParser } from "https://deno.land/x/deno_dom@v0.1.38/deno-dom-wasm.ts";

/**
 * Fetches and extracts data from a website URL
 */
export async function fetchWebsiteData(url: string) {
  try {
    // Ensure URL has protocol
    let formattedUrl = url.trim();
    if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
      // Add https protocol
      formattedUrl = 'https://' + formattedUrl;
    }
    
    console.log(`Fetching website: ${formattedUrl}`);
    
    // Fetch the website content with browser-like user agent
    const response = await fetch(formattedUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      },
      // Add timeout to prevent hanging
      signal: AbortSignal.timeout(15000) // 15 second timeout
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch website: ${response.status} ${response.statusText}`);
    }

    const html = await response.text();
    console.log(`Fetched ${html.length} bytes of HTML content`);
    
    // Parse HTML
    const doc = new DOMParser().parseFromString(html, "text/html");
    if (!doc) {
      throw new Error("Failed to parse HTML");
    }

    // Extract title
    const title = doc.querySelector("title")?.textContent || "No title found";
    
    // Extract meta description
    const metaDescription = doc.querySelector('meta[name="description"]')?.getAttribute("content") || 
                            doc.querySelector('meta[property="og:description"]')?.getAttribute("content") || 
                            "No description found";
    
    // Extract meta keywords
    const metaKeywords = doc.querySelector('meta[name="keywords"]')?.getAttribute("content") || "";
    
    // Extract visible text in a more sophisticated way
    let visibleText = "";
    
    // Extract heading content
    const headings = doc.querySelectorAll("h1, h2, h3, h4");
    for (let i = 0; i < headings.length; i++) {
      const text = headings[i].textContent?.trim();
      if (text && text.length > 0) {
        visibleText += text + ". ";
      }
    }
    
    // Try to find main content by common selectors
    const mainSelectors = [
      'main', 'article', '#main', '#content', '.main', '.content',
      '[role="main"]', 'section'
    ];
    
    let mainContent = "";
    for (const selector of mainSelectors) {
      const element = doc.querySelector(selector);
      if (element) {
        const text = element.textContent?.trim();
        if (text && text.length > 100) { // Only use if substantial content
          mainContent = text;
          break;
        }
      }
    }
    
    if (mainContent) {
      visibleText += mainContent + " ";
    } else {
      // Fallback: get all paragraph content
      const paragraphs = doc.querySelectorAll("p");
      for (let i = 0; i < paragraphs.length; i++) {
        const text = paragraphs[i].textContent?.trim();
        if (text && text.length > 15) { // Filter out short snippets
          visibleText += text + " ";
        }
      }
    }
    
    // Also try to find about section or company info
    const aboutSelectors = [
      '#about', '.about', 'section:contains("About")', 'div:contains("About Us")',
      '#company', '.company', 'section:contains("Company")'
    ];
    
    for (const selector of aboutSelectors) {
      try {
        const element = doc.querySelector(selector);
        if (element) {
          const text = element.textContent?.trim();
          if (text && text.length > 100) { // Only use if substantial content
            visibleText += "About section: " + text + " ";
            break;
          }
        }
      } catch (e) {
        // Some selectors might not be supported by deno_dom, just continue
      }
    }
    
    // Clean up text
    visibleText = visibleText.replace(/\s+/g, " ").trim();
    
    // Limit text to reasonable size (max 7500 chars)
    if (visibleText.length > 7500) {
      visibleText = visibleText.substring(0, 7500);
    }
    
    console.log(`Extracted ${visibleText.length} characters of visible text`);
    
    // Return structured data
    return {
      title,
      description: metaDescription,
      keywords: metaKeywords,
      visibleText,
      url: formattedUrl
    };
  } catch (error) {
    console.error("Error in fetchWebsiteData:", error);
    throw error;
  }
}
