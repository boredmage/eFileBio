-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');

-- CreateEnum
CREATE TYPE "FilingType" AS ENUM ('INITIAL', 'CORRECT', 'UPDATE', 'NEW_EXEMPT');

-- CreateEnum
CREATE TYPE "FillingStatus" AS ENUM ('DRAFT', 'INREVIEW', 'SUBMITTED', 'APPROVED', 'REJECTED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "AddressType" AS ENUM ('BUSINESS', 'RESIDENTIAL');

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,
    "role" "Role" NOT NULL DEFAULT 'USER',

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "Business" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "logo" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "ownerId" TEXT NOT NULL,
    "creationDate" TIMESTAMP(3) NOT NULL,
    "entityType" TEXT NOT NULL,

    CONSTRAINT "Business_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Form" (
    "id" TEXT NOT NULL,
    "version" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "ownerId" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "status" "FillingStatus" NOT NULL DEFAULT 'DRAFT',

    CONSTRAINT "Form_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FiForm" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "formId" TEXT NOT NULL,
    "filingType" "FilingType" NOT NULL,
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
    "domesticState" TEXT,
    "domesticTribalJurisdiction" TEXT,
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

-- CreateTable
CREATE TABLE "caForm" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "formId" TEXT NOT NULL,
    "fincenId" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "middleName" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "suffix" TEXT NOT NULL,
    "dob" TIMESTAMP(3) NOT NULL,
    "addressType" "AddressType" NOT NULL,
    "country" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "zip" TEXT NOT NULL,
    "identificationId" TEXT NOT NULL,
    "identifyingDocumentId" TEXT NOT NULL,

    CONSTRAINT "caForm_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "boForm" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "formId" TEXT NOT NULL,
    "isParentGuardianInformation" BOOLEAN,
    "fincenId" TEXT,
    "isExemptEntity" BOOLEAN NOT NULL,
    "lastName" TEXT NOT NULL,
    "middleName" TEXT,
    "firstName" TEXT,
    "suffix" TEXT,
    "dob" TIMESTAMP(3),
    "country" TEXT,
    "state" TEXT,
    "address" TEXT,
    "city" TEXT,
    "zip" TEXT,
    "identificationId" TEXT,
    "identifyingDocumentId" TEXT,

    CONSTRAINT "boForm_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Identification" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "ID" TEXT NOT NULL,
    "jurisdiction" TEXT NOT NULL,
    "state" TEXT,
    "localTribal" TEXT,
    "otherTribe" TEXT,
    "image" TEXT NOT NULL,

    CONSTRAINT "Identification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IdentifyingDocument" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "type" TEXT NOT NULL,

    CONSTRAINT "IdentifyingDocument_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- CreateIndex
CREATE UNIQUE INDEX "FiForm_formId_key" ON "FiForm"("formId");

-- CreateIndex
CREATE UNIQUE INDEX "RcForm_formId_key" ON "RcForm"("formId");

-- CreateIndex
CREATE UNIQUE INDEX "caForm_identificationId_key" ON "caForm"("identificationId");

-- CreateIndex
CREATE UNIQUE INDEX "caForm_identifyingDocumentId_key" ON "caForm"("identifyingDocumentId");

-- CreateIndex
CREATE UNIQUE INDEX "boForm_formId_key" ON "boForm"("formId");

-- CreateIndex
CREATE UNIQUE INDEX "boForm_identificationId_key" ON "boForm"("identificationId");

-- CreateIndex
CREATE UNIQUE INDEX "boForm_identifyingDocumentId_key" ON "boForm"("identifyingDocumentId");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Business" ADD CONSTRAINT "Business_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Form" ADD CONSTRAINT "Form_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Form" ADD CONSTRAINT "Form_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FiForm" ADD CONSTRAINT "FiForm_formId_fkey" FOREIGN KEY ("formId") REFERENCES "Form"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RcForm" ADD CONSTRAINT "RcForm_formId_fkey" FOREIGN KEY ("formId") REFERENCES "Form"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "caForm" ADD CONSTRAINT "caForm_formId_fkey" FOREIGN KEY ("formId") REFERENCES "Form"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "caForm" ADD CONSTRAINT "caForm_identificationId_fkey" FOREIGN KEY ("identificationId") REFERENCES "Identification"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "caForm" ADD CONSTRAINT "caForm_identifyingDocumentId_fkey" FOREIGN KEY ("identifyingDocumentId") REFERENCES "IdentifyingDocument"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "boForm" ADD CONSTRAINT "boForm_formId_fkey" FOREIGN KEY ("formId") REFERENCES "Form"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "boForm" ADD CONSTRAINT "boForm_identificationId_fkey" FOREIGN KEY ("identificationId") REFERENCES "Identification"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "boForm" ADD CONSTRAINT "boForm_identifyingDocumentId_fkey" FOREIGN KEY ("identifyingDocumentId") REFERENCES "IdentifyingDocument"("id") ON DELETE SET NULL ON UPDATE CASCADE;
