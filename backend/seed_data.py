#!/usr/bin/env python3
"""Seed database with sample data for demo"""
import asyncio
import os
import uuid
from datetime import datetime, timezone, timedelta
from motor.motor_asyncio import AsyncIOMotorClient
from kb_data import sample_kb_articles

MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")
DB_NAME = os.getenv("DB_NAME", "test_database")


async def seed_database():
    """Seed the database with sample institution, users, students, tickets, and KB"""
    client = AsyncIOMotorClient(MONGO_URL)
    db = client[DB_NAME]
    
    print("🌱 Seeding AidHub Pro database...")
    
    # Create demo institution
    institution_id = str(uuid.uuid4())
    institution = {
        "id": institution_id,
        "name": "University of Demo",
        "slug": "demo-u",
        "domain": "demou.edu",
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    await db.institutions.delete_many({"slug": "demo-u"})
    await db.institutions.insert_one(institution)
    print(f"✅ Created institution: {institution['name']} (ID: {institution_id})")
    
    # Create demo queues
    queues = [
        {"id": str(uuid.uuid4()), "institution_id": institution_id, "name": "General Inquiries", "description": "General financial aid questions"},
        {"id": str(uuid.uuid4()), "institution_id": institution_id, "name": "FAFSA Support", "description": "FAFSA application assistance"},
        {"id": str(uuid.uuid4()), "institution_id": institution_id, "name": "Verification", "description": "Document verification requests"},
        {"id": str(uuid.uuid4()), "institution_id": institution_id, "name": "SAP Appeals", "description": "Satisfactory Academic Progress appeals"},
        {"id": str(uuid.uuid4()), "institution_id": institution_id, "name": "Billing", "description": "Billing and payment questions"},
    ]
    await db.queues.delete_many({"institution_id": institution_id})
    await db.queues.insert_many(queues)
    print(f"✅ Created {len(queues)} queues")
    
    # Create demo staff users
    users = [
        {
            "id": str(uuid.uuid4()),
            "institution_id": institution_id,
            "email": "advisor1@demou.edu",
            "name": "Sarah Chen",
            "role": "staff",
            "oauth_provider": "microsoft",
            "oauth_token": "mock_token_1",
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "institution_id": institution_id,
            "email": "advisor2@demou.edu",
            "name": "Michael Rodriguez",
            "role": "staff",
            "oauth_provider": "google",
            "oauth_token": "mock_token_2",
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "institution_id": institution_id,
            "email": "director@demou.edu",
            "name": "Dr. Emily Thompson",
            "role": "admin",
            "oauth_provider": "microsoft",
            "oauth_token": "mock_token_3",
            "created_at": datetime.now(timezone.utc).isoformat()
        }
    ]
    await db.users.delete_many({"institution_id": institution_id})
    await db.users.insert_many(users)
    print(f"✅ Created {len(users)} staff users")
    
    # Create demo students
    students = [
        {
            "id": str(uuid.uuid4()),
            "institution_id": institution_id,
            "email": "alex.johnson@student.demou.edu",
            "name": "Alex Johnson",
            "student_id": "1234567",
            "phone": "(555) 123-4567",
            "notes": "First-year student, priority for state grants",
            "sis_url": "https://sis.demou.edu/students/1234567",
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "institution_id": institution_id,
            "email": "sam.martinez@student.demou.edu",
            "name": "Sam Martinez",
            "student_id": "2345678",
            "phone": "(555) 234-5678",
            "notes": "Selected for verification, submitted documents 2 days ago",
            "sis_url": "https://sis.demou.edu/students/2345678",
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "institution_id": institution_id,
            "email": "jordan.lee@student.demou.edu",
            "name": "Jordan Lee",
            "student_id": "3456789",
            "phone": None,
            "notes": "SAP appeal pending, meeting scheduled for next week",
            "sis_url": "https://sis.demou.edu/students/3456789",
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "institution_id": institution_id,
            "email": "taylor.kim@student.demou.edu",
            "name": "Taylor Kim",
            "student_id": "4567890",
            "phone": "(555) 456-7890",
            "notes": "Transfer student, questions about credit evaluation",
            "sis_url": "https://sis.demou.edu/students/4567890",
            "created_at": datetime.now(timezone.utc).isoformat()
        }
    ]
    await db.students.delete_many({"institution_id": institution_id})
    await db.students.insert_many(students)
    print(f"✅ Created {len(students)} demo students")
    
    # Create demo tickets with messages
    now = datetime.now(timezone.utc)
    tickets_data = [
        {
            "ticket": {
                "id": str(uuid.uuid4()),
                "institution_id": institution_id,
                "student_id": students[0]["id"],
                "subject": "Question about FAFSA priority deadline",
                "status": "open",
                "priority": "medium",
                "category": "fafsa",
                "queue_id": queues[1]["id"],
                "assignee_id": users[0]["id"],
                "channel": "email",
                "created_at": (now - timedelta(hours=2)).isoformat(),
                "updated_at": (now - timedelta(hours=2)).isoformat()
            },
            "messages": [
                {
                    "id": str(uuid.uuid4()),
                    "institution_id": institution_id,
                    "ticket_id": "",  # Will be set below
                    "sender_email": students[0]["email"],
                    "recipient_email": "finaid@demou.edu",
                    "subject": "Question about FAFSA priority deadline",
                    "body": "Hi, I'm trying to figure out when I need to submit my FAFSA for next year. What's the priority deadline? I want to make sure I get the most aid possible. Thanks!",
                    "direction": "inbound",
                    "thread_id": None,
                    "created_at": (now - timedelta(hours=2)).isoformat()
                }
            ]
        },
        {
            "ticket": {
                "id": str(uuid.uuid4()),
                "institution_id": institution_id,
                "student_id": students[1]["id"],
                "subject": "Verification documents - what do I need?",
                "status": "waiting_on_student",
                "priority": "high",
                "category": "verification",
                "queue_id": queues[2]["id"],
                "assignee_id": users[0]["id"],
                "channel": "email",
                "created_at": (now - timedelta(days=1)).isoformat(),
                "updated_at": (now - timedelta(hours=3)).isoformat()
            },
            "messages": [
                {
                    "id": str(uuid.uuid4()),
                    "institution_id": institution_id,
                    "ticket_id": "",
                    "sender_email": students[1]["email"],
                    "recipient_email": "finaid@demou.edu",
                    "subject": "Verification documents - what do I need?",
                    "body": "I got selected for verification and I'm confused about what documents I need. Can you help? I need this resolved ASAP because my aid hasn't disbursed yet.",
                    "direction": "inbound",
                    "thread_id": None,
                    "created_at": (now - timedelta(days=1)).isoformat()
                },
                {
                    "id": str(uuid.uuid4()),
                    "institution_id": institution_id,
                    "ticket_id": "",
                    "sender_email": "finaid@demou.edu",
                    "recipient_email": students[1]["email"],
                    "subject": "Re: Verification documents - what do I need?",
                    "body": "Hi Sam,\\n\\nThank you for reaching out. For verification, you'll need to submit:\\n\\n1. IRS Tax Transcript for 2023\\n2. Signed verification worksheet (download from student portal)\\n3. W-2 forms if applicable\\n\\nPlease submit within 30 days to avoid delays. You can upload to the student portal or email to verify@demou.edu.\\n\\nLet me know if you have questions!\\n\\nBest,\\nSarah Chen",
                    "direction": "outbound",
                    "thread_id": None,
                    "created_at": (now - timedelta(hours=20)).isoformat()
                }
            ]
        },
        {
            "ticket": {
                "id": str(uuid.uuid4()),
                "institution_id": institution_id,
                "student_id": students[2]["id"],
                "subject": "SAP appeal submission",
                "status": "open",
                "priority": "high",
                "category": "sap_appeal",
                "queue_id": queues[3]["id"],
                "assignee_id": users[1]["id"],
                "channel": "email",
                "created_at": (now - timedelta(days=3)).isoformat(),
                "updated_at": (now - timedelta(days=3)).isoformat()
            },
            "messages": [
                {
                    "id": str(uuid.uuid4()),
                    "institution_id": institution_id,
                    "ticket_id": "",
                    "sender_email": students[2]["email"],
                    "recipient_email": "finaid@demou.edu",
                    "subject": "SAP appeal submission",
                    "body": "Hi, I failed to meet SAP standards last semester due to a family emergency. I'd like to submit an appeal. Can you tell me what documents I need and the deadline?",
                    "direction": "inbound",
                    "thread_id": None,
                    "created_at": (now - timedelta(days=3)).isoformat()
                }
            ]
        },
        {
            "ticket": {
                "id": str(uuid.uuid4()),
                "institution_id": institution_id,
                "student_id": students[3]["id"],
                "subject": "Payment plan questions",
                "status": "closed",
                "priority": "low",
                "category": "billing",
                "queue_id": queues[4]["id"],
                "assignee_id": users[1]["id"],
                "channel": "email",
                "created_at": (now - timedelta(days=7)).isoformat(),
                "updated_at": (now - timedelta(days=6)).isoformat()
            },
            "messages": [
                {
                    "id": str(uuid.uuid4()),
                    "institution_id": institution_id,
                    "ticket_id": "",
                    "sender_email": students[3]["email"],
                    "recipient_email": "finaid@demou.edu",
                    "subject": "Payment plan questions",
                    "body": "Can you explain how the payment plan works? I'd like to set up monthly payments instead of paying everything upfront.",
                    "direction": "inbound",
                    "thread_id": None,
                    "created_at": (now - timedelta(days=7)).isoformat()
                }
            ]
        }
    ]
    
    await db.tickets.delete_many({"institution_id": institution_id})
    await db.messages.delete_many({"institution_id": institution_id})
    
    for ticket_data in tickets_data:
        ticket = ticket_data["ticket"]
        ticket_id = ticket["id"]
        
        # Insert ticket
        await db.tickets.insert_one(ticket)
        
        # Insert messages with ticket_id
        for message in ticket_data["messages"]:
            message["ticket_id"] = ticket_id
            await db.messages.insert_one(message)
    
    print(f"✅ Created {len(tickets_data)} tickets with messages")
    
    # Create Knowledge Base articles
    kb_articles = [
        {**article, "institution_id": institution_id, "id": str(uuid.uuid4())}
        for article in sample_kb_articles
    ]
    await db.knowledge_base.delete_many({"institution_id": institution_id})
    await db.knowledge_base.insert_many(kb_articles)
    print(f"✅ Created {len(kb_articles)} Knowledge Base articles")
    
    # Create some student events
    events = [
        {
            "id": str(uuid.uuid4()),
            "institution_id": institution_id,
            "student_id": students[1]["id"],
            "ticket_id": tickets_data[1]["ticket"]["id"],
            "event_type": "ai_routed",
            "content": "Ticket automatically categorized as 'verification'",
            "created_by": None,
            "created_at": (now - timedelta(days=1)).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "institution_id": institution_id,
            "student_id": students[1]["id"],
            "ticket_id": tickets_data[1]["ticket"]["id"],
            "event_type": "sent_email",
            "content": "Sent verification requirements email",
            "created_by": users[0]["id"],
            "created_at": (now - timedelta(hours=20)).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "institution_id": institution_id,
            "student_id": students[2]["id"],
            "ticket_id": None,
            "event_type": "phone_call",
            "content": "Student called regarding SAP appeal requirements. Advised on documentation needed.",
            "created_by": users[1]["id"],
            "created_at": (now - timedelta(days=2)).isoformat()
        }
    ]
    await db.student_events.delete_many({"institution_id": institution_id})
    await db.student_events.insert_many(events)
    print(f"✅ Created {len(events)} student events")
    
    print("\\n" + "="*60)
    print("🎉 Database seeded successfully!")
    print("="*60)
    print(f"\\nInstitution ID: {institution_id}")
    print(f"Institution Slug: demo-u")
    print(f"Staff Users: {len(users)}")
    print(f"Students: {len(students)}")
    print(f"Tickets: {len(tickets_data)}")
    print(f"Queues: {len(queues)}")
    print(f"KB Articles: {len(kb_articles)}")
    
    client.close()


if __name__ == "__main__":
    asyncio.run(seed_database())
