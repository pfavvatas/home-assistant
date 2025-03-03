-- CreateTable
CREATE TABLE "ElectricityRecord" (
    "id" TEXT NOT NULL,
    "homeId" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "kwhUsed" DOUBLE PRECISION NOT NULL,
    "cost" DOUBLE PRECISION NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ElectricityRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SharedElectricityBill" (
    "id" TEXT NOT NULL,
    "buildingName" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "totalKwh" DOUBLE PRECISION NOT NULL,
    "totalCost" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SharedElectricityBill_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SharedElectricityHomeUsage" (
    "id" TEXT NOT NULL,
    "billId" TEXT NOT NULL,
    "homeId" TEXT NOT NULL,
    "kwhUsed" DOUBLE PRECISION NOT NULL,
    "cost" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SharedElectricityHomeUsage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SharedElectricityHomeUsage_billId_homeId_key" ON "SharedElectricityHomeUsage"("billId", "homeId");

-- AddForeignKey
ALTER TABLE "ElectricityRecord" ADD CONSTRAINT "ElectricityRecord_homeId_fkey" FOREIGN KEY ("homeId") REFERENCES "Home"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SharedElectricityHomeUsage" ADD CONSTRAINT "SharedElectricityHomeUsage_billId_fkey" FOREIGN KEY ("billId") REFERENCES "SharedElectricityBill"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SharedElectricityHomeUsage" ADD CONSTRAINT "SharedElectricityHomeUsage_homeId_fkey" FOREIGN KEY ("homeId") REFERENCES "Home"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
