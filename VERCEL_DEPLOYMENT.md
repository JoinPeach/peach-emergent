# Vercel Deployment Guide

This codebase has been migrated to be fully compatible with Vercel deployment.

## Project Structure

- **Frontend**: React app in `frontend/` directory
- **Backend**: FastAPI serverless functions in `api/` directory
- **Configuration**: `vercel.json` for routing and build configuration

## Pre-Deployment Setup

### 1. Environment Variables

Set the following environment variables in your Vercel project settings:

**Required:**
- `MONGO_URL` - Your MongoDB connection string
- `DB_NAME` - Your MongoDB database name
- `EMERGENT_LLM_KEY` - Your Emergent LLM API key

**Optional:**
- `CORS_ORIGINS` - Comma-separated list of allowed CORS origins (defaults to `*`)
- `REACT_APP_BACKEND_URL` - Backend URL (leave empty for same-domain deployment)

### 2. MongoDB Connection

Ensure your MongoDB instance is accessible from Vercel's serverless functions. If using MongoDB Atlas, make sure your IP whitelist includes Vercel's IP ranges or allows all IPs (0.0.0.0/0).

## Deployment Steps

### Option 1: Deploy via Vercel CLI

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Deploy:
   ```bash
   vercel
   ```

4. Follow the prompts to link your project or create a new one.

### Option 2: Deploy via GitHub Integration

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) and sign in
3. Click "Add New Project"
4. Import your GitHub repository
5. Vercel will automatically detect the configuration from `vercel.json`
6. Add environment variables in the project settings
7. Click "Deploy"

## How It Works

### Frontend Build

- Vercel builds the React app using the `vercel-build` script
- Output directory: `frontend/build`
- Static files are served from the root

### Backend API

- FastAPI application wrapped with Mangum for AWS Lambda/Vercel compatibility
- All API routes are under `/api/*`
- Serverless functions are automatically created from `api/index.py`

### Routing

- `/api/*` → Serverless function (`api/index.py`)
- `/*` → Frontend React app (SPA routing)

## Post-Deployment

### Testing

1. Visit your Vercel deployment URL
2. Test the frontend: Should load the React app
3. Test the API: Visit `https://your-domain.vercel.app/api/` - should return API status

### Troubleshooting

**Frontend not loading:**
- Check that `frontend/build` directory exists after build
- Verify `vercel.json` routes are correct

**API errors:**
- Check environment variables are set correctly
- Verify MongoDB connection string is correct
- Check Vercel function logs in the dashboard

**CORS errors:**
- Set `CORS_ORIGINS` environment variable with your frontend domain
- Or leave it as `*` for development (not recommended for production)

**MongoDB connection issues:**
- Ensure MongoDB Atlas allows connections from Vercel IPs
- Check connection string format
- Verify database name is correct

## Local Development

To test locally before deploying:

1. **Backend**: The original `backend/server.py` still works for local development
2. **Frontend**: Run `cd frontend && npm start`
3. **API**: Set `REACT_APP_BACKEND_URL=http://localhost:8000` (or your local backend URL)

## Notes

- Sessions are stored in-memory (not persistent across serverless invocations)
- For production, consider using Redis or a database-backed session store
- MongoDB connection uses connection pooling optimized for serverless
- All API endpoints maintain the same interface as the original backend

## Support

For issues specific to:
- **Vercel**: Check [Vercel Documentation](https://vercel.com/docs)
- **FastAPI**: Check [FastAPI Documentation](https://fastapi.tiangolo.com/)
- **Mangum**: Check [Mangum Documentation](https://mangum.io/)

