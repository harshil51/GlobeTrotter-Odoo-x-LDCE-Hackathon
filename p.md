You are a senior full-stack engineer, travel-platform architect, API integration engineer, geospatial engineer, recommendation-system designer, database architect, security engineer, and UX engineer.

I have an existing GlobeTrotter hackathon project.

The current application is too static:
- cities are hardcoded
- activities are hardcoded
- images are static
- recommendations are static
- costs are static
- itinerary generation is static
- geographical information is limited
- travel options are not dynamic
- flights/trains/hotels are not integrated
- suggestions do not adapt to the user's actual trip
- much of the information is not persisted properly

I want you to transform GlobeTrotter from a static CRUD itinerary application into a DYNAMIC, DATA-DRIVEN, INTELLIGENT TRAVEL PLANNING PLATFORM.

DO NOT create a fake/demo implementation using hardcoded JSON.

The application must fetch real data from APIs and online resources wherever practical, intelligently combine that information, and persist user-selected information in MySQL.

==================================================
IMPORTANT EXISTING STACK
==================================================

Frontend:

- React
- Vite
- JavaScript
- React Router
- Tailwind CSS
- Axios
- Recharts
- FullCalendar
- Leaflet

Backend:

- Node.js
- Express.js
- JavaScript
- REST API

Database:

- MySQL
- Prisma ORM

Authentication:

- JWT
- bcrypt/bcryptjs

Validation:

- Zod

LOCAL HACKATHON APPLICATION.

DO NOT introduce deployment infrastructure.

DO NOT replace MySQL with MongoDB.

DO NOT replace Prisma with Mongoose.

DO NOT convert the project to TypeScript.

==================================================
CORE VISION
==================================================

GlobeTrotter should work like an intelligent travel assistant.

Instead of:

User → manually enters everything

The application should work like:

User enters:
- destination
- origin
- dates
- budget
- number of travelers
- interests
- travel style
- preferred transport
- accommodation preference

↓

GlobeTrotter fetches live information

↓

Places
Activities
Attractions
Images
Weather
Flights
Hotels
Transport
Routes
Travel times
Estimated costs
Cultural information

↓

Recommendation engine analyzes the information

↓

GlobeTrotter dynamically generates a suggested itinerary

↓

User reviews it

↓

User can modify it

↓

Final plan is saved to MySQL

↓

GlobeTrotter continuously provides contextual suggestions.

The application should feel like:

"Tell me what kind of trip you want, and GlobeTrotter will help you construct the entire journey."

==================================================
1. FIRST ANALYZE THE EXISTING PROJECT
==================================================

DO NOT immediately start coding.

First inspect the entire repository.

Analyze:

FRONTEND:
- pages
- components
- routes
- services
- hooks
- API layer
- state management
- existing itinerary UI
- existing dashboard
- map
- calendar
- budget
- authentication

BACKEND:
- routes
- controllers
- services
- middleware
- authentication
- API integrations
- Prisma
- database
- environment variables

DATABASE:
- Prisma schema
- migrations
- tables
- relations
- indexes
- existing stored data

Identify all static/hardcoded data.

Search for:

- hardcoded city arrays
- hardcoded activity arrays
- static image URLs
- fake prices
- fake recommendations
- mock flight data
- mock hotel data
- mock transportation data
- hardcoded coordinates
- hardcoded countries
- hardcoded itinerary suggestions

Create a report before modifying major architecture.

==================================================
2. LIVE DATA ARCHITECTURE
==================================================

Implement this architecture:

React
 ↓
Node/Express API
 ↓
Internal Travel Service Layer
 ↓
External APIs
 ↓
Normalize data
 ↓
Recommendation Engine
 ↓
MySQL

The frontend must NEVER call external API providers directly when secrets/API keys are required.

Example:

React
 ↓
GET /api/travel/search?destination=Paris
 ↓
Express
 ↓
Google Places / Amadeus / other providers
 ↓
Normalize results
 ↓
Return clean GlobeTrotter format
 ↓
React

API credentials must remain on the backend.

==================================================
3. API PROVIDER STRATEGY
==================================================

Use real APIs where possible.

Recommended integrations:

A. Google Places / Maps Platform

Use for:

- city/place search
- attractions
- restaurants
- points of interest
- place details
- ratings
- opening hours
- photos
- geographical coordinates
- map information
- route calculation
- travel time
- distance

