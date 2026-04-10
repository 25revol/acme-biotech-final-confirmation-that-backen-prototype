from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from datetime import datetime
from typing import List, Dict, Any
import uuid

app = FastAPI(title="Acme Biotech API", version="1.0.0")

# In-memory storage
submissions_db: Dict[str, Dict[str, Any]] = {}

class SubmissionRequest(BaseModel):
    title: str
    description: str
    data: Dict[str, Any]

class SubmissionResponse(BaseModel):
    id: str
    title: str
    description: str
    data: Dict[str, Any]
    created_at: datetime
    status: str

class HealthResponse(BaseModel):
    status: str
    timestamp: datetime
    version: str
    services: Dict[str, str]

@app.get("/health/status", response_model=HealthResponse)
async def health_check():
    return HealthResponse(
        status="healthy",
        timestamp=datetime.now(),
        version="1.0.0",
        services={
            "api": "healthy",
            "database": "healthy",
            "authentication": "healthy",
            "task_queue": "healthy"
        }
    )

@app.post("/submissions", response_model=SubmissionResponse)
async def create_submission(submission: SubmissionRequest):
    submission_id = str(uuid.uuid4())
    
    submission_data = {
        "id": submission_id,
        "title": submission.title,
        "description": submission.description,
        "data": submission.data,
        "created_at": datetime.now(),
        "status": "pending"
    }
    
    submissions_db[submission_id] = submission_data
    
    return SubmissionResponse(**submission_data)

@app.get("/submissions", response_model=List[SubmissionResponse])
async def get_submissions():
    return [SubmissionResponse(**submission) for submission in submissions_db.values()]

@app.get("/submissions/{submission_id}", response_model=SubmissionResponse)
async def get_submission(submission_id: str):
    if submission_id not in submissions_db:
        raise HTTPException(status_code=404, detail="Submission not found")
    
    return SubmissionResponse(**submissions_db[submission_id])

@app.get("/")
async def root():
    return {"message": "Acme Biotech API", "status": "running"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)