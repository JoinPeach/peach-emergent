#!/usr/bin/env python3
"""Seed 500+ additional tickets for stress testing"""
import asyncio
import os
import uuid
from datetime import datetime, timezone, timedelta
import random
from motor.motor_asyncio import AsyncIOMotorClient

MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")
DB_NAME = os.getenv("DB_NAME", "test_database")


async def seed_massive_tickets():
    """Add 500+ tickets to the database"""
    client = AsyncIOMotorClient(MONGO_URL)
    db = client[DB_NAME]
    
    print("🌱 Seeding 500+ additional tickets for stress testing...")
    
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
    
    # Extended subjects pool for variety
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
        "Graduate school aid questions",
        "Transfer student aid process",
        "International student eligibility",
        "Dependency status override",
        "Multiple enrollment periods",
        "Aid disbursement delay issue",
        "Scholarship application deadline",
        "Federal loan limit questions",
        "Work-study tax implications",
        "Summer course aid coverage",
        "Emergency financial assistance",
        "Aid suspension appeal",
        "Document verification timeline",
        "Pell Grant eligibility",
        "State aid application process",
        "Financial aid transcript hold",
        "Loan entrance counseling",
        "Exit interview requirements",
        "Aid offer comparison question",
        "Cost of living allowance",
        "Unusual enrollment pattern",
        "Professional judgment request",
        "Consortium agreement aid",
        "Study abroad financial aid",
        "Master promissory note issue"
    ]
    
    categories = ["fafsa", "verification", "sap_appeal", "billing", "general"]
    statuses = ["open", "in_progress", "closed"]
    priorities = ["low", "medium", "high", "urgent"]
    channels = ["email", "chat", "phone", "walk_in"]
    
    # Generate 500 tickets in batches for performance
    batch_size = 100
    total_created = 0
    
    for batch in range(5):
        tickets_batch = []
        messages_batch = []
        
        for i in range(batch_size):
            ticket_id = str(uuid.uuid4())
            student = random.choice(students)
            queue = random.choice(queues)
            assignee = random.choice([None, random.choice(users)["id"]])
            
            # Random timestamp in last 90 days for variety
            days_ago = random.randint(0, 90)
            hours_ago = random.randint(0, 23)
            created_at = datetime.now(timezone.utc) - timedelta(days=days_ago, hours=hours_ago)
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
            tickets_batch.append(ticket)
            
            # Create initial message for each ticket
            message = {
                "id": str(uuid.uuid4()),
                "institution_id": institution_id,
                "ticket_id": ticket_id,
                "sender_email": student["email"],
                "recipient_email": "finaid@demou.edu",
                "subject": ticket["subject"],
                "body": f"Hi, I have a question about {ticket['category'].replace('_', ' ')}. Can you help me with this issue? I need assistance with the process.",
                "direction": "inbound",
                "thread_id": None,
                "created_at": created_at.isoformat()
            }
            messages_batch.append(message)
        
        # Insert batch
        await db.tickets.insert_many(tickets_batch)
        await db.messages.insert_many(messages_batch)
        total_created += len(tickets_batch)
        print(f"✅ Batch {batch + 1}/5: Created {len(tickets_batch)} tickets (Total: {total_created}/500)")
    
    # Get final count
    total_tickets = await db.tickets.count_documents({"institution_id": institution_id})
    print(f"\n📊 Final ticket count: {total_tickets}")
    print(f"✅ Successfully added 500 additional tickets!")
    
    client.close()


if __name__ == "__main__":
    asyncio.run(seed_massive_tickets())
