import csv
import logging
import os
from pathlib import Path
from typing import Any

from app.core.config import settings
from app.services.neo4j_service import neo4j_service

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

DATA_DIR = Path(__file__).parent.parent / "data"

def seed_nodes(file_path: Path, label: str, merge_func: Any):
    """Seed nodes from a CSV file using a provided merge function."""
    if not file_path.exists():
        logger.warning(f"File {file_path} not found, skipping {label} seeding.")
        return

    logger.info(f"Seeding {label} from {file_path}...")
    count = 0
    with open(file_path, mode='r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            if merge_func(row):
                count += 1
    logger.info(f"✓ Seeded {count} {label} nodes.")

def seed_relationships(file_path: Path, rel_type: str, merge_func: Any):
    """Seed relationships from a CSV file."""
    if not file_path.exists():
        logger.warning(f"File {file_path} not found, skipping {rel_type} seeding.")
        return

    logger.info(f"Seeding {rel_type} relationships from {file_path}...")
    count = 0
    with open(file_path, mode='r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            # Dynamically unpack row based on merge_func signature or use as is
            # For simplicity in skeleton, we assume merge_func takes the row dict or specific args
            try:
                if rel_type == "TREATS":
                    success = merge_func(row['drug_name'], row['disease_name'], source="csv_seed")
                elif rel_type == "HAS_SYMPTOM":
                    success = merge_func(row['disease_name'], row['symptom_name'], source="csv_seed")
                elif rel_type == "CONTAINS":
                    success = merge_func(row['drug_name'], row['ingredient_name'])
                elif rel_type == "MADE_BY":
                    success = merge_func(row['drug_name'], row['manufacturer_name'])
                elif rel_type == "INTERACTS_WITH":
                    success = merge_func(
                        row['drug_name_1'], 
                        row['drug_name_2'], 
                        severity=row.get('severity', 'moderate'),
                        description=row.get('description', '')
                    )
                else:
                    success = False
                
                if success:
                    count += 1
            except Exception as e:
                logger.error(f"Error seeding {rel_type} row {row}: {e}")
                
    logger.info(f"✓ Seeded {count} {rel_type} relationships.")

def seed():
    """Main seed function."""
    logger.info("Starting Neo4j CSV Seeding...")
    
    # Ensure indexes/constraints exist
    neo4j_service.rebuild_graph()
    
    # 1. Seed Nodes (Priority: ensure props like descriptions are set)
    seed_nodes(DATA_DIR / "drugs.csv", "Drug", neo4j_service.merge_drug)
    seed_nodes(DATA_DIR / "diseases.csv", "Disease", neo4j_service.merge_disease)
    seed_nodes(DATA_DIR / "symptoms.csv", "Symptom", neo4j_service.merge_symptom)
    seed_nodes(DATA_DIR / "ingredients.csv", "Ingredient", neo4j_service.merge_ingredient)
    seed_nodes(DATA_DIR / "manufacturers.csv", "Manufacturer", neo4j_service.merge_manufacturer)
    
    # 2. Seed Relationships
    seed_relationships(DATA_DIR / "drug_disease.csv", "TREATS", neo4j_service.merge_treats_relationship)
    seed_relationships(DATA_DIR / "disease_symptom.csv", "HAS_SYMPTOM", neo4j_service.merge_has_symptom_relationship)
    seed_relationships(DATA_DIR / "drug_ingredient.csv", "CONTAINS", neo4j_service.merge_contains_relationship)
    seed_relationships(DATA_DIR / "drug_manufacturer.csv", "MADE_BY", neo4j_service.merge_made_by_relationship)
    seed_relationships(DATA_DIR / "drug_interaction.csv", "INTERACTS_WITH", neo4j_service.create_interacts_relationship)

    logger.info("Neo4j Seeding Completed.")

if __name__ == "__main__":
    seed()