B. Amadeus APIs

Use for:

- flight search
- flight offers
- flight pricing
- hotel search
- hotel offers
- destination experiences
- car/transfer information where available

C. Weather API

Use a reliable weather API to provide:

- current weather
- forecast
- temperature
- precipitation
- weather warnings where available

D. OpenStreetMap / Leaflet

Use for map visualization where appropriate.

IMPORTANT:

Do not assume every API is free.

Create an API provider abstraction layer.

Example:

services/external/
    googlePlacesService.js
    googleRoutesService.js
    amadeusFlightService.js
    amadeusHotelService.js
    weatherService.js

The rest of the backend should NOT directly depend on provider-specific response formats.

==================================================
4. API KEY SECURITY
==================================================

Never expose:

- Google API key
- Amadeus client secret
- weather API key
- any other secret

to React.

Use:

.env

Example:

GOOGLE_MAPS_API_KEY=
AMADEUS_CLIENT_ID=
AMADEUS_CLIENT_SECRET=
WEATHER_API_KEY=

Frontend should only call GlobeTrotter backend endpoints.

Implement:

API timeout
API error handling
rate-limit handling
provider failure fallback
request validation

==================================================
5. DYNAMIC DESTINATION SEARCH
==================================================

Replace static city data with dynamic search.

When user searches:

"Paris"

the backend should return useful destination information:

- city
- country
- region
- coordinates
- place ID
- popularity/relevance
- photos
- short description
- rating where available

Example:

GET /api/destinations/search?q=Paris

Response:

{
  "success": true,
  "data": [
    {
      "name": "Paris",
      "country": "France",
      "latitude": 48.8566,
      "longitude": 2.3522,
      "placeId": "...",
      "image": "...",
      "rating": 4.8
    }
  ]
}

Do not hardcode the response.

==================================================
6. DYNAMIC CITY PAGE
==================================================

When the user selects a city, dynamically load:

- hero image
- geographical location
- country
- local timezone
- weather
- famous attractions
- cultural attractions
- historical places
- food experiences
- adventure activities
- nightlife
- shopping
- family activities
- hidden gems
- highly rated places
- recommended duration
- estimated daily cost
- local transportation information

The page should feel different for every destination.

Example:

Paris:

Must dynamically produce relevant Paris information.

Tokyo:

Must dynamically produce relevant Tokyo information.

Dubai:

Must dynamically produce relevant Dubai information.

Do not reuse static content between cities.

==================================================
7. DYNAMIC PLACE IMAGES
==================================================

This is very important.

When the user selects:

Paris

the application should dynamically retrieve relevant imagery.

Examples:

Paris → Eiffel Tower
Paris → Louvre
Paris → Montmartre
Paris → Seine
Paris → Notre-Dame

When the user selects:

Tokyo

retrieve Tokyo-specific images.

Use provider APIs for place photos rather than random unrelated static images.

Store only appropriate identifiers/metadata in MySQL where provider terms permit it.

Do not assume external photo URLs can always be permanently cached.

If an API requires attribution, preserve and display the required attribution.

==================================================
8. DYNAMIC ATTRACTION DISCOVERY
==================================================

For every destination generate categories:

MUST VISIT
CULTURE & HISTORY
FOOD
ADVENTURE
NATURE
NIGHTLIFE
SHOPPING
FAMILY
HIDDEN GEMS
LOCAL EXPERIENCES

For each recommendation return:

- name
- description
- image
- coordinates
- rating
- category
- estimated duration
- estimated cost
- opening hours when available
- distance from selected location
- source/provider
- place ID

Allow:

"Add to itinerary"

==================================================
9. INTELLIGENT RECOMMENDATION ENGINE
==================================================

Do NOT simply return the most popular places.

Recommendations should depend on:

- destination
- trip duration
- dates
- budget
- user interests
- travel style
- number of travelers
- age/group preferences where provided
- previous saved places
- selected activities
- distance
- opening hours
- weather
- travel time
- popularity
- ratings
- estimated cost

Example:

User:

Destination:
Paris

Duration:
3 days

Budget:
₹60,000

Interests:
History + Food + Photography

The recommendation engine should prioritize:

Louvre
Eiffel Tower
Montmartre
Seine
local food experiences
photography-friendly locations

and avoid filling the itinerary with unrelated activities.

