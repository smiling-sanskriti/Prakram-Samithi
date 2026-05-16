"""Shared database instance and helpers for the Flask app."""

import os
from urllib.parse import quote_plus

from flask_sqlalchemy import SQLAlchemy


db = SQLAlchemy()


def build_database_url():
	"""Build a PostgreSQL connection string from discrete env vars."""
	database_url = os.getenv("DATABASE_URL")
	if database_url:
		return database_url

	user = os.getenv("user")
	password = os.getenv("password")
	host = os.getenv("host")
	port = os.getenv("port", "5432")
	dbname = os.getenv("dbname", "postgres")

	if not all([user, password, host, port, dbname]):
		return "sqlite:///registrations.db"

	return (
		f"postgresql+psycopg2://{user}:{quote_plus(password)}"
		f"@{host}:{port}/{dbname}?sslmode=require"
	)