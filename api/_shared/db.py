import os
from motor.motor_asyncio import AsyncIOMotorClient

# Global client instance (reused across invocations for serverless)
_client = None
_db = None

def get_db():
    """Get MongoDB database connection (singleton pattern for serverless)"""
    global _client, _db
    
    if _client is None:
        mongo_url = os.environ.get('MONGO_URL')
        db_name = os.environ.get('DB_NAME')
        
        if not mongo_url or not db_name:
            raise ValueError("MONGO_URL and DB_NAME must be set in environment variables")
        
        _client = AsyncIOMotorClient(mongo_url)
        _db = _client[db_name]
    
    return _db

def get_client():
    """Get MongoDB client"""
    global _client
    if _client is None:
        mongo_url = os.environ.get('MONGO_URL')
        if not mongo_url:
            raise ValueError("MONGO_URL must be set in environment variables")
        _client = AsyncIOMotorClient(mongo_url)
    return _client

