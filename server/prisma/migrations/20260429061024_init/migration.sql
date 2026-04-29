-- CreateTable
CREATE TABLE "TripPlan" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "destination" TEXT NOT NULL,
    "startDate" TEXT NOT NULL,
    "endDate" TEXT NOT NULL,
    "plan" JSONB NOT NULL,
    "weather" JSONB,

    CONSTRAINT "TripPlan_pkey" PRIMARY KEY ("id")
);
