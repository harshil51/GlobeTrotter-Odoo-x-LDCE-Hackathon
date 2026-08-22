const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // 1. Seed Cities
  const tokyo = await prisma.city.create({
    data: {
      name: 'Tokyo',
      country: 'Japan',
      region: 'East Asia',
      costIndex: 7.8,
      popularity: 96,
      latitude: 35.6762,
      longitude: 139.6503,
    },
  });

  const kyoto = await prisma.city.create({
    data: {
      name: 'Kyoto',
      country: 'Japan',
      region: 'East Asia',
      costIndex: 6.5,
      popularity: 85,
      latitude: 35.0116,
      longitude: 135.7681,
    },
  });

  const paris = await prisma.city.create({
    data: {
      name: 'Paris',
      country: 'France',
      region: 'Europe',
      costIndex: 8.5,
      popularity: 98,
      latitude: 48.8566,
      longitude: 2.3522,
    },
  });

  // 2. Seed Activities for Tokyo
  await prisma.activity.createMany({
    data: [
      { cityId: tokyo.id, name: 'Shibuya Crossing', category: 'SIGHTSEEING', estimatedCost: 0, duration: 30 },
      { cityId: tokyo.id, name: 'Senso-ji Temple', category: 'CULTURE', estimatedCost: 500, duration: 120 },
      { cityId: tokyo.id, name: 'Tokyo Tower', category: 'SIGHTSEEING', estimatedCost: 1800, duration: 90 },
      { cityId: tokyo.id, name: 'Tsukiji Fish Market', category: 'FOOD', estimatedCost: 2500, duration: 120 },
      { cityId: tokyo.id, name: 'Akihabara Electronics', category: 'SHOPPING', estimatedCost: 0, duration: 180 },
    ],
  });

  // 3. Seed Activities for Kyoto
  await prisma.activity.createMany({
    data: [
      { cityId: kyoto.id, name: 'Fushimi Inari Taisha', category: 'CULTURE', estimatedCost: 0, duration: 180 },
      { cityId: kyoto.id, name: 'Kinkaku-ji (Golden Pavilion)', category: 'CULTURE', estimatedCost: 500, duration: 60 },
      { cityId: kyoto.id, name: 'Arashiyama Bamboo Grove', category: 'NATURE', estimatedCost: 0, duration: 120 },
    ],
  });

  // 4. Seed Users
  const passwordHash = await bcrypt.hash('Demo@1234', 12);
  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@globetrotter.app' },
    update: {},
    create: {
      email: 'demo@globetrotter.app',
      passwordHash,
      firstName: 'Demo',
      lastName: 'User',
      city: 'Bangalore',
      country: 'India',
    },
  });

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
