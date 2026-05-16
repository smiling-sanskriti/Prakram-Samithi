"""Vercel serverless Flask API handler for production."""

import sys
import os
from pathlib import Path

# Add backend directory to path
backend_path = str(Path(__file__).parent.parent / "backend")
if backend_path not in sys.path:
    sys.path.insert(0, backend_path)

# Configure environment
os.environ.setdefault("FLASK_ENV", "production")

# Import and configure Flask app
from app import app
from flask_cors import CORS

# Add CORS with production origins
cors_origins = [
    "http://localhost:5173",
    "http://localhost:3000",
    "http://localhost:5174"
]

# Add Vercel deployment URLs dynamically
import re
if os.getenv("VERCEL_URL"):
    vercel_url = os.getenv("VERCEL_URL")
    cors_origins.append(f"https://{vercel_url}")
    # Also allow preview deployments
    cors_origins.append(f"https://*.vercel.app")
    cors_origins.append(f"https://*.vercel.sh")

CORS(app, resources={r"/api/*": {"origins": cors_origins}})

# Export for Vercel
export = app

