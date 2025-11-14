#!/usr/bin/env python3
"""Seed 100+ additional tickets for testing"""
import asyncio
import os
import uuid
from datetime import datetime, timezone, timedelta
import random
from motor.motor_asyncio import AsyncIOMotorClient

MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")
DB_NAME = os.getenv("DB_NAME", "test_database")


async def seed_additional_tickets():
    """Add 100+ tickets to the database"""
    client = AsyncIOMotorClient(MONGO_URL)
    db = client[DB_NAME]
    
    print("🌱 Seeding 100+ additional tickets...")
    
    # Get existing institution
    institution = await db.institutions.find_one({"slug": "demo-u"})
    if not institution:
        print("❌ Institution not found. Run seed_data.py first.")
        return
    
    institution_id = institution["id"]
    
    # Get existing students, queues, users
    students = await db.students.find({"institution_id": institution_id}).to_list(100)
    queues = await db.queues.find({"institution_id": institution_id}).to_list(100)
    users = await db.users.find({"institution_id": institution_id}).to_list(100)
    
    # Subjects pool
    subjects = [
        "FAFSA application question",
        "Verification documents needed",
        "SAP appeal process inquiry",
        "Payment plan setup",
        "Loan disbursement timing",
        "Grant eligibility question",
        "Work-study position inquiry",
        "Scholarship renewal question",
        "Missing financial aid award letter",
        "Tuition payment deadline extension",
        "Need help with FAFSA corrections",
        "Tax transcript submission",
        "Direct deposit setup question",
        "Federal vs institutional aid",
        "Summer financial aid availability",
        "Estimated Family Contribution question",
        "Book voucher inquiry",
        "Refund check status",
        "Withdrew from class - aid impact?",
        "Change of enrollment status",
        "Parent PLUS loan questions",
        "Private scholarship reporting",
        "Cost of attendance clarification",
        "Appeal for more aid",
        "Late FAFSA submission penalty?",
    ]
    
    categories = ["fafsa", "verification", "sap_appeal", "billing", "general"]
    statuses = ["open", "waiting_on_student", "closed"]
    priorities = ["low", "medium", "high", "urgent"]
    channels = ["email", "chat", "phone", "walk_in"]
    
    # Generate 100 tickets
    tickets_to_insert = []
    messages_to_insert = []
    now = datetime.now(timezone.utc)
    
    for i in range(100):
        ticket_id = str(uuid.uuid4())
        student = random.choice(students)
        queue = random.choice(queues)
        assignee = random.choice([None, random.choice(users)["id"]])
        
        # Random timestamp in last 30 days
        days_ago = random.randint(0, 30)
        hours_ago = random.randint(0, 23)
        created_at = now - timedelta(days=days_ago, hours=hours_ago)
        updated_at = created_at + timedelta(hours=random.randint(1, 48))
        
        ticket = {
            "id": ticket_id,
            "institution_id": institution_id,
            "student_id": student["id"],
            "subject": random.choice(subjects),
            "status": random.choice(statuses),
            "priority": random.choice(priorities),
            "category": random.choice(categories),
            "queue_id": queue["id"],
            "assignee_id": assignee,
            "channel": random.choice(channels),
            "created_at": created_at.isoformat(),
            "updated_at": updated_at.isoformat()
        }
        tickets_to_insert.append(ticket)
        
        # Create initial message for each ticket
        message = {
            "id": str(uuid.uuid4()),
            "institution_id": institution_id,
            "ticket_id": ticket_id,
            "sender_email": student["email"],
            "recipient_email": "finaid@demou.edu",
            "subject": ticket["subject"],
            "body": f"Hi, I have a question about {ticket['category'].replace('_', ' ')}. Can you help me with this?",
            "direction": "inbound",
            "thread_id": None,
            "created_at": created_at.isoformat()
        }
        messages_to_insert.append(message)
    
    # Insert tickets and messages
    await db.tickets.insert_many(tickets_to_insert)
    await db.messages.insert_many(messages_to_insert)
    
    print(f"✅ Created {len(tickets_to_insert)} additional tickets")
    print(f"✅ Created {len(messages_to_insert)} additional messages")
    
    # Get total count
    total_tickets = await db.tickets.count_documents({"institution_id": institution_id})
    print(f"\n📊 Total tickets in database: {total_tickets}")
    
    client.close()


if __name__ == "__main__":
    asyncio.run(seed_additional_tickets())
