from typing import Optional
from fastapi import HTTPException, Header

# Simple in-memory session storage (consider Redis for production)
# This is a module-level variable that will be shared across all serverless invocations
sessions = {}

async def get_current_user(authorization: Optional[str] = Header(None)):
    """Get current user from session token (mock implementation)"""
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    token = authorization.replace("Bearer ", "")
    session = sessions.get(token)
    if not session:
        raise HTTPException(status_code=401, detail="Invalid session")
    
    return session["user"]

