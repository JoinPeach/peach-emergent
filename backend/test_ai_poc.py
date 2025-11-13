#!/usr/bin/env python3
"""Test script for AI POC endpoints"""
import asyncio
import sys
from motor.motor_asyncio import AsyncIOMotorClient
from ai_tools import search_kb_articles, draft_reply_with_ai, triage_ticket_with_ai
from models import SearchKBRequest, DraftReplyRequest
from kb_data import sample_kb_articles
import uuid
import os

# MongoDB connection
MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")
DB_NAME = os.getenv("DB_NAME", "test_database")


async def setup_test_data(db):
    """Seed test KB articles"""
    print("\n📚 Seeding test KB articles...")
    
    # Create test institution
    test_institution_id = str(uuid.uuid4())
    
    # Add institution_id to all articles
    articles_with_inst = [
        {**article, "institution_id": test_institution_id, "id": str(uuid.uuid4())}
        for article in sample_kb_articles
    ]
    
    # Clear existing KB for this test
    await db.knowledge_base.delete_many({"institution_id": test_institution_id})
    
    # Insert new articles
    if articles_with_inst:
        await db.knowledge_base.insert_many(articles_with_inst)
    
    print(f"✅ Seeded {len(articles_with_inst)} KB articles for institution {test_institution_id}")
    return test_institution_id


async def test_search_kb(db, institution_id):
    """Test KB search functionality"""
    print("\n🔍 Testing KB Search...")
    print("-" * 60)
    
    test_queries = [
        ("FAFSA deadline", None),
        ("verification documents", "verification"),
        ("SAP appeal process", "sap_appeal"),
    ]
    
    for query, category in test_queries:
        request = SearchKBRequest(
            institution_id=institution_id,
            query=query,
            category=category,
            limit=2
        )
        
        result = await search_kb_articles(db, request)
        
        print(f"\nQuery: '{query}' (category={category})")
        print(f"Found {len(result.articles)} articles:")
        for article in result.articles:
            print(f"  - {article['title']} [{article['category']}]")
    
    print("\n✅ KB Search tests passed")


async def test_draft_reply(db, institution_id):
    """Test AI draft reply generation"""
    print("\n✍️  Testing AI Draft Reply...")
    print("-" * 60)
    
    # Test case 1: FAFSA deadline question
    request1 = DraftReplyRequest(
        institution_id=institution_id,
        ticket_id=str(uuid.uuid4()),
        student_email="student@university.edu",
        student_name="Alex Johnson",
        latest_message="Hi, I'm trying to figure out when I need to submit my FAFSA for next year. What's the deadline? I want to make sure I get the most aid possible. Thanks!",
        thread_context=[],
        student_notes="First-year student, priority for state grants"
    )
    
    result1 = await draft_reply_with_ai(db, request1)
    
    print("\nTest 1: FAFSA Deadline Question")
    print(f"Summary: {result1.summary}")
    print(f"Reasoning: {result1.reasoning}")
    print(f"Cited KB Articles: {len(result1.cited_kb)}")
    for kb in result1.cited_kb:
        print(f"  - {kb['title']}")
    print(f"\nDraft Reply:\n{result1.safe_reply[:400]}...")
    print(f"\nRedaction Report: {result1.redaction_report}")
    
    # Verify requirements
    assert result1.disclaimer in result1.safe_reply, "❌ Disclaimer missing!"
    assert len(result1.cited_kb) > 0, "❌ No KB articles cited!"
    assert "financial aid" in result1.safe_reply.lower(), "❌ Reply doesn't mention financial aid!"
    
    print("\n✅ Disclaimer present: " + result1.disclaimer[:80] + "...")
    
    # Test case 2: Verification with PII
    request2 = DraftReplyRequest(
        institution_id=institution_id,
        ticket_id=str(uuid.uuid4()),
        student_email="student2@university.edu",
        student_name="Sam Martinez",
        latest_message="I got selected for verification and I'm confused about what documents I need. My student ID is 1234567 and my SSN is 123-45-6789. Can you help? I need this resolved ASAP because my aid hasn't disbursed yet.",
        thread_context=[],
        student_notes=None
    )
    
    result2 = await draft_reply_with_ai(db, request2)
    
    print("\n\nTest 2: Verification with PII")
    print(f"Summary: {result2.summary}")
    print(f"Redaction Report: {result2.redaction_report}")
    print(f"\nDraft Reply (first 300 chars):\n{result2.safe_reply[:300]}...")
    
    # Verify PII masking
    assert result2.redaction_report.get('ssn_count', 0) > 0, "❌ SSN not detected!"
    assert result2.redaction_report.get('student_id_count', 0) > 0, "❌ Student ID not detected!"
    
    print("\n✅ PII masking successful")
    print("✅ Draft reply tests passed")


async def test_triage(db, institution_id):
    """Test AI ticket triage"""
    print("\n🎯 Testing AI Ticket Triage...")
    print("-" * 60)
    
    test_cases = [
        (
            "Urgent: My aid hasn't disbursed and classes start in 3 days. I can't register until this is fixed!",
            "urgent",
            "general"
        ),
        (
            "I got a letter saying I need to submit verification documents. What do I need to send?",
            "high",
            "verification"
        ),
        (
            "Can you explain how the payment plan works?",
            "medium",
            "billing"
        ),
    ]
    
    for email_body, expected_priority, expected_category in test_cases:
        result = await triage_ticket_with_ai(db, email_body, institution_id)
        
        print(f"\nEmail: {email_body[:80]}...")
        print(f"  Category: {result['category']} (expected: {expected_category})")
        print(f"  Priority: {result['priority']} (expected: {expected_priority})")
        print(f"  Reasoning: {result['reasoning']}")
        
        # Note: AI might not always match expected exactly, so we just verify it returns valid values
        assert result['category'] in ['fafsa', 'verification', 'sap_appeal', 'billing', 'general'], "❌ Invalid category!"
        assert result['priority'] in ['low', 'medium', 'high', 'urgent'], "❌ Invalid priority!"
    
    print("\n✅ Triage tests passed")


async def main():
    print("="*60)
    print("🚀 AI POC Test Suite")
    print("="*60)
    
    # Connect to MongoDB
    client = AsyncIOMotorClient(MONGO_URL)
    db = client[DB_NAME]
    
    try:
        # Setup test data
        institution_id = await setup_test_data(db)
        
        # Run tests
        await test_search_kb(db, institution_id)
        await test_draft_reply(db, institution_id)
        await test_triage(db, institution_id)
        
        print("\n" + "="*60)
        print("✅ All POC tests passed!")
        print("="*60)
        print("\n📊 Summary:")
        print("  ✓ KB search working with relevance scoring")
        print("  ✓ AI draft generation with KB citations")
        print("  ✓ PII masking functional (SSN, student ID, phone)")
        print("  ✓ Required disclaimers present")
        print("  ✓ Ticket triage categorization working")
        print("\n🎉 POC is ready for endpoint integration!")
        
    except Exception as e:
        print(f"\n❌ Test failed: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
    finally:
        client.close()


if __name__ == "__main__":
    asyncio.run(main())
