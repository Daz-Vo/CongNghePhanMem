import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session
from unittest.mock import patch, MagicMock

from app.main import app
from app.core.config import settings

client = TestClient(app)

def test_chat_interaction_no_auth():
    """Test that chat requires authentication."""
    response = client.post(
        f"{settings.API_V1_STR}/chat/",
        json={"message": "Paradol có tác dụng gì?"}
    )
    assert response.status_code == 401

@patch("app.services.llm_service.llm_service.generate_response")
@patch("app.services.ner_service.ner_service.extract_entities")
@patch("app.services.neo4j_service.neo4j_service.get_drug_detail")
def test_chat_drug_lookup(
    mock_drug_detail, 
    mock_ner, 
    mock_llm, 
    client: TestClient, 
    superuser_token_headers: dict
):
    """Test looking up a drug with mock entities and context."""
    # Mock NER
    mock_ner.return_value = {"drugs": ["Paracetamol"], "diseases": []}
    
    # Mock Neo4j
    mock_drug_detail.return_value = {
        "name": "Paracetamol",
        "generic_name": "Acetaminophen",
        "purpose": "Giảm đau, hạ sốt",
        "indications": "Đau đầu, sốt",
        "dosage": "500mg mỗi 4-6 giờ",
        "warnings": "Không dùng quá 4g mỗi ngày",
        "ingredients": [{"name": "Paracetamol"}],
        "manufacturers": [{"name": "Generic"}]
    }
    
    # Mock LLM
    mock_llm.return_value = "Paracetamol là thuốc giảm đau hạ sốt phổ biến."

    response = client.post(
        f"{settings.API_V1_STR}/chat/",
        headers=superuser_token_headers,
        json={"message": "Paracetamol dùng để làm gì?"}
    )
    
    assert response.status_code == 200
    data = response.json()
    assert "Paracetamol" in data["entities"]
    assert "Neo4j: Drug(Paracetamol)" in data["sources"]
    assert "Paracetamol" in data["answer"]

@patch("app.services.llm_service.llm_service.generate_response")
@patch("app.services.ner_service.ner_service.extract_entities")
def test_chat_unknown_entity(
    mock_ner, 
    mock_llm, 
    client: TestClient, 
    superuser_token_headers: dict
):
    """Test identifying when no entities are found."""
    mock_ner.return_value = {"drugs": [], "diseases": []}
    mock_llm.return_value = "Tôi không tìm thấy thông tin về thực thể bạn hỏi."

    response = client.post(
        f"{settings.API_V1_STR}/chat/",
        headers=superuser_token_headers,
        json={"message": "Blahblah kjsadhf?"}
    )
    
    assert response.status_code == 200
    data = response.json()
    assert data["entities"] == []
    assert "AI Base Knowledge" in data["sources"]

@patch("app.services.llm_service.llm_service.generate_response")
@patch("app.services.ner_service.ner_service.extract_entities")
@patch("app.services.neo4j_service.neo4j_service.check_drug_interactions")
@patch("app.services.neo4j_service.neo4j_service.get_drug_detail")
def test_chat_drug_interaction(
    mock_drug_detail,
    mock_interactions,
    mock_ner, 
    mock_llm, 
    client: TestClient, 
    superuser_token_headers: dict
):
    """Test interaction check between two drugs."""
    mock_ner.return_value = {"drugs": ["DrugA", "DrugB"], "diseases": []}
    mock_drug_detail.side_effect = lambda x: {"name": x}
    
    mock_interactions.return_value = [{
        "drug_1": "DrugA",
        "drug_2": "DrugB",
        "severity": "High",
        "description": "Serious interaction"
    }]
    
    mock_llm.return_value = "DrugA and DrugB have a high severity interaction."

    response = client.post(
        f"{settings.API_V1_STR}/chat/",
        headers=superuser_token_headers,
        json={"message": "Dùng chung DrugA và DrugB được không?"}
    )
    
    assert response.status_code == 200
    data = response.json()
    assert "Neo4j: Drug Interactions" in data["sources"]
    assert any("Tương tác (High)" in w for w in data["warnings"])

@patch("app.services.llm_service.llm_service.detect_language")
@patch("app.services.llm_service.llm_service.generate_response")
@patch("app.services.ner_service.ner_service.extract_entities")
def test_chat_multilingual_vi(mock_ner, mock_llm, mock_lang, client: TestClient, superuser_token_headers: dict):
    mock_lang.return_value = "Vietnamese"
    mock_ner.return_value = {"drugs": [], "diseases": []}
    mock_llm.return_value = "Xin chào, tôi là trợ lý y tế."
    
    response = client.post(f"{settings.API_V1_STR}/chat/", headers=superuser_token_headers, json={"message": "Chào bạn"})
    assert "Xin chào" in response.json()["answer"]

@patch("app.services.llm_service.llm_service.detect_language")
@patch("app.services.llm_service.llm_service.generate_response")
def test_chat_multilingual_en(mock_llm, mock_lang, client: TestClient, superuser_token_headers: dict):
    mock_lang.return_value = "English"
    mock_llm.return_value = "Hello, I am your medical assistant."
    
    response = client.post(f"{settings.API_V1_STR}/chat/", headers=superuser_token_headers, json={"message": "Hello"})
    assert "Hello" in response.json()["answer"]

@patch("app.services.llm_service.llm_service.detect_language")
@patch("app.services.llm_service.llm_service.generate_response")
def test_chat_multilingual_fr(mock_llm, mock_lang, client: TestClient, superuser_token_headers: dict):
    mock_lang.return_value = "French"
    mock_llm.return_value = "Bonjour, je suis votre assistant médical."
    
    response = client.post(f"{settings.API_V1_STR}/chat/", headers=superuser_token_headers, json={"message": "Bonjour"})
    assert "Bonjour" in response.json()["answer"]

@patch("app.services.llm_service.llm_service.detect_language")
@patch("app.services.llm_service.llm_service.generate_response")
def test_chat_multilingual_es(mock_llm, mock_lang, client: TestClient, superuser_token_headers: dict):
    mock_lang.return_value = "Spanish"
    mock_llm.return_value = "Hola, soy su asistente médico."
    
    response = client.post(f"{settings.API_V1_STR}/chat/", headers=superuser_token_headers, json={"message": "Hola"})
    assert "Hola" in response.json()["answer"]
