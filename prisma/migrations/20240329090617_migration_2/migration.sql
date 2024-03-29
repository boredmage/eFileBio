/*
  Warnings:

  - Added the required column `isForeignPooledInvestmentVehicle` to the `FormStep2` table without a default value. This is not possible if the table is not empty.
  - Added the required column `isRequestingId` to the `FormStep2` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "FormStep2" ADD COLUMN     "isForeignPooledInvestmentVehicle" BOOLEAN NOT NULL,
ADD COLUMN     "isRequestingId" BOOLEAN NOT NULL;
