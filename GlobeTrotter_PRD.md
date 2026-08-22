# GlobeTrotter — Empowering Personalized Travel Planning
## Complete Product Requirements Document (PRD)
### Hackathon Edition — Implementation Ready

---

> **Version:** 1.0  
> **Status:** Ready for Implementation  
> **Scope:** Local hackathon MVP — no cloud deployment required

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Product Vision](#2-product-vision)
3. [Problem Statement](#3-problem-statement)
4. [Goals](#4-goals)
5. [Non-Goals](#5-non-goals)
6. [Target Users](#6-target-users)
7. [User Personas](#7-user-personas)
8. [User Journeys](#8-user-journeys)
9. [Functional Requirements](#9-functional-requirements)
10. [Feature Priorities](#10-feature-priorities)
11. [Screen / Page Requirements](#11-screen--page-requirements)
12. [UX / UI Requirements](#12-ux--ui-requirements)
13. [System Architecture](#13-system-architecture)
14. [Technology Stack](#14-technology-stack)
15. [Database Architecture](#15-database-architecture)
16. [ER Diagram](#16-er-diagram)
17. [Prisma Schema Design](#17-prisma-schema-design)
18. [REST API Specification](#18-rest-api-specification)
19. [Authentication & Authorization](#19-authentication--authorization)
20. [Frontend Architecture](#20-frontend-architecture)
21. [Backend Architecture](#21-backend-architecture)
22. [External API Strategy](#22-external-api-strategy)
23. [Seed Data Strategy](#23-seed-data-strategy)
24. [Error Handling](#24-error-handling)
25. [Security](#25-security)
26. [Testing Strategy](#26-testing-strategy)
27. [Git / Team Workflow](#27-git--team-workflow)
28. [Hackathon Demo Flow](#28-hackathon-demo-flow)
29. [Acceptance Criteria](#29-acceptance-criteria)
30. [Future Enhancements](#30-future-enhancements)

---

## 1. Executive Summary

**GlobeTrotter** is a personalized, multi-city travel planning web application that transforms the chaotic process of international travel planning into a smooth, visual, and collaborative experience.

### What it solves

Planning a multi-city trip today requires juggling multiple spreadsheets, browser tabs, chat threads, and note apps. Users lose track of dates, blow their budgets, and lack any visual sense of their journey. GlobeTrotter centralizes all of this into a single, beautiful tool.

### Who it is for

Independent travelers, backpackers, group trip organizers, and anyone who wants to plan a structured multi-destination journey with clarity on timing, activities, and cost.

### Why it matters

Most travel apps either book for you (Booking.com, Airbnb) or just store notes (Google Docs). GlobeTrotter occupies the gap: a proper **planner** that gives travelers the full picture — destinations, day-by-day activities, budgets, visual calendars, and trip sharing — all backed by a properly structured relational database.

### What makes it different

- Day-wise itinerary builder with real relational data (not flat notes)
- Automatic budget calculation across categories with visual charts
- Calendar/timeline and map visualization in one app
- Public trip sharing with copy-trip functionality
- Clean, modern travel-app aesthetic (not a spreadsheet with buttons)

---

## 2. Product Vision

> *GlobeTrotter should make planning a trip feel as enjoyable as taking it.*

The platform empowers users to:

- **Dream** — browse cities and discover activities
- **Design** — build structured day-by-day itineraries
- **Budget** — see automatic cost breakdowns in real-time
- **Visualize** — view their journey on a calendar, timeline, and map
- **Share** — publish and copy itineraries within the community

The product is a hackathon MVP but should feel like a polished, professional travel SaaS at demo time.

---

## 3. Problem Statement

Multi-city travel planning is genuinely complex. A traveler planning a 3-week trip across 6 countries needs to:

- Sequence cities in a logical order
- Assign travel dates to each stop
- Select and schedule specific activities per city
- Track costs across transport, accommodation, food, and experiences
- Visualize the full timeline before committing
- Share the plan for feedback or inspiration

No single free tool handles all of this well. Spreadsheets lack visualization. Generic note apps lack structure. Booking platforms lack the planning-first workflow.

**GlobeTrotter solves this by providing an end-to-end itinerary planner with relational data, automatic budgeting, and public sharing.**

---

## 4. Goals

### Primary Goals (Hackathon MVP)
- G1: Allow users to create multi-city trip itineraries with structured relational data
- G2: Enable day-wise activity assignment to each trip stop
- G3: Automatically calculate and visualize trip budgets by category
- G4: Provide calendar/timeline views of the full itinerary
- G5: Allow users to share trips publicly via a unique shareable URL
- G6: Allow any authenticated user to copy a public trip to their own account
- G7: Deliver a visually impressive, demo-ready UI

### Secondary Goals
- G8: Show trip route on an interactive map
- G9: Provide city discovery and activity search/filtering
- G10: Support drag-and-drop itinerary reordering

---

## 5. Non-Goals

The following are explicitly **out of scope** for this hackathon:

- **No cloud deployment** — runs on local machines only
- **No real-time collaboration** — no Socket.io or live co-editing
- **No payment processing** — budget tracking only, no bookings
- **No external booking integration** — no Airbnb, Skyscanner, or hotel APIs
- **No mobile native app** — responsive web only
- **No email notifications** — no SMTP or email service
- **No TypeScript** — JavaScript only
- **No microservices** — monolith backend only
- **No Docker** — runs directly on the host machine
- **No Redux** — React state and Context API only
- **AI itinerary generation** — P2 optional, not required for MVP

---

## 6. Target Users

### Primary User: The Traveler

An individual who wants to plan a personal trip (solo, couple, or group), with full control over destinations, dates, activities, and budget.

**Needs:**
- A clear place to organize multi-city trip plans
- Visibility into what happens on each day
- Budget awareness before the trip happens
- A way to share the plan with travel companions or online communities

### Secondary User: The Community Explorer

A user who is not planning a trip themselves but wants to browse public trips for inspiration, and may copy a plan to customize it.

### Optional User: The Platform Admin *(OPTIONAL)*

An internal administrator who monitors platform usage, popular destinations, and user statistics via an analytics dashboard.

---

## 7. User Personas

### Persona 1 — Priya, 27, Solo Traveler

**Background:** Software engineer in Bangalore. Plans 2–3 international trips per year. Uses spreadsheets today but finds them tedious to maintain.

**Goals:** Build a structured 10-day Japan itinerary, track her budget in INR, and share the plan with her friend.

**Frustrations:** Loses track of which cities to visit on which days. Can't easily see the "shape" of a trip before booking.

**Tech comfort:** High. Comfortable with web apps.

---

### Persona 2 — Daniel, 34, Group Trip Organizer

**Background:** Marketing manager in London organizing a 2-week Europe trip for 6 friends. Constantly battling group chat chaos.

**Goals:** Create a shared plan that everyone can view (read-only). Track the estimated group budget. Have one source of truth for the itinerary.

**Frustrations:** Every group member has a different version of the plan. No single app handles the full picture.

**Tech comfort:** Moderate. Wants simplicity, not configuration.

---

### Persona 3 — Aiko, 22, Travel Enthusiast

**Background:** University student in Tokyo. Dreams about travel more than she books it. Loves browsing other people's itineraries for inspiration.

**Goals:** Browse public trip plans, discover new city combinations, copy a trip someone else built and modify it for her budget.

**Frustrations:** Travel blogs show photos, not structured day-by-day plans.

**Tech comfort:** High. Mobile-first user.

---

## 8. User Journeys

### Journey 1 — First-Time User Creates a Trip

```
1. Lands on /login → registers account
2. Redirected to /dashboard → sees empty state, "Plan Your First Trip" CTA
3. Clicks "Plan New Trip" → navigates to /trips/new
4. Fills in trip name, dates, description → submits
5. Redirected to /trips/:id/itinerary (Itinerary Builder)
6. Searches for first city → adds it as a stop with dates
7. Browses activities for that city → adds 3 activities to Day 1
8. Adds second city → assigns dates → adds activities
9. Opens /trips/:id/calendar → sees activities on a full calendar
10. Opens /trips/:id/budget → sees cost breakdown with charts
11. Opens /trips/:id/map → sees route between cities on Leaflet map
12. Makes trip public → copies share link
```

---

### Journey 2 — Community Explorer Copies a Trip

```
1. Receives a shareable URL from a friend
2. Opens /public/trips/:shareToken → no login required
3. Sees full itinerary: cities, activities, estimated budget
4. Clicks "Copy This Trip"
5. Prompted to log in / sign up if not authenticated
6. After auth, new copy of the trip appears in their /trips dashboard
7. Edits the copy: changes dates, swaps activities, adjusts budget
```

---

### Journey 3 — User Adds Manual Expenses

```
1. Opens existing trip → navigates to budget page
2. Clicks "Add Expense"
3. Fills in category (Transport), amount, description, date
4. Expense saved → budget totals auto-update
5. Pie chart updates to reflect new category split
6. User sees "You're ₹5,000 over budget" warning
```

---

## 9. Functional Requirements

### FR-01: User Authentication
- Users can register with first name, last name, email, phone, city, country, and password
- Users can log in with email and password
- Passwords are hashed with bcrypt before storage
- JWT tokens are issued on successful login
- JWT tokens are validated on all protected routes
- Users can log out (token invalidated client-side)
- Basic form validation: required fields, valid email format, password minimum 8 characters

### FR-02: Trip Management
- Authenticated users can create trips with: name, description, start date, end date, optional cover photo
- Start date must not be after end date
- Users can view all their trips in a list
- Users can edit trip metadata
- Users can delete trips (cascades to stops, activities, expenses)
- Users can only access their own trips

### FR-03: Stop / City Management
- Users can add cities as stops to a trip
- Each stop has: city, start date, end date, position (order)
- Users can reorder stops
- Users can remove stops from a trip

### FR-04: City Discovery
- Users can search cities by name
- City data includes: name, country, region, cost index, popularity, latitude, longitude
- Users can filter by country, region, cost level
- Users can add a city directly to their current trip from search results

### FR-05: Activity Discovery & Assignment
- Activities are pre-seeded per city in the database
- Activities include: name, description, category, estimated cost, duration, image URL
- Users can filter activities by category, cost range, duration
- Users can add activities to a specific stop in their itinerary
- Each assigned activity (trip_activity) has: date, start_time, position, optional custom_cost

### FR-06: Itinerary Builder
- Day-wise view of all activities across all stops
- Users can reorder activities within a day
- Users can reassign activity dates
- Users can remove activities from the itinerary
- Changes persist to MySQL via the API

### FR-07: Itinerary Views
- **List View:** Cities → Days → Activities with time, cost, category
- **Calendar View:** FullCalendar component showing activities by date
- **Timeline View:** Vertical timeline of the trip from start to end date
- Users can toggle between all three views

### FR-08: Map View
- Leaflet + OpenStreetMap renders an interactive map
- Trip stop cities appear as numbered markers
- A polyline route connects cities in order
- Clicking a marker shows city name and dates

### FR-09: Budget & Cost Tracking
- Automatic calculation of total trip cost = sum of all trip_activity custom_costs + expenses
- Cost breakdown by category: Transport, Accommodation, Activities, Meals, Other
- Cost per day (total / trip duration)
- Cost per city (sum of activities + expenses tagged to that stop)
- Recharts pie chart for category breakdown
- Recharts bar chart for daily spending
- Over-budget warning when actual > estimated

### FR-10: Expense Management
- Users can manually add expenses to a trip
- Expense fields: category, amount, description, date
- Expenses auto-update budget calculations
- Users can edit or delete expenses

### FR-11: Calendar / Timeline
- FullCalendar displays activities on their assigned dates
- Day and week view supported
- Activities show name, time, and cost in the calendar event
- Drag-and-drop to reassign activity dates *(P1 enhancement)*

### FR-12: Public Trip Sharing
- Users can toggle a trip to "public"
- A secure share token (UUID) is generated on first publish
- Public URL: `/public/trips/:shareToken`
- No authentication required to view a public trip
- Public view shows: trip summary, cities, day-wise activities, estimated budget
- Public users cannot modify the original trip

### FR-13: Copy Trip
- Any authenticated user viewing a public trip can click "Copy Trip"
- A full deep copy of the trip is created under their account:
  - New trip record, new stops, new trip_activities
  - No link to original owner's data
- The copied trip appears immediately in their /trips dashboard

### FR-14: User Profile
- Users can update: name, email, profile photo, language preference
- Profile photo upload *(optional: Cloudinary integration)*
- Users can view their saved/completed trips from their profile

### FR-15: Admin Dashboard *(OPTIONAL — P2)*
- View total users, total trips, most popular cities, most popular activities
- User engagement statistics
- Recharts visualizations

---

## 10. Feature Priorities

### P0 — MUST HAVE (demo blockers if missing)

| Feature | Rationale |
|---|---|
| User Registration & Login | Gate to all functionality |
| JWT Auth + Protected Routes | Security foundation |
| Create / Edit / Delete Trip | Core entity |
| Add Cities (Stops) to Trip | Core itinerary unit |
| Add Activities to Stops | Core itinerary content |
| Itinerary Builder (list view) | The central feature |
| Budget Calculation (automatic) | Key differentiator |
| MySQL Persistence via Prisma | Database requirement |
| My Trips Dashboard | User's home base |
| City Search (seeded data) | Required for stop creation |
| Activity Discovery (seeded data) | Required for itinerary building |

### P1 — HIGH VALUE (strongly recommended for demo)

| Feature | Rationale |
|---|---|
| Calendar View (FullCalendar) | Visual wow factor |
| Recharts Budget Charts | Makes budget tangible |
| Map View (Leaflet) | Visually impressive in demo |
| Timeline View | Alternate trip overview |
| Public Trip Sharing | Community + demo story |
| Copy Trip | Completes sharing story |
| Expense Manual Entry | Budget completeness |
| Trip Status (Upcoming/Past/Ongoing) | UX polish |

### P2 — OPTIONAL (only if time permits)

| Feature | Rationale |
|---|---|
| AI Itinerary Generation | Cool but non-trivial to implement safely |
| Cloudinary Image Upload | Nice but not blocking |
| Drag-and-drop Reorder | UX enhancement |
| Admin Analytics Dashboard | Only for polish phase |
| Forgot Password / Reset | Auth edge case |
| Social Sharing (Twitter, etc.) | P2 only |
| Advanced Filters | Refinement |
| Community/Explore Tab | Additional screen |

> **Rule:** Do not start any P2 feature until all P0 and P1 features are complete and demoed.

---

## 11. Screen / Page Requirements

### Screen 1: Login (`/login`)

**Purpose:** Authenticate existing users.

**Components:**
- Email input
- Password input (masked)
- Login button
- Link to Signup
- Validation error messages

**States:**
- Default
- Loading (button spinner during API call)
- Error (invalid credentials)
- Success (redirect to /dashboard)

---

### Screen 2: Registration (`/signup`)

**Purpose:** Create a new user account.

**Components:**
- First name, Last name
- Email, Phone number
- City, Country
- Optional profile photo upload
- Additional information / bio textarea
- Register button

**Validation:**
- All required fields present
- Valid email format
- Password min 8 chars
- Passwords match (if confirm field present)

---

### Screen 3: Dashboard / Home (`/dashboard`)

**Purpose:** Central hub. First screen after login.

**Layout:**
- Top: Welcome message with user's name
- Hero banner (destination imagery)
- "Plan New Trip" prominent CTA
- Recent/Upcoming Trips (horizontal scroll cards)
- Recommended Destinations (seeded popular cities)
- Budget Highlights (if trips exist)

**Empty State:** "No trips yet. Start planning your first adventure →"

**API Data Required:**
- `GET /api/trips` (user's trips, sorted by start_date)
- `GET /api/cities?popular=true` (recommended destinations)

---

### Screen 4: Create Trip (`/trips/new`)

**Purpose:** Initiate a new trip.

**Form Fields:**
- Trip name (required)
- Description (optional)
- Start date (required)
- End date (required, must be ≥ start date)
- Cover photo (optional)
- Suggested places / activities (UI hint only, not functional gate)

**Behavior:** On submit → `POST /api/trips` → redirect to `/trips/:id/itinerary`

---

### Screen 5: Itinerary Builder (`/trips/:id/itinerary`)

**Purpose:** The core planning interface. Add cities, dates, activities.

**Layout:**
- Left panel: Trip metadata, stop list (cities in order)
- Main panel: Day-wise activity view for selected stop
- Right panel: Activity search / discovery for current city

**Components:**
- "Add Stop" button → opens city search modal
- Stop card: city name, date range, activity count
- Day view: collapsible days with activity cards
- Activity card: name, category badge, time, cost, remove button
- "Add Activity" button per day → opens activity search drawer

**Section structure (matching mockup Screen 5):**
- Each stop is a "Section" with date range and budget
- "Add Another Section" at bottom

---

### Screen 6: My Trips (`/trips`)

**Purpose:** List and manage all user trips.

**Trip Card Shows:**
- Cover image (or placeholder)
- Trip name
- Date range
- Number of stops/destinations
- Estimated total budget
- Status badge: Upcoming / Ongoing / Completed

**Grouped by status:**
- Ongoing (currently within date range)
- Upcoming (start date in future)
- Completed (end date in past)

**Actions per card:** View | Edit | Delete | Share | Continue Planning

**Empty State:** "No trips here yet."

---

### Screen 7: User Profile (`/profile`)

**Purpose:** View and edit user information.

**Sections:**
- Profile photo + name + bio
- Editable fields: name, email, phone, city, country
- Language preference dropdown
- Pre-planned trips (upcoming)
- Previous trips (completed)

---

### Screen 8: City / Activity Search

**City Search** (`/cities` or modal):
- Search bar with debounce
- Results list: city name, country, region, cost index, popularity
- "Add to Trip" button
- Filters: Country, Region, Cost range

**Activity Search** (drawer/modal within itinerary builder):
- Triggered per stop
- Shows activities seeded for that city
- Filter by category, cost, duration
- "Add to Day" button

---

### Screen 9: Itinerary View (`/trips/:id`)

**Purpose:** Read-oriented summary of the full trip.

**Layout:**
- Header: trip name, date range, estimated budget
- Toggle: Calendar | Timeline | List
- **List view:** City → Day → Activities (with time, cost, category)
- **Calendar view:** FullCalendar with activities as events
- **Timeline view:** Vertical scroll from day 1 to last day

---

### Screen 10: Community / Public Explore *(P2 OPTIONAL)*

**Purpose:** Browse public trips from all users.

**Layout:**
- Search bar
- Filter / Sort options
- Public trip cards: destination overview, dates, budget range
- Click → opens public itinerary view

---

### Screen 11: Calendar View (`/trips/:id/calendar`)

**Purpose:** Visual calendar for the trip itinerary.

**Component:** FullCalendar (dayGrid + timeGrid views)

**Events:** Each `trip_activity` appears as a calendar event on its assigned date
- Event shows: activity name, start time, cost
- Click event → activity detail modal

---

### Screen 12: Admin Panel (`/admin`) — *OPTIONAL*

**Purpose:** Platform analytics.

**Tabs:**
- Overview: total users, total trips
- Popular Cities
- Popular Activities
- User Analytics

**Charts:** Recharts bar, pie, and line charts.

---

### Screen 13: Budget View (`/trips/:id/budget`)

**Purpose:** Financial overview of the trip.

**Sections:**
- Total estimated cost (large display number)
- Cost breakdown by category (Recharts pie chart)
- Cost per city (Recharts bar chart)
- Daily spending (Recharts bar chart)
- Expense list with add/edit/delete
- Over-budget warning alert

---

### Screen 14: Map View (`/trips/:id/map`)

**Purpose:** Geographic visualization of the trip route.

**Component:** Leaflet + OpenStreetMap
- Numbered markers for each stop city (using city lat/lng from DB)
- Polyline connecting stops in order
- Popup on marker: city name, dates

---

### Screen 15: Public Trip View (`/public/trips/:shareToken`)

**Purpose:** Shareable read-only itinerary.

**Content:**
- Trip summary (name, date range, cities, estimated budget)
- Day-wise activity list (same as list view)
- "Copy This Trip" button (requires login)
- No edit controls visible

**Access:** No authentication required.

---

## 12. UX / UI Requirements

### Visual Direction

GlobeTrotter should feel like a **premium travel SaaS product** — think Notion meets Airbnb Experiences. Clean, modern, content-forward.

**Palette:**
- Background: `#FAFAF8` (warm off-white)
- Surface cards: `#FFFFFF`
- Primary accent: `#0F7EFA` (vibrant travel blue)
- Secondary accent: `#22C55E` (confirmation green, budget OK)
- Warning: `#F59E0B` (amber, budget caution)
- Danger: `#EF4444` (over-budget)
- Text primary: `#111827`
- Text secondary: `#6B7280`
- Border: `#E5E7EB`

**Typography:**
- Display: `Inter` (semi-bold 700, used for headings and trip titles)
- Body: `Inter` (regular 400 / medium 500)
- Data/caption: `Inter` (small, muted)
- Icon library: `lucide-react` or `heroicons`

**Layout Principles:**
- Max content width: 1280px, centered
- Left sidebar nav (collapsible on mobile)
- Cards with subtle drop shadows (`shadow-sm`)
- 8pt spacing grid (Tailwind default)
- Rounded corners: `rounded-xl` for cards, `rounded-lg` for buttons
- No excessive gradients — one gradient accent on the hero/banner only

**Responsive:**
- Desktop-first, but mobile breakpoints required
- Sidebar collapses to bottom nav on mobile
- Trip cards switch to single-column on mobile

**Consistency Rules:**
- All primary actions: solid blue button
- All destructive actions: red ghost/outline button
- All secondary actions: gray ghost button
- Status badges use pill shape with category-specific colors
- Activity category colors are consistent across all screens

**Do Not:**
- Heavy drop shadows everywhere
- Rainbow gradients on cards
- Cluttered dashboards with too many widgets
- Placeholder lorem ipsum — use realistic travel content

---

## 13. System Architecture

```
┌─────────────────────────────────────────────────┐
│                  BROWSER CLIENT                 │
│  React + Vite + Tailwind CSS + React Router     │
│  Recharts │ FullCalendar │ Leaflet │ Axios       │
└────────────────────┬────────────────────────────┘
                     │ HTTP REST (JSON)
                     │ http://localhost:5000
                     ▼
┌─────────────────────────────────────────────────┐
│               NODE.JS / EXPRESS                 │
│  REST API │ JWT Middleware │ Zod Validation      │
│  Controllers │ Services │ Utilities              │
└────────────────────┬────────────────────────────┘
                     │ Prisma ORM
                     ▼
┌─────────────────────────────────────────────────┐
│              LOCAL MySQL DATABASE               │
│  Normalized relational schema                   │
│  Seeded with cities + activities                │
└─────────────────────────────────────────────────┘
```

### Authentication Flow

```
Client login form
       ↓
POST /api/auth/login
       ↓
Express validates credentials
       ↓
bcrypt.compare(password, hash)
       ↓
JWT signed with JWT_SECRET
       ↓
Token returned to client
       ↓
Stored in localStorage / httpOnly cookie
       ↓
Attached as Authorization: Bearer <token> on all requests
       ↓
authMiddleware validates token on protected routes
```

### Data Flow (Example: Add Activity)

```
User clicks "Add Activity" in Builder
        ↓
React calls POST /api/stops/:stopId/activities (with JWT)
        ↓
Express authMiddleware validates JWT
        ↓
Controller checks stop belongs to user's trip
        ↓
Zod validates request body
        ↓
Prisma creates trip_activity record in MySQL
        ↓
Returns created record as JSON
        ↓
React updates local state → UI re-renders
```

---

## 14. Technology Stack

### Frontend

| Technology | Version | Purpose |
|---|---|---|
| React | 18.x | UI framework |
| Vite | 5.x | Build tool and dev server |
| JavaScript | ES2022 | Language |
| React Router DOM | 6.x | Client-side routing |
| Tailwind CSS | 3.x | Utility-first styling |
| Axios | 1.x | HTTP client |
| Recharts | 2.x | Budget and analytics charts |
| FullCalendar | 6.x | Calendar and timeline view |
| Leaflet + React-Leaflet | 1.x | Interactive maps |
| date-fns | 3.x | Date manipulation |
| lucide-react | latest | Icon set |

### Backend

| Technology | Version | Purpose |
|---|---|---|
| Node.js | 20.x LTS | Runtime |
| Express.js | 4.x | HTTP framework |
| JavaScript | ES2022 | Language |
| Prisma ORM | 5.x | Database access layer |
| bcryptjs | 2.x | Password hashing |
| jsonwebtoken | 9.x | JWT signing and verification |
| Zod | 3.x | Request validation schemas |
| cors | 2.x | Cross-origin resource sharing |
| dotenv | 16.x | Environment variable loading |
| uuid | 9.x | Share token generation |
| express-async-handler | 1.x | Async error forwarding |

### Database

| Technology | Version | Purpose |
|---|---|---|
| MySQL | 8.x | Primary relational database |
| Prisma | 5.x | Schema management + migrations |

### Development Tools

| Tool | Purpose |
|---|---|
| nodemon | Auto-restart backend on changes |
| concurrently | Run frontend + backend together |
| Prisma Studio | Visual DB browser during development |
| Postman / Insomnia | API testing |

---

## 15. Database Architecture

### Design Principles

- **Normalized** to 3NF — no redundant data
- Cities and Activities are **global reference data** shared across all users
- Trip-specific data (stops, trip_activities, expenses) is **user-owned**
- All user-owned tables include ownership checks in the API
- Cascade deletes ensure no orphan records
- Share tokens are unique UUID strings

---

### Table Definitions

#### `users`

| Column | Type | Constraints | Description |
|---|---|---|---|
| id | INT | PK, AUTO_INCREMENT | Unique user identifier |
| first_name | VARCHAR(100) | NOT NULL | User first name |
| last_name | VARCHAR(100) | NOT NULL | User last name |
| email | VARCHAR(255) | NOT NULL, UNIQUE | Login email |
| password_hash | VARCHAR(255) | NOT NULL | bcrypt hash |
| phone | VARCHAR(20) | NULL | Phone number |
| city | VARCHAR(100) | NULL | User's home city |
| country | VARCHAR(100) | NULL | User's home country |
| profile_photo | VARCHAR(500) | NULL | URL to profile image |
| language | VARCHAR(10) | DEFAULT 'en' | Language preference |
| bio | TEXT | NULL | Optional bio |
| created_at | DATETIME | DEFAULT NOW() | Account creation time |
| updated_at | DATETIME | AUTO UPDATE | Last modification |

---

#### `trips`

| Column | Type | Constraints | Description |
|---|---|---|---|
| id | INT | PK, AUTO_INCREMENT | Unique trip ID |
| user_id | INT | FK → users.id, NOT NULL | Owner |
| name | VARCHAR(255) | NOT NULL | Trip title |
| description | TEXT | NULL | Optional description |
| start_date | DATE | NOT NULL | Trip start |
| end_date | DATE | NOT NULL | Trip end |
| cover_photo | VARCHAR(500) | NULL | Cover image URL |
| is_public | BOOLEAN | DEFAULT false | Whether shared |
| share_token | VARCHAR(255) | UNIQUE, NULL | UUID for sharing |
| total_budget | DECIMAL(10,2) | DEFAULT 0 | User defined overall budget |
| created_at | DATETIME | DEFAULT NOW() | — |
| updated_at | DATETIME | AUTO UPDATE | — |

**Constraints:** `end_date >= start_date` (enforced at API level)  
**Indexes:** `user_id`, `share_token`

---

#### `cities`

| Column | Type | Constraints | Description |
|---|---|---|---|
| id | INT | PK, AUTO_INCREMENT | Unique city ID |
| name | VARCHAR(150) | NOT NULL | City name |
| country | VARCHAR(100) | NOT NULL | Country name |
| region | VARCHAR(100) | NULL | Region/continent |
| latitude | DECIMAL(10,7) | NULL | GPS lat |
| longitude | DECIMAL(10,7) | NULL | GPS long |
| cost_index | DECIMAL(5,2) | NULL | 1.0–10.0 relative cost |
| popularity | INT | DEFAULT 0 | Popularity score |
| image_url | VARCHAR(500) | NULL | Representative image |
| description | TEXT | NULL | Short city bio |
| created_at | DATETIME | DEFAULT NOW() | — |

**Indexes:** `name`, `country`, `region`

---

#### `stops`

| Column | Type | Constraints | Description |
|---|---|---|---|
| id | INT | PK, AUTO_INCREMENT | Unique stop ID |
| trip_id | INT | FK → trips.id, NOT NULL | Parent trip |
| city_id | INT | FK → cities.id, NOT NULL | Which city |
| start_date | DATE | NOT NULL | Arrival at city |
| end_date | DATE | NOT NULL | Departure from city |
| position | INT | NOT NULL, DEFAULT 0 | Order in itinerary |
| notes | TEXT | NULL | Stop-level notes |
| created_at | DATETIME | DEFAULT NOW() | — |
| updated_at | DATETIME | AUTO UPDATE | — |

**Cascade:** DELETE on trip_id (stop deleted when trip deleted)  
**Indexes:** `trip_id`, `city_id`, `position`

---

#### `activities`

| Column | Type | Constraints | Description |
|---|---|---|---|
| id | INT | PK, AUTO_INCREMENT | Unique activity ID |
| city_id | INT | FK → cities.id, NOT NULL | Which city |
| name | VARCHAR(255) | NOT NULL | Activity name |
| description | TEXT | NULL | What it involves |
| category | ENUM | NOT NULL | Category (see below) |
| estimated_cost | DECIMAL(10,2) | DEFAULT 0 | Default cost |
| duration | INT | NULL | Minutes |
| image_url | VARCHAR(500) | NULL | Activity image |
| location_name | VARCHAR(255) | NULL | Specific venue name |
| created_at | DATETIME | DEFAULT NOW() | — |

**Category ENUM values:** `SIGHTSEEING`, `FOOD`, `ADVENTURE`, `CULTURE`, `SHOPPING`, `ENTERTAINMENT`, `NATURE`, `HISTORY`, `TRANSPORT`, `ACCOMMODATION`

**Indexes:** `city_id`, `category`

---

#### `trip_activities`

This is the **join table** between `stops` and `activities` with additional trip-specific metadata.

| Column | Type | Constraints | Description |
|---|---|---|---|
| id | INT | PK, AUTO_INCREMENT | Unique assignment ID |
| stop_id | INT | FK → stops.id, NOT NULL | Which stop |
| activity_id | INT | FK → activities.id, NOT NULL | Which activity |
| date | DATE | NOT NULL | Scheduled date |
| start_time | TIME | NULL | Scheduled time |
| duration_override | INT | NULL | Override activity duration |
| custom_cost | DECIMAL(10,2) | NULL | Override estimated_cost |
| position | INT | DEFAULT 0 | Order within the day |
| notes | TEXT | NULL | Personal notes |
| created_at | DATETIME | DEFAULT NOW() | — |

**Cascade:** DELETE on stop_id  
**Indexes:** `stop_id`, `activity_id`, `date`

---

#### `expenses`

| Column | Type | Constraints | Description |
|---|---|---|---|
| id | INT | PK, AUTO_INCREMENT | Unique expense ID |
| trip_id | INT | FK → trips.id, NOT NULL | Parent trip |
| stop_id | INT | FK → stops.id, NULL | Optional: link to a stop |
| category | ENUM | NOT NULL | Expense category |
| amount | DECIMAL(10,2) | NOT NULL | Expense amount |
| description | VARCHAR(255) | NULL | What was spent |
| date | DATE | NOT NULL | When spent |
| created_at | DATETIME | DEFAULT NOW() | — |
| updated_at | DATETIME | AUTO UPDATE | — |

**Category ENUM:** `TRANSPORT`, `ACCOMMODATION`, `FOOD`, `ACTIVITIES`, `SHOPPING`, `OTHER`

**Indexes:** `trip_id`, `stop_id`, `category`

---

## 16. ER Diagram

```mermaid
erDiagram
    users {
        int id PK
        string first_name
        string last_name
        string email UK
        string password_hash
        string phone
        string city
        string country
        string profile_photo
        string language
        datetime created_at
        datetime updated_at
    }

    trips {
        int id PK
        int user_id FK
        string name
        text description
        date start_date
        date end_date
        string cover_photo
        boolean is_public
        string share_token UK
        decimal total_budget
        datetime created_at
        datetime updated_at
    }

    cities {
        int id PK
        string name
        string country
        string region
        decimal latitude
        decimal longitude
        decimal cost_index
        int popularity
        string image_url
    }

    stops {
        int id PK
        int trip_id FK
        int city_id FK
        date start_date
        date end_date
        int position
        text notes
        datetime created_at
    }

    activities {
        int id PK
        int city_id FK
        string name
        text description
        enum category
        decimal estimated_cost
        int duration
        string image_url
    }

    trip_activities {
        int id PK
        int stop_id FK
        int activity_id FK
        date date
        time start_time
        decimal custom_cost
        int position
        text notes
    }

    expenses {
        int id PK
        int trip_id FK
        int stop_id FK
        enum category
        decimal amount
        string description
        date date
    }

    users ||--o{ trips : "owns"
    trips ||--o{ stops : "contains"
    cities ||--o{ stops : "visited in"
    cities ||--o{ activities : "has"
    stops ||--o{ trip_activities : "schedules"
    activities ||--o{ trip_activities : "included in"
    trips ||--o{ expenses : "tracks"
    stops ||--o{ expenses : "associated with"
```

### Relationship Explanations

| Relationship | Cardinality | Why it exists |
|---|---|---|
| users → trips | 1:N | A user owns many trips |
| trips → stops | 1:N | A trip visits multiple cities (stops) |
| cities → stops | 1:N | A city can be a stop in many different trips |
| cities → activities | 1:N | A city offers many activities |
| stops → trip_activities | 1:N | A stop schedules many activities |
| activities → trip_activities | 1:N | An activity can be scheduled in many trips |
| trips → expenses | 1:N | A trip accumulates many expenses |
| stops → expenses | 1:N (nullable) | Expenses optionally associated with a specific city stop |

The `trip_activities` table is the critical junction — it's where global activity catalog data meets user-specific scheduling data (date, time, cost, order).

---

## 17. Prisma Schema Design

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}

model User {
  id            Int       @id @default(autoincrement())
  firstName     String    @map("first_name") @db.VarChar(100)
  lastName      String    @map("last_name") @db.VarChar(100)
  email         String    @unique @db.VarChar(255)
  passwordHash  String    @map("password_hash") @db.VarChar(255)
  phone         String?   @db.VarChar(20)
  city          String?   @db.VarChar(100)
  country       String?   @db.VarChar(100)
  profilePhoto  String?   @map("profile_photo") @db.VarChar(500)
  language      String    @default("en") @db.VarChar(10)
  bio           String?   @db.Text
  createdAt     DateTime  @default(now()) @map("created_at")
  updatedAt     DateTime  @updatedAt @map("updated_at")

  trips         Trip[]

  @@map("users")
}

model Trip {
  id           Int       @id @default(autoincrement())
  userId       Int       @map("user_id")
  name         String    @db.VarChar(255)
  description  String?   @db.Text
  startDate    DateTime  @map("start_date") @db.Date
  endDate      DateTime  @map("end_date") @db.Date
  coverPhoto   String?   @map("cover_photo") @db.VarChar(500)
  isPublic     Boolean   @default(false) @map("is_public")
  shareToken   String?   @unique @map("share_token") @db.VarChar(255)
  totalBudget  Decimal   @default(0) @map("total_budget") @db.Decimal(10, 2)
  createdAt    DateTime  @default(now()) @map("created_at")
  updatedAt    DateTime  @updatedAt @map("updated_at")

  user         User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  stops        Stop[]
  expenses     Expense[]

  @@index([userId])
  @@index([shareToken])
  @@map("trips")
}

model City {
  id          Int       @id @default(autoincrement())
  name        String    @db.VarChar(150)
  country     String    @db.VarChar(100)
  region      String?   @db.VarChar(100)
  latitude    Decimal?  @db.Decimal(10, 7)
  longitude   Decimal?  @db.Decimal(10, 7)
  costIndex   Decimal?  @map("cost_index") @db.Decimal(5, 2)
  popularity  Int       @default(0)
  imageUrl    String?   @map("image_url") @db.VarChar(500)
  description String?   @db.Text
  createdAt   DateTime  @default(now()) @map("created_at")

  stops       Stop[]
  activities  Activity[]

  @@index([name])
  @@index([country])
  @@map("cities")
}

model Stop {
  id        Int       @id @default(autoincrement())
  tripId    Int       @map("trip_id")
  cityId    Int       @map("city_id")
  startDate DateTime  @map("start_date") @db.Date
  endDate   DateTime  @map("end_date") @db.Date
  position  Int       @default(0)
  notes     String?   @db.Text
  createdAt DateTime  @default(now()) @map("created_at")
  updatedAt DateTime  @updatedAt @map("updated_at")

  trip           Trip           @relation(fields: [tripId], references: [id], onDelete: Cascade)
  city           City           @relation(fields: [cityId], references: [id])
  tripActivities TripActivity[]
  expenses       Expense[]

  @@index([tripId])
  @@index([cityId])
  @@index([position])
  @@map("stops")
}

enum ActivityCategory {
  SIGHTSEEING
  FOOD
  ADVENTURE
  CULTURE
  SHOPPING
  ENTERTAINMENT
  NATURE
  HISTORY
  TRANSPORT
  ACCOMMODATION
}

model Activity {
  id            Int              @id @default(autoincrement())
  cityId        Int              @map("city_id")
  name          String           @db.VarChar(255)
  description   String?          @db.Text
  category      ActivityCategory
  estimatedCost Decimal          @default(0) @map("estimated_cost") @db.Decimal(10, 2)
  duration      Int?             // minutes
  imageUrl      String?          @map("image_url") @db.VarChar(500)
  locationName  String?          @map("location_name") @db.VarChar(255)
  createdAt     DateTime         @default(now()) @map("created_at")

  city           City           @relation(fields: [cityId], references: [id])
  tripActivities TripActivity[]

  @@index([cityId])
  @@index([category])
  @@map("activities")
}

model TripActivity {
  id               Int       @id @default(autoincrement())
  stopId           Int       @map("stop_id")
  activityId       Int       @map("activity_id")
  date             DateTime  @db.Date
  startTime        DateTime? @map("start_time") @db.Time
  durationOverride Int?      @map("duration_override")
  customCost       Decimal?  @map("custom_cost") @db.Decimal(10, 2)
  position         Int       @default(0)
  notes            String?   @db.Text
  createdAt        DateTime  @default(now()) @map("created_at")

  stop     Stop     @relation(fields: [stopId], references: [id], onDelete: Cascade)
  activity Activity @relation(fields: [activityId], references: [id])

  @@index([stopId])
  @@index([activityId])
  @@index([date])
  @@map("trip_activities")
}

enum ExpenseCategory {
  TRANSPORT
  ACCOMMODATION
  FOOD
  ACTIVITIES
  SHOPPING
  OTHER
}

model Expense {
  id          Int             @id @default(autoincrement())
  tripId      Int             @map("trip_id")
  stopId      Int?            @map("stop_id")
  category    ExpenseCategory
  amount      Decimal         @db.Decimal(10, 2)
  description String?         @db.VarChar(255)
  date        DateTime        @db.Date
  createdAt   DateTime        @default(now()) @map("created_at")
  updatedAt   DateTime        @updatedAt @map("updated_at")

  trip  Trip  @relation(fields: [tripId], references: [id], onDelete: Cascade)
  stop  Stop? @relation(fields: [stopId], references: [id], onDelete: SetNull)

  @@index([tripId])
  @@index([category])
  @@map("expenses")
}
```

---

## 18. REST API Specification

### Base URL
```
http://localhost:5000/api
```

### Authentication Header
```
Authorization: Bearer <jwt_token>
```

---

### 18.1 Authentication

#### `POST /api/auth/register`

**Auth:** None  
**Purpose:** Create a new user account

**Request Body:**
```json
{
  "firstName": "Priya",
  "lastName": "Sharma",
  "email": "priya@example.com",
  "password": "mypassword123",
  "phone": "+91-9876543210",
  "city": "Bangalore",
  "country": "India"
}
```

**Validation:** All string fields trimmed; email must be unique; password min 8 chars

**Success 201:**
```json
{
  "user": { "id": 1, "firstName": "Priya", "email": "priya@example.com" },
  "token": "<jwt>"
}
```

**Errors:** `400` validation error | `409` email already exists

---

#### `POST /api/auth/login`

**Auth:** None  
**Purpose:** Authenticate user and return JWT

**Request Body:**
```json
{ "email": "priya@example.com", "password": "mypassword123" }
```

**Success 200:**
```json
{
  "user": { "id": 1, "firstName": "Priya", "email": "priya@example.com" },
  "token": "<jwt>"
}
```

**Errors:** `400` missing fields | `401` invalid credentials

---

#### `GET /api/auth/me`

**Auth:** Required  
**Purpose:** Get current authenticated user's profile

**Success 200:**
```json
{
  "id": 1, "firstName": "Priya", "lastName": "Sharma",
  "email": "priya@example.com", "city": "Bangalore", "country": "India",
  "language": "en", "profilePhoto": null, "createdAt": "2024-01-15T..."
}
```

**Errors:** `401` unauthorized

---

#### `PUT /api/auth/profile`

**Auth:** Required  
**Purpose:** Update user profile

**Request Body:** Any subset of: `firstName`, `lastName`, `phone`, `city`, `country`, `language`, `bio`, `profilePhoto`

**Success 200:** Updated user object

---

### 18.2 Trips

#### `POST /api/trips`

**Auth:** Required  
**Purpose:** Create a new trip

**Request Body:**
```json
{
  "name": "Japan Adventure",
  "description": "7 days in Japan",
  "startDate": "2024-09-01",
  "endDate": "2024-09-07",
  "coverPhoto": "https://...",
  "totalBudget": 85000
}
```

**Validation:** name required; startDate and endDate required and valid dates; endDate >= startDate

**Success 201:**
```json
{
  "id": 42,
  "userId": 1,
  "name": "Japan Adventure",
  "startDate": "2024-09-01",
  "endDate": "2024-09-07",
  "isPublic": false,
  "shareToken": null,
  "totalBudget": 85000
}
```

---

#### `GET /api/trips`

**Auth:** Required  
**Purpose:** Get all trips for the authenticated user

**Query Params:** `status` (upcoming | ongoing | completed), `sort` (startDate | createdAt)

**Success 200:**
```json
[
  {
    "id": 42,
    "name": "Japan Adventure",
    "startDate": "2024-09-01",
    "endDate": "2024-09-07",
    "stopCount": 3,
    "totalBudget": 85000,
    "estimatedBudget": 80000,
    "isPublic": false,
    "status": "upcoming"
  }
]
```

---

#### `GET /api/trips/:id`

**Auth:** Required  
**Purpose:** Get a single trip with all stops, cities, and activities

**Authorization:** Trip must belong to authenticated user

**Success 200:**
```json
{
  "id": 42,
  "name": "Japan Adventure",
  "stops": [
    {
      "id": 1,
      "position": 0,
      "city": { "id": 5, "name": "Tokyo", "country": "Japan", "latitude": 35.6762, "longitude": 139.6503 },
      "startDate": "2024-09-01",
      "endDate": "2024-09-04",
      "tripActivities": [
        {
          "id": 10,
          "date": "2024-09-01",
          "startTime": "09:00:00",
          "position": 0,
          "customCost": 0,
          "activity": { "id": 21, "name": "Shibuya Crossing", "category": "SIGHTSEEING", "estimatedCost": 0 }
        }
      ]
    }
  ]
}
```

**Errors:** `404` not found | `403` forbidden (not owner)

---

#### `PUT /api/trips/:id`

**Auth:** Required  
**Purpose:** Update trip metadata  
**Authorization:** Must own trip  
**Request Body:** Any updatable trip fields  
**Success 200:** Updated trip object

---

#### `DELETE /api/trips/:id`

**Auth:** Required  
**Authorization:** Must own trip  
**Purpose:** Delete trip and all related data (cascade)  
**Success 200:** `{ "message": "Trip deleted" }`

---

### 18.3 Stops

#### `POST /api/trips/:tripId/stops`

**Auth:** Required  
**Purpose:** Add a city stop to a trip

**Request Body:**
```json
{
  "cityId": 5,
  "startDate": "2024-09-01",
  "endDate": "2024-09-04",
  "position": 0
}
```

**Success 201:** Created stop with city data

---

#### `PUT /api/stops/:id`

**Auth:** Required  
**Purpose:** Update stop dates, position, or notes  
**Request Body:** `startDate`, `endDate`, `position`, `notes`  
**Success 200:** Updated stop

---

#### `DELETE /api/stops/:id`

**Auth:** Required  
**Purpose:** Remove a stop (cascade deletes its trip_activities)  
**Success 200:** `{ "message": "Stop removed" }`

---

#### `PUT /api/trips/:tripId/stops/reorder`

**Auth:** Required  
**Purpose:** Bulk update stop positions

**Request Body:**
```json
{ "order": [{ "id": 1, "position": 0 }, { "id": 2, "position": 1 }] }
```

**Success 200:** `{ "message": "Reordered" }`

---

### 18.4 Cities

#### `GET /api/cities`

**Auth:** Optional  
**Purpose:** List cities (for discovery/search)

**Query Params:** `q` (search term), `country`, `region`, `minCost`, `maxCost`, `popular` (boolean), `limit`, `offset`

**Success 200:**
```json
[
  {
    "id": 5,
    "name": "Tokyo",
    "country": "Japan",
    "region": "East Asia",
    "costIndex": 7.5,
    "popularity": 95,
    "latitude": 35.6762,
    "longitude": 139.6503,
    "imageUrl": "..."
  }
]
```

---

#### `GET /api/cities/:id`

**Auth:** Optional  
**Purpose:** Get a single city with its activities  
**Success 200:** City object with `activities` array

---

### 18.5 Activities

#### `GET /api/cities/:cityId/activities`

**Auth:** Optional  
**Purpose:** Get all activities for a city

**Query Params:** `category`, `minCost`, `maxCost`, `maxDuration`

**Success 200:**
```json
[
  {
    "id": 21,
    "name": "Shibuya Crossing",
    "category": "SIGHTSEEING",
    "estimatedCost": 0,
    "duration": 60,
    "description": "...",
    "imageUrl": "..."
  }
]
```

---

#### `POST /api/stops/:stopId/activities`

**Auth:** Required  
**Purpose:** Add an activity to a stop (creates trip_activity record)

**Request Body:**
```json
{
  "activityId": 21,
  "date": "2024-09-01",
  "startTime": "09:00",
  "customCost": 0,
  "position": 0
}
```

**Success 201:** Created trip_activity with nested activity data

---

#### `PUT /api/trip-activities/:id`

**Auth:** Required  
**Purpose:** Update a scheduled activity (date, time, cost, position)  
**Request Body:** Any updatable fields  
**Success 200:** Updated trip_activity

---

#### `DELETE /api/trip-activities/:id`

**Auth:** Required  
**Purpose:** Remove an activity from the itinerary  
**Success 200:** `{ "message": "Activity removed" }`

---

#### `PUT /api/stops/:stopId/activities/reorder`

**Auth:** Required  
**Purpose:** Reorder activities within a stop/day

**Request Body:**
```json
{ "order": [{ "id": 10, "position": 0 }, { "id": 11, "position": 1 }] }
```

---

### 18.6 Expenses

#### `GET /api/trips/:tripId/expenses`

**Auth:** Required  
**Purpose:** Get all expenses for a trip  
**Success 200:** Array of expense objects

---

#### `POST /api/trips/:tripId/expenses`

**Auth:** Required  
**Purpose:** Add a manual expense

**Request Body:**
```json
{
  "category": "TRANSPORT",
  "amount": 2500.00,
  "description": "Shinkansen Tokyo to Kyoto",
  "date": "2024-09-04",
  "stopId": 2
}
```

**Success 201:** Created expense

---

#### `PUT /api/expenses/:id`

**Auth:** Required  
**Purpose:** Edit an expense  
**Request Body:** Any updatable expense fields  
**Success 200:** Updated expense

---

#### `DELETE /api/expenses/:id`

**Auth:** Required  
**Purpose:** Delete an expense  
**Success 200:** `{ "message": "Expense deleted" }`

---

### 18.7 Budget

#### `GET /api/trips/:tripId/budget`

**Auth:** Required  
**Purpose:** Get computed budget summary for a trip

**Success 200:**
```json
{
  "totalBudget": 85000,
  "totalEstimated": 80000,
  "totalActual": 92000,
  "remainingBudget": -7000,
  "isOverBudget": true,
  "overBudgetBy": 7000,
  "byCategory": {
    "TRANSPORT": { "estimated": 25000, "actual": 28000 },
    "ACCOMMODATION": { "estimated": 30000, "actual": 32000 },
    "ACTIVITIES": { "estimated": 15000, "actual": 17000 },
    "FOOD": { "estimated": 10000, "actual": 10000 },
    "OTHER": { "estimated": 5000, "actual": 5000 }
  },
  "byStop": [
    { "stopId": 1, "cityName": "Tokyo", "total": 55000 },
    { "stopId": 2, "cityName": "Kyoto", "total": 37000 }
  ],
  "byDay": [
    { "date": "2024-09-01", "total": 12000 },
    { "date": "2024-09-02", "total": 8500 }
  ],
  "tripDuration": 7,
  "costPerDay": 13142
}
```

**Implementation note:** This endpoint computes its response by summing `trip_activities.custom_cost` (falling back to `activities.estimated_cost`) plus all `expenses.amount` grouped appropriately. Do not denormalize this into a separate table.

---

### 18.8 Sharing

#### `POST /api/trips/:tripId/share`

**Auth:** Required  
**Purpose:** Make a trip public and generate/return its share token

**Success 200:**
```json
{
  "shareToken": "uuid-v4-string",
  "shareUrl": "/public/trips/uuid-v4-string",
  "isPublic": true
}
```

---

#### `POST /api/trips/:tripId/unshare`

**Auth:** Required  
**Purpose:** Make a public trip private again  
**Success 200:** `{ "isPublic": false }`

---

#### `GET /api/public/trips/:shareToken`

**Auth:** None  
**Purpose:** Get full public itinerary by share token

**Success 200:** Full trip object (same shape as `GET /api/trips/:id`) without owner-private data  
**Errors:** `404` invalid or revoked token

---

#### `POST /api/public/trips/:shareToken/copy`

**Auth:** Required (must be logged in to copy)  
**Purpose:** Deep-copy a public trip into the authenticated user's account

**Process:**
1. Fetch original trip by shareToken
2. Create new Trip under `req.user.id`
3. Duplicate all Stops with new stop IDs
4. Duplicate all TripActivities with new stop references
5. Budget data is NOT copied (clean slate for new owner)

**Success 201:**
```json
{ "id": 99, "name": "Japan Adventure (Copy)", "message": "Trip copied to your account" }
```

---

## 19. Authentication & Authorization

### JWT Configuration

```javascript
// Token payload
{
  "sub": 1,           // user.id
  "email": "...",
  "iat": 1700000000,
  "exp": 1700604800   // 7 days
}
```

### Auth Middleware

```javascript
// backend/src/middleware/auth.js
const jwt = require('jsonwebtoken');

const authMiddleware = async (req, res, next) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }
  try {
    const token = header.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.sub, email: decoded.email };
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};
```

### Authorization Pattern

Every controller that accesses user-owned data must verify ownership:

```javascript
// Example: Trip ownership check
const trip = await prisma.trip.findUnique({ where: { id: tripId } });
if (!trip) return res.status(404).json({ error: 'Trip not found' });
if (trip.userId !== req.user.id) return res.status(403).json({ error: 'Forbidden' });
```

This pattern applies to: trips, stops, trip_activities, expenses.

### Password Security

- `bcryptjs` with salt rounds = 12
- Never return `passwordHash` in any API response
- Validate password strength: min 8 chars (Zod)

---

## 20. Frontend Architecture

### Project Structure

```
frontend/
├── public/
│   └── favicon.ico
├── src/
│   ├── api/                    # Axios instances and API call functions
│   │   ├── axiosInstance.js    # Base Axios config with interceptors
│   │   ├── auth.api.js
│   │   ├── trips.api.js
│   │   ├── cities.api.js
│   │   ├── activities.api.js
│   │   ├── expenses.api.js
│   │   └── public.api.js
│   │
│   ├── components/             # Reusable UI components
│   │   ├── layout/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   └── PageWrapper.jsx
│   │   ├── common/
│   │   │   ├── Button.jsx
│   │   │   ├── Input.jsx
│   │   │   ├── Modal.jsx
│   │   │   ├── Badge.jsx
│   │   │   ├── LoadingSpinner.jsx
│   │   │   ├── EmptyState.jsx
│   │   │   └── ErrorState.jsx
│   │   ├── trips/
│   │   │   ├── TripCard.jsx
│   │   │   ├── TripForm.jsx
│   │   │   └── ShareModal.jsx
│   │   ├── itinerary/
│   │   │   ├── ItineraryBuilder.jsx
│   │   │   ├── StopCard.jsx
│   │   │   ├── DayView.jsx
│   │   │   └── ActivityCard.jsx
│   │   ├── search/
│   │   │   ├── CitySearch.jsx
│   │   │   ├── CityCard.jsx
│   │   │   ├── ActivitySearch.jsx
│   │   │   └── ActivityListItem.jsx
│   │   ├── budget/
│   │   │   ├── BudgetSummary.jsx
│   │   │   ├── BudgetPieChart.jsx
│   │   │   ├── BudgetBarChart.jsx
│   │   │   ├── DailySpendChart.jsx
│   │   │   └── ExpenseForm.jsx
│   │   ├── calendar/
│   │   │   └── CalendarView.jsx
│   │   └── map/
│   │       └── MapView.jsx
│   │
│   ├── pages/                  # Route-level page components
│   │   ├── LoginPage.jsx
│   │   ├── SignupPage.jsx
│   │   ├── DashboardPage.jsx
│   │   ├── TripsPage.jsx
│   │   ├── NewTripPage.jsx
│   │   ├── TripDetailPage.jsx
│   │   ├── ItineraryPage.jsx
│   │   ├── CalendarPage.jsx
│   │   ├── BudgetPage.jsx
│   │   ├── MapPage.jsx
│   │   ├── ProfilePage.jsx
│   │   ├── PublicTripPage.jsx
│   │   └── AdminPage.jsx
│   │
│   ├── context/               # React Context for global state
│   │   ├── AuthContext.jsx    # User auth state, login/logout
│   │   └── TripContext.jsx    # Current trip state
│   │
│   ├── hooks/                 # Custom React hooks
│   │   ├── useAuth.js
│   │   ├── useTrip.js
│   │   ├── useCities.js
│   │   ├── useActivities.js
│   │   └── useBudget.js
│   │
│   ├── utils/
│   │   ├── dateUtils.js       # date-fns helpers
│   │   ├── budgetUtils.js     # Budget computation helpers
│   │   ├── tripStatus.js      # Determine upcoming/ongoing/past
│   │   └── formatCurrency.js  # INR/USD formatting
│   │
│   ├── constants/
│   │   ├── categories.js      # Activity and expense category lists
│   │   └── routes.js          # Route path constants
│   │
│   ├── App.jsx                # Router setup
│   └── main.jsx               # Vite entry point
│
├── index.html
├── vite.config.js
├── tailwind.config.js
└── package.json
```

### Routing

```jsx
// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Public routes (no auth required)
<Route path="/login" element={<LoginPage />} />
<Route path="/signup" element={<SignupPage />} />
<Route path="/public/trips/:shareToken" element={<PublicTripPage />} />

// Protected routes (auth required)
<Route element={<ProtectedRoute />}>
  <Route path="/dashboard" element={<DashboardPage />} />
  <Route path="/trips" element={<TripsPage />} />
  <Route path="/trips/new" element={<NewTripPage />} />
  <Route path="/trips/:id" element={<TripDetailPage />} />
  <Route path="/trips/:id/itinerary" element={<ItineraryPage />} />
  <Route path="/trips/:id/calendar" element={<CalendarPage />} />
  <Route path="/trips/:id/budget" element={<BudgetPage />} />
  <Route path="/trips/:id/map" element={<MapPage />} />
  <Route path="/profile" element={<ProfilePage />} />
</Route>

// Default redirect
<Route path="/" element={<Navigate to="/dashboard" />} />
```

### Axios Configuration

```javascript
// src/api/axiosInstance.js
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' }
});

// Attach JWT to every request
api.interceptors.request.use(config => {
  const token = localStorage.getItem('globe_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401 globally (token expired)
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('globe_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

### Auth Context

```jsx
// src/context/AuthContext.jsx
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('globe_token');
    if (token) {
      authApi.getMe().then(setUser).catch(() => {
        localStorage.removeItem('globe_token');
      }).finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const { user, token } = await authApi.login(email, password);
    localStorage.setItem('globe_token', token);
    setUser(user);
    return user;
  };

  const logout = () => {
    localStorage.removeItem('globe_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
```

---

## 21. Backend Architecture

### Project Structure

```
backend/
├── prisma/
│   ├── schema.prisma          # Prisma schema
│   ├── migrations/            # Auto-generated migrations
│   └── seed.js                # Seed script
│
├── src/
│   ├── controllers/           # Request handlers (thin layer)
│   │   ├── auth.controller.js
│   │   ├── trips.controller.js
│   │   ├── stops.controller.js
│   │   ├── cities.controller.js
│   │   ├── activities.controller.js
│   │   ├── expenses.controller.js
│   │   ├── budget.controller.js
│   │   └── public.controller.js
│   │
│   ├── routes/                # Express route definitions
│   │   ├── auth.routes.js
│   │   ├── trips.routes.js
│   │   ├── stops.routes.js
│   │   ├── cities.routes.js
│   │   ├── activities.routes.js
│   │   ├── expenses.routes.js
│   │   ├── budget.routes.js
│   │   └── public.routes.js
│   │
│   ├── middleware/
│   │   ├── auth.js            # JWT validation
│   │   ├── validate.js        # Zod validation wrapper
│   │   └── errorHandler.js    # Global error handler
│   │
│   ├── services/              # Business logic
│   │   ├── auth.service.js
│   │   ├── trips.service.js
│   │   ├── budget.service.js  # Budget calculation logic
│   │   └── share.service.js
│   │
│   ├── validators/            # Zod schemas
│   │   ├── auth.schema.js
│   │   ├── trip.schema.js
│   │   ├── stop.schema.js
│   │   └── expense.schema.js
│   │
│   ├── utils/
│   │   ├── prismaClient.js    # Singleton Prisma instance
│   │   ├── jwt.js             # Sign and verify helpers
│   │   └── errors.js          # Custom error classes
│   │
│   └── app.js                 # Express app setup
│
├── .env
├── .env.example
└── package.json
```

### Express App Setup

```javascript
// src/app.js
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors({ origin: process.env.CLIENT_URL }));
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/trips', require('./routes/trips.routes'));
app.use('/api/stops', require('./routes/stops.routes'));
app.use('/api/cities', require('./routes/cities.routes'));
app.use('/api/trip-activities', require('./routes/activities.routes'));
app.use('/api/public', require('./routes/public.routes'));

// Global error handler
app.use(require('./middleware/errorHandler'));

module.exports = app;
```

### Validation Pattern (Zod)

```javascript
// src/validators/trip.schema.js
const { z } = require('zod');

const createTripSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().optional(),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format'),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format'),
  coverPhoto: z.string().url().optional(),
}).refine(data => data.endDate >= data.startDate, {
  message: 'End date must be on or after start date'
});

// src/middleware/validate.js
const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ errors: result.error.flatten().fieldErrors });
  }
  req.validatedData = result.data;
  next();
};
```

### Budget Service

```javascript
// src/services/budget.service.js
const getBudgetSummary = async (tripId) => {
  const trip = await prisma.trip.findUnique({
    where: { id: tripId },
    include: {
      stops: {
        include: {
          city: true,
          tripActivities: {
            include: { activity: true }
          }
        }
      },
      expenses: true
    }
  });

  // Sum activity costs (custom_cost if set, else activity.estimated_cost)
  const activityTotal = trip.stops.flatMap(s => s.tripActivities)
    .reduce((sum, ta) => sum + (ta.customCost ?? ta.activity.estimatedCost), 0);

  const expenseTotal = trip.expenses.reduce((sum, e) => sum + e.amount, 0);

  // Group by category...
  // Group by day...
  // Group by stop...

  return { totalEstimated: activityTotal, totalActual: expenseTotal, ... };
};
```

---

## 22. External API Strategy

### Approach: Seed-First, Enhance Later

The application **must work without any external API**. All core city and activity data is seeded into MySQL at project setup.

External APIs are treated as optional enhancements:

| External API | Use Case | Priority | Fallback |
|---|---|---|---|
| OpenStreetMap (via Leaflet) | Map tiles (no API key needed) | P1 | Map hidden if offline |
| Cloudinary | Profile/trip image uploads | P2 optional | Use local URL storage |
| OpenTripMap / Foursquare | Enrich activity discovery | P2 optional | Seeded activity data |
| Any AI API (OpenAI / Gemini) | AI itinerary generation | P2 optional | Manual planning only |

**No external API should be a hard dependency of the hackathon demo.**

### Offline Resilience

If Leaflet can't load map tiles (no internet), show a toast: *"Map requires internet connection"* and display a static coordinate list instead.

---

## 23. Seed Data Strategy

Run `node prisma/seed.js` after `prisma migrate dev` to populate the database.

### Seed Cities (minimum 15)

| City | Country | Region | Cost Index | Popularity | Lat | Lng |
|---|---|---|---|---|---|---|
| Paris | France | Europe | 8.5 | 98 | 48.8566 | 2.3522 |
| London | UK | Europe | 9.0 | 97 | 51.5074 | -0.1278 |
| Amsterdam | Netherlands | Europe | 7.5 | 88 | 52.3676 | 4.9041 |
| Tokyo | Japan | East Asia | 7.8 | 96 | 35.6762 | 139.6503 |
| Kyoto | Japan | East Asia | 6.5 | 85 | 35.0116 | 135.7681 |
| Mumbai | India | South Asia | 3.2 | 80 | 19.0760 | 72.8777 |
| Dubai | UAE | Middle East | 8.0 | 90 | 25.2048 | 55.2708 |
| New York | USA | North America | 9.5 | 99 | 40.7128 | -74.0060 |
| Singapore | Singapore | Southeast Asia | 7.0 | 89 | 1.3521 | 103.8198 |
| Rome | Italy | Europe | 7.2 | 92 | 41.9028 | 12.4964 |
| Barcelona | Spain | Europe | 6.8 | 88 | 41.3851 | 2.1734 |
| Bangkok | Thailand | Southeast Asia | 3.5 | 87 | 13.7563 | 100.5018 |
| Sydney | Australia | Oceania | 8.8 | 86 | -33.8688 | 151.2093 |
| Istanbul | Turkey | Europe/Asia | 4.5 | 85 | 41.0082 | 28.9784 |
| Bali | Indonesia | Southeast Asia | 2.8 | 83 | -8.3405 | 115.0920 |

### Seed Activities (5–8 per city minimum)

**Example — Tokyo:**

| Name | Category | Cost (INR) | Duration (min) |
|---|---|---|---|
| Shibuya Crossing | SIGHTSEEING | 0 | 30 |
| Senso-ji Temple | CULTURE | 500 | 120 |
| Tokyo Tower | SIGHTSEEING | 1800 | 90 |
| Tsukiji Fish Market | FOOD | 2500 | 120 |
| Akihabara Electronics | SHOPPING | 0 | 180 |
| teamLab Borderless | ENTERTAINMENT | 3200 | 180 |
| Shinjuku Gyoen Garden | NATURE | 400 | 90 |
| Ramen Tour Shinjuku | FOOD | 1200 | 90 |

**Example — Paris:**

| Name | Category | Cost (INR) | Duration (min) |
|---|---|---|---|
| Eiffel Tower | SIGHTSEEING | 2000 | 120 |
| Louvre Museum | CULTURE | 1800 | 240 |
| Seine River Cruise | SIGHTSEEING | 1500 | 60 |
| Montmartre Walk | HISTORY | 0 | 180 |
| Versailles Palace | HISTORY | 2200 | 360 |
| Crepe Tour Le Marais | FOOD | 800 | 60 |
| Sacré-Cœur Basilica | CULTURE | 0 | 90 |

Repeat for all seeded cities. Total target: ~100–120 activities.

### Seed Users (for testing)

```javascript
// Seed two test users
{ email: 'demo@globetrotter.app', password: 'Demo@1234', firstName: 'Demo', lastName: 'User' }
{ email: 'admin@globetrotter.app', password: 'Admin@1234', firstName: 'Admin', lastName: 'User' }
```

### Seed Trips (for demo)

Create one complete demo trip for `demo` user:
- **"Japan Discovery — 7 Days"**
- Stops: Tokyo (3 days), Kyoto (2 days), Osaka (2 days)
- Activities pre-assigned with dates and times
- A few manual expenses added
- Made public with a share token

This allows the demo to start from a pre-built state rather than building from scratch.

---

## 24. Error Handling

### Backend: Global Error Handler

```javascript
// src/middleware/errorHandler.js
const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  
  if (err.name === 'ZodError') {
    return res.status(400).json({ error: 'Validation failed', details: err.errors });
  }
  
  if (err.code === 'P2025') { // Prisma: record not found
    return res.status(404).json({ error: 'Record not found' });
  }

  if (err.code === 'P2002') { // Prisma: unique constraint
    return res.status(409).json({ error: 'Duplicate entry' });
  }

  const status = err.status || 500;
  const message = err.message || 'Internal server error';
  res.status(status).json({ error: message });
};
```

### Frontend: Error States

Every page that fetches data must handle:

| State | Implementation |
|---|---|
| Loading | `<LoadingSpinner />` component, centered |
| Error | `<ErrorState message="..." retry={fn} />` with retry button |
| Empty | `<EmptyState message="..." cta="..." ctaHref="..." />` |
| Success | Toast notification (react-hot-toast or similar) |

### Standard Error Response Shape

```json
{ "error": "Human-readable message", "details": {} }
```

### Form Validation Errors

```json
{
  "errors": {
    "name": ["Trip name is required"],
    "endDate": ["End date must be after start date"]
  }
}
```

Display field-level errors inline below each input.

---

## 25. Security

### Implementation Checklist

| Security Concern | Implementation |
|---|---|
| Password storage | bcryptjs, saltRounds=12 |
| Authentication | JWT HS256, 7-day expiry |
| Authorization | Ownership check on every protected resource |
| Input validation | Zod on all request bodies |
| SQL injection | Prisma parameterized queries (no raw SQL) |
| CORS | Restricted to `CLIENT_URL` env var |
| Sensitive data in responses | `passwordHash` never returned |
| Secrets in code | All secrets in `.env`, `.gitignored` |
| Share token security | UUID v4 (cryptographically random) |
| Rate limiting | *Optional P2: express-rate-limit* |

### Ownership Verification Pattern

Applied consistently to: trips, stops, trip_activities (via stop → trip), expenses.

```javascript
// Verify a stop belongs to the requesting user's trip
const verifyStopOwnership = async (stopId, userId) => {
  const stop = await prisma.stop.findUnique({
    where: { id: stopId },
    include: { trip: { select: { userId: true } } }
  });
  if (!stop) throw new NotFoundError('Stop not found');
  if (stop.trip.userId !== userId) throw new ForbiddenError('Not authorized');
  return stop;
};
```

### Environment Variables

```bash
# .env.example
DATABASE_URL="mysql://root:password@localhost:3306/globetrotter"
JWT_SECRET="your-super-secret-jwt-key-change-this"
PORT=5000
CLIENT_URL="http://localhost:5173"

# Optional
CLOUDINARY_CLOUD_NAME=""
CLOUDINARY_API_KEY=""
CLOUDINARY_API_SECRET=""
```

---

## 26. Testing Strategy

### Philosophy: Pragmatic, Not Perfect

For a hackathon, the goal is confidence that the core flow works. Use manual testing checklists plus basic automated tests for critical paths.

### Manual Test Checklist (P0 coverage)

**Authentication:**
- [ ] Register with valid data → JWT returned → redirect to dashboard
- [ ] Register with duplicate email → 409 error
- [ ] Login with correct credentials → JWT returned
- [ ] Login with wrong password → 401 error
- [ ] Access protected route without token → 401 error

**Trip Management:**
- [ ] Create trip → appears in My Trips
- [ ] Create trip with end date before start date → validation error
- [ ] Edit trip name → change persists after page refresh
- [ ] Delete trip → removed from list, no orphan data in DB

**Itinerary Building:**
- [ ] Add stop (city) to trip → appears in builder
- [ ] Reorder stops → new order persists
- [ ] Remove stop → all its activities removed too
- [ ] Add activity to stop → activity appears on correct day
- [ ] Change activity date → moves to correct day in calendar view

**Budget:**
- [ ] Add manual expense → total budget updates
- [ ] Delete expense → total budget updates
- [ ] Budget pie chart reflects category breakdown

**Sharing:**
- [ ] Make trip public → share URL generated
- [ ] Open share URL in incognito → itinerary visible without login
- [ ] Make trip private → share URL no longer works
- [ ] Copy trip (as different user) → new independent copy in account
- [ ] Attempting to edit original via copy user → blocked

**Authorization:**
- [ ] Change trip ID in URL to another user's trip ID → 403 returned
- [ ] Access another user's expenses → 403 returned

### Automated Tests (lightweight)

Use `jest` + `supertest` for the backend only.

**Priority test files:**
- `auth.test.js` — register, login, invalid credentials
- `trips.test.js` — create, read, ownership check, delete
- `budget.test.js` — correct calculation given known activity costs
- `sharing.test.js` — share token generation, public access, copy

**Setup:**
```javascript
// Use a separate test database
// DATABASE_URL=mysql://root:pass@localhost:3306/globetrotter_test
```

Run: `npm test` in `/backend`

---

## 27. Git / Team Workflow

### Branch Strategy

```
main                        ← stable, demo-ready code only
│
├── develop                 ← integration branch
│   ├── feature/auth        ← Registration, login, JWT
│   ├── feature/trips       ← Trip CRUD + My Trips
│   ├── feature/itinerary   ← Stop/activity builder
│   ├── feature/budget      ← Budget calculation + charts
│   ├── feature/calendar    ← FullCalendar integration
│   ├── feature/map         ← Leaflet map view
│   ├── feature/sharing     ← Share token + public view
│   └── feature/frontend-ui ← Dashboard, nav, polish
```

### Merge Rules
- Feature branches merge to `develop` via PR (or direct if solo)
- `develop` → `main` only when a working demo is ready
- No force-pushes to `main`

### Team Responsibilities

| Role | Owns |
|---|---|
| **Backend Developer** | Express API, Prisma schema, migrations, seed script, auth, budget service |
| **Frontend Developer** | React pages, routing, Axios integration, state management |
| **Full-Stack / DB** | Database design, complex queries, API/frontend integration, testing |
| **UI/UX Developer** | Tailwind styling, component design, FullCalendar, Leaflet, Recharts |

*If team is 2 people: Backend Dev owns all backend; Frontend Dev owns all frontend and is responsible for integration testing.*

### Commit Convention

```
feat: add trip creation API endpoint
fix: correct budget calculation for zero-cost activities  
style: polish trip card layout on mobile
refactor: extract budget logic to service layer
test: add authorization tests for trip endpoints
```

### `.gitignore` (essential)

```
node_modules/
.env
dist/
prisma/migrations/
*.log
```

---

## 28. Hackathon Demo Flow

Rehearse this flow before judging. It should take 8–10 minutes.

### Step 1: Register
- Open `http://localhost:5173`
- Show the Login screen (reference mockup Screen 1)
- Click "Sign Up" → show the Registration form (Screen 2)
- Register a new account
- *Mention: "Passwords are hashed with bcrypt, JWT is issued on login"*

### Step 2: Dashboard
- Land on Dashboard (Screen 3)
- Show welcome message, empty state
- Point to the map banner and "Plan New Trip" button

### Step 3: Create a Trip
- Click "Plan New Trip" (Screen 4)
- Fill in: "Japan Discovery", dates Sept 1–7, description
- Submit → redirect to Itinerary Builder

### Step 4: Build the Itinerary
- Click "Add Stop" → City Search modal opens (Screen 8)
- Type "Tokyo" → results appear instantly from seeded DB
- Add Tokyo, set dates Sept 1–3
- Search and add activities: "Shibuya Crossing", "Senso-ji Temple"
- Add second stop: Kyoto, Sept 4–7
- Add activities to Kyoto
- *Mention: "All of this is stored relationally in MySQL via Prisma"*

### Step 5: Calendar View
- Open Calendar tab (Screen 11)
- Show activities appearing as FullCalendar events on their scheduled dates
- *Mention: "Activities are shown on their assigned dates — no duplication in the DB"*

### Step 6: Map View
- Open Map tab
- Show Tokyo and Kyoto markers on Leaflet/OpenStreetMap
- Show the polyline route connecting them
- *Mention: "Coordinates come from our city seed data"*

### Step 7: Budget View
- Open Budget tab (Screen 9)
- Show total estimated cost, pie chart by category
- Click "Add Expense" → add a ¥2500 Transport expense
- Show budget totals update, chart updates

### Step 8: Share the Trip
- Click "Share Trip" → toggle to Public → copy the share URL
- Open in a new incognito browser tab
- Show the full itinerary visible without login
- *Mention: "Secure UUID share token, no auth required to view"*

### Step 9: Copy the Trip
- Click "Copy This Trip" → prompted to log in
- Log in as second user (demo user 2 from seed)
- Trip is copied to their account with a new ID
- Navigate to their /trips → show the copied trip

### Step 10: Database Proof
- Open Prisma Studio (`npx prisma studio`)
- Show the trips, stops, and trip_activities tables populated with live data
- *This is the relational DB proof point for judges*

---

## 29. Acceptance Criteria

### AC-01: User Registration

**Given** an unauthenticated visitor  
**When** they submit the registration form with valid data  
**Then:**
- A `users` record is created in MySQL
- The `password_hash` is a bcrypt hash (not plaintext)
- A JWT token is returned in the response
- The user is redirected to `/dashboard`
- The email field has a UNIQUE constraint (duplicate rejected with 409)

---

### AC-02: User Login

**Given** a registered user  
**When** they submit correct email and password  
**Then:**
- A JWT is returned
- Stored in localStorage
- Subsequent requests include `Authorization: Bearer <token>`
- `GET /api/auth/me` returns the user's profile

**Given** wrong password  
**When** submitted  
**Then** 401 is returned and no token is issued

---

### AC-03: Create Trip

**Given** an authenticated user  
**When** they submit a valid trip creation form  
**Then:**
- A `trips` record is created in MySQL with `user_id` matching the authenticated user
- The trip appears in `GET /api/trips`
- The user is redirected to `/trips/:id/itinerary`
- Another user cannot access this trip via `GET /api/trips/:id`

**Given** end date before start date  
**When** form is submitted  
**Then** 400 is returned with a clear validation error

---

### AC-04: Add City Stop

**Given** an existing trip  
**When** the user searches for a city and clicks "Add to Trip"  
**Then:**
- A `stops` record is created linked to the trip and city
- The city appears in the Itinerary Builder with correct dates
- The stop has a `position` value reflecting its order
- The stop can be reordered (position updated via `PUT /api/trips/:tripId/stops/reorder`)

---

### AC-05: Add Activity to Stop

**Given** an existing stop  
**When** the user selects an activity from the discovery panel  
**Then:**
- A `trip_activities` record is created with `stop_id`, `activity_id`, `date`
- The activity appears in the correct day in the itinerary view
- The activity appears on the correct date in the FullCalendar view
- The activity's cost (custom or estimated) is reflected in the budget total

---

### AC-06: Budget Calculation

**Given** a trip with stops and activities  
**When** the user views the Budget page  
**Then:**
- Total estimated cost = sum of `trip_activities.custom_cost` (or `activity.estimated_cost` where null)
- Budget is broken down by category (SIGHTSEEING, FOOD, etc.)
- Adding a manual expense updates the totals
- Recharts pie chart and bar chart reflect current data

---

### AC-07: Public Trip Sharing

**Given** an authenticated user with a trip  
**When** they click "Make Public"  
**Then:**
- `trips.is_public` is set to `true`
- `trips.share_token` is set to a UUID string
- `GET /api/public/trips/:shareToken` returns the full itinerary
- No authentication header is required for the public endpoint
- The original user's other trips are not exposed

**When** the user clicks "Make Private"  
**Then** the public endpoint returns 404

---

### AC-08: Copy Trip

**Given** an authenticated user viewing a public trip  
**When** they click "Copy This Trip"  
**Then:**
- A new `trips` record is created under their `user_id`
- New `stops` records are created (no shared IDs with original)
- New `trip_activities` records are created referencing the same `activity_id` values
- The copy appears in their `/trips` dashboard
- Modifying the copy does not affect the original

---

### AC-09: Authorization (Negative Case)

**Given** authenticated User A  
**When** they request `GET /api/trips/:id` where the trip belongs to User B  
**Then:**
- Response is `403 Forbidden`
- No trip data is exposed
- Same protection applies to stops, activities, and expenses

---

## 30. Future Enhancements

These are explicitly **out of scope** for the hackathon but represent the natural product roadmap:

### Near-term (Post-Hackathon)

| Feature | Description |
|---|---|
| AI Itinerary Generator | Input destination + days + budget + interests → structured itinerary suggestion, validated before DB write |
| Real-time Collaboration | Socket.io for shared editing of group trips |
| Flight & Hotel Search | Read-only integration with Skyscanner/Booking APIs for price context |
| Cloudinary Image Upload | Trip cover photos and activity images from user devices |
| Notifications | Email reminders as trip start date approaches |
| Currency Conversion | Real-time exchange rates so budget shows in user's home currency |

### Medium-term

| Feature | Description |
|---|---|
| Mobile App | React Native companion app with offline itinerary access |
| Community Explore Tab | Browse and search all public trips with filters |
| Trip Templates | Pre-built itinerary templates for popular destinations |
| Collaborative Notes | Per-activity comment threads for group trips |
| Packing List | Checklist tool linked to the trip |
| Export to PDF | Download a printable trip summary |

### Long-term

| Feature | Description |
|---|---|
| Travel Agent Mode | Professionals build trips for clients |
| Booking Integration | One-click booking of activities via partner APIs |
| Carbon Footprint Tracker | Environmental impact of travel route |
| AR Map View | Augmented reality point-of-interest overlay (mobile) |
| Multi-language Support | Full i18n for international users |

---

## Appendix A: Local Development Setup

```bash
# 1. Clone the repository
git clone <repo-url>
cd globetrotter

# 2. Setup backend
cd backend
cp .env.example .env
# Edit .env with your MySQL credentials

npm install
npx prisma migrate dev --name init
node prisma/seed.js

npm run dev   # starts on http://localhost:5000

# 3. Setup frontend (new terminal)
cd ../frontend
npm install
npm run dev   # starts on http://localhost:5173

# 4. (Optional) Prisma Studio
cd backend
npx prisma studio   # opens at http://localhost:5555
```

---

## Appendix B: package.json Scripts

**Backend:**
```json
{
  "scripts": {
    "dev": "nodemon src/server.js",
    "start": "node src/server.js",
    "db:migrate": "prisma migrate dev",
    "db:seed": "node prisma/seed.js",
    "db:studio": "prisma studio",
    "test": "jest --runInBand"
  }
}
```

**Frontend:**
```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

---

*End of PRD — GlobeTrotter v1.0*  
*Last updated: August 2026*
