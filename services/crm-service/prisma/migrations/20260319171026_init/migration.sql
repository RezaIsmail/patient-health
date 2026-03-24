-- CreateTable
CREATE TABLE "accounts" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'clinic',
    "status" TEXT NOT NULL DEFAULT 'active',
    "phone" TEXT,
    "email" TEXT,
    "website" TEXT,
    "addressLine1" TEXT,
    "addressLine2" TEXT,
    "city" TEXT,
    "state" TEXT,
    "postalCode" TEXT,
    "country" TEXT NOT NULL DEFAULT 'US',
    "parentAccountId" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contacts" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "preferredName" TEXT,
    "dateOfBirth" TIMESTAMP(3),
    "sex" TEXT,
    "genderIdentity" TEXT,
    "pronouns" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "language" TEXT DEFAULT 'en',
    "photoUrl" TEXT,
    "status" TEXT NOT NULL DEFAULT 'lead',
    "source" TEXT,
    "riskLevel" TEXT NOT NULL DEFAULT 'low',
    "sdohFlags" TEXT[],
    "assignedTo" TEXT,
    "accountId" TEXT,
    "emrPatientId" TEXT,
    "addressLine1" TEXT,
    "addressLine2" TEXT,
    "city" TEXT,
    "state" TEXT,
    "postalCode" TEXT,
    "country" TEXT NOT NULL DEFAULT 'US',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "contacts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "care_plans" (
    "id" TEXT NOT NULL,
    "contactId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "templateKey" TEXT,
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "assignedTo" TEXT,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "care_plans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "care_plan_problems" (
    "id" TEXT NOT NULL,
    "carePlanId" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "snomedCode" TEXT,
    "icd10Code" TEXT,
    "status" TEXT NOT NULL DEFAULT 'active',
    "onsetDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "care_plan_problems_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "care_plan_goals" (
    "id" TEXT NOT NULL,
    "carePlanId" TEXT NOT NULL,
    "problemId" TEXT,
    "description" TEXT NOT NULL,
    "targetDate" TIMESTAMP(3),
    "status" TEXT NOT NULL DEFAULT 'in_progress',
    "achievedDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "care_plan_goals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "care_plan_interventions" (
    "id" TEXT NOT NULL,
    "carePlanId" TEXT NOT NULL,
    "goalId" TEXT,
    "description" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'other',
    "frequency" TEXT,
    "assignedTo" TEXT,
    "status" TEXT NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "care_plan_interventions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "care_plan_notes" (
    "id" TEXT NOT NULL,
    "carePlanId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "authorName" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "care_plan_notes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "care_teams" (
    "id" TEXT NOT NULL,
    "contactId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "care_teams_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "care_team_members" (
    "id" TEXT NOT NULL,
    "careTeamId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "memberName" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'care_coordinator',
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "leftAt" TIMESTAMP(3),

    CONSTRAINT "care_team_members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "referrals" (
    "id" TEXT NOT NULL,
    "referralNumber" TEXT NOT NULL,
    "contactId" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'inbound',
    "stage" TEXT NOT NULL DEFAULT 'received',
    "priority" TEXT NOT NULL DEFAULT 'routine',
    "referringProvider" TEXT,
    "referringOrgName" TEXT,
    "receivingProvider" TEXT,
    "receivingOrgName" TEXT,
    "reasonCode" TEXT,
    "reasonDisplay" TEXT NOT NULL,
    "authorizationNumber" TEXT,
    "dueDate" TIMESTAMP(3),
    "outcome" TEXT,
    "outcomeNotes" TEXT,
    "assignedTo" TEXT,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "referrals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tasks" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "type" TEXT NOT NULL DEFAULT 'follow_up',
    "status" TEXT NOT NULL DEFAULT 'pending',
    "priority" TEXT NOT NULL DEFAULT 'normal',
    "contactId" TEXT,
    "referralId" TEXT,
    "carePlanId" TEXT,
    "careGapId" TEXT,
    "assignedTo" TEXT NOT NULL,
    "dueDate" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "completionNotes" TEXT,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tasks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "care_gaps" (
    "id" TEXT NOT NULL,
    "contactId" TEXT NOT NULL,
    "gapType" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'open',
    "priority" TEXT NOT NULL DEFAULT 'medium',
    "identifiedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "identifiedBy" TEXT NOT NULL,
    "targetDate" TIMESTAMP(3),
    "closedAt" TIMESTAMP(3),
    "closedBy" TEXT,
    "declineReason" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "care_gaps_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "campaigns" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "type" TEXT NOT NULL DEFAULT 'email',
    "status" TEXT NOT NULL DEFAULT 'draft',
    "targetSegment" JSONB,
    "subject" TEXT,
    "content" TEXT,
    "scheduledAt" TIMESTAMP(3),
    "launchedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "sentCount" INTEGER NOT NULL DEFAULT 0,
    "deliveredCount" INTEGER NOT NULL DEFAULT 0,
    "openedCount" INTEGER NOT NULL DEFAULT 0,
    "respondedCount" INTEGER NOT NULL DEFAULT 0,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "campaigns_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "campaign_members" (
    "id" TEXT NOT NULL,
    "campaignId" TEXT NOT NULL,
    "contactId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "sentAt" TIMESTAMP(3),
    "deliveredAt" TIMESTAMP(3),
    "openedAt" TIMESTAMP(3),
    "respondedAt" TIMESTAMP(3),
    "failureReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "campaign_members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "communications" (
    "id" TEXT NOT NULL,
    "contactId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "direction" TEXT NOT NULL DEFAULT 'outbound',
    "subject" TEXT,
    "content" TEXT,
    "status" TEXT NOT NULL DEFAULT 'sent',
    "sentBy" TEXT,
    "sentAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "referralId" TEXT,
    "taskId" TEXT,
    "campaignId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "communications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" TEXT NOT NULL,
    "contactId" TEXT,
    "userId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "resourceType" TEXT NOT NULL,
    "resourceId" TEXT,
    "changes" JSONB,
    "ipAddress" TEXT,
    "correlationId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "accounts_name_idx" ON "accounts"("name");

-- CreateIndex
CREATE INDEX "accounts_type_status_idx" ON "accounts"("type", "status");

-- CreateIndex
CREATE INDEX "contacts_lastName_firstName_idx" ON "contacts"("lastName", "firstName");

-- CreateIndex
CREATE INDEX "contacts_status_riskLevel_idx" ON "contacts"("status", "riskLevel");

-- CreateIndex
CREATE INDEX "contacts_assignedTo_idx" ON "contacts"("assignedTo");

-- CreateIndex
CREATE INDEX "care_plans_contactId_status_idx" ON "care_plans"("contactId", "status");

-- CreateIndex
CREATE INDEX "care_plan_problems_carePlanId_idx" ON "care_plan_problems"("carePlanId");

-- CreateIndex
CREATE INDEX "care_plan_goals_carePlanId_idx" ON "care_plan_goals"("carePlanId");

-- CreateIndex
CREATE INDEX "care_plan_interventions_carePlanId_idx" ON "care_plan_interventions"("carePlanId");

-- CreateIndex
CREATE INDEX "care_plan_notes_carePlanId_idx" ON "care_plan_notes"("carePlanId");

-- CreateIndex
CREATE UNIQUE INDEX "care_teams_contactId_key" ON "care_teams"("contactId");

-- CreateIndex
CREATE INDEX "care_team_members_careTeamId_idx" ON "care_team_members"("careTeamId");

-- CreateIndex
CREATE UNIQUE INDEX "referrals_referralNumber_key" ON "referrals"("referralNumber");

-- CreateIndex
CREATE INDEX "referrals_contactId_stage_idx" ON "referrals"("contactId", "stage");

-- CreateIndex
CREATE INDEX "referrals_stage_priority_idx" ON "referrals"("stage", "priority");

-- CreateIndex
CREATE INDEX "referrals_createdAt_idx" ON "referrals"("createdAt");

-- CreateIndex
CREATE INDEX "tasks_assignedTo_status_idx" ON "tasks"("assignedTo", "status");

-- CreateIndex
CREATE INDEX "tasks_contactId_status_idx" ON "tasks"("contactId", "status");

-- CreateIndex
CREATE INDEX "tasks_dueDate_status_idx" ON "tasks"("dueDate", "status");

-- CreateIndex
CREATE INDEX "care_gaps_contactId_status_idx" ON "care_gaps"("contactId", "status");

-- CreateIndex
CREATE INDEX "care_gaps_gapType_status_idx" ON "care_gaps"("gapType", "status");

-- CreateIndex
CREATE INDEX "campaigns_status_idx" ON "campaigns"("status");

-- CreateIndex
CREATE INDEX "campaign_members_campaignId_status_idx" ON "campaign_members"("campaignId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "campaign_members_campaignId_contactId_key" ON "campaign_members"("campaignId", "contactId");

-- CreateIndex
CREATE INDEX "communications_contactId_createdAt_idx" ON "communications"("contactId", "createdAt");

-- CreateIndex
CREATE INDEX "communications_type_direction_idx" ON "communications"("type", "direction");

-- CreateIndex
CREATE INDEX "audit_logs_contactId_idx" ON "audit_logs"("contactId");

-- CreateIndex
CREATE INDEX "audit_logs_userId_idx" ON "audit_logs"("userId");

-- CreateIndex
CREATE INDEX "audit_logs_createdAt_idx" ON "audit_logs"("createdAt");

-- AddForeignKey
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_parentAccountId_fkey" FOREIGN KEY ("parentAccountId") REFERENCES "accounts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contacts" ADD CONSTRAINT "contacts_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "accounts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "care_plans" ADD CONSTRAINT "care_plans_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "contacts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "care_plan_problems" ADD CONSTRAINT "care_plan_problems_carePlanId_fkey" FOREIGN KEY ("carePlanId") REFERENCES "care_plans"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "care_plan_goals" ADD CONSTRAINT "care_plan_goals_carePlanId_fkey" FOREIGN KEY ("carePlanId") REFERENCES "care_plans"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "care_plan_goals" ADD CONSTRAINT "care_plan_goals_problemId_fkey" FOREIGN KEY ("problemId") REFERENCES "care_plan_problems"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "care_plan_interventions" ADD CONSTRAINT "care_plan_interventions_carePlanId_fkey" FOREIGN KEY ("carePlanId") REFERENCES "care_plans"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "care_plan_interventions" ADD CONSTRAINT "care_plan_interventions_goalId_fkey" FOREIGN KEY ("goalId") REFERENCES "care_plan_goals"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "care_plan_notes" ADD CONSTRAINT "care_plan_notes_carePlanId_fkey" FOREIGN KEY ("carePlanId") REFERENCES "care_plans"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "care_teams" ADD CONSTRAINT "care_teams_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "contacts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "care_team_members" ADD CONSTRAINT "care_team_members_careTeamId_fkey" FOREIGN KEY ("careTeamId") REFERENCES "care_teams"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "referrals" ADD CONSTRAINT "referrals_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "contacts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "contacts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_referralId_fkey" FOREIGN KEY ("referralId") REFERENCES "referrals"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_carePlanId_fkey" FOREIGN KEY ("carePlanId") REFERENCES "care_plans"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_careGapId_fkey" FOREIGN KEY ("careGapId") REFERENCES "care_gaps"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "care_gaps" ADD CONSTRAINT "care_gaps_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "contacts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "campaign_members" ADD CONSTRAINT "campaign_members_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "campaigns"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "campaign_members" ADD CONSTRAINT "campaign_members_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "contacts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "communications" ADD CONSTRAINT "communications_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "contacts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "communications" ADD CONSTRAINT "communications_referralId_fkey" FOREIGN KEY ("referralId") REFERENCES "referrals"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "contacts"("id") ON DELETE SET NULL ON UPDATE CASCADE;
