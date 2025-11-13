import { prisma } from "../lib/prisma";

async function main() {
  // Use a test user ID for seeding
  const testUserId = "test-user-id";

  await prisma.car.createMany({
    data: [
      {
        registrationNumber: "AB12 CDE",
        make: "Toyota",
        model: "Corolla",
        year: 2018,
        lastServiceDate: new Date("2024-11-01"),
        nextServiceDue: new Date("2025-05-01"),
        motDueDate: new Date("2025-02-15"),
        insuranceRenewal: new Date("2025-03-01"),
        taxRenewal: new Date("2025-04-01"),
        userId: testUserId
      },
      {
        registrationNumber: "XY34 ZZZ",
        make: "Honda",
        model: "Civic",
        year: 2020,
        lastServiceDate: new Date("2025-06-01"),
        nextServiceDue: new Date("2025-12-01"),
        motDueDate: new Date("2026-01-20"),
        insuranceRenewal: new Date("2025-11-15"),
        taxRenewal: new Date("2025-12-31"),
        userId: testUserId
      }
    ],
    skipDuplicates: true
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

