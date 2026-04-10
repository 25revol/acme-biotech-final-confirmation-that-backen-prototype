# Acme Biotech - Prototype System

## Overview
Secure biotech data submission platform with multi-factor authentication, real-time monitoring, and comprehensive health checks.

## Tech Stack
- **Backend**: FastAPI 0.104.1, PostgreSQL 15, OAuth2 + JWT + TOTP MFA
- **Frontend**: React 18 + TypeScript, React Query, React Hook Form
- **Real-time**: Socket.IO for live updates
- **Tasks**: Celery + Redis queue system
- **Security**: Passlib + Python-JOSE encryption
- **Monitoring**: Circuit-breaker pattern

## Quick Start

### Prerequisites
- Python 3.11+
- Node.js 18+
- PostgreSQL 15
- Redis

### Backend Setup
```bash
cd backend
pip install -r requirements.txt
cp .env.example .env
# Configure database and Redis URLs in .env
alembic upgrade head
uvicorn app.main:app --reload --port 8000
```

### Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env.local
# Set REACT_APP_API_URL=http://localhost:8000
npm start
```

### Services
```bash
# Start Redis
redis-server

# Start Celery worker
cd backend && celery -A app.celery worker --loglevel=info
```

## Key Features

### Authentication Flow
1. Login with email/password
2. Setup TOTP MFA (first login)
3. Verify 6-digit codes
4. JWT token management

### Core Endpoints
- `POST /auth/login` - User authentication with MFA
- `POST /auth/setup-mfa` - Configure TOTP authentication
- `POST /auth/refresh` - Refresh JWT tokens
- `GET /health/status` - System health monitoring
- `POST /submissions` - Submit biotech data
- `GET /submissions` - List user submissions

### UI Components
- **Login**: Authentication with MFA setup/verification
- **Dashboard**: Real-time system status and health monitoring
- **Submissions**: Form submission with validation and history

## Testing
Backend confirmation: Visit `http://localhost:8000/health/status`
Frontend confirmation: Login form at `http://localhost:3000`

## Demo Flow
1. Register new user account
2. Complete MFA setup with authenticator app
3. Navigate to submissions page
4. Submit test data form
5. Monitor real-time status updates

## Development Notes
- All forms use React Hook Form validation
- WebSocket connections for live updates
- Circuit-breaker monitoring for service health
- Comprehensive error handling and user feedback