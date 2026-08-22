<div align="center">

<img src="frontend/images/logo.png" alt="GlobeTrotter Logo" width="140" />

# GlobeTrotter

### *Plan smarter. Travel better.*

**A full-stack, multi-city travel planning platform that transforms the chaos of international trip planning into a smooth, visual, and structured experience.**

<br/>

![Node.js](https://img.shields.io/badge/Node.js-20.x-339933?style=flat-square&logo=nodedotjs&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-6-646CFF?style=flat-square&logo=vite&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-6-2D3748?style=flat-square&logo=prisma&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-8-4479A1?style=flat-square&logo=mysql&logoColor=white)
![Express](https://img.shields.io/badge/Express-5-000000?style=flat-square&logo=express&logoColor=white)
![License](https://img.shields.io/badge/License-ISC-blue?style=flat-square)

</div>

---

## Overview

Planning a multi-city trip today means juggling spreadsheets, browser tabs, and note apps. Users lose track of dates, blow their budgets, and have no visual sense of their journey. **GlobeTrotter** solves this by centralizing trip planning into a single, beautiful tool.

Unlike booking platforms (Booking.com, Airbnb) or generic note apps (Notion, Google Docs), GlobeTrotter is a **planner-first** platform: it gives travelers the complete picture — structured itineraries, day-by-day activities, categorized budget tracking, calendar views, interactive maps, and public trip sharing — all backed by a properly structured relational database and a secure REST API.

> *"GlobeTrotter makes planning a trip feel as enjoyable as taking it."*

---

## Table of Contents

- [Key Features](#key-features)
- [How It Works](#how-it-works)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Database Overview](#database-overview)
- [API Overview](#api-overview)
- [Screenshots](#screenshots)
- [Installation & Setup](#installation--setup)
- [Environment Variables](#environment-variables)
- [Running the Project](#running-the-project)
- [Available Scripts](#available-scripts)
- [Future Enhancements](#future-enhancements)
- [Contributing](#contributing)
- [License](#license)

---

## Key Features

### ✈️ Multi-City Trip Planning
Create structured trips with multiple destination stops. Each stop has its own date range, position in the journey, and per-city notes. The entire trip is visualized as an ordered itinerary.

### 🗓️ Day-by-Day Itinerary Builder
Add activities to specific dates within each stop. Assign start times, custom costs, duration overrides, and personal notes. Activities are pulled from a curated database and can be filtered by category (Sightseeing, Food, Culture, Adventure, and more).

### 💸 Budget Tracking & Analytics
Log expenses across six categories — Transport, Accommodation, Food, Activities, Shopping, and Other. View real-time budget breakdowns with visual charts powered by Recharts. Compare planned budget vs. actual spending per trip.

### 🗺️ Interactive Map & Explore
Browse destinations on an interactive Leaflet map. Search cities and filter activities by category. View live country information via integrated external APIs.

### 📅 Calendar View
See all trips and their activities plotted on a monthly calendar view. Color-coded by trip for quick visual identification.

### 🌐 Community & Trip Sharing
Publish trips publicly with a unique, shareable token URL. Browse community trips. Copy any public itinerary to your own account with one click.

### 🤖 AI-Powered Trip Generation *(optional)*
Generate a complete day-by-day itinerary using Google Gemini AI. The system searches for real places via Google Places, then feeds structured data to the AI to produce a geographically optimized plan. Falls back to a rule-engine mock if no API key is provided.

### 🔐 Secure Authentication
JWT-based authentication with rate limiting on auth endpoints (10 requests per 15-minute window). Brute-force protection via login attempt tracking and account locking. Role-based access control (USER / ADMIN).

### 👤 User Profiles & Admin Panel
Users can manage their profile photo, bio, phone, location, and language preference. Admins have a dedicated panel with elevated platform access.

---

## How It Works

```
User registers / logs in
        │
        ▼
    Dashboard
  (stats, upcoming trips, explore cities)
        │
        ├──► Explore  →  Search cities / activities on a map
        │
        ├──► New Trip →  Name, dates, cover photo, budget, stops
        │                        │
        │                        ▼
        │              Itinerary Builder
        │           (add cities → add activities per day)
        │
        ├──► Budget   →  Log & visualize expenses by category
        │
        ├──► Calendar →  All trips plotted on a monthly calendar
        │
        └──► Community → Browse & copy public trips
```

---

## Tech Stack

### Frontend

| Technology | Version | Purpose |
|---|---|---|
| React | 19 | UI framework |
| Vite | 6 | Dev server & bundler |
| React Router DOM | 7 | Client-side routing |
| Axios | 1.x | HTTP client |
| Recharts | 3.x | Budget & analytics charts |
| React Leaflet + Leaflet | 4/1.x | Interactive map |
| FullCalendar | 6.x | Calendar / timeline view |
| Lucide React | 1.x | Icon library |
| Vanilla CSS | — | Custom design system |

### Backend

| Technology | Version | Purpose |
|---|---|---|
| Node.js | 20.x | Runtime |
| Express | 5 | HTTP server & routing |
| Prisma ORM | 6 | Database access & migrations |
| MySQL | 8 | Relational database |
| JSON Web Token | 9.x | Authentication tokens |
| bcryptjs | 3.x | Password hashing |
| Helmet | 8.x | Security HTTP headers |
| express-rate-limit | 8.x | Request rate limiting |
| Zod | 4.x | Schema validation |
| Multer | 2.x | File / image uploads |

### External Services *(all optional)*

| Service | Purpose |
|---|---|
| Google Gemini 1.5 Flash | AI-generated trip itineraries |
| Google Places API | Real-world place search for AI planning |
| Amadeus API | Live flight & hotel search |
| countries.dev | Country metadata |
| WeatherAPI | Destination weather data |

---

## Project Structure

```
GlobeTrotter-Odoo-x-LDCE-Hackathon/
│
├── frontend/                     # React + Vite SPA
│   ├── public/                   # Static assets (logo, favicon)
│   ├── images/                   # Logo and branding assets
│   └── src/
│       ├── api/                  # Axios API client modules (one per resource)
│       │   ├── client.js         # Axios instance with auth interceptor
│       │   ├── auth.api.js
│       │   ├── trips.api.js
│       │   ├── cities.api.js
│       │   ├── expenses.api.js
│       │   ├── stops.api.js
│       │   ├── activities.api.js
│       │   ├── travel.api.js
│       │   └── public.api.js
│       ├── components/
│       │   ├── layout/           # Shell (sidebar + topbar layout wrapper)
│       │   ├── common/           # Reusable UI components
│       │   └── trips/            # TicketCard, ShareModal
│       ├── context/
│       │   ├── AuthContext.jsx   # Global authentication state
│       │   └── ToastContext.jsx  # Global toast notification system
│       ├── pages/                # One component per route
│       │   ├── Landing.jsx       # Public landing page
│       │   ├── Login.jsx / Register.jsx
│       │   ├── Dashboard.jsx     # Stats, trips, city discovery
│       │   ├── Explore.jsx       # City/activity search + Leaflet map
│       │   ├── Trips.jsx         # Trip library
│       │   ├── NewTrip.jsx       # Trip creation wizard
│       │   ├── Itinerary.jsx     # Day-by-day itinerary builder
│       │   ├── Budget.jsx        # Expense tracking + Recharts
│       │   ├── Calendar.jsx      # FullCalendar timeline
│       │   ├── Community.jsx     # Public trip browser
│       │   ├── PublicTrip.jsx    # Shareable trip (no auth required)
│       │   ├── Profile.jsx       # User profile management
│       │   ├── Admin.jsx         # Admin panel
│       │   └── GeneratedPlan.jsx # AI itinerary viewer
│       ├── utils/                # fmtMoney, fmtDate, daysBetween, etc.
│       ├── App.jsx               # Router + route guards (Protected/Admin)
│       └── index.css             # Global design system & CSS variables
│
├── backend/                      # Node.js + Express REST API
│   ├── prisma/
│   │   ├── schema.prisma         # All DB models & relations
│   │   └── seed.js               # Mock cities & activities seed
│   ├── uploads/                  # User-uploaded images
│   └── src/
│       ├── app.js                # Express setup: middleware, routes
│       ├── server.js             # HTTP server entry point
│       ├── controllers/          # Route handler logic (8 controllers)
│       ├── routes/               # Express routers (10 route files)
│       ├── middleware/
│       │   ├── auth.js           # JWT verification
│       │   ├── validate.js       # Zod request validation
│       │   └── errorHandler.js   # Global error handler
│       ├── services/
│       │   ├── budget.service.js
│       │   ├── share.service.js
│       │   ├── travel/
│       │   │   ├── destinationService.js  # Aggregates external APIs
│       │   │   └── itineraryService.js    # Gemini AI generation logic
│       │   └── providers/                 # External API adapters
│       │       ├── aiProvider.js          # Google Gemini 1.5 Flash
│       │       ├── googleProvider.js      # Google Places
│       │       ├── amadeusProvider.js     # Flights & hotels
│       │       ├── countriesDevProvider.js
│       │       └── weatherProvider.js
│       ├── validators/           # Zod schemas per resource
│       └── utils/
│
├── GlobeTrotter_PRD.md           # Full Product Requirements Document
└── README.md
```

---

## Database Overview

GlobeTrotter uses **MySQL 8** managed via **Prisma ORM**. The schema is defined in `backend/prisma/schema.prisma`.

### Tables

| Table | Description |
|---|---|
| `users` | Registered users with role, profile, and auth security fields |
| `trips` | A user's named trip (dates, budget, share token, cover photo) |
| `stops` | A city destination within a trip, ordered by position |
| `cities` | Curated city catalog with geo coordinates and cost index |
| `activities` | Activities per city (category, estimated cost, duration) |
| `trip_activities` | An activity assigned to a specific stop date |
| `expenses` | User-logged expenses categorized by type |
| `saved_places` | User-bookmarked places from external search |
| `hotel_selections` | Hotels saved to a trip from Amadeus |
| `flight_selections` | Flights saved to a trip from Amadeus |
| `trip_preferences` | Travel style, interests, and pace per trip |
| `generated_itineraries` | AI-generated itinerary stored as JSON per trip |

### Key Enums

```
Role              → USER | ADMIN
ActivityCategory  → SIGHTSEEING | FOOD | ADVENTURE | CULTURE | SHOPPING |
                    ENTERTAINMENT | NATURE | HISTORY | TRANSPORT | ACCOMMODATION
ExpenseCategory   → TRANSPORT | ACCOMMODATION | FOOD | ACTIVITIES | SHOPPING | OTHER
```

### Relational Hierarchy

```
User
 └── Trip (many)
      ├── Stop (many, ordered by position)
      │    └── TripActivity (many, per date)
      ├── Expense (many)
      ├── HotelSelection (many)
      ├── FlightSelection (many)
      ├── TripPreference (one)
      └── GeneratedItinerary (one)
City
 ├── Activity (many)
 └── Stop (many)
```

---

## API Overview

Base URL: `http://localhost:5000/api`

### Authentication — `/api/auth`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/register` | No | Register new account |
| `POST` | `/login` | No | Login, receive JWT |
| `GET` | `/verify-email/:token` | No | Verify email address |
| `GET` | `/me` | JWT | Get current user |
| `PUT` | `/profile` | JWT | Update profile |

### Trips — `/api/trips`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/` | JWT | List all user trips |
| `POST` | `/` | JWT | Create trip |
| `GET` | `/:id` | JWT | Get trip with stops |
| `GET` | `/:tripId/budget` | JWT | Budget summary |
| `PUT` | `/:id` | JWT | Update trip |
| `DELETE` | `/:id` | JWT | Delete trip |

### Stops — `/api/stops`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/` | JWT | Add city stop |
| `PUT` | `/:id` | JWT | Update stop |
| `DELETE` | `/:id` | JWT | Remove stop |

### Activities — `/api/trip-activities`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/` | JWT | Add activity to stop/date |
| `PUT` | `/:id` | JWT | Update activity |
| `DELETE` | `/:id` | JWT | Remove activity |

### Cities — `/api/cities`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/` | No | Search cities |
| `GET` | `/:id/activities` | No | City activities |

### Expenses — `/api/expenses`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/` | JWT | List expenses |
| `GET` | `/budget/:tripId` | JWT | Budget by category |
| `POST` | `/` | JWT | Log expense |
| `PUT` | `/:id` | JWT | Update expense |
| `DELETE` | `/:id` | JWT | Delete expense |

### Community — `/api/public`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/trips` | No | Browse public trips |
| `GET` | `/trips/:shareToken` | No | View shared trip |
| `POST` | `/trips/:tripId/share` | JWT | Publish trip |
| `POST` | `/trips/:tripId/unshare` | JWT | Unpublish trip |
| `POST` | `/trips/:shareToken/copy` | JWT | Copy trip to account |

### Travel & AI — `/api/travel`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/destinations/search` | No | Search destinations |
| `GET` | `/info?name=` | No | City/country info |
| `GET` | `/countries` | No | All countries |
| `GET` | `/flights` | No | Live flights (Amadeus) |
| `GET` | `/hotels` | No | Live hotels (Amadeus) |
| `POST` | `/generate-plan` | JWT | Generate AI itinerary |
| `GET` | `/plan/:tripId` | JWT | Get saved AI plan |

### Upload — `/api/upload`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/profile-photo` | JWT | Upload profile photo |
| `POST` | `/trip-cover` | JWT | Upload trip cover image |

---

## Screenshots

> Add screenshots to `frontend/images/` and update this section.

| Page | Preview |
|---|---|
| Landing Page | *(coming soon)* |
| Dashboard | *(coming soon)* |
| Itinerary Builder | *(coming soon)* |
| Explore + Map | *(coming soon)* |
| Budget Tracker | *(coming soon)* |
| Calendar View | *(coming soon)* |
| Community | *(coming soon)* |

---

## Installation & Setup

### Prerequisites

- **Node.js** v18+
- **MySQL 8** (MySQL Workbench, standalone MySQL Server, or XAMPP)
- **npm** v9+
- **Git**

### 1. Clone

```bash
git clone https://github.com/your-org/GlobeTrotter-Odoo-x-LDCE-Hackathon.git
cd GlobeTrotter-Odoo-x-LDCE-Hackathon
```

### 2. Install dependencies

```bash
cd backend && npm install
cd ../frontend && npm install
```

### 3. Configure environment

```bash
cd backend
cp .env.example .env
# Edit .env — set DATABASE_URL, JWT_SECRET, and any optional API keys
```

> **Tip:** If your MySQL password contains `@`, encode it as `%40` in `DATABASE_URL`.
> Example: `mysql://root:Heer%402806@127.0.0.1:3306/globetrotter`

### 4. Create the database

In MySQL Workbench or CLI:

```sql
CREATE DATABASE globetrotter;
```

### 5. Push schema & seed data

```bash
cd backend
npx prisma db push    # Creates all tables from schema.prisma
npx prisma db seed    # Loads cities & activities mock data
```

### 6. Start servers

```bash
# Terminal 1 — Backend (port 5000)
cd backend && npm run dev

# Terminal 2 — Frontend (port 5173)
cd frontend && npm run dev
```

Visit **http://localhost:5173**

---

## Environment Variables

Create `backend/.env` from the provided `backend/.env.example`:

| Variable | Purpose | Required |
|---|---|---|
| `DATABASE_URL` | MySQL: `mysql://user:pass@host:3306/globetrotter` | **Yes** |
| `JWT_SECRET` | Long random string for signing JWT tokens | **Yes** |
| `PORT` | Backend port (default: `5000`) | No |
| `CLIENT_URL` | Frontend CORS origin (default: `http://localhost:5173`) | No |
| `GEMINI_API_KEY` | Google Gemini for AI trip generation | No |
| `GOOGLE_MAPS_API_KEY` | Google Places for real place search | No |
| `AMADEUS_CLIENT_ID` | Amadeus flights & hotels | No |
| `AMADEUS_CLIENT_SECRET` | Amadeus secret | No |
| `WEATHER_API_KEY` | WeatherAPI for destination weather | No |

> All external API keys are **optional**. The app runs fully using built-in seed data and a mock AI fallback engine.

---

## Running the Project

```bash
# Backend — with nodemon hot-reload
cd backend && npm run dev

# Frontend — with Vite HMR
cd frontend && npm run dev

# Verify database connection
cd backend && node test-db.js
```

### After pulling new changes from the team

```bash
cd backend
npm install               # Install any new packages
npx prisma db push        # Apply schema changes to DB
npx prisma generate       # Regenerate Prisma Client
npm run dev               # Restart backend
```

---

## Available Scripts

### Backend (`/backend`)

| Command | Description |
|---|---|
| `npm run dev` | Start server with nodemon (hot-reload) |
| `npm start` | Start in production mode |
| `npx prisma db push` | Sync schema to MySQL database |
| `npx prisma db seed` | Seed cities & activities |
| `npx prisma generate` | Regenerate Prisma Client after schema changes |

### Frontend (`/frontend`)

| Command | Description |
|---|---|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Build production bundle |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

---

## Future Enhancements

- **Email verification** — Token fields are in DB; full email-sending integration pending
- **Live weather widget** — Weather provider scaffolded; frontend integration planned
- **Collaborative planning** — Real-time multi-user trip editing
- **Packing list** — Per-trip checklist with organized categories
- **PWA / Offline support** — Service worker for no-connection access
- **Mobile app** — React Native companion for on-the-go planning
- **Budget forecasting** — AI-based cost prediction before trip creation

---

## Contributing

1. Fork this repository
2. Create a branch: `git checkout -b feature/your-feature`
3. Commit: `git commit -m "feat: your change"`
4. Push: `git push origin feature/your-feature`
5. Open a Pull Request

Please ensure all new API endpoints include Zod validation and follow the existing controller/route/service pattern.

---

## License

Licensed under the **ISC License**.

---

## Acknowledgements

Built with passion for the **Odoo × LDCE Hackathon**.

| Tool | Link |
|---|---|
| Prisma ORM | [prisma.io](https://www.prisma.io) |
| Vite | [vitejs.dev](https://vitejs.dev) |
| FullCalendar | [fullcalendar.io](https://fullcalendar.io) |
| React Leaflet | [react-leaflet.js.org](https://react-leaflet.js.org) |
| Recharts | [recharts.org](https://recharts.org) |
| Lucide Icons | [lucide.dev](https://lucide.dev) |
| Google Gemini | [ai.google.dev](https://ai.google.dev) |
| Amadeus for Developers | [developers.amadeus.com](https://developers.amadeus.com) |

---

<div align="center">
  <sub>Made for the Odoo × LDCE Hackathon &nbsp;·&nbsp; GlobeTrotter Team</sub>
</div>