==================================================
10. TRAVEL STYLE
==================================================

Add user/trip preferences:

Budget Traveler
Balanced
Luxury
Adventure
Cultural
Foodie
Romantic
Family
Backpacker
Photography
Relaxed
Fast-paced

The recommendation engine should change recommendations accordingly.

Example:

Budget traveler:

Prefer:
- free attractions
- affordable food
- public transportation
- budget accommodation

Luxury traveler:

Prefer:
- premium hotels
- private transfers
- premium experiences
- high-end restaurants

==================================================
11. DYNAMIC ITINERARY GENERATOR
==================================================

This is one of the MOST IMPORTANT features.

Create:

POST /api/trips/generate-plan

Input:

{
  "origin": "Ahmedabad",
  "destinations": ["Paris", "Amsterdam", "London"],
  "startDate": "...",
  "endDate": "...",
  "budget": 150000,
  "travelers": 2,
  "interests": [
    "culture",
    "food",
    "history"
  ],
  "travelStyle": "balanced"
}

The backend should generate a structured itinerary.

The itinerary should consider:

- available dates
- city duration
- travel time between cities
- opening hours
- activity duration
- geographical proximity
- budget
- user preferences
- transportation options
- weather where available

Do NOT randomly generate activities.

Use actual places retrieved from APIs.

==================================================
12. GEOGRAPHICAL ITINERARY OPTIMIZATION
==================================================

This should be a major differentiating feature.

Do not recommend:

Place A
→ 30 km away
→ Place B
→ 25 km back
→ Place C

Instead cluster activities geographically.

Example:

DAY 1 — Central Paris

Eiffel Tower
↓
Seine
↓
Louvre
↓
Tuileries

DAY 2 — Montmartre

Montmartre
↓
Sacré-Cœur
↓
local food
↓
artist district

Use coordinates and route/distance calculations.

Minimize:

- unnecessary travel
- excessive backtracking
- long transfers

Maximize:

- sightseeing efficiency
- user preference match
- available time

==================================================
13. MAP INTELLIGENCE
==================================================

The map should not merely show markers.

Show:

Origin
↓
Transport
↓
City
↓
Activity
↓
Activity
↓
Hotel
↓
Next city

Use Leaflet.

Display:

- city markers
- activity markers
- hotel marker
- route
- travel distance
- estimated travel time

Allow the user to click markers.

Clicking a marker should show:

- image
- name
- category
- rating
- cost
- duration
- Add to itinerary

==================================================
14. INTER-CITY TRAVEL
==================================================

For multiple cities, calculate:

City A
→ City B

Possible modes:

- Flight
- Train
- Bus
- Car
- Public transport where appropriate

Show:

- estimated duration
- distance
- estimated/current price if available
- departure/arrival information
- number of transfers
- recommended option

Example:

Paris → Amsterdam

FLIGHT
₹8,500
1h 20m

TRAIN
₹7,200
3h 20m

BUS
₹4,500
6h 30m

Then recommend:

"Recommended: Train"

because:

- city-center to city-center
- shorter total travel overhead
- reasonable price
- lower hassle

Do not invent prices.

If live pricing is unavailable, clearly label the value as:

Estimated

rather than:

Live price.

==================================================
15. LIVE FLIGHT SEARCH
==================================================

Integrate flight search through the backend.

Endpoint:

GET /api/travel/flights

Parameters:

origin
destination
departureDate
returnDate
adults
currency

Return:

- airline
- flight number
- departure
- arrival
- duration
- stops
- baggage if available
- price
- currency
- booking/deep-link information where available

Allow sorting:

Cheapest
Fastest
Best
Fewest stops

Add:

"View Flight"

button.

If a direct booking flow is unavailable, redirect the user to the provider/airline/appropriate booking page rather than pretending the application books the ticket.

IMPORTANT:

Never claim that a flight price is guaranteed.

Display:

"Prices and availability may change."

==================================================
16. HOTEL SEARCH
==================================================

When a city is selected, provide:

Recommended Hotels

Based on:

- trip dates
- budget
- number of travelers
- location
- rating
- amenities
- travel style

Display:

- hotel image
- name
- rating
- location
- price
- room information where available
- amenities
- map location
- booking/view button

Allow sorting:

Cheapest
Best rated
Closest
Best value
Luxury

Do not invent hotel prices.

