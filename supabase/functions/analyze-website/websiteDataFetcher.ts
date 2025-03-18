
import { DOMParser } from "https://deno.land/x/deno_dom@v0.1.38/deno-dom-wasm.ts";

/**
 * Fetches and extracts data from a website URL
 */
export async function fetchWebsiteData(url: string) {
  try {
    // Ensure URL has protocol
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }
    
    console.log(`Fetching website: ${url}`);
    
    // Fetch the website content
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch website: ${response.status}`);
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
    console.log(`Title: ${title}`);
    
    // Extract meta description
    const metaDescription = doc.querySelector('meta[name="description"]')?.getAttribute("content") || 
                            doc.querySelector('meta[property="og:description"]')?.getAttribute("content") || 
                            "No description found";
    
    // Extract meta keywords
    const metaKeywords = doc.querySelector('meta[name="keywords"]')?.getAttribute("content") || 
                         "No keywords found";
    
    // Extract visible text
    let visibleText = "";
    // Get main content elements
    const contentElements = doc.querySelectorAll("p, h1, h2, h3, h4, h5, h6, li, a, span, div");
    for (let i = 0; i < contentElements.length; i++) {
      const text = contentElements[i].textContent?.trim();
      if (text && text.length > 20) { // Filter out short snippets that are likely not relevant
        visibleText += text + " ";
      }
      
      // Limit text length to avoid excessive token usage
      if (visibleText.length > 5000) {
        break;
      }
    }
    
    visibleText = visibleText.replace(/\s+/g, " ").trim();
    console.log(`Extracted ${visibleText.length} characters of visible text`);
    
    // Return structured data
    return {
      title,
      description: metaDescription,
      keywords: metaKeywords,
      visibleText
    };
  } catch (error) {
    console.error("Error in fetchWebsiteData:", error);
    throw error;
  }
}
