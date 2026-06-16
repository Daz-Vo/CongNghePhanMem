import logging
import httpx
from typing import Optional, List, Dict, Any
from urllib.parse import quote

logger = logging.getLogger(__name__)


class WikipediaService:
    """
    Service to fetch medical information from Wikipedia.
    Supports both English and Vietnamese Wikipedia.
    No API key required - completely free!
    """

    # Wikipedia endpoints
    EN_WIKI_API = "https://en.wikipedia.org/w/api.php"
    VI_WIKI_API = "https://vi.wikipedia.org/w/api.php"
    
    # Timeout for requests
    TIMEOUT = 10

    @staticmethod
    def _get_wiki_api_url(language: str = "en") -> str:
        """Get Wikipedia API endpoint based on language."""
        if language.lower() in ["vi", "vietnamese"]:
            return WikipediaService.VI_WIKI_API
        return WikipediaService.EN_WIKI_API

    async def search(self, query: str, language: str = "en", limit: int = 5) -> List[Dict[str, Any]]:
        """
        Search Wikipedia for articles matching the query.
        
        Args:
            query: Search term (e.g., "aspirin", "drug interaction")
            language: "en" or "vi" for English or Vietnamese
            limit: Max results to return
            
        Returns:
            List of search results with title and snippet
        """
        try:
            wiki_url = self._get_wiki_api_url(language)
            
            params = {
                "action": "query",
                "format": "json",
                "srsearch": query,
                "srwhat": "text",
                "srprop": "snippet|size|timestamp",
                "srlimit": limit,
                "list": "search"
            }
            
            headers = {
                "User-Agent": "MediAI/1.0 (https://localhost)"
            }
            
            logger.info(f"[Wikipedia] Searching '{query}' in {language} Wikipedia")
            
            async with httpx.AsyncClient(trust_env=False, headers=headers, follow_redirects=True) as client:
                response = await client.get(wiki_url, params=params, timeout=self.TIMEOUT)
                
                if response.status_code != 200:
                    logger.warning(f"[Wikipedia] Search failed: {response.status_code} {response.text}")
                    return []
                
                data = response.json()
                search_results = data.get("query", {}).get("search", [])
                
                logger.info(f"[Wikipedia] Found {len(search_results)} results")
                return search_results
                
        except Exception as e:
            logger.error(f"[Wikipedia] Search error: {e}")
            return []

    async def get_article_summary(
        self, 
        article_title: str, 
        language: str = "en", 
        chars: int = 500
    ) -> Optional[str]:
        """
        Get the introduction/summary of a Wikipedia article.
        
        Args:
            article_title: Wikipedia article title
            language: "en" or "vi"
            chars: Max characters to return (default 500)
            
        Returns:
            Article summary or None if not found
        """
        try:
            wiki_url = self._get_wiki_api_url(language)
            
            params = {
                "action": "query",
                "format": "json",
                "titles": article_title,
                "prop": "extracts",
                "explaintext": "true",
                "exintro": "true",  # Get only intro section
                "exchars": chars
            }
            
            logger.info(f"[Wikipedia] Fetching article: '{article_title}' ({language})")
            
            headers = {
                "User-Agent": "MediAI/1.0 (https://localhost)"
            }
            async with httpx.AsyncClient(trust_env=False, headers=headers, follow_redirects=True) as client:
                response = await client.get(wiki_url, params=params, timeout=self.TIMEOUT)
                
                if response.status_code != 200:
                    logger.warning(f"[Wikipedia] Fetch failed: {response.status_code} {response.text}")
                    return None
                
                data = response.json()
                pages = data.get("query", {}).get("pages", {})
                
                # Get first (and usually only) page
                for page_id, page_data in pages.items():
                    if page_id != "-1":  # -1 means page not found
                        extract = page_data.get("extract", "").strip()
                        if extract:
                            logger.info(f"[Wikipedia] Got extract for '{article_title}' ({len(extract)} chars)")
                            return extract
                
                logger.warning(f"[Wikipedia] Article not found: '{article_title}'")
                return None
                
        except Exception as e:
            logger.error(f"[Wikipedia] Get article error: {e}")
            return None

    async def get_full_article(
        self, 
        article_title: str, 
        language: str = "en"
    ) -> Optional[str]:
        """
        Get the full content of a Wikipedia article.
        
        Args:
            article_title: Wikipedia article title
            language: "en" or "vi"
            
        Returns:
            Full article content or None if not found
        """
        try:
            wiki_url = self._get_wiki_api_url(language)
            
            params = {
                "action": "query",
                "format": "json",
                "titles": article_title,
                "prop": "extracts",
                "explaintext": "true"
            }
            
            logger.info(f"[Wikipedia] Fetching full article: '{article_title}' ({language})")
            
            headers = {
                "User-Agent": "MediAI/1.0 (https://localhost)"
            }
            async with httpx.AsyncClient(trust_env=False, headers=headers, follow_redirects=True) as client:
                response = await client.get(wiki_url, params=params, timeout=self.TIMEOUT)
                
                if response.status_code != 200:
                    logger.warning(f"[Wikipedia] Full article fetch failed: {response.status_code} {response.text}")
                    return None
                
                data = response.json()
                pages = data.get("query", {}).get("pages", {})
                
                for page_id, page_data in pages.items():
                    if page_id != "-1":
                        extract = page_data.get("extract", "").strip()
                        if extract:
                            # Limit to first 3000 chars to avoid overwhelming context
                            return extract[:3000]
                
                return None
                
        except Exception as e:
            logger.error(f"[Wikipedia] Get full article error: {e}")
            return None

    async def search_and_summarize(
        self,
        query: str,
        language: str = "en"
    ) -> Optional[str]:
        """
        Search for a term and return summary of the best matching article.
        
        Args:
            query: Search term
            language: "en" or "vi"
            
        Returns:
            Article summary or None
        """
        try:
            # First search
            results = await self.search(query, language, limit=1)
            
            article_title = None
            if results:
                article_title = results[0].get("title")
            else:
                logger.warning(f"[Wikipedia] No search results for '{query}', trying direct article fetch")
                article_title = query
            
            if not article_title:
                return None
            
            # Fetch article summary
            summary = await self.get_article_summary(article_title, language)
            
            if summary:
                # Add article link for reference
                wiki_lang = "vi" if language.lower() in ["vi", "vietnamese"] else "en"
                article_url = f"https://{wiki_lang}.wikipedia.org/wiki/{quote(article_title)}"
                return f"{summary}\n\n[Source: Wikipedia - {article_title}]({article_url})"
            
            return None
            
        except Exception as e:
            logger.error(f"[Wikipedia] Search and summarize error: {e}")
            return None

    async def extract_medical_context(
        self,
        terms: List[str],
        language: str = "en",
        max_results: int = 3
    ) -> Dict[str, Optional[str]]:
        """
        Extract medical information for multiple terms (drugs, diseases, symptoms).
        
        Args:
            terms: List of medical terms to look up
            language: "en" or "vi"
            max_results: Max articles to fetch per term
            
        Returns:
            Dictionary mapping term -> summary
        """
        results = {}
        
        for term in terms:
            try:
                summary = await self.search_and_summarize(term, language)
                results[term] = summary
            except Exception as e:
                logger.error(f"[Wikipedia] Error extracting context for '{term}': {e}")
                results[term] = None
        
        return results


# Global instance
wikipedia_service = WikipediaService()
