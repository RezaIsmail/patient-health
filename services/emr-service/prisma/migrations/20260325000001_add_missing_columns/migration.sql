-- AlterTable: observations — add inbox review fields
ALTER TABLE "observations"
  ADD COLUMN "reviewedAt" TIMESTAMP(3),
  ADD COLUMN "reviewedBy" TEXT;

-- CreateIndex
CREATE INDEX "observations_isAbnormal_reviewedAt_idx" ON "observations"("isAbnormal", "reviewedAt");

-- AlterTable: encounters — add SOAP note fields, provider name, and signing fields
ALTER TABLE "encounters"
  ADD COLUMN "providerName" TEXT,
  ADD COLUMN "chiefComplaint" TEXT,
  ADD COLUMN "subjective" TEXT,
  ADD COLUMN "objective" TEXT,
  ADD COLUMN "assessment" TEXT,
  ADD COLUMN "plan" TEXT,
  ADD COLUMN "signedAt" TIMESTAMP(3),
  ADD COLUMN "signedBy" TEXT,
  ADD COLUMN "signedByName" TEXT;
