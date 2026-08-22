const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting comprehensive database seed for GlobeTrotter...');

  // Clean existing data in reverse relation order
  await prisma.expense.deleteMany();
  await prisma.tripActivity.deleteMany();
  await prisma.stop.deleteMany();
  await prisma.trip.deleteMany();
  await prisma.activity.deleteMany();
  await prisma.city.deleteMany();
  await prisma.user.deleteMany();

  console.log('🧹 Existing data cleared.');

  // ==================== 1. SEED CITIES ====================
  const citiesData = [
    {
      name: 'Tokyo',
      country: 'Japan',
      region: 'East Asia',
      latitude: 35.6762,
      longitude: 139.6503,
      costIndex: 7.8,
      popularity: 96,
      imageUrl: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80',
      description: 'Futuristic neon skyline, quiet ancient temples, ultra-efficient rail transit, and the world\'s most acclaimed culinary landscape.',
    },
    {
      name: 'Kyoto',
      country: 'Japan',
      region: 'East Asia',
      latitude: 35.0116,
      longitude: 135.7681,
      costIndex: 6.5,
      popularity: 85,
      imageUrl: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80',
      description: 'The cultural capital of Japan with thousands of classical Buddhist temples, gardens, imperial palaces, and traditional wooden machiya houses.',
    },
    {
      name: 'Paris',
      country: 'France',
      region: 'Europe',
      latitude: 48.8566,
      longitude: 2.3522,
      costIndex: 8.5,
      popularity: 98,
      imageUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80',
      description: 'The City of Light — world-renowned art museums, iconic Haussmann architecture, Seine riverbanks, and legendary patisseries.',
    },
    {
      name: 'London',
      country: 'UK',
      region: 'Europe',
      latitude: 51.5074,
      longitude: -0.1278,
      costIndex: 9.0,
      popularity: 94,
      imageUrl: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=800&q=80',
      description: 'Global financial and cultural hub spanning Roman history through cutting-edge theater, West End shows, and diverse markets.',
    },
    {
      name: 'Amsterdam',
      country: 'Netherlands',
      region: 'Europe',
      latitude: 52.3676,
      longitude: 4.9041,
      costIndex: 7.5,
      popularity: 88,
      imageUrl: 'https://images.unsplash.com/photo-1512470876302-972faa2aa9a4?auto=format&fit=crop&w=800&q=80',
      description: '17th-century Golden Age canals, world-class cycling culture, Van Gogh art heritage, and vibrant canal-side cafes.',
    },
    {
      name: 'Jaipur',
      country: 'India',
      region: 'Rajasthan, India',
      latitude: 26.9124,
      longitude: 75.7873,
      costIndex: 3.0,
      popularity: 86,
      imageUrl: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80',
      description: 'The Pink City of Rajasthan, famous for opulent hilltop forts, intricately carved royal palaces, and vibrant textile bazaars.',
    },
    {
      name: 'Udaipur',
      country: 'India',
      region: 'Rajasthan, India',
      latitude: 24.5854,
      longitude: 73.7125,
      costIndex: 3.4,
      popularity: 84,
      imageUrl: 'https://images.unsplash.com/photo-1615836245337-f5b9b2303f10?auto=format&fit=crop&w=800&q=80',
      description: 'City of Lakes — romantic shimmering waters, white marble island palaces, Aravalli hills, and golden-hour sunset boat rides.',
    },
    {
      name: 'Goa',
      country: 'India',
      region: 'Western India',
      latitude: 15.2993,
      longitude: 74.1240,
      costIndex: 3.8,
      popularity: 95,
      imageUrl: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80',
      description: 'Tropical coastline of sun-drenched beaches, Portuguese colonial architecture, beach shacks, spice plantations, and nightlife.',
    },
    {
      name: 'Mumbai',
      country: 'India',
      region: 'Maharashtra, India',
      latitude: 19.0760,
      longitude: 72.8777,
      costIndex: 3.6,
      popularity: 91,
      imageUrl: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=800&q=80',
      description: 'Maximum City — colonial Victorian landmarks, Marine Drive promenade, Bollywood energy, and an unbeatable street food culture.',
    },
    {
      name: 'Dubai',
      country: 'UAE',
      region: 'Middle East',
      latitude: 25.2048,
      longitude: 55.2708,
      costIndex: 8.0,
      popularity: 93,
      imageUrl: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80',
      description: 'Architectural marvels including Burj Khalifa, luxury mega-malls, desert dune safaris, and pristine Persian Gulf beaches.',
    },
    {
      name: 'Singapore',
      country: 'Singapore',
      region: 'Southeast Asia',
      latitude: 1.3521,
      longitude: 103.8198,
      costIndex: 7.0,
      popularity: 90,
      imageUrl: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=800&q=80',
      description: 'The Garden City — futuristic Supertree groves at Gardens by the Bay, Michelin-starred hawker food, and marina skyline.',
    },
    {
      name: 'Bali',
      country: 'Indonesia',
      region: 'Southeast Asia',
      latitude: -8.3405,
      longitude: 115.0920,
      costIndex: 2.8,
      popularity: 92,
      imageUrl: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80',
      description: 'Island of the Gods — emerald tiered rice terraces in Ubud, volcanic peaks, sacred cliffside sea temples, and world-class surf.',
    },
    {
      name: 'Rome',
      country: 'Italy',
      region: 'Europe',
      latitude: 41.9028,
      longitude: 12.4964,
      costIndex: 7.2,
      popularity: 92,
      imageUrl: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=800&q=80',
      description: 'The Eternal City — nearly 3,000 years of globally influential art, architecture, Colosseum ruins, Vatican City, and authentic pasta.',
    },
    {
      name: 'Barcelona',
      country: 'Spain',
      region: 'Europe',
      latitude: 41.3851,
      longitude: 2.1734,
      costIndex: 6.8,
      popularity: 88,
      imageUrl: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?auto=format&fit=crop&w=800&q=80',
      description: 'Catalan capital famous for Antoni Gaudí\'s surreal architecture (Sagrada Família), Mediterranean beachfront, and vibrant tapas bars.',
    },
    {
      name: 'New York',
      country: 'USA',
      region: 'North America',
      latitude: 40.7128,
      longitude: -74.0060,
      costIndex: 9.5,
      popularity: 99,
      imageUrl: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=800&q=80',
      description: 'The city that never sleeps — Central Park strolls, Broadway theaters, world-class art at MoMA/Met, and iconic skyline views.',
    },
    {
      name: 'Ahmedabad',
      country: 'India',
      region: 'Gujarat, India',
      latitude: 23.0225,
      longitude: 72.5714,
      costIndex: 2.5,
      popularity: 82,
      imageUrl: 'https://images.unsplash.com/photo-1588096344356-9b517726c04f?auto=format&fit=crop&w=800&q=80',
      description: 'UNESCO World Heritage city famous for Pols, Adalaj Stepwell, Sabarmati Ashram, night food market at Manek Chowk, and textile heritage.',
    }
  ];

  const cityMap = {};
  for (const c of citiesData) {
    const created = await prisma.city.create({ data: c });
    cityMap[c.name] = created;
  }
  console.log(`🏙️ Seeded ${Object.keys(cityMap).length} cities.`);

  // ==================== 2. SEED ACTIVITIES ====================
  const activitiesList = [
    // Tokyo
    { cityName: 'Tokyo', name: 'Shibuya Crossing & Hachiko Statue', category: 'SIGHTSEEING', estimatedCost: 0, duration: 45, locationName: 'Shibuya, Tokyo', description: 'Experience the world\'s busiest pedestrian intersection and pay tribute to the loyal dog Hachiko.' },
    { cityName: 'Tokyo', name: 'Senso-ji Temple & Nakamise-dori', category: 'CULTURE', estimatedCost: 500, duration: 120, locationName: 'Asakusa, Tokyo', description: 'Tokyo\'s oldest ancient Buddhist temple, approached via a vibrant historic street with traditional souvenirs and snacks.' },
    { cityName: 'Tokyo', name: 'Tokyo Skytree Observation Deck', category: 'SIGHTSEEING', estimatedCost: 2200, duration: 90, locationName: 'Sumida, Tokyo', description: 'Breathtaking 360-degree panoramic skyline vistas across the Tokyo metropolis from 450m above ground.' },
    { cityName: 'Tokyo', name: 'Tsukiji Outer Market Food Tour', category: 'FOOD', estimatedCost: 2800, duration: 120, locationName: 'Tsukiji, Tokyo', description: 'Sample ultra-fresh sashimi, wagyu skewers, tamagoyaki omelets, and matcha delicacies from historic market stalls.' },
    { cityName: 'Tokyo', name: 'teamLab Planets Digital Art Immersion', category: 'ENTERTAINMENT', estimatedCost: 3500, duration: 150, locationName: 'Toyosu, Tokyo', description: 'Walk barefoot through mesmerizing body-immersive light, water, and infinite mirror digital installations.' },
    { cityName: 'Tokyo', name: 'Akihabara Tech & Anime Exploration', category: 'SHOPPING', estimatedCost: 1000, duration: 180, locationName: 'Akihabara, Tokyo', description: 'Browse multi-story electronics department stores, retro gaming shops, and manga collector boutiques.' },
    { cityName: 'Tokyo', name: 'Shinjuku Omoide Yokocho Ramen & Yakitori', category: 'FOOD', estimatedCost: 1800, duration: 90, locationName: 'Shinjuku, Tokyo', description: 'Atmospheric post-war narrow lantern-lit alleyway packed with intimate yakitori counters and authentic broth.' },

    // Kyoto
    { cityName: 'Kyoto', name: 'Fushimi Inari Taisha Thousand Torii Gates', category: 'CULTURE', estimatedCost: 0, duration: 180, locationName: 'Fushimi, Kyoto', description: 'Hike through thousands of vermilion shrine gates winding up the sacred Mount Inari forest.' },
    { cityName: 'Kyoto', name: 'Kinkaku-ji (The Golden Pavilion)', category: 'HISTORY', estimatedCost: 500, duration: 75, locationName: 'Kita-ku, Kyoto', description: 'Iconic Zen temple whose top two floors are completely covered in gleaming pure gold leaf over a reflecting pond.' },
    { cityName: 'Kyoto', name: 'Arashiyama Bamboo Grove & Monkey Park', category: 'NATURE', estimatedCost: 700, duration: 150, locationName: 'Arashiyama, Kyoto', description: 'Walk through soaring green stalks swaying in the breeze, followed by scenic views across Kyoto.' },
    { cityName: 'Kyoto', name: 'Gion Historic Geisha District Evening Walk', category: 'CULTURE', estimatedCost: 0, duration: 90, locationName: 'Gion, Kyoto', description: 'Preserved Edo-period wooden tea houses, lantern-lit stone lanes, and glimpses of geiko and maiko.' },
    { cityName: 'Kyoto', name: 'Nishiki Market Culinary Walking Feast', category: 'FOOD', estimatedCost: 1600, duration: 90, locationName: 'Nakagyo-ku, Kyoto', description: 'Known as Kyoto\'s Kitchen, five blocks packed with 100+ stalls offering skewered seafood, pickles, and sweets.' },

    // Paris
    { cityName: 'Paris', name: 'Eiffel Tower Summit & Trocadéro View', category: 'SIGHTSEEING', estimatedCost: 2800, duration: 150, locationName: 'Champ de Mars, Paris', description: 'Ascend to the top summit of Gustave Eiffel\'s masterpiece for unmatched views across Paris.' },
    { cityName: 'Paris', name: 'Louvre Museum Masterpieces Tour', category: 'CULTURE', estimatedCost: 2000, duration: 240, locationName: '1st Arrondissement, Paris', description: 'Explore the world\'s largest art museum housing the Mona Lisa, Venus de Milo, and Winged Victory.' },
    { cityName: 'Paris', name: 'Seine River Sunset Glass Boat Cruise', category: 'SIGHTSEEING', estimatedCost: 1600, duration: 75, locationName: 'Pont Neuf, Paris', description: 'Glide past Notre-Dame Cathedral, the Musée d\'Orsay, and illuminated bridges as dusk falls over the city.' },
    { cityName: 'Paris', name: 'Montmartre & Sacré-Cœur Artist Quarter', category: 'HISTORY', estimatedCost: 0, duration: 120, locationName: '18th Arrondissement, Paris', description: 'Cobblestone village streets where Picasso and Renoir painted, topped by the white dome of Sacré-Cœur.' },
    { cityName: 'Paris', name: 'Le Marais Boulangerie & Pastry Crawl', category: 'FOOD', estimatedCost: 1200, duration: 90, locationName: '4th Arrondissement, Paris', description: 'Taste freshly baked croissants, pistachio éclairs, macarons, and artisanal cheese in a chic historic quarter.' },
    { cityName: 'Paris', name: 'Palace of Versailles Grand Apartments & Gardens', category: 'HISTORY', estimatedCost: 2600, duration: 300, locationName: 'Versailles, Île-de-France', description: 'Opulent Hall of Mirrors, royal bedchambers, musical fountains, and sprawling sculpted garden groves.' },

    // London
    { cityName: 'London', name: 'Tower of London & Crown Jewels', category: 'HISTORY', estimatedCost: 3200, duration: 180, locationName: 'Tower Hill, London', description: 'Near-thousand-year-old royal fortress, former prison, and home to the ceremonial Crown Jewels.' },
    { cityName: 'London', name: 'British Museum World Antiquities', category: 'CULTURE', estimatedCost: 0, duration: 180, locationName: 'Bloomsbury, London', description: 'Free entry to examine the Rosetta Stone, Parthenon sculptures, Egyptian mummies, and the Great Court.' },
    { cityName: 'London', name: 'Borough Market Street Food Explorer', category: 'FOOD', estimatedCost: 1500, duration: 90, locationName: 'Southwark, London', description: 'London\'s premier artisanal food market with gourmet scotch eggs, raclette cheese, oysters, and donuts.' },
    { cityName: 'London', name: 'West End Musical Theatre Night', category: 'ENTERTAINMENT', estimatedCost: 5500, duration: 180, locationName: 'Covent Garden, London', description: 'Top-tier world theater productions, award-winning musicals, and vibrant Soho dining.' },

    // Jaipur
    { cityName: 'Jaipur', name: 'Amber Fort Elephant Pathway & Sheesh Mahal', category: 'HISTORY', estimatedCost: 600, duration: 210, locationName: 'Amer, Jaipur', description: 'Magnificent Rajput fortress with mirror mosaic palaces, courtyards, and panoramic Maota Lake reflections.' },
    { cityName: 'Jaipur', name: 'Hawa Mahal (Palace of Winds) & Pink City Walk', category: 'SIGHTSEEING', estimatedCost: 200, duration: 60, locationName: 'Badi Choupad, Jaipur', description: 'Iconic five-story pink honeycomb facade built with 953 jharokhas for royal ladies to view street processions.' },
    { cityName: 'Jaipur', name: 'Johari & Bapu Bazaar Block Print Shopping', category: 'SHOPPING', estimatedCost: 1500, duration: 150, locationName: 'Old City, Jaipur', description: 'Browse handmade Sanganeri bedsheets, Jaipuri quilts, silver jewelry, and vibrant juttis.' },
    { cityName: 'Jaipur', name: 'LMB Traditional Rajasthani Thali Experience', category: 'FOOD', estimatedCost: 1100, duration: 75, locationName: 'Johari Bazaar, Jaipur', description: 'Authentic royal Rajasthani banquet featuring Dal Baati Churma, Gatte ki Sabzi, and hot Ghevar.' },
    { cityName: 'Jaipur', name: 'Nahargarh Fort Sunset Panorama', category: 'ADVENTURE', estimatedCost: 300, duration: 120, locationName: 'Aravalli Hills, Jaipur', description: 'Watch the sun sink behind the Pink City skyline from the scenic ramparts of Nahargarh.' },

    // Udaipur
    { cityName: 'Udaipur', name: 'City Palace Complex & Crystal Gallery', category: 'HISTORY', estimatedCost: 500, duration: 180, locationName: 'Lake Pichola, Udaipur', description: 'Rajasthan\'s largest palace complex combining Rajasthani and Mughal architectural styles over Lake Pichola.' },
    { cityName: 'Udaipur', name: 'Lake Pichola Sunset Boat Cruise to Jag Mandir', category: 'NATURE', estimatedCost: 900, duration: 75, locationName: 'Rameshwar Ghat, Udaipur', description: 'Private boat tour drifting past the floating Lake Palace with golden light reflecting on mountain waters.' },
    { cityName: 'Udaipur', name: 'Bagore Ki Haveli Folk Dance & Puppet Show', category: 'CULTURE', estimatedCost: 250, duration: 90, locationName: 'Gangaur Ghat, Udaipur', description: 'Vibrant evening Dharohar performance featuring traditional Chari, Ghoomar, and fire acrobatics.' },
    { cityName: 'Udaipur', name: 'Rooftop Candlelight Dinner Overlooking Pichola', category: 'FOOD', estimatedCost: 1800, duration: 120, locationName: 'Lal Ghat, Udaipur', description: 'Fine dining with panoramic lake views, illuminated palaces, and signature Mewari dishes.' },

    // Goa
    { cityName: 'Goa', name: 'Palolem Beach Kayaking & Dolphin Spotting', category: 'ADVENTURE', estimatedCost: 1200, duration: 120, locationName: 'Canacona, South Goa', description: 'Paddle through crystal calm waters around Monkey Island and spot wild coastal dolphins at dawn.' },
    { cityName: 'Goa', name: 'Fontainhas Latin Quarter Heritage Walk', category: 'CULTURE', estimatedCost: 0, duration: 90, locationName: 'Panaji, Goa', description: 'Wander through vibrant pastel Portuguese houses with terracotta roofs and wooden balconies.' },
    { cityName: 'Goa', name: 'Anjuna Beach Sunset Shack & Seafood BBQ', category: 'FOOD', estimatedCost: 1400, duration: 150, locationName: 'Anjuna, North Goa', description: 'Savor fresh grilled kingfish, Goan prawn curry, and chilled beverages with sand beneath your feet.' },
    { cityName: 'Goa', name: 'Dudhsagar Waterfalls Jungle Safari Trek', category: 'NATURE', estimatedCost: 2200, duration: 300, locationName: 'Bhagwan Mahaveer Sanctuary, Goa', description: 'Four-tiered sea-of-milk cascading waterfall hidden inside lush Western Ghats jungles.' },

    // Dubai
    { cityName: 'Dubai', name: 'Burj Khalifa At The Top (124th & 125th Floor)', category: 'SIGHTSEEING', estimatedCost: 3800, duration: 120, locationName: 'Downtown Dubai', description: 'Look down from the world\'s tallest architectural structure across the desert skyline and fountain lake.' },
    { cityName: 'Dubai', name: 'Desert Dune Bashing & BBQ Bedouin Camp', category: 'ADVENTURE', estimatedCost: 4500, duration: 360, locationName: 'Lahbab Desert, Dubai', description: 'Exciting 4x4 red dune roller coaster, sandboarding, camel rides, and Tanoura dance under starlit dunes.' },
    { cityName: 'Dubai', name: 'Dubai Mall & Dubai Fountain Show', category: 'SHOPPING', estimatedCost: 0, duration: 150, locationName: 'Downtown Dubai', description: 'World\'s largest entertainment mall with massive indoor aquarium, choreographed water fountains, and luxury brands.' },
    { cityName: 'Dubai', name: 'Old Dubai Abra Boat Ride & Gold Souk', category: 'CULTURE', estimatedCost: 400, duration: 120, locationName: 'Deira & Bur Dubai', description: 'Cross Dubai Creek on a traditional wooden abra boat and bargain in the glittering gold & spice souks.' },

    // Singapore
    { cityName: 'Singapore', name: 'Gardens by the Bay & Cloud Forest Dome', category: 'NATURE', estimatedCost: 2400, duration: 180, locationName: 'Marina Bay, Singapore', description: 'Marvel at the world\'s largest glass greenhouse, 35m indoor waterfall, and illuminated Supertree light show.' },
    { cityName: 'Singapore', name: 'Chinatown & Maxwell Hawker Centre Feasting', category: 'FOOD', estimatedCost: 800, duration: 90, locationName: 'Chinatown, Singapore', description: 'Taste Tian Tian Hainanese Chicken Rice, char kway teow, and laksa in Singapore\'s iconic food institution.' },
    { cityName: 'Singapore', name: 'Marina Bay Sands SkyPark Observation Deck', category: 'SIGHTSEEING', estimatedCost: 2000, duration: 90, locationName: 'Bayfront, Singapore', description: 'Catch unobstructed views of the city skyline, Singapore Strait shipping lanes, and Gardens by the Bay.' },

    // Bali
    { cityName: 'Bali', name: 'Tegallalang Rice Terrace & Jungle Giant Swing', category: 'NATURE', estimatedCost: 1500, duration: 150, locationName: 'Ubud, Bali', description: 'Walk through dramatic stepped green paddy fields and soar over the lush jungle canopy on a giant swing.' },
    { cityName: 'Bali', name: 'Uluwatu Cliff Temple & Sunset Kecak Fire Dance', category: 'CULTURE', estimatedCost: 1200, duration: 150, locationName: 'Uluwatu, Bali', description: 'Ancient temple perched 70m high on ocean cliffs with a hypnotic choral chant and fire dance at sunset.' },
    { cityName: 'Bali', name: 'Mount Batur Sunrise Volcano Trek', category: 'ADVENTURE', estimatedCost: 2800, duration: 360, locationName: 'Kintamani, Bali', description: 'Early morning hike to summit an active volcanic crater for sunrise above the clouds and volcanic steam eggs.' },
    { cityName: 'Bali', name: 'Canggu Surf Lesson & Beach Club Sunset', category: 'ADVENTURE', estimatedCost: 2200, duration: 180, locationName: 'Canggu, Bali', description: 'Catch your first waves on gentle rolling surf breaks, followed by sunset tunes at an eco beach club.' },

    // Ahmedabad
    { cityName: 'Ahmedabad', name: 'Adalaj Stepwell (Vav) Architectural Wonder', category: 'HISTORY', estimatedCost: 50, duration: 90, locationName: 'Gandhinagar / Ahmedabad', description: 'Intricately carved 5-story underground stepwell built in 1498 with Indo-Islamic floral carvings and cool galleries.' },
    { cityName: 'Ahmedabad', name: 'Sabarmati Gandhi Ashram & Peace Museum', category: 'CULTURE', estimatedCost: 0, duration: 120, locationName: 'Ashram Road, Ahmedabad', description: 'Walk through the tranquil headquarters of Mahatma Gandhi\'s non-violent freedom movement and Dandi March.' },
    { cityName: 'Ahmedabad', name: 'Manek Chowk Midnight Street Food Bazaar', category: 'FOOD', estimatedCost: 600, duration: 120, locationName: 'Old City, Ahmedabad', description: 'Jewelry market by day that transforms by midnight into a bustling street food haven with chocolate cheese sandwiches, Gwalior dosa, and Kulfi.' },
    { cityName: 'Ahmedabad', name: 'Sabarmati Riverfront Promenade Walk', category: 'NATURE', estimatedCost: 50, duration: 60, locationName: 'Riverfront, Ahmedabad', description: 'Sunset stroll along the landscaped waterfront parks, flower gardens, and pedal boat attractions.' }
  ];

  let actCount = 0;
  for (const act of activitiesList) {
    const city = cityMap[act.cityName];
    if (city) {
      await prisma.activity.create({
        data: {
          cityId: city.id,
          name: act.name,
          category: act.category,
          estimatedCost: act.estimatedCost,
          duration: act.duration,
          locationName: act.locationName,
          description: act.description,
          imageUrl: city.imageUrl,
        }
      });
      actCount++;
    }
  }
  console.log(`🎯 Seeded ${actCount} detailed activities.`);

  // ==================== 3. SEED USERS ====================
  const demoHash = await bcrypt.hash('Demo@1234', 12);
  const adminHash = await bcrypt.hash('Admin@1234', 12);
  const passHash = await bcrypt.hash('password123', 12);

  const userDemo = await prisma.user.create({
    data: {
      firstName: 'Demo',
      lastName: 'Traveler',
      email: 'demo@globetrotter.app',
      passwordHash: demoHash,
      phone: '+91 98765 43210',
      city: 'Bangalore',
      country: 'India',
      profilePhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      bio: 'Passionate solo backpacker & shutterbug. 24 countries and counting!'
    }
  });

  const userMaster = await prisma.user.create({
    data: {
      firstName: 'MasterAgent',
      lastName: 'Explorer',
      email: 'masteragent@example.com',
      passwordHash: passHash,
      phone: '+91 90000 00000',
      city: 'Ahmedabad',
      country: 'India',
      profilePhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
      bio: 'Software engineer building modern travel products for global adventurers.'
    }
  });

  const userAdmin = await prisma.user.create({
    data: {
      firstName: 'Admin',
      lastName: 'Platform',
      email: 'admin@globetrotter.app',
      passwordHash: adminHash,
      phone: '+91 99999 88888',
      city: 'Mumbai',
      country: 'India',
      profilePhoto: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
      bio: 'GlobeTrotter platform administrator.'
    }
  });

  console.log('👤 Seeded 3 primary users (Demo, MasterAgent, Admin).');

  // ==================== 4. SEED SAMPLE TRIPS ====================
  // Helper to fetch activities for a city
  const getCityActs = async (cityId) => {
    return prisma.activity.findMany({ where: { cityId } });
  };

  // Trip 1: Japan Discovery — 7 Days (Demo User)
  const tokyoActs = await getCityActs(cityMap['Tokyo'].id);
  const kyotoActs = await getCityActs(cityMap['Kyoto'].id);

  const tripJapan = await prisma.trip.create({
    data: {
      userId: userDemo.id,
      name: 'Japan Discovery — 7 Days',
      description: 'An unforgettable 7-day adventure through the neon futuristic alleys of Tokyo and the timeless sacred temples of Kyoto.',
      startDate: new Date('2026-09-10'),
      endDate: new Date('2026-09-17'),
      coverPhoto: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80',
      isPublic: true,
      shareToken: 'japan-discovery-7days-public-2026',
      totalBudget: 85000,
    }
  });

  // Stop 1: Tokyo
  const stopTokyo = await prisma.stop.create({
    data: {
      tripId: tripJapan.id,
      cityId: cityMap['Tokyo'].id,
      startDate: new Date('2026-09-10'),
      endDate: new Date('2026-09-14'),
      position: 0,
      notes: 'Stay near Shinjuku Station for convenient JR Yamanote Line connections.'
    }
  });

  if (tokyoActs.length >= 3) {
    await prisma.tripActivity.createMany({
      data: [
        {
          stopId: stopTokyo.id,
          activityId: tokyoActs[0].id,
          date: new Date('2026-09-10'),
          startTime: new Date('1970-01-01T10:00:00Z'),
          position: 0,
          notes: 'Best photography from Tsutaya Starbucks upstairs.'
        },
        {
          stopId: stopTokyo.id,
          activityId: tokyoActs[1].id,
          date: new Date('2026-09-11'),
          startTime: new Date('1970-01-01T09:30:00Z'),
          position: 1,
          notes: 'Grab fresh melonpan on Nakamise street.'
        },
        {
          stopId: stopTokyo.id,
          activityId: tokyoActs[3].id,
          date: new Date('2026-09-12'),
          startTime: new Date('1970-01-01T08:00:00Z'),
          position: 2,
          notes: 'Arrive early before morning crowds.'
        },
        {
          stopId: stopTokyo.id,
          activityId: tokyoActs[4].id,
          date: new Date('2026-09-13'),
          startTime: new Date('1970-01-01T15:00:00Z'),
          position: 3,
          notes: 'Wear comfortable shorts/pants that roll up easily.'
        }
      ]
    });
  }

  // Stop 2: Kyoto
  const stopKyoto = await prisma.stop.create({
    data: {
      tripId: tripJapan.id,
      cityId: cityMap['Kyoto'].id,
      startDate: new Date('2026-09-14'),
      endDate: new Date('2026-09-17'),
      position: 1,
      notes: 'Shinkansen Bullet Train from Tokyo to Kyoto (approx 2h 15m).'
    }
  });

  if (kyotoActs.length >= 3) {
    await prisma.tripActivity.createMany({
      data: [
        {
          stopId: stopKyoto.id,
          activityId: kyotoActs[0].id,
          date: new Date('2026-09-14'),
          startTime: new Date('1970-01-01T07:00:00Z'),
          position: 0,
          notes: 'Early morning hike is empty and serene.'
        },
        {
          stopId: stopKyoto.id,
          activityId: kyotoActs[1].id,
          date: new Date('2026-09-15'),
          startTime: new Date('1970-01-01T10:00:00Z'),
          position: 1,
          notes: 'Sunny morning reflections are spectacular.'
        },
        {
          stopId: stopKyoto.id,
          activityId: kyotoActs[2].id,
          date: new Date('2026-09-16'),
          startTime: new Date('1970-01-01T13:30:00Z'),
          position: 2,
          notes: 'Combine with Tenryu-ji Zen temple gardens.'
        }
      ]
    });
  }

  // Expenses for Trip 1
  await prisma.expense.createMany({
    data: [
      { tripId: tripJapan.id, stopId: stopTokyo.id, category: 'TRANSPORT', amount: 18500, description: '7-Day JR Whole Japan Rail Pass', date: new Date('2026-09-10') },
      { tripId: tripJapan.id, stopId: stopTokyo.id, category: 'ACCOMMODATION', amount: 24000, description: '4 Nights Shinjuku Boutique Hotel', date: new Date('2026-09-10') },
      { tripId: tripJapan.id, stopId: stopKyoto.id, category: 'ACCOMMODATION', amount: 18000, description: '3 Nights Traditional Kyoto Ryokan', date: new Date('2026-09-14') },
      { tripId: tripJapan.id, stopId: stopTokyo.id, category: 'FOOD', amount: 5500, description: 'Tsukiji Market & Ramen dinners', date: new Date('2026-09-12') },
      { tripId: tripJapan.id, stopId: stopKyoto.id, category: 'ACTIVITIES', amount: 3500, description: 'teamLab & Shrine entry tickets', date: new Date('2026-09-15') }
    ]
  });

  // Trip 2: Rajasthan Royals Route (MasterAgent User)
  const jaipurActs = await getCityActs(cityMap['Jaipur'].id);
  const udaipurActs = await getCityActs(cityMap['Udaipur'].id);

  const tripRajasthan = await prisma.trip.create({
    data: {
      userId: userMaster.id,
      name: 'Rajasthan Royals Heritage Route',
      description: 'Explore royal palaces, hilltop fortresses, colorful desert bazaars, and romantic lake sunsets across Jaipur & Udaipur.',
      startDate: new Date('2026-10-05'),
      endDate: new Date('2026-10-12'),
      coverPhoto: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=80',
      isPublic: true,
      shareToken: 'rajasthan-royals-route-2026',
      totalBudget: 48000,
    }
  });

  const stopJaipur = await prisma.stop.create({
    data: {
      tripId: tripRajasthan.id,
      cityId: cityMap['Jaipur'].id,
      startDate: new Date('2026-10-05'),
      endDate: new Date('2026-10-08'),
      position: 0,
      notes: 'Heritage haveli stay inside the old city.'
    }
  });

  if (jaipurActs.length >= 3) {
    await prisma.tripActivity.createMany({
      data: [
        { stopId: stopJaipur.id, activityId: jaipurActs[0].id, date: new Date('2026-10-05'), startTime: new Date('1970-01-01T09:00:00Z'), position: 0 },
        { stopId: stopJaipur.id, activityId: jaipurActs[1].id, date: new Date('2026-10-06'), startTime: new Date('1970-01-01T11:00:00Z'), position: 1 },
        { stopId: stopJaipur.id, activityId: jaipurActs[2].id, date: new Date('2026-10-07'), startTime: new Date('1970-01-01T16:00:00Z'), position: 2 }
      ]
    });
  }

  const stopUdaipur = await prisma.stop.create({
    data: {
      tripId: tripRajasthan.id,
      cityId: cityMap['Udaipur'].id,
      startDate: new Date('2026-10-08'),
      endDate: new Date('2026-10-12'),
      position: 1,
      notes: 'Private taxi drive from Jaipur via Chittorgarh Fort.'
    }
  });

  if (udaipurActs.length >= 3) {
    await prisma.tripActivity.createMany({
      data: [
        { stopId: stopUdaipur.id, activityId: udaipurActs[0].id, date: new Date('2026-10-08'), startTime: new Date('1970-01-01T10:00:00Z'), position: 0 },
        { stopId: stopUdaipur.id, activityId: udaipurActs[1].id, date: new Date('2026-10-09'), startTime: new Date('1970-01-01T17:00:00Z'), position: 1 },
        { stopId: stopUdaipur.id, activityId: udaipurActs[2].id, date: new Date('2026-10-10'), startTime: new Date('1970-01-01T19:00:00Z'), position: 2 }
      ]
    });
  }

  await prisma.expense.createMany({
    data: [
      { tripId: tripRajasthan.id, stopId: stopJaipur.id, category: 'TRANSPORT', amount: 4500, description: 'Intercity AC train & cab', date: new Date('2026-10-05') },
      { tripId: tripRajasthan.id, stopId: stopJaipur.id, category: 'ACCOMMODATION', amount: 10500, description: '3 nights Jaipur Haveli', date: new Date('2026-10-05') },
      { tripId: tripRajasthan.id, stopId: stopUdaipur.id, category: 'ACCOMMODATION', amount: 14000, description: '4 nights Lake View Heritage Resort', date: new Date('2026-10-08') },
      { tripId: tripRajasthan.id, stopId: stopUdaipur.id, category: 'FOOD', amount: 4800, description: 'Rooftop dinners & LMB Thali', date: new Date('2026-10-09') }
    ]
  });

  // Trip 3: Goa Coastal Reset (MasterAgent)
  const goaActs = await getCityActs(cityMap['Goa'].id);
  const tripGoa = await prisma.trip.create({
    data: {
      userId: userMaster.id,
      name: 'Goa Coastal Sun & Shacks',
      description: 'Tropical getaway with beach shacks, Portuguese quarters, paddleboarding, and coastal sunset feasts.',
      startDate: new Date('2026-11-12'),
      endDate: new Date('2026-11-16'),
      coverPhoto: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80',
      isPublic: false,
      totalBudget: 28000,
    }
  });

  const stopGoa = await prisma.stop.create({
    data: {
      tripId: tripGoa.id,
      cityId: cityMap['Goa'].id,
      startDate: new Date('2026-11-12'),
      endDate: new Date('2026-11-16'),
      position: 0,
      notes: 'Beach resort in Palolem South Goa.'
    }
  });

  if (goaActs.length >= 3) {
    await prisma.tripActivity.createMany({
      data: [
        { stopId: stopGoa.id, activityId: goaActs[0].id, date: new Date('2026-11-12'), startTime: new Date('1970-01-01T08:00:00Z'), position: 0 },
        { stopId: stopGoa.id, activityId: goaActs[1].id, date: new Date('2026-11-13'), startTime: new Date('1970-01-01T15:30:00Z'), position: 1 },
        { stopId: stopGoa.id, activityId: goaActs[2].id, date: new Date('2026-11-14'), startTime: new Date('1970-01-01T18:00:00Z'), position: 2 }
      ]
    });
  }

  await prisma.expense.createMany({
    data: [
      { tripId: tripGoa.id, stopId: stopGoa.id, category: 'ACCOMMODATION', amount: 12000, description: '4 Nights Beachfront Cottage', date: new Date('2026-11-12') },
      { tripId: tripGoa.id, stopId: stopGoa.id, category: 'TRANSPORT', amount: 3500, description: 'Scooter rental & airport transfers', date: new Date('2026-11-12') },
      { tripId: tripGoa.id, stopId: stopGoa.id, category: 'FOOD', amount: 5000, description: 'Seafood feasts & beach cafes', date: new Date('2026-11-13') }
    ]
  });

  // Trip 4: European Highlights (Paris & Amsterdam) - Demo User
  const parisActs = await getCityActs(cityMap['Paris'].id);
  const tripParis = await prisma.trip.create({
    data: {
      userId: userDemo.id,
      name: 'Paris Art & Seine Magic',
      description: 'Iconic art museums, Eiffel tower summit, Seine river cruises, and charming Montmartre cafes.',
      startDate: new Date('2026-05-10'),
      endDate: new Date('2026-05-15'),
      coverPhoto: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80',
      isPublic: true,
      shareToken: 'paris-seine-magic-2026',
      totalBudget: 95000,
    }
  });

  const stopParis = await prisma.stop.create({
    data: {
      tripId: tripParis.id,
      cityId: cityMap['Paris'].id,
      startDate: new Date('2026-05-10'),
      endDate: new Date('2026-05-15'),
      position: 0,
      notes: 'Boutique hotel near Saint-Germain-des-Prés.'
    }
  });

  if (parisActs.length >= 4) {
    await prisma.tripActivity.createMany({
      data: [
        { stopId: stopParis.id, activityId: parisActs[0].id, date: new Date('2026-05-10'), startTime: new Date('1970-01-01T11:00:00Z'), position: 0 },
        { stopId: stopParis.id, activityId: parisActs[1].id, date: new Date('2026-05-11'), startTime: new Date('1970-01-01T09:30:00Z'), position: 1 },
        { stopId: stopParis.id, activityId: parisActs[2].id, date: new Date('2026-05-12'), startTime: new Date('1970-01-01T18:30:00Z'), position: 2 },
        { stopId: stopParis.id, activityId: parisActs[3].id, date: new Date('2026-05-13'), startTime: new Date('1970-01-01T14:00:00Z'), position: 3 }
      ]
    });
  }

  await prisma.expense.createMany({
    data: [
      { tripId: tripParis.id, stopId: stopParis.id, category: 'ACCOMMODATION', amount: 42000, description: '5 nights Paris hotel', date: new Date('2026-05-10') },
      { tripId: tripParis.id, stopId: stopParis.id, category: 'FOOD', amount: 16000, description: 'Bistros, bakeries, and wine', date: new Date('2026-05-11') },
      { tripId: tripParis.id, stopId: stopParis.id, category: 'ACTIVITIES', amount: 8500, description: 'Museum pass and Eiffel tickets', date: new Date('2026-05-12') }
    ]
  });

  console.log('✈️ Seeded 4 complete multi-city trips with day-by-day activities, stops, expenses, and public share tokens!');
  console.log('✅ Database seeding finished successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
