import logging
import re
from typing import Set
from app.services.neo4j_service import neo4j_service

logger = logging.getLogger(__name__)

try:
    from sentence_transformers import SentenceTransformer, util
    import torch
    MODEL_AVAILABLE = True
except ImportError:
    MODEL_AVAILABLE = False

class NERService:
    """
    Named Entity Recognition Service for Medical Chatbot.
    Identifies Drugs and Diseases from user queries using Semantic Vector Search.
    """
    
    def __init__(self):
        self.drug_names = []
        self.disease_names = []
        self.drug_embeddings = None
        self.disease_embeddings = None
        
        if MODEL_AVAILABLE:
            logger.info("Loading sentence-transformers model (all-MiniLM-L6-v2)...")
            self.model = SentenceTransformer('all-MiniLM-L6-v2')
        else:
            logger.warning("sentence-transformers not available. Falling back to exact match.")
            self.model = None
            
        self._last_refresh = 0
        self._refresh_interval = 3600  # 1 hour

    def _normalize_text(self, text: str) -> str:
        text = text.lower()
        text = re.sub(r'[^\w\s]', '', text)
        return text.strip()

    def refresh_entities(self):
        """Fetch drug and disease names from Neo4j and compute embeddings."""
        try:
            logger.info("Refreshing NER entity cache from Neo4j...")
            drugs = neo4j_service.search_drugs("", limit=1000)
            diseases = neo4j_service.search_diseases("", limit=1000)
            
            self.drug_names = [d["name"] for d in drugs]
            self.disease_names = [d["name"] for d in diseases]
            
            if self.model:
                logger.info("Computing Semantic Embeddings for entities...")
                if self.drug_names:
                    self.drug_embeddings = self.model.encode(self.drug_names, convert_to_tensor=True)
                if self.disease_names:
                    self.disease_embeddings = self.model.encode(self.disease_names, convert_to_tensor=True)
                    
            logger.info(f"NER cache refreshed: {len(self.drug_names)} drugs, {len(self.disease_names)} diseases.")
        except Exception as e:
            logger.error(f"Failed to refresh NER cache: {e}")

    def extract_entities(self, text: str) -> dict:
        """
        Extract drugs and diseases from text.
        Priority 1: Quoted strings (e.g. "headache")
        Priority 2: Semantic Vector Similarity (Cosine Similarity > 0.8)
        """
        if not self.drug_names:
            self.refresh_entities()

        extracted_drugs = set()
        extracted_diseases = set()

        # 1. Quoted Entities Extraction (Highest Priority)
        quoted_phrases = re.findall(r'["\'](.*?)["\']', text)
        if quoted_phrases:
            logger.info(f"Found quoted entities: {quoted_phrases}")
            words_to_check = quoted_phrases
        else:
            # Sliding window of 1-3 words
            normalized_query = self._normalize_text(text)
            words = normalized_query.split()
            words_to_check = []
            for n in range(1, 4):
                for i in range(len(words) - n + 1):
                    words_to_check.append(" ".join(words[i:i+n]))

        if not words_to_check:
            return {"drugs": [], "diseases": []}

        if self.model and self.drug_embeddings is not None and self.disease_embeddings is not None:
            # Semantic Search
            phrase_embeddings = self.model.encode(words_to_check, convert_to_tensor=True)
            
            if self.drug_names:
                cos_scores_drugs = util.cos_sim(phrase_embeddings, self.drug_embeddings)
                for i in range(len(words_to_check)):
                    best_score, best_idx = torch.max(cos_scores_drugs[i], dim=0)
                    if best_score.item() > 0.78:  # 0.78 similarity threshold
                        extracted_drugs.add(self.drug_names[best_idx])
                        
            if self.disease_names:
                cos_scores_diseases = util.cos_sim(phrase_embeddings, self.disease_embeddings)
                for i in range(len(words_to_check)):
                    best_score, best_idx = torch.max(cos_scores_diseases[i], dim=0)
                    if best_score.item() > 0.78:
                        extracted_diseases.add(self.disease_names[best_idx])
        else:
            # Fallback to Exact/Fuzzy Matching
            for phrase in words_to_check:
                norm_phrase = self._normalize_text(phrase)
                for drug in self.drug_names:
                    if norm_phrase == self._normalize_text(drug):
                        extracted_drugs.add(drug)
                for disease in self.disease_names:
                    if norm_phrase == self._normalize_text(disease):
                        extracted_diseases.add(disease)

        return {
            "drugs": list(extracted_drugs),
            "diseases": list(extracted_diseases)
        }

ner_service = NERService()
