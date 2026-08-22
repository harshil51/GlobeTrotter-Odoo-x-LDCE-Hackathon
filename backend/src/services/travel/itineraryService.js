const aiProvider = require('../providers/aiProvider');
const googleProvider = require('../providers/googleProvider');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class ItineraryService {
  async generateTripPlan(userId, requestData) {
    const { name, origin, destinations, startDate, endDate, budget, travelers, interests, travelStyle } = requestData;

    // 1. Fetch live metadata for the destinations to feed the AI
    // We limit to 5 places per destination to save API costs & context length
    const aggregatedPlaces = {};
    for (const dest of destinations) {
      // Find top places for this destination based on user interests
      const query = `${dest} ${interests.join(' ')} attractions`;
      const places = await googleProvider.searchPlaces(query);
      aggregatedPlaces[dest] = places.slice(0, 10);
    }

    const aiRequestPayload = {
      origin,
      destinations,
      startDate,
      endDate,
      budget,
      travelers,
      interests,
      travelStyle,
      places: aggregatedPlaces,
    };

    // 2. Pass structured data to AI engine
    const aiResponse = await aiProvider.generateItinerary(aiRequestPayload);

    // 3. Create a Trip in DB
    const newTrip = await prisma.trip.create({
      data: {
        userId,
        name: name || `Trip to ${destinations.join(', ')}`,
        description: `Generated ${travelStyle} trip focused on ${interests.join(', ')}`,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        totalBudget: budget,
        coverPhoto: aggregatedPlaces[destinations[0]]?.[0]?.imageUrl || null,
        preference: {
          create: {
            travelStyle,
            interests: JSON.stringify(interests),
          }
        },
        generatedPlan: {
          create: {
            content: JSON.stringify(aiResponse),
            estimatedCost: aiResponse.estimatedTotalCost || budget
          }
        }
      }
    });

    return {
      trip: newTrip,
      itinerary: aiResponse
    };
  }

  async getSavedPlan(tripId, userId) {
    const trip = await prisma.trip.findFirst({
      where: { id: parseInt(tripId), userId },
      include: {
        generatedPlan: true,
        preference: true
      }
    });

    if (!trip) throw new Error('Trip not found or unauthorized');

    let itinerary = null;
    if (trip.generatedPlan?.content) {
      try {
        itinerary = JSON.parse(trip.generatedPlan.content);
      } catch (e) {
        console.error('Failed to parse generated plan JSON', e);
      }
    }

    return { trip, itinerary };
  }
}

module.exports = new ItineraryService();
