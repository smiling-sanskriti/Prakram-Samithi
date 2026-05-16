# Parakram Samiti API Backend

Flask REST API for storing and managing Parakram Samiti registration form submissions.

## Quick Start

### 1. Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 2. Setup Environment

```bash
cp .env.example .env
```

(Keep default SQLite for local dev, or set `DATABASE_URL` for PostgreSQL)

### 3. Run the Server

```bash
python app.py
```

Server will start at `http://localhost:5000`

---

## API Endpoints

### Health Check
**GET** `/health`
```json
{
  "status": "ok",
  "message": "API is running"
}
```

---

### Submit Registration
**POST** `/api/register`

**Request:**
```json
{
  "fullName": "John Doe",
  "age": 25,
  "gender": "Male",
  "sport": "Karate",
  "district": "Delhi",
  "phone": "9876543210"
}
```

**Response (Success):**
```json
{
  "status": "success",
  "message": "Registration submitted successfully",
  "registration_id": 1
}
```

**Response (Validation Error):**
```json
{
  "status": "error",
  "message": "Validation failed",
  "errors": [
    "fullName: Required",
    "phone: Must be 10 digits"
  ]
}
```

---

### Get All Registrations
**GET** `/api/registrations?page=1&per_page=10`

**Response:**
```json
{
  "status": "success",
  "data": [
    {
      "id": 1,
      "fullName": "John Doe",
      "age": 25,
      "gender": "Male",
      "sport": "Karate",
      "district": "Delhi",
      "phone": "9876543210",
      "submittedAt": "2026-05-17T10:30:00"
    }
  ],
  "pagination": {
    "page": 1,
    "per_page": 10,
    "total": 50,
    "pages": 5
  }
}
```

---

### Get Single Registration
**GET** `/api/registrations/<id>`

Example: `GET /api/registrations/1`

---

### Search Registrations
**GET** `/api/registrations/search?sport=Karate&district=Delhi`

Query parameters:
- `sport` (optional): Filter by sport
- `district` (optional): Filter by district

---

### Get Statistics
**GET** `/api/stats`

**Response:**
```json
{
  "status": "success",
  "data": {
    "total_registrations": 50,
    "by_sport": {
      "Karate": 20,
      "Shooting": 15,
      "Kickboxing": 15
    },
    "by_district": {
      "Delhi": 30,
      "UP": 20
    },
    "by_gender": {
      "Male": 35,
      "Female": 15
    }
  }
}
```

---

## Connect React Frontend

Update your React form to POST to the API:

```javascript
const handleSubmit = async (event) => {
  event.preventDefault();
  const formData = new FormData(event.target);
  
  const payload = {
    fullName: formData.get("fullName"),
    age: formData.get("age"),
    gender: formData.get("gender"),
    sport: formData.get("sport"),
    district: formData.get("district"),
    phone: formData.get("phone")
  };

  try {
    const response = await fetch("http://localhost:5000/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const result = await response.json();
    if (result.status === "success") {
      setFormMessage("Registration submitted successfully!");
      event.target.reset();
    } else {
      setFormMessage(result.errors?.join(", ") || "Registration failed");
    }
  } catch (error) {
    setFormMessage("Network error: " + error.message);
  }
};
```

---

## Database Options

### SQLite (Default - Local Dev)
- No setup needed
- File: `registrations.db`
- Change `DATABASE_URL` if needed

### PostgreSQL (Production)

1. Install PostgreSQL
2. Create database:
   ```sql
   CREATE DATABASE parakram_db;
   ```

3. Update `.env`:
   ```
   DATABASE_URL=postgresql://user:password@localhost:5432/parakram_db
   ```

4. Install psycopg2:
   ```bash
   pip install psycopg2-binary
   ```

5. Run app:
   ```bash
   python app.py
   ```

---

## Deployment

### Heroku
```bash
git add .
git commit -m "Add Flask backend"
git push heroku main
```

### Railway / Render
1. Connect GitHub repo
2. Set environment variables
3. Deploy automatically

---

## Validation Rules

| Field | Rules |
|-------|-------|
| fullName | 2-100 chars, required |
| age | 8-100, required |
| gender | Male/Female/Other, required |
| sport | 2-100 chars, required |
| district | 2-100 chars, required |
| phone | Exactly 10 digits, unique, required |

---

## Troubleshooting

**CORS Error?**
- Backend runs on port 5000
- Frontend runs on port 5173
- CORS is enabled for both — check browser console

**Phone already exists?**
- Phone must be unique; can't register twice with same number
- Delete the old record or use a different phone

**SQLite file not created?**
- Run `python app.py` once to auto-create `registrations.db`

---

## File Structure

```
backend/
├── app.py              # Main Flask app
├── models.py           # Database models
├── requirements.txt    # Python dependencies
├── .env.example        # Environment template
├── .env                # Your local config (not in git)
└── registrations.db    # SQLite database (auto-created)
```

