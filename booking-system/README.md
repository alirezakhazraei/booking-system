# Booking System API

A REST API for an appointment booking system. Customers book appointments with
Providers for services the providers offer, within the providers' declared
availability, with basic overlap prevention.

Built as an internship-level project with a clean layered architecture:
**Routes → Controllers → Services → Repositories → Models**.

## Tech Stack

- JavaScript (Node.js)
- Express.js
- MongoDB + Mongoose
- JWT (jsonwebtoken) for authentication
- bcrypt for password hashing

## Architecture

```
src/
  config/         DB connection + env config
  models/         Mongoose schemas (User, Service, Availability, Appointment)
  repositories/   Raw database access only (no business logic)
  services/       Business logic (validation, rules, overlap checks)
  controllers/    HTTP layer - parses req, calls service, sends res
  routes/         Express route definitions
  middlewares/    auth (JWT), role-based access, centralized error handler
  utils/          ApiError class, asyncHandler wrapper
  app.js          Express app setup (middleware + routes)
  server.js       Entry point - connects DB then starts the server
```

Why split Repository and Service? The repository layer only knows how to
talk to MongoDB. The service layer only knows business rules (e.g. "you
can't book an overlapping appointment"). This makes each layer easy to
explain in an interview and easy to unit test in isolation.

## Features

- Register / Login (JWT-based auth, passwords hashed with bcrypt)
- Two roles: `customer` and `provider`
- Providers can create services they offer (title, duration, price)
- Providers can declare weekly availability (day + time range)
- Customers can create appointments against a provider's service
- Prevents double-booking: rejects any appointment that overlaps an
  existing non-cancelled appointment for that provider
- Customers can view their own appointments; providers can view theirs
- Status flow: `pending → confirmed / cancelled / completed`
  - Providers can confirm, cancel, or complete
  - Customers can only cancel their own appointment
- Centralized error handling (validation errors, invalid IDs, duplicate
  emails, etc. all return consistent JSON error responses)

## Getting Started

### 1. Prerequisites
- Node.js 18+
- A MongoDB instance (local or [MongoDB Atlas](https://www.mongodb.com/atlas) free tier)

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables
Copy `.env.example` to `.env` and fill in your values:
```bash
cp .env.example .env
```
```
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/booking-system
JWT_SECRET=change_this_to_a_long_random_secret
JWT_EXPIRES_IN=7d
```

### 4. Run the server
```bash
npm run dev    # with nodemon, auto-restarts on changes
# or
npm start
```

The API will be available at `http://localhost:5000`.
Health check: `GET /api/health`

## API Reference

### Auth
| Method | Endpoint             | Access | Description               |
|--------|-----------------------|--------|----------------------------|
| POST   | `/api/auth/register`  | Public | Register as customer/provider |
| POST   | `/api/auth/login`     | Public | Login, returns JWT token  |

**Register body:**
```json
{ "name": "Ali", "email": "ali@example.com", "password": "123456", "role": "provider" }
```

### Services (things a provider offers)
| Method | Endpoint              | Access           | Description               |
|--------|------------------------|------------------|----------------------------|
| GET    | `/api/services`        | Public           | List all active services  |
| GET    | `/api/services/mine`   | Provider (auth)  | List my own services      |
| POST   | `/api/services`        | Provider (auth)  | Create a service           |
| PUT    | `/api/services/:id`    | Provider (auth)  | Update my service          |
| DELETE | `/api/services/:id`    | Provider (auth)  | Deactivate my service      |

**Create service body:**
```json
{ "title": "Haircut", "description": "Classic haircut", "durationMinutes": 30, "price": 15 }
```

### Availability (a provider's weekly schedule)
| Method | Endpoint                              | Access          | Description                  |
|--------|-----------------------------------------|-----------------|-------------------------------|
| GET    | `/api/availability/provider/:providerId`| Public          | View a provider's availability |
| GET    | `/api/availability/mine`               | Provider (auth) | View my own availability      |
| POST   | `/api/availability`                    | Provider (auth) | Add an availability slot      |
| DELETE | `/api/availability/:id`                | Provider (auth) | Remove a slot                 |

**Create availability body:**
```json
{ "dayOfWeek": 1, "startTime": "09:00", "endTime": "17:00" }
```
`dayOfWeek`: 0 = Sunday ... 6 = Saturday

### Appointments
All require `Authorization: Bearer <token>`.

| Method | Endpoint                       | Access           | Description                        |
|--------|----------------------------------|------------------|-------------------------------------|
| POST   | `/api/appointments`              | Customer         | Book an appointment                 |
| GET    | `/api/appointments/customer/me`  | Customer         | My appointments (as customer)       |
| GET    | `/api/appointments/provider/me`  | Provider         | My appointments (as provider)       |
| GET    | `/api/appointments/:id`          | Customer/Provider| Get one appointment                 |
| PATCH  | `/api/appointments/:id/status`   | Customer/Provider| Update status                       |

**Create appointment body:**
```json
{
  "providerId": "<provider user id>",
  "serviceId": "<service id>",
  "startTime": "2026-10-01T09:00:00.000Z",
  "notes": "First visit"
}
```
`endTime` is calculated automatically from the service's `durationMinutes`.

**Update status body:**
```json
{ "status": "confirmed" }
```

## Notes on the overlap-prevention logic

When a customer requests an appointment, `appointmentService.createAppointment`:
1. Loads the service to get its duration and computes `endTime`.
2. Checks the requested slot falls inside the provider's declared
   availability for that day (skipped if the provider has none defined).
3. Queries for any existing non-cancelled appointment for that provider
   whose time range overlaps the requested range, and rejects with `409`
   if one is found.

This is intentionally simple (no timezone handling, no recurring
exceptions) to match an internship-level scope, but the logic lives in one
place (`appointmentService.js`) so it's easy to extend later.

## Pushing this to GitHub

```bash
git init
git add .
git commit -m "Initial commit: booking system API (auth, services, availability, appointments)"
git branch -M main
git remote add origin <your-empty-github-repo-url>
git push -u origin main
```

Suggested follow-up commits as you keep working on it, so your commit
history tells a story (good for interviews):
```bash
git commit -m "Add input validation for availability time format"
git commit -m "Add postman collection for manual API testing"
git commit -m "Add unit tests for appointment overlap logic"
```

`.env` is already in `.gitignore` — never commit real secrets, only `.env.example`.
