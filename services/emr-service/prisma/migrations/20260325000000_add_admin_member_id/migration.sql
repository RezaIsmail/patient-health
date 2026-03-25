-- AlterTable
ALTER TABLE "patients" ADD COLUMN "adminMemberId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "patients_adminMemberId_key" ON "patients"("adminMemberId");

-- CreateIndex
CREATE INDEX "patients_adminMemberId_idx" ON "patients"("adminMemberId");
