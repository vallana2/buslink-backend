import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const ROUTES = [
  { from: "Musanze", to: "Rubavu", price: 2573 },
  { from: "Rubavu", to: "Musanze", price: 2573 },
  { from: "Rwamagana", to: "Kayonza", price: 634 },
  { from: "Huye", to: "Nyamagabe", price: 1109 },
  { from: "Nyamagabe", to: "Huye", price: 1109 },
  { from: "Muhanga", to: "Huye", price: 3089 },
];

async function main() {
  const agencies = await prisma.agency.findMany({
    where: { isApproved: true },
  });

  if (agencies.length === 0) {
    console.log("No agencies found! Create agencies first.");
    return;
  }

  console.log(`Found ${agencies.length} agencies`);

  for (const agency of agencies) {
    console.log(`\nProcessing agency: ${agency.name}`);

    const bus = await prisma.bus.findFirst({
      where: { agencyId: agency.id },
    });

    if (!bus) {
      console.log(`  No bus found for ${agency.name}, skipping`);
      continue;
    }

    for (const r of ROUTES) {
      const fromStation = await prisma.station.findFirst({
        where: { city: { equals: r.from, mode: "insensitive" } },
      });
      const toStation = await prisma.station.findFirst({
        where: { city: { equals: r.to, mode: "insensitive" } },
      });

      if (!fromStation || !toStation) {
        console.log(`  Skipping ${r.from} -> ${r.to}: station not found`);
        continue;
      }

      let route = await prisma.route.findUnique({
        where: {
          agencyId_fromStationId_toStationId: {
            agencyId: agency.id,
            fromStationId: fromStation.id,
            toStationId: toStation.id,
          },
        },
      });

      if (!route) {
        route = await prisma.route.create({
          data: {
            agencyId: agency.id,
            fromStationId: fromStation.id,
            toStationId: toStation.id,
          },
        });
        console.log(`  Created route: ${r.from} -> ${r.to}`);
      }

      const times = [8, 14];

      for (const hour of times) {
        const departureTime = new Date();
        departureTime.setDate(departureTime.getDate() + 1);
        departureTime.setHours(hour, 0, 0, 0);

        const arrivalTime = new Date(departureTime);
        arrivalTime.setHours(arrivalTime.getHours() + 2);

        await prisma.schedule.create({
          data: {
            routeId: route.id,
            busId: bus.id,
            departureTime,
            arrivalTime,
            price: r.price,
          },
        });

        console.log(`    Schedule at ${hour}:00 - ${r.price} RWF`);
      }
    }
  }

  console.log("\nDone! All agencies now have schedules at official RURA prices.");
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });