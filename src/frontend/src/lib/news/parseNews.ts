interface NewsItem {
  headline: string;
  preview: string;
}

interface GNewsArticle {
  title: string;
  description: string;
  content?: string;
}

interface GNewsResponse {
  articles?: GNewsArticle[];
  errors?: string[];
}

export function parseNewsFromGNews(jsonText: string): { parsedData: NewsItem[]; error: Error | null } {
  // Handle empty or whitespace-only responses gracefully
  if (!jsonText || jsonText.trim() === '') {
    return {
      parsedData: [],
      error: null,
    };
  }

  try {
    // Try to parse as JSON
    const data: GNewsResponse = JSON.parse(jsonText);

    // Check for API errors - return exact error message without prefix
    if (data.errors && data.errors.length > 0) {
      return {
        parsedData: [],
        error: new Error(data.errors.join(', ')),
      };
    }

    // Check if articles exist - treat empty array as valid (no error)
    if (!data.articles || !Array.isArray(data.articles)) {
      return {
        parsedData: [],
        error: null, // Empty is valid, not an error
      };
    }

    // If articles array is empty, return empty result (no error)
    if (data.articles.length === 0) {
      return {
        parsedData: [],
        error: null,
      };
    }

    const newsItems: NewsItem[] = [];

    // Process up to 10 articles
    data.articles.slice(0, 10).forEach((article) => {
      const title = article.title || '';
      const description = article.description || article.content || '';

      // Clean up description
      const cleanDescription = description
        .replace(/<[^>]*>/g, '') // Remove HTML tags
        .replace(/&nbsp;/g, ' ')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .trim();

      // Create preview (first 150 characters)
      const preview = cleanDescription.length > 150
        ? cleanDescription.substring(0, 150) + '...'
        : cleanDescription || 'No preview available';

      if (title) {
        newsItems.push({
          headline: title,
          preview,
        });
      }
    });

    return { parsedData: newsItems, error: null };
  } catch (error) {
    // If JSON parsing fails, return the exact error message
    if (error instanceof Error) {
      return {
        parsedData: [],
        error: new Error(error.message),
      };
    }
    
    return {
      parsedData: [],
      error: new Error('Failed to parse news data'),
    };
  }
}