==================================================
17. HOTEL LOCATION INTELLIGENCE
==================================================

Don't recommend hotels only by price.

Consider:

- distance from itinerary activities
- proximity to transport
- neighborhood
- user budget
- trip style

Example:

If most activities are in central Paris:

recommend hotels close to the planned activity cluster.

Explain:

"Recommended because it is close to 8 of your planned activities."

This makes the recommendation feel intelligent.

==================================================
18. LOCAL TRANSPORT
==================================================

For every destination provide transportation suggestions:

- Metro
- Bus
- Taxi
- Ride sharing where available
- Rental car
- Walking
- Bike
- Airport transfer

Show:

- estimated cost
- estimated duration
- best use case

Example:

"Metro is recommended for this itinerary because 70% of your activities are within the metro network."

Do not fabricate availability.

==================================================
19. WEATHER-AWARE PLANNING
==================================================

Integrate weather data.

The itinerary should adapt to weather when forecast information is available.

Example:

If:

Day 2:
Heavy rain

Then suggest:

Indoor activities:
- Louvre
- museums
- food experiences

Instead of:

Outdoor walking tour

Display:

"Weather-aware suggestion"

This is an important differentiating feature.

==================================================
20. CULTURAL INTELLIGENCE
==================================================

For each destination provide useful cultural information:

- local customs
- etiquette
- dress considerations where relevant
- local food
- festivals/events where available
- public holidays
- basic local phrases
- tipping conventions
- safety/travel notes where reliable

Do not present uncertain information as fact.

==================================================
21. FOOD RECOMMENDATIONS
==================================================

Dynamically discover:

- local restaurants
- famous local dishes
- street food
- cafes
- food markets
- vegetarian options
- halal options where available
- fine dining
- budget food

Use location-based place search.

Allow:

"Add restaurant to itinerary"

==================================================
22. EVENT DISCOVERY
==================================================

If a reliable event API/source is available, show:

- concerts
- festivals
- exhibitions
- sports events
- cultural events
- seasonal events

Filter by:

Trip dates.

Never display an event outside the user's travel dates as if it were available.

If no reliable event source is configured, gracefully omit this feature rather than using fake events.

==================================================
23. SMART DAILY PLAN
==================================================

Each day should have:

Morning
Afternoon
Evening

Example:

DAY 1 — PARIS

09:00
Breakfast

10:00
Louvre Museum
2h 30m

13:00
Lunch nearby

14:30
Tuileries Garden

16:00
Seine

19:00
Dinner

The schedule should consider:

- opening hours
- duration
- travel time
- meal breaks
- user preferences

Avoid impossible schedules.

==================================================
24. PLAN FEASIBILITY ENGINE
==================================================

Before saving a generated itinerary, validate:

- No overlapping activities
- No impossible travel times
- Activities fall within opening hours where available
- Dates are within trip dates
- City transitions are possible
- Budget is within range
- Activity duration fits available time

If the plan is impossible:

DO NOT save it.

Return warnings.

Example:

"Your itinerary contains 3 activities that cannot realistically fit on Day 2."

Offer:

"Optimize My Day"

==================================================
25. SMART BUDGET ESTIMATION
==================================================

Budget should be dynamically calculated.

Calculate:

Flights
Intercity transport
Local transport
Hotels
Activities
Food
Other expenses

Example:

Trip estimate:

Flights        ₹42,000
Hotels         ₹35,000
Transport      ₹12,000
Activities     ₹10,000
Food           ₹15,000
Other           ₹5,000
-----------------------
Estimated      ₹119,000

The estimate should be based on actual retrieved data where possible.

Clearly distinguish:

LIVE PRICE

vs

ESTIMATED COST

Never present estimates as confirmed prices.

==================================================
26. BUDGET OPTIMIZATION
==================================================

If user enters:

Budget:
₹100,000

but estimated trip:

₹135,000

the application should say:

"Your current plan is approximately ₹35,000 over budget."

Then suggest:

- cheaper hotel
- cheaper flight
- alternative train
- fewer paid activities
- budget restaurants
- fewer cities
- shorter duration

Example:

"Switching Paris → Amsterdam from flight to train could reduce estimated transport cost."

This should be dynamically calculated from available data.

==================================================
27. SMART CITY DURATION
==================================================

When user chooses:

Paris
Amsterdam
London

and has:

7 days

