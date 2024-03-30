/*
  Warnings:

  - You are about to drop the column `filingType` on the `Form` table. All the data in the column will be lost.
  - You are about to drop the `FormStep1` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `FormStep2` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "FillingStatus" AS ENUM ('DRAFT', 'INREVIEW', 'SUBMITTED', 'APPROVED', 'REJECTED');

-- DropForeignKey
ALTER TABLE "FormStep1" DROP CONSTRAINT "FormStep1_formId_fkey";

-- DropForeignKey
ALTER TABLE "FormStep2" DROP CONSTRAINT "FormStep2_formId_fkey";

-- AlterTable
ALTER TABLE "Form" DROP COLUMN "filingType",
ADD COLUMN     "status" "FillingStatus" NOT NULL DEFAULT 'DRAFT';

-- DropTable
DROP TABLE "FormStep1";

-- DropTable
DROP TABLE "FormStep2";

-- CreateTable
CREATE TABLE "FiForm" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "formId" TEXT NOT NULL,
    "fillingType" "FillingType" NOT NULL,
    "legalName" TEXT NOT NULL,
    "taxType" TEXT NOT NULL,
    "taxId" TEXT NOT NULL,
    "taxJurisdiction" TEXT NOT NULL,

    CONSTRAINT "FiForm_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RcForm" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "formId" TEXT NOT NULL,
    "isForeignPooledInvestmentVehicle" BOOLEAN NOT NULL,
    "isRequestingId" BOOLEAN NOT NULL,
    "legalName" TEXT NOT NULL,
    "alternateNames" TEXT[],
    "taxType" TEXT NOT NULL,
    "taxId" TEXT NOT NULL,
    "taxJurisdiction" TEXT NOT NULL,
    "jurisdiction" TEXT NOT NULL,
    "domesticState" TEXT NOT NULL,
    "domesticTribalJurisdiction" TEXT NOT NULL,
    "domesticOtherTribe" TEXT NOT NULL,
    "foreignFirstState" TEXT NOT NULL,
    "foreignTribalJurisdiction" TEXT NOT NULL,
    "foreignOtherTribe" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "zip" TEXT NOT NULL,

    CONSTRAINT "RcForm_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FiForm_formId_key" ON "FiForm"("formId");

-- CreateIndex
CREATE UNIQUE INDEX "RcForm_formId_key" ON "RcForm"("formId");

-- AddForeignKey
ALTER TABLE "FiForm" ADD CONSTRAINT "FiForm_formId_fkey" FOREIGN KEY ("formId") REFERENCES "Form"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RcForm" ADD CONSTRAINT "RcForm_formId_fkey" FOREIGN KEY ("formId") REFERENCES "Form"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
