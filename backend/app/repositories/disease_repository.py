"""
Disease repository for Neo4j operations.
Handles disease lookups and searches.
"""

import logging
from typing import Any

from app.repositories.neo4j_repository import neo4j_repository

logger = logging.getLogger(__name__)


class DiseaseRepository:
    """Repository for disease-related Neo4j operations."""

    def __init__(self):
        self._repository = neo4j_repository

    def get_disease_by_name(self, disease_name: str) -> dict[str, Any] | None:
        """
        Get a disease by exact name with all related information.
        """
        query = """
        MATCH (d:Disease {name: $name})
        OPTIONAL MATCH (m:Medicine)-[:TREATS]->(d)
        OPTIONAL MATCH (d)-[:HAS_SYMPTOM|RELATED_TO]->(s:Symptom)
        RETURN 
            d.name AS name,
            d.description AS description,
            d.icd_code AS icd_code,
            d.updated_at AS updated_at,
            collect(DISTINCT m.name) AS treating_medicines,
            collect(DISTINCT {name: s.name, description: s.description}) AS symptoms
        """
        try:
            results = self._repository.execute_read(query, name=disease_name)
            if results:
                return results[0]
            return None
        except Exception as exc:
            logger.error(f"Error retrieving disease '{disease_name}': {exc}")
            return None

    def search_diseases(self, query_str: str, limit: int = 10, skip: int = 0) -> list[dict[str, Any]]:
        """
        Search for diseases by name or description.
        """
        cypher_query = """
        MATCH (d:Disease)
        WHERE toLower(d.name) CONTAINS toLower($query) 
           OR toLower(d.description) CONTAINS toLower($query)
        RETURN 
            d.name AS name,
            d.description AS description,
            d.icd_code AS icd_code
        SKIP $skip
        LIMIT $limit
        """
        try:
            results = self._repository.execute_read(
                cypher_query, query=query_str, limit=limit, skip=skip
            )
            return results if results else []
        except Exception as exc:
            logger.error(f"Error searching diseases with query '{query_str}': {exc}")
            return []

    def get_treating_medicines(
        self, disease_name: str, limit: int = 10, skip: int = 0
    ) -> list[dict[str, Any]]:
        """
        Get medicines that treat a specific disease.
        """
        query = """
        MATCH (disease:Disease {name: $disease_name})
        MATCH (m:Medicine)-[:TREATS]->(disease)
        RETURN 
            m.name AS name,
            m.brand_name AS brand_name,
            m.generic_name AS generic_name,
            m.dosage AS dosage
        SKIP $skip
        LIMIT $limit
        """
        try:
            results = self._repository.execute_read(
                query, disease_name=disease_name, limit=limit, skip=skip
            )
            return results if results else []
        except Exception as exc:
            logger.error(
                f"Error getting treating medicines for disease '{disease_name}': {exc}"
            )
            return []

    def get_disease_count(self) -> int:
        """
        Get total count of diseases in database.
        """
        query = "MATCH (d:Disease) RETURN COUNT(d) AS count"
        try:
            results = self._repository.execute_read(query)
            if results:
                return results[0].get("count", 0)
            return 0
        except Exception as exc:
            logger.error(f"Error counting diseases: {exc}")
            return 0

    def create_disease(self, data: dict[str, Any]) -> dict[str, Any] | None:
        """Create a new disease node."""
        query = """
        MERGE (d:Disease {name: $name})
        SET d += $props, d.updated_at = datetime()
        RETURN d
        """
        name = data.get("name")
        props = {k: v for k, v in data.items() if k != "name"}
        try:
            results = self._repository.execute_write(query, name=name, props=props)
            return results[0] if results else None
        except Exception as exc:
            logger.error(f"Error creating disease '{name}': {exc}")
            return None

    def update_disease(self, name: str, data: dict[str, Any]) -> dict[str, Any] | None:
        """Update an existing disease node."""
        query = """
        MATCH (d:Disease {name: $name})
        SET d += $props, d.updated_at = datetime()
        RETURN d
        """
        try:
            results = self._repository.execute_write(query, name=name, props=data)
            return results[0] if results else None
        except Exception as exc:
            logger.error(f"Error updating disease '{name}': {exc}")
            return None

    def delete_disease(self, name: str) -> bool:
        """Delete a disease node and its relationships."""
        query = """
        MATCH (d:Disease {name: $name})
        DETACH DELETE d
        """
        try:
            self._repository.execute_write(query, name=name)
            return True
        except Exception as exc:
            logger.error(f"Error deleting disease '{name}': {exc}")
            return False


disease_repository = DiseaseRepository()