the system should suggest a realistic allocation.

Example:

Paris — 3 days
Amsterdam — 2 days
London — 2 days

The recommendation should consider:

- number of attractions
- activity density
- travel time
- user's interests
- city popularity
- selected places

Allow the user to override the recommendation.

==================================================
28. DESTINATION ALTERNATIVES
==================================================

Provide:

"You may also like"

If the user selects Paris:

Suggest destinations based on:

- similar cultural experience
- budget
- geography
- interests

Example:

Paris
→ Rome
→ Barcelona
→ Prague
→ Vienna

Explain WHY:

"Similar cultural experience"

or

"Lower estimated daily cost"

or

"Good alternative for a 3-day trip"

==================================================
29. CONTEXTUAL SUGGESTIONS
==================================================

Suggestions should appear throughout the application.

Examples:

User adds Eiffel Tower.

Show:

"Nearby recommendations"

- Seine Cruise
- Louvre
- Tuileries Garden
- Arc de Triomphe

User adds a hotel.

Show:

"Your hotel is 1.2 km from your Day 1 activities."

User adds an expensive flight.

Show:

"Alternative train option is available."

User selects rainy day.

Show:

"Consider moving outdoor activities to Day 3."

This is how the application should feel intelligent.

==================================================
30. PERSONALIZED RECOMMENDATION SCORE
==================================================

Create a recommendation scoring system.

For example:

score =
  preferenceMatch * 0.25
+ rating * 0.20
+ distanceScore * 0.15
+ budgetFit * 0.15
+ popularity * 0.10
+ weatherFit * 0.10
+ scheduleFit * 0.05

Do not blindly use this exact formula if better logic exists.

The important requirement:

Recommendations must be explainable.

For every top recommendation provide:

"Why this is recommended"

Example:

"Recommended because:
✓ Matches your interest in history
✓ 4.7+ rating
✓ 15 minutes from your previous activity
✓ Fits your budget
✓ Open during your planned time"

==================================================
31. SAVE LIVE DATA TO MYSQL
==================================================

The application must store important user-selected information.

Persist:

Users
Trips
Stops
Selected places
Selected activities
Expenses
Generated itinerary
Selected hotels
Selected transport options
Selected flights where appropriate
User preferences
Travel style
Saved places
Share information

IMPORTANT:

Do not blindly store every external API response forever.

Create a clear distinction between:

LIVE EXTERNAL DATA

and

USER-OWNED SNAPSHOT DATA.

For example:

User selects a hotel.

Store:

hotelProvider
externalHotelId
name
selectedPrice
currency
checkIn
checkOut
image/reference if allowed
selectedAt

Do not assume external prices remain valid.

==================================================
32. CACHE STRATEGY
==================================================

Implement reasonable caching where API terms allow it.

Examples:

City metadata
Static destination metadata
Non-sensitive geographic data

But respect provider restrictions.

If a provider prohibits caching certain photo identifiers or live pricing information, do not cache them.

For live flight/hotel pricing:

fetch fresh data when the user searches.

==================================================
33. API FAILURE FALLBACK
==================================================

External APIs WILL sometimes fail.

The application must remain usable.

Example:

Google Places unavailable.

Show:

"Live place information is temporarily unavailable."

But still allow:

- existing saved trips
- existing saved itinerary
- stored user data
- manually selected places

Do not crash the application.

==================================================
34. RATE LIMITING
==================================================

Prevent abuse.

Implement backend protection for expensive API endpoints.

Examples:

/api/travel/flights
/api/travel/hotels
/api/destinations/search
/api/recommendations

Avoid calling external APIs on every React render.

Use:

- debouncing
- caching where allowed
- request deduplication
- sensible API limits

==================================================
35. DATABASE MODEL EXTENSIONS
==================================================

Extend the existing Prisma schema if required.

Potential models:

User
Trip
Stop
City
Activity
TripActivity
Expense

Additional:

Place
SavedPlace
HotelSelection
FlightSelection
TransportOption
Recommendation
TripPreference
TravelSearch
WeatherSnapshot
GeneratedItinerary
ItinerarySuggestion

Do not add tables unnecessarily.

Only add entities that are actually needed.

Maintain normalized relationships.

==================================================
36. SEARCH HISTORY
==================================================

Optionally store:

- recent destinations
- recent searches
- saved places
- selected flights
- selected hotels

