"""Flask API for Parakram Samiti registration form."""

import os
import re
from datetime import datetime

from flask import Flask, jsonify, request
from flask_cors import CORS
from dotenv import load_dotenv
from sqlalchemy.exc import IntegrityError

from db import build_database_url, db
from models import Registration

load_dotenv()

app = Flask(__name__)

# Configuration
app.config['SQLALCHEMY_DATABASE_URI'] = build_database_url()
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JSON_SORT_KEYS'] = False

# Initialize extensions
db.init_app(app)
CORS(app, origins=[
    "http://localhost:5173",
    "http://localhost:3000",
    "http://localhost:5174"
])


@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint."""
    return jsonify({'status': 'ok', 'message': 'API is running'}), 200


@app.route('/api/register', methods=['POST'])
def register():
    """
    Handle registration form submission.
    
    Expected JSON:
    {
      "fullName": "John Doe",
      "age": 25,
      "gender": "Male",
      "sport": "Karate",
      "district": "Delhi",
      "phone": "9876543210"
    }
    """
    try:
        data = request.get_json()

        # Validation
        errors = validate_registration(data)
        if errors:
            return jsonify({
                'status': 'error',
                'message': 'Validation failed',
                'errors': errors
            }), 400

        # Create registration record
        registration = Registration(
            full_name=data['fullName'].strip(),
            age=int(data['age']),
            gender=data['gender'].strip(),
            sport=data['sport'].strip(),
            district=data['district'].strip(),
            phone=data['phone'].strip(),
            submitted_at=datetime.utcnow()
        )

        db.session.add(registration)
        db.session.commit()

        return jsonify({
            'status': 'success',
            'message': 'Registration submitted successfully',
            'registration_id': registration.id
        }), 201

    except IntegrityError:
        db.session.rollback()
        return jsonify({
            'status': 'error',
            'message': 'A registration already exists for this phone number'
        }), 409

    except Exception as e:
        db.session.rollback()
        app.logger.error(f"Registration error: {str(e)}")
        return jsonify({
            'status': 'error',
            'message': 'Server error during registration'
        }), 500


@app.route('/api/registrations', methods=['GET'])
def get_registrations():
    """Retrieve all registrations (with optional pagination)."""
    try:
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 10, type=int)

        query = Registration.query.order_by(Registration.submitted_at.desc())
        paginated = query.paginate(page=page, per_page=per_page, error_out=False)

        registrations = [
            {
                'id': r.id,
                'fullName': r.full_name,
                'age': r.age,
                'gender': r.gender,
                'sport': r.sport,
                'district': r.district,
                'phone': r.phone,
                'submittedAt': r.submitted_at.isoformat()
            }
            for r in paginated.items
        ]

        return jsonify({
            'status': 'success',
            'data': registrations,
            'pagination': {
                'page': page,
                'per_page': per_page,
                'total': paginated.total,
                'pages': paginated.pages
            }
        }), 200

    except Exception as e:
        app.logger.error(f"Fetch registrations error: {str(e)}")
        return jsonify({
            'status': 'error',
            'message': 'Server error fetching registrations'
        }), 500


@app.route('/api/registrations/<int:registration_id>', methods=['GET'])
def get_registration(registration_id):
    """Retrieve a single registration by ID."""
    try:
        reg = Registration.query.get(registration_id)
        if not reg:
            return jsonify({
                'status': 'error',
                'message': 'Registration not found'
            }), 404

        return jsonify({
            'status': 'success',
            'data': {
                'id': reg.id,
                'fullName': reg.full_name,
                'age': reg.age,
                'gender': reg.gender,
                'sport': reg.sport,
                'district': reg.district,
                'phone': reg.phone,
                'submittedAt': reg.submitted_at.isoformat()
            }
        }), 200

    except Exception as e:
        app.logger.error(f"Fetch registration error: {str(e)}")
        return jsonify({
            'status': 'error',
            'message': 'Server error fetching registration'
        }), 500


@app.route('/api/registrations/search', methods=['GET'])
def search_registrations():
    """Search registrations by sport or district."""
    try:
        sport = request.args.get('sport', '').strip()
        district = request.args.get('district', '').strip()

        query = Registration.query

        if sport:
            query = query.filter(Registration.sport.ilike(f'%{sport}%'))
        if district:
            query = query.filter(Registration.district.ilike(f'%{district}%'))

        registrations = [
            {
                'id': r.id,
                'fullName': r.full_name,
                'age': r.age,
                'gender': r.gender,
                'sport': r.sport,
                'district': r.district,
                'phone': r.phone,
                'submittedAt': r.submitted_at.isoformat()
            }
            for r in query.order_by(Registration.submitted_at.desc()).all()
        ]

        return jsonify({
            'status': 'success',
            'count': len(registrations),
            'data': registrations
        }), 200

    except Exception as e:
        app.logger.error(f"Search error: {str(e)}")
        return jsonify({
            'status': 'error',
            'message': 'Server error during search'
        }), 500


@app.route('/api/stats', methods=['GET'])
def get_stats():
    """Get registration statistics."""
    try:
        total = Registration.query.count()
        sports = db.session.query(
            Registration.sport,
            db.func.count(Registration.id).label('count')
        ).group_by(Registration.sport).all()

        districts = db.session.query(
            Registration.district,
            db.func.count(Registration.id).label('count')
        ).group_by(Registration.district).all()

        genders = db.session.query(
            Registration.gender,
            db.func.count(Registration.id).label('count')
        ).group_by(Registration.gender).all()

        return jsonify({
            'status': 'success',
            'data': {
                'total_registrations': total,
                'by_sport': {s[0]: s[1] for s in sports},
                'by_district': {d[0]: d[1] for d in districts},
                'by_gender': {g[0]: g[1] for g in genders}
            }
        }), 200

    except Exception as e:
        app.logger.error(f"Stats error: {str(e)}")
        return jsonify({
            'status': 'error',
            'message': 'Server error fetching stats'
        }), 500


def validate_registration(data):
    """Validate registration form data."""
    errors = []

    if not data:
        return ['No data provided']

    # Full Name validation
    full_name = data.get('fullName', '').strip()
    if not full_name:
        errors.append('fullName: Required')
    elif len(full_name) < 2:
        errors.append('fullName: Must be at least 2 characters')
    elif len(full_name) > 100:
        errors.append('fullName: Must be at most 100 characters')

    # Age validation
    try:
        age = int(data.get('age', 0))
        if age < 8 or age > 100:
            errors.append('age: Must be between 8 and 100')
    except (ValueError, TypeError):
        errors.append('age: Must be a valid number')

    # Gender validation
    gender = data.get('gender', '').strip()
    if not gender:
        errors.append('gender: Required')
    elif gender not in ['Male', 'Female', 'Other']:
        errors.append('gender: Must be Male, Female, or Other')

    # Sport validation
    sport = data.get('sport', '').strip()
    if not sport:
        errors.append('sport: Required')
    elif len(sport) < 2:
        errors.append('sport: Must be at least 2 characters')
    elif len(sport) > 100:
        errors.append('sport: Must be at most 100 characters')

    # District validation
    district = data.get('district', '').strip()
    if not district:
        errors.append('district: Required')
    elif len(district) < 2:
        errors.append('district: Must be at least 2 characters')
    elif len(district) > 100:
        errors.append('district: Must be at most 100 characters')

    # Phone validation
    phone = data.get('phone', '').strip()
    if not phone:
        errors.append('phone: Required')
    elif not re.match(r'^\d{10}$', phone):
        errors.append('phone: Must be 10 digits')

    return errors


@app.errorhandler(404)
def not_found(error):
    """Handle 404 errors."""
    return jsonify({
        'status': 'error',
        'message': 'Endpoint not found'
    }), 404


@app.errorhandler(500)
def server_error(error):
    """Handle 500 errors."""
    return jsonify({
        'status': 'error',
        'message': 'Internal server error'
    }), 500


if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True, host='0.0.0.0', port=5000)
