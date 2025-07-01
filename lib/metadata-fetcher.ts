import { JSDOM } from 'jsdom';

export interface MetaData {
  title?: string;
  description?: string;
  image?: string;
  favicon?: string;
}

export async function fetchMetadata(url: string): Promise<MetaData> {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'LinkNest/1.0 (Bookmark Manager)',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const html = await response.text();
    const dom = new JSDOM(html);
    const { document } = dom.window;

    // Helper function to get meta content
    const getMeta = (name: string): string | null => {
      const selector = `meta[name="${name}"], meta[property="${name}"], meta[property="og:${name}"], meta[name="twitter:${name}"]`;
      const element = document.querySelector(selector);
      return element?.getAttribute('content') || null;
    };

    // Extract metadata
    const title =
      getMeta('title') ||
      getMeta('og:title') ||
      getMeta('twitter:title') ||
      document.querySelector('title')?.textContent ||
      undefined;

    const description =
      getMeta('description') ||
      getMeta('og:description') ||
      getMeta('twitter:description') ||
      undefined;

    const image =
      getMeta('image') ||
      getMeta('og:image') ||
      getMeta('twitter:image') ||
      undefined;

    // Get favicon
    let favicon: string | undefined;
    const faviconElement = document.querySelector(
      'link[rel="icon"], link[rel="shortcut icon"]'
    );
    if (faviconElement) {
      const href = faviconElement.getAttribute('href');
      if (href) {
        favicon = new URL(href, url).href;
      }
    }

    return {
      ...(title?.trim() && { title: title.trim() }),
      ...(description?.trim() && { description: description.trim() }),
      ...(image && { image: new URL(image, url).href }),
      ...(favicon && { favicon }),
    };
  } catch (error) {
    console.error(`Failed to fetch metadata for ${url}:`, error);
    return {};
  }
}
