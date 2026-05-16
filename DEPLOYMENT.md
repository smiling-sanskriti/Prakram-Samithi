# Vercel Deployment Guide

This full-stack application deploys to Vercel with:
- **Frontend**: React + Vite (deployed as static site)
- **Backend**: Flask API (deployed as serverless functions in `/api`)
- **Database**: Supabase PostgreSQL

## Deployment Steps

### 1. Install Vercel CLI
```bash
npm install -g vercel
```

### 2. Configure Environment Variables in Vercel

In your Vercel dashboard or via CLI, set these environment variables:

```
user = postgres.lvxzofpotqqvowqemxxo
password = [Your Supabase password from .env]
host = aws-1-ap-southeast-2.pooler.supabase.com
port = 5432
dbname = postgres
FLASK_ENV = production
FLASK_DEBUG = False
```

**Important**: Use the Session Pooler endpoint (not the Direct connection) to avoid DNS issues.

### 3. Deploy via CLI

```bash
# Login to Vercel
vercel login

# Deploy the project
vercel
```

Or connect your GitHub repository:
1. Push to your GitHub repository
2. Go to https://vercel.com/new
3. Import your GitHub repository
4. Set the environment variables in the project settings
5. Deploy

### 4. Verify Deployment

- Frontend: https://your-project.vercel.app
- Backend Health: https://your-project.vercel.app/api/health
- Register Endpoint: POST https://your-project.vercel.app/api/register

The frontend automatically uses the deployed backend URL.

## Local Development

### Run Frontend
```bash
npm run dev
```

### Run Backend (Local Testing)
```bash
cd backend
source ../.venv/bin/activate  # Mac/Linux
python app.py                  # Runs on http://localhost:5001
```

Then update `src/App.jsx` API URL to `http://localhost:5001` for testing.

## Troubleshooting

**Database Connection Failed?**
- Ensure you're using Session Pooler endpoint, not Direct connection
- Verify `user` includes the project ID: `postgres.lvxzofpotqqvowqemxxo`
- Check password encoding - use raw password in Vercel env, not URL-encoded

**CORS Issues?**
- The backend automatically allows:
  - All Vercel preview deployments (*.vercel.app, *.vercel.sh)
  - Localhost for development

**Form Submission Fails?**
- Check browser console for actual error
- Verify backend health: https://your-project.vercel.app/api/health should return `{"status":"ok"}`
- Ensure environment variables are set in Vercel dashboard

## Production Notes

- Database uses Supabase PostgreSQL with Session Pooler for connection pooling
- Flask serverless functions auto-scale based on demand
- Vite frontend is served as a static site (fast, no server needed)
- All deployments are automatically HTTPS

## Reset to Local Testing

If you need to test locally again:
1. Update `src/App.jsx`: `apiBaseUrl = "http://localhost:5001"`
2. Ensure `.env` in backend has local database credentials
3. Run `python app.py` from backend folder