Allow users to revisit their research.

==================================================
37. USER PREFERENCES
==================================================

Store:

- preferred budget
- travel style
- interests
- preferred transportation
- accommodation style
- food preferences
- preferred pace

Use these preferences in recommendations.

==================================================
38. AI INTEGRATION
==================================================

If an AI API is available, use AI as a reasoning/recommendation layer.

IMPORTANT:

AI must NOT invent:

- flight prices
- hotel prices
- opening hours
- coordinates
- availability
- booking URLs

AI should receive verified structured data from the backend.

Example:

External APIs
↓
Verified structured data
↓
AI recommendation layer
↓
Structured itinerary suggestion
↓
Validation engine
↓
User confirmation
↓
MySQL

AI can decide:

"These 3 activities fit Day 1 best."

But it should not fabricate live travel information.

==================================================
39. AI ITINERARY GENERATION
==================================================

Provide:

"Generate My Trip"

User enters:

Origin
Destination(s)
Dates
Budget
Travelers
Interests
Travel style

System:

1. Searches destinations
2. Retrieves places
3. Retrieves activities
4. Retrieves travel options
5. Retrieves hotel options
6. Retrieves weather
7. Calculates distances
8. Clusters places geographically
9. Builds daily itinerary
10. Estimates cost
11. Checks feasibility
12. Optimizes budget
13. Returns plan

User sees:

"Your suggested 7-day itinerary"

with:

- day
- city
- activities
- times
- transport
- estimated cost
- map
- images
- explanation

User can:

Accept
Edit
Regenerate
Optimize budget
Optimize travel time

==================================================
40. REGENERATE OPTIONS
==================================================

Provide buttons:

"Make it cheaper"

"Make it more relaxed"

"Add more culture"

"Add more food"

"Add nightlife"

"Reduce travel time"

"Add hidden gems"

"Make it family friendly"

"Make it luxury"

The system should modify the existing plan rather than generating a completely unrelated trip.

==================================================
41. SMART TRIP INSIGHTS
==================================================

Add a trip intelligence panel:

Example:

TRIP INSIGHTS

✓ Your activities are geographically well clustered.

⚠ Day 3 is slightly overloaded.

⚠ Your current plan is ₹12,500 over budget.

✓ Taking the train instead of flying could save approximately ₹4,000.

✓ Wednesday has better weather for your outdoor activities.

✓ Your hotel is close to most planned activities.

This should be dynamically calculated.

==================================================
42. BOOKING REDIRECTS
==================================================

The application does NOT need to process actual payments.

Instead provide:

"View Flight"

"View Hotel"

"View Activity"

"Book"

buttons.

Redirect to:

- airline/provider
- hotel/provider
- appropriate booking website

Only use legitimate URLs returned/provided by the API/provider.

Never fabricate booking URLs.

Track outbound selections if useful.

Example:

User selects flight
↓
Save selection
↓
Show:
"Continue to booking"
↓
External provider

Clearly label:

"GlobeTrotter does not process this booking."

==================================================
43. SECURITY
==================================================

Maintain strong authentication.

Every private operation must verify:

authenticatedUserId === resource.ownerId

Protect:

Trips
Expenses
Saved places
Search history
Selected hotels
Selected flights
Preferences

Never expose API secrets.

Validate all external API parameters.

Never trust frontend-generated prices.

Never trust frontend ownership information.

Never allow:

GET /api/trips/:id

to reveal another user's private trip.

==================================================
44. FRONTEND EXPERIENCE
==================================================

Do not make the UI look like a simple CRUD dashboard.

Create sections such as:

Explore
Plan
My Trips
Discover
Flights
Hotels
Activities
Map
Budget
Recommendations

The dashboard should dynamically show:

"Good morning, Mehul"

"Where are you going next?"

"Explore destinations"

"Recommended for you"

"Continue planning"

"Upcoming trip"

"Trip intelligence"

==================================================
45. DYNAMIC DESTINATION HERO
==================================================

When destination changes, the hero section changes dynamically.

Example:

Paris:

Paris image
Paris weather
Paris rating
Top attractions
Estimated daily cost

Tokyo:

Tokyo image
Tokyo weather
Tokyo attractions
Estimated daily cost

No static generic hero image.

==================================================
46. DYNAMIC MAP
==================================================

Map should update based on the current trip.

