-- CreateTable
CREATE TABLE "organisations" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'clinic',
    "status" TEXT NOT NULL DEFAULT 'active',
    "phone" TEXT,
    "email" TEXT,
    "website" TEXT,
    "addressLine1" TEXT,
    "city" TEXT,
    "state" TEXT,
    "postalCode" TEXT,
    "country" TEXT NOT NULL DEFAULT 'US',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "organisations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sites" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "siteType" TEXT NOT NULL DEFAULT 'clinic',
    "organisationId" TEXT NOT NULL,
    "addressLine1" TEXT,
    "city" TEXT,
    "state" TEXT,
    "postalCode" TEXT,
    "status" TEXT NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sites_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "departments" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "departmentType" TEXT NOT NULL DEFAULT 'clinical',
    "siteId" TEXT NOT NULL,
    "headUserId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "departments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "teams" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "teamType" TEXT NOT NULL DEFAULT 'care',
    "departmentId" TEXT NOT NULL,
    "leadUserId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "teams_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "members" (
    "id" TEXT NOT NULL,
    "memberNumber" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "dateOfBirth" TIMESTAMP(3),
    "sex" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "status" TEXT NOT NULL DEFAULT 'active',
    "riskLevel" TEXT NOT NULL DEFAULT 'low',
    "emrPatientId" TEXT,
    "crmContactId" TEXT,
    "organisationId" TEXT NOT NULL,
    "siteId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "programmes" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "programmeType" TEXT NOT NULL DEFAULT 'chronic_disease',
    "status" TEXT NOT NULL DEFAULT 'draft',
    "organisationId" TEXT NOT NULL,
    "eligibilityCriteria" JSONB,
    "enrollmentCapacity" INTEGER,
    "slaDefinitions" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "programmes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "programme_enrollments" (
    "id" TEXT NOT NULL,
    "memberId" TEXT NOT NULL,
    "programmeId" TEXT NOT NULL,
    "state" TEXT NOT NULL DEFAULT 'referred',
    "assignedTo" TEXT,
    "enrolledAt" TIMESTAMP(3),
    "graduatedAt" TIMESTAMP(3),
    "disenrolledAt" TIMESTAMP(3),
    "reasonCode" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "programme_enrollments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "enrollment_transitions" (
    "id" TEXT NOT NULL,
    "enrollmentId" TEXT NOT NULL,
    "fromState" TEXT NOT NULL,
    "toState" TEXT NOT NULL,
    "actorId" TEXT NOT NULL,
    "actorRole" TEXT,
    "reasonCode" TEXT,
    "notes" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "enrollment_transitions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "consents" (
    "id" TEXT NOT NULL,
    "memberId" TEXT,
    "enrollmentId" TEXT,
    "consentType" TEXT NOT NULL DEFAULT 'verbal',
    "channel" TEXT,
    "collectedBy" TEXT NOT NULL,
    "collectedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "documentVersion" TEXT,
    "status" TEXT NOT NULL DEFAULT 'active',
    "withdrawnAt" TIMESTAMP(3),
    "withdrawnBy" TEXT,
    "withdrawalReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "consents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "roles" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "productScope" TEXT NOT NULL DEFAULT 'platform',
    "isBuiltIn" BOOLEAN NOT NULL DEFAULT false,
    "organisationId" TEXT,
    "permissions" JSONB NOT NULL DEFAULT '[]',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_roles" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,
    "grantedBy" TEXT NOT NULL,
    "grantedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3),
    "revokedAt" TIMESTAMP(3),
    "revokedBy" TEXT,

    CONSTRAINT "user_roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_events" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "service" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT,
    "action" TEXT NOT NULL,
    "actorId" TEXT NOT NULL,
    "actorRole" TEXT,
    "correlationId" TEXT,
    "ipAddress" TEXT,
    "fieldChanges" JSONB,
    "reasonCode" TEXT,
    "notes" TEXT,
    "memberId" TEXT,

    CONSTRAINT "audit_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reference_tables" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "isBuiltIn" BOOLEAN NOT NULL DEFAULT false,
    "organisationId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reference_tables_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reference_entries" (
    "id" TEXT NOT NULL,
    "tableId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "description" TEXT,
    "effectiveFrom" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "effectiveTo" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reference_entries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "templates" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "templateType" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "contentBody" TEXT NOT NULL,
    "variableTokens" JSONB NOT NULL DEFAULT '[]',
    "organisationId" TEXT,
    "programmeIds" JSONB NOT NULL DEFAULT '[]',
    "versionNumber" INTEGER NOT NULL DEFAULT 1,
    "createdBy" TEXT NOT NULL,
    "approvedBy" TEXT,
    "approvedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "templates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_alert_rules" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "service" TEXT,
    "entityType" TEXT,
    "action" TEXT,
    "actorRole" TEXT,
    "threshold" INTEGER NOT NULL DEFAULT 10,
    "windowMinutes" INTEGER NOT NULL DEFAULT 60,
    "severity" TEXT NOT NULL DEFAULT 'medium',
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "audit_alert_rules_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "members_memberNumber_key" ON "members"("memberNumber");

-- CreateIndex
CREATE UNIQUE INDEX "programme_enrollments_memberId_programmeId_key" ON "programme_enrollments"("memberId", "programmeId");

-- CreateIndex
CREATE UNIQUE INDEX "roles_name_key" ON "roles"("name");

-- CreateIndex
CREATE UNIQUE INDEX "audit_events_eventId_key" ON "audit_events"("eventId");

-- CreateIndex
CREATE UNIQUE INDEX "reference_tables_name_key" ON "reference_tables"("name");

-- CreateIndex
CREATE UNIQUE INDEX "reference_entries_tableId_code_key" ON "reference_entries"("tableId", "code");

-- CreateIndex
CREATE INDEX "organisations_name_idx" ON "organisations"("name");
CREATE INDEX "organisations_status_idx" ON "organisations"("status");
CREATE INDEX "sites_organisationId_idx" ON "sites"("organisationId");
CREATE INDEX "departments_siteId_idx" ON "departments"("siteId");
CREATE INDEX "teams_departmentId_idx" ON "teams"("departmentId");
CREATE INDEX "members_lastName_firstName_idx" ON "members"("lastName", "firstName");
CREATE INDEX "members_status_riskLevel_idx" ON "members"("status", "riskLevel");
CREATE INDEX "members_organisationId_idx" ON "members"("organisationId");
CREATE INDEX "members_emrPatientId_idx" ON "members"("emrPatientId");
CREATE INDEX "members_crmContactId_idx" ON "members"("crmContactId");
CREATE INDEX "programmes_organisationId_status_idx" ON "programmes"("organisationId", "status");
CREATE INDEX "programme_enrollments_memberId_idx" ON "programme_enrollments"("memberId");
CREATE INDEX "programme_enrollments_programmeId_state_idx" ON "programme_enrollments"("programmeId", "state");
CREATE INDEX "enrollment_transitions_enrollmentId_idx" ON "enrollment_transitions"("enrollmentId");
CREATE INDEX "consents_memberId_idx" ON "consents"("memberId");
CREATE INDEX "consents_enrollmentId_idx" ON "consents"("enrollmentId");
CREATE INDEX "roles_productScope_idx" ON "roles"("productScope");
CREATE INDEX "user_roles_userId_idx" ON "user_roles"("userId");
CREATE INDEX "user_roles_roleId_idx" ON "user_roles"("roleId");
CREATE INDEX "audit_events_entityType_entityId_idx" ON "audit_events"("entityType", "entityId");
CREATE INDEX "audit_events_actorId_idx" ON "audit_events"("actorId");
CREATE INDEX "audit_events_timestamp_idx" ON "audit_events"("timestamp");
CREATE INDEX "audit_events_memberId_idx" ON "audit_events"("memberId");
CREATE INDEX "audit_events_service_idx" ON "audit_events"("service");
CREATE INDEX "reference_entries_tableId_idx" ON "reference_entries"("tableId");
CREATE INDEX "templates_templateType_idx" ON "templates"("templateType");
CREATE INDEX "templates_status_idx" ON "templates"("status");
CREATE INDEX "templates_organisationId_idx" ON "templates"("organisationId");
CREATE INDEX "audit_alert_rules_isActive_idx" ON "audit_alert_rules"("isActive");

-- AddForeignKey
ALTER TABLE "sites" ADD CONSTRAINT "sites_organisationId_fkey" FOREIGN KEY ("organisationId") REFERENCES "organisations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "departments" ADD CONSTRAINT "departments_siteId_fkey" FOREIGN KEY ("siteId") REFERENCES "sites"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "teams" ADD CONSTRAINT "teams_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "departments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "members" ADD CONSTRAINT "members_organisationId_fkey" FOREIGN KEY ("organisationId") REFERENCES "organisations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "members" ADD CONSTRAINT "members_siteId_fkey" FOREIGN KEY ("siteId") REFERENCES "sites"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "programmes" ADD CONSTRAINT "programmes_organisationId_fkey" FOREIGN KEY ("organisationId") REFERENCES "organisations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "programme_enrollments" ADD CONSTRAINT "programme_enrollments_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "members"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "programme_enrollments" ADD CONSTRAINT "programme_enrollments_programmeId_fkey" FOREIGN KEY ("programmeId") REFERENCES "programmes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "enrollment_transitions" ADD CONSTRAINT "enrollment_transitions_enrollmentId_fkey" FOREIGN KEY ("enrollmentId") REFERENCES "programme_enrollments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "consents" ADD CONSTRAINT "consents_enrollmentId_fkey" FOREIGN KEY ("enrollmentId") REFERENCES "programme_enrollments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_events" ADD CONSTRAINT "audit_events_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "members"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reference_entries" ADD CONSTRAINT "reference_entries_tableId_fkey" FOREIGN KEY ("tableId") REFERENCES "reference_tables"("id") ON DELETE CASCADE ON UPDATE CASCADE;
