-- CreateTable
CREATE TABLE "Car" (
    "id" SERIAL NOT NULL,
    "registrationNumber" TEXT NOT NULL,
    "make" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "lastServiceDate" TIMESTAMP(3),
    "nextServiceDue" TIMESTAMP(3),
    "insuranceRenewal" TIMESTAMP(3),
    "taxRenewal" TIMESTAMP(3),
    "motDueDate" TIMESTAMP(3),

    CONSTRAINT "Car_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Car_registrationNumber_idx" ON "Car"("registrationNumber");