Example:

Ahmedabad
↓
Dubai
↓
Paris
↓
Amsterdam
↓
London

Show:

- flight route
- train route
- city
- hotel
- activity markers

Allow clicking on locations.

==================================================
47. REAL-TIME VS LIVE DATA
==================================================

Be precise.

Do NOT claim:

"real-time"

unless the provider actually supplies live/current information.

Use labels:

LIVE
for currently fetched provider data.

ESTIMATED
for calculated estimates.

SAVED
for previously selected user data.

LAST UPDATED
for cached information.

Example:

Flight:
₹42,500
LIVE — checked 30 seconds ago

Hotel:
₹8,200/night
LIVE — checked 2 minutes ago

Daily food estimate:
₹1,500
ESTIMATED

This greatly improves trust.

==================================================
48. DATA SOURCE DISPLAY
==================================================

Where appropriate show:

Source:
Google Places

Source:
Amadeus

Source:
Weather provider

Provide appropriate attribution according to each provider's terms.

Do not pretend that GlobeTrotter owns third-party data.

==================================================
49. ERROR HANDLING
==================================================

If one API fails:

Do not break the entire page.

Example:

Flights unavailable.

Still show:

Hotels
Activities
Places
Map
Weather

Display:

"Flight data temporarily unavailable."

==================================================
50. PERFORMANCE
==================================================

Do not make 50 API calls when opening one city.

Use:

- backend aggregation
- batching where provider supports it
- debounced search
- caching where permitted
- parallel requests when appropriate
- lazy loading
- pagination
- selective API fields

For example:

When loading Paris:

Fetch necessary data intelligently rather than making unnecessary repeated requests.

==================================================
51. API SERVICE ARCHITECTURE
==================================================

Create a provider abstraction:

services/travel/

    destinationService.js
    placesService.js
    flightsService.js
    hotelsService.js
    weatherService.js
    routesService.js
    recommendationService.js
    itineraryService.js

External providers:

services/providers/

    googleProvider.js
    amadeusProvider.js
    weatherProvider.js

This prevents the rest of the application from depending directly on external API formats.

==================================================
52. API ENDPOINTS
==================================================

Implement/fix endpoints such as:

DESTINATIONS

GET /api/destinations/search
GET /api/destinations/:id
GET /api/destinations/:id/places
GET /api/destinations/:id/weather
GET /api/destinations/:id/recommendations

PLACES

GET /api/places/search
GET /api/places/:id
GET /api/places/:id/photos

ROUTES

GET /api/travel/route

FLIGHTS

GET /api/travel/flights

HOTELS

GET /api/travel/hotels

TRANSPORT

GET /api/travel/transport

RECOMMENDATIONS

POST /api/recommendations

ITINERARY

POST /api/trips/generate-plan
POST /api/trips/:id/optimize
POST /api/trips/:id/regenerate

BUDGET

GET /api/trips/:id/budget
POST /api/trips/:id/optimize-budget

SAVED DATA

POST /api/places/:id/save
DELETE /api/places/:id/save
GET /api/users/me/saved-places

Use the existing API architecture where possible rather than duplicating routes.

==================================================
53. FRONTEND DATA FLOW
==================================================

The frontend must never contain the source of truth for travel data.

Example:

User searches Paris

React
↓
GET /api/destinations/search?q=Paris
↓
Backend
↓
External APIs
↓
Normalized data
↓
React

User selects Eiffel Tower

React
↓
POST /api/trips/:id/places
↓
Backend
↓
MySQL

User refreshes page

React
↓
GET /api/trips/:id
↓
MySQL
↓
Saved itinerary appears

==================================================
54. DO NOT USE STATIC FALLBACK DATA AS FAKE LIVE DATA
==================================================

This is extremely important.

Do NOT do:

if API fails:
return [
  { name: "Eiffel Tower", price: 100 }
]

That creates fake data.

Instead:

if API fails:

return:

{
  "success": false,
  "sourceUnavailable": true,
  "message": "Live destination information is temporarily unavailable."
}

Existing user-saved data can still be displayed.

==================================================
55. HACKATHON DIFFERENTIATORS
==================================================

Prioritize these features because they can make GlobeTrotter stand out:

