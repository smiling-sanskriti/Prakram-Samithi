"""Database models for Parakram Samiti."""

from datetime import datetime

from db import db


class Registration(db.Model):
    """Registration model for storing form submissions."""
    __tablename__ = 'registrations'

    id = db.Column(db.Integer, primary_key=True)
    full_name = db.Column(db.String(100), nullable=False, index=True)
    age = db.Column(db.Integer, nullable=False)
    gender = db.Column(db.String(20), nullable=False)
    sport = db.Column(db.String(100), nullable=False, index=True)
    district = db.Column(db.String(100), nullable=False, index=True)
    phone = db.Column(db.String(10), nullable=False, unique=True)
    submitted_at = db.Column(db.DateTime, default=datetime.utcnow, index=True)

    def __repr__(self):
        return f'<Registration {self.id}: {self.full_name}>'

    def to_dict(self):
        """Convert registration to dictionary."""
        return {
            'id': self.id,
            'fullName': self.full_name,
            'age': self.age,
            'gender': self.gender,
            'sport': self.sport,
            'district': self.district,
            'phone': self.phone,
            'submittedAt': self.submitted_at.isoformat()
        }
