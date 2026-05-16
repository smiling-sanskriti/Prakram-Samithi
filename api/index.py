"""Vercel serverless Flask API handler."""

import sys
import os
from pathlib import Path

# Add backend directory to path for imports
backend_dir = Path(__file__).parent.parent / "backend"
sys.path.insert(0, str(backend_dir))

# Set environment variables for Vercel
os.environ.setdefault("FLASK_ENV", "production")

# Import Flask app
from app import app
from flask_cors import CORS

# Enable CORS for Vercel domain and frontend
CORS(app, origins=[
    "http://localhost:5173",
    "http://localhost:3000",
    "http://localhost:5174",
    "https://*.vercel.app",  # All Vercel preview deployments
    "https://*.vercel.sh",   # All Vercel preview deployments
])

# Export the app for Vercel
export = app