1. AI-assisted dynamic itinerary generation
2. Geographically optimized itinerary
3. Live flight suggestions
4. Live hotel suggestions
5. Dynamic destination imagery
6. Weather-aware itinerary
7. Smart budget estimation
8. Budget optimization
9. Travel-time optimization
10. Contextual nearby recommendations
11. Alternative destination suggestions
12. Map-based itinerary
13. Explainable recommendations
14. "Make it cheaper"
15. "Make it relaxed"
16. "Reduce travel time"
17. Public trip sharing
18. Copy trip
19. Personalized travel style
20. Complete travel ecosystem

==================================================
56. IMPORTANT PRODUCT PRINCIPLE
==================================================

GlobeTrotter should NOT simply answer:

"Here are some places in Paris."

It should answer:

"You are visiting Paris for 3 days, you like history and food, you have a ₹60,000 budget, and you prefer a relaxed schedule.

Here is the best plan for you.

Day 1:
Eiffel Tower → Seine → nearby French dinner

Day 2:
Louvre → Tuileries → Montmartre

Day 3:
Versailles → local food experience

Your current estimated cost is ₹54,200.

Your hotel is 1.1 km from 7 planned activities.

Wednesday is better for outdoor activities based on the current forecast.

Taking the train for your next destination could save approximately ₹3,500.

Would you like to make the trip cheaper or more relaxed?"

That is the target experience.

==================================================
57. FINAL IMPLEMENTATION REQUIREMENT
==================================================

Do NOT just create mock UI.

Actually integrate:

- APIs
- backend services
- database
- authentication
- recommendation logic
- maps
- dynamic images
- travel data
- budget calculation
- itinerary generation

The application must work with real API responses.

If an API requires credentials:

Create:

.env.example

with:

GOOGLE_MAPS_API_KEY=
AMADEUS_CLIENT_ID=
AMADEUS_CLIENT_SECRET=
WEATHER_API_KEY=

Do not put actual credentials in source code.

==================================================
58. API AVAILABILITY / FALLBACK
==================================================

Design the system so that if an optional API key is missing:

The corresponding feature becomes unavailable gracefully.

Example:

No Amadeus credentials:

Flights:
"Flight search requires configuration."

But:

Places
Map
Saved trips
Itinerary
Budget
still work.

Do not crash the application.

==================================================
59. DATABASE + USER DATA
==================================================

Ensure all user-owned data is persisted.

A user should be able to:

Close browser
Restart application
Login again

and still have:

Trips
Itineraries
Expenses
Saved places
Preferences
Selected travel options

==================================================
60. FINAL TESTING
==================================================

Test with real destinations:

Paris
Tokyo
Dubai
London
Amsterdam

For each verify:

- destination search
- images
- places
- activities
- map
- weather
- recommendations
- itinerary generation
- cost estimation
- hotel search
- flight search
- inter-city travel
- save trip
- refresh
- login again

Test failure cases:

- API unavailable
- invalid API key
- empty destination
- invalid dates
- impossible itinerary
- budget too low
- no flights
- no hotels
- missing coordinates

The application must gracefully handle all of them.

==================================================
61. FINAL REPORT
==================================================

After implementation provide:

1. Existing architecture analysis
2. Static data removed
3. APIs integrated
4. New backend services
5. New API endpoints
6. Database schema changes
7. New frontend components
8. Recommendation engine
9. Itinerary generation logic
10. Map functionality
11. Flight functionality
12. Hotel functionality
13. Weather functionality
14. Image functionality
15. Security changes
16. Caching strategy
17. Error handling
18. Environment variables required
19. Features that are LIVE
20. Features that are ESTIMATED
21. Features that require API credentials
22. Features that could not be implemented
23. Manual testing results

IMPORTANT:

Do not claim data is live unless it is actually fetched from the external provider.

Do not fabricate prices.

Do not fabricate flight availability.

Do not fabricate hotel availability.

Do not fabricate booking links.

Do not expose API secrets.

Do not store sensitive API credentials in MySQL.

Do not destroy existing user data.

Do not rewrite working parts unnecessarily.

The final application should feel like a real intelligent travel platform rather than a static hackathon CRUD application.

The target experience is:

DISCOVER
↓
SEARCH
↓
COMPARE
↓
RECOMMEND
↓
GENERATE
↓
OPTIMIZE
↓
PERSONALIZE
↓
SAVE
↓
SHARE
↓
BOOK/REDIRECT

Build GlobeTrotter around this experience.