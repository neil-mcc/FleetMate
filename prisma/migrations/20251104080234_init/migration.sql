-- CreateTable
CREATE TABLE "Car" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "registrationNumber" TEXT NOT NULL,
    "make" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "lastServiceDate" DATETIME,
    "nextServiceDue" DATETIME,
    "motDueDate" DATETIME,
    "insuranceRenewal" DATETIME,
    "taxRenewal" DATETIME
);

-- CreateIndex
CREATE INDEX "Car_registrationNumber_idx" ON "Car"("registrationNumber");
