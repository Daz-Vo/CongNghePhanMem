"""
Medicine repository for Neo4j operations.
Handles medicine lookups, searches, and relationships.
"""

import logging
from typing import Any

from app.repositories.neo4j_repository import neo4j_repository

logger = logging.getLogger(__name__)


class MedicineRepository:
    """Repository for medicine-related Neo4j operations."""

    def __init__(self):
        self._repository = neo4j_repository

    def get_medicine_by_name(self, name: str) -> dict[str, Any] | None:
        """
        Get a medicine by exact name with all related information.
        """
        query = """
        MATCH (m:Drug)
        WHERE toLower(trim(m.name)) = toLower(trim($name))
           OR toLower(trim(coalesce(m.brand_name, ""))) = toLower(trim($name))
           OR toLower(trim(coalesce(m.generic_name, ""))) = toLower(trim($name))
        RETURN 
            m.name AS name,
            m.brand_name AS brand_name,
            m.generic_name AS generic_name,
            m.manufacturer AS manufacturer,
            m.purpose AS purpose,
            m.indications AS indications,
            m.warnings AS warnings,
            m.dosage AS dosage,
            m.contraindications AS contraindications,
            m.adverse_reactions AS adverse_reactions,
            m.updated_at AS updated_at,
            [(m)-[:CONTAINS]->(i:Ingredient) | i.name] AS ingredients,
            [(m)-[:MANUFACTURED_BY]->(man:Manufacturer) | man.name] AS manufacturers,
            [(m)-[:TREATS]->(dis:Disease) | dis.name] AS treated_diseases,
            [(m)-[int:INTERACTS_WITH]->(m2:Drug) | {
                name: m2.name,
                severity: int.severity,
                description: int.description
            }] AS interactions
        """
        try:
            results = self._repository.execute_read(query, name=name)
            if results:
                return results[0]
            return None
        except Exception as exc:
            logger.error(f"Error retrieving medicine '{name}': {exc}")
            return None

    def search_medicines(self, query_str: str, limit: int = 10, skip: int = 0) -> list[dict[str, Any]]:
        """
        Search for medicines by name, brand name, or generic name.
        """
        cypher_query = """
        MATCH (m:Drug)
        WHERE toLower(coalesce(m.name, "")) CONTAINS toLower($search_query) 
           OR toLower(coalesce(m.brand_name, "")) CONTAINS toLower($search_query) 
           OR toLower(coalesce(m.generic_name, "")) CONTAINS toLower($search_query)
        RETURN 
            m.name AS name,
            m.brand_name AS brand_name,
            m.generic_name AS generic_name,
            m.manufacturer AS manufacturer,
            m.purpose AS purpose,
            m.indications AS indications,
            m.dosage AS dosage
        SKIP $skip
        LIMIT $limit
        """
        try:
            results = self._repository.execute_read(
                cypher_query, search_query=query_str, limit=limit, skip=skip
            )
            return results if results else []
        except Exception as exc:
            logger.error(f"Error searching medicines with query '{query_str}': {exc}")
            return []

    def get_medicines_by_disease(
        self, disease_name: str, limit: int = 10, skip: int = 0
    ) -> list[dict[str, Any]]:
        """
        Get medicines that treat a specific disease.
        """
        query = """
        MATCH (disease:Disease {name: $disease_name})
        MATCH (medicine:Drug)-[:TREATS]->(disease)
        RETURN 
            medicine.name AS name,
            medicine.brand_name AS brand_name,
            medicine.generic_name AS generic_name,
            medicine.dosage AS dosage
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
                f"Error getting medicines for disease '{disease_name}': {exc}"
            )
            return []

    def get_medicine_interactions(self, name: str, limit: int = 10, skip: int = 0) -> list[dict[str, Any]]:
        """
        Get all medicines that interact with a specific medicine.
        """
        query = """
        MATCH (medicine:Medicine {name: $name})
        MATCH (medicine)-[int:INTERACTS_WITH]->(m2:Drug)
        RETURN 
            m2.name AS name,
            m2.brand_name AS brand_name,
            int.severity AS severity,
            int.description AS description
        SKIP $skip
        LIMIT $limit
        """
        try:
            results = self._repository.execute_read(query, name=name, limit=limit, skip=skip)
            return results if results else []
        except Exception as exc:
            logger.error(
                f"Error getting interactions for medicine '{name}': {exc}"
            )
            return []

    def check_multiple_medicine_interactions(
        self, names: list[str]
    ) -> list[dict[str, Any]]:
        """
        Check interactions between multiple medicines.
        Returns all pairs that have interactions.
        """
        if not names or len(names) < 2:
            return []

        query = """
        MATCH (m1:Drug)-[int:INTERACTS_WITH]->(m2:Drug)
        WHERE m1.name IN $names AND m2.name IN $names
        RETURN 
            m1.name AS medicine_1,
            m2.name AS medicine_2,
            int.severity AS severity,
            int.description AS description
        """
        try:
            results = self._repository.execute_read(query, names=names)
            return results if results else []
        except Exception as exc:
            logger.error(f"Error checking multiple medicine interactions: {exc}")
            return []

    def get_medicine_ingredients(self, name: str) -> list[dict[str, Any]]:
        """
        Get all ingredients in a medicine.
        """
        query = """
        MATCH (m:Medicine {name: $name})
        MATCH (m)-[:CONTAINS]->(i:Ingredient)
        RETURN 
            i.name AS name,
            i.description AS description
        """
        try:
            results = self._repository.execute_read(query, name=name)
            return results if results else []
        except Exception as exc:
            logger.error(f"Error getting ingredients for medicine '{name}': {exc}")
            return []

    def get_medicine_count(self) -> int:
        """
        Get total count of medicines in database.
        """
        query = "MATCH (m:Drug) RETURN COUNT(m) AS count"
        try:
            results = self._repository.execute_read(query)
            if results:
                return results[0].get("count", 0)
            return 0
        except Exception as exc:
            logger.error(f"Error counting medicines: {exc}")
            return 0

    def create_medicine(self, data: dict[str, Any]) -> dict[str, Any] | None:
        """Create a new medicine node."""
        query = """
        MERGE (m:Medicine {name: $name})
        SET m += $props, m.updated_at = datetime()
        RETURN m
        """
        name = data.get("name")
        props = {k: v for k, v in data.items() if k != "name"}
        try:
            results = self._repository.execute_write(query, name=name, props=props)
            return results[0] if results else None
        except Exception as exc:
            logger.error(f"Error creating medicine '{name}': {exc}")
            return None

    def update_medicine(self, name: str, data: dict[str, Any]) -> dict[str, Any] | None:
        """Update an existing medicine node."""
        query = """
        MATCH (m:Medicine {name: $name})
        SET m += $props, m.updated_at = datetime()
        RETURN m
        """
        try:
            results = self._repository.execute_write(query, name=name, props=data)
            return results[0] if results else None
        except Exception as exc:
            logger.error(f"Error updating medicine '{name}': {exc}")
            return None

    def delete_medicine(self, name: str) -> bool:
        """Delete a medicine node and its relationships."""
        query = """
        MATCH (m:Medicine {name: $name})
        DETACH DELETE m
        """
        try:
            self._repository.execute_write(query, name=name)
            return True
        except Exception as exc:
            logger.error(f"Error deleting medicine '{name}': {exc}")
            return False


medicine_repository = MedicineRepository()
