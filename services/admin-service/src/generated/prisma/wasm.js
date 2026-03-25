
Object.defineProperty(exports, "__esModule", { value: true });

const {
  Decimal,
  objectEnumValues,
  makeStrictEnum,
  Public,
  getRuntime,
  skip
} = require('./runtime/index-browser.js')


const Prisma = {}

exports.Prisma = Prisma
exports.$Enums = {}

/**
 * Prisma Client JS version: 5.22.0
 * Query Engine version: 605197351a3c8bdd595af2d2a9bc3025bca48ea2
 */
Prisma.prismaVersion = {
  client: "5.22.0",
  engine: "605197351a3c8bdd595af2d2a9bc3025bca48ea2"
}

Prisma.PrismaClientKnownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientKnownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)};
Prisma.PrismaClientUnknownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientUnknownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientRustPanicError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientRustPanicError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientInitializationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientInitializationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientValidationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientValidationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.NotFoundError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`NotFoundError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`sqltag is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.empty = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`empty is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.join = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`join is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.raw = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`raw is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.validator = Public.validator

/**
* Extensions
*/
Prisma.getExtensionContext = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.getExtensionContext is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.defineExtension = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.defineExtension is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}

/**
 * Shorthand utilities for JSON filtering
 */
Prisma.DbNull = objectEnumValues.instances.DbNull
Prisma.JsonNull = objectEnumValues.instances.JsonNull
Prisma.AnyNull = objectEnumValues.instances.AnyNull

Prisma.NullTypes = {
  DbNull: objectEnumValues.classes.DbNull,
  JsonNull: objectEnumValues.classes.JsonNull,
  AnyNull: objectEnumValues.classes.AnyNull
}



/**
 * Enums
 */

exports.Prisma.TransactionIsolationLevel = makeStrictEnum({
  ReadUncommitted: 'ReadUncommitted',
  ReadCommitted: 'ReadCommitted',
  RepeatableRead: 'RepeatableRead',
  Serializable: 'Serializable'
});

exports.Prisma.OrganisationScalarFieldEnum = {
  id: 'id',
  name: 'name',
  type: 'type',
  status: 'status',
  phone: 'phone',
  email: 'email',
  website: 'website',
  addressLine1: 'addressLine1',
  city: 'city',
  state: 'state',
  postalCode: 'postalCode',
  country: 'country',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.SiteScalarFieldEnum = {
  id: 'id',
  name: 'name',
  siteType: 'siteType',
  organisationId: 'organisationId',
  addressLine1: 'addressLine1',
  city: 'city',
  state: 'state',
  postalCode: 'postalCode',
  status: 'status',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.DepartmentScalarFieldEnum = {
  id: 'id',
  name: 'name',
  departmentType: 'departmentType',
  siteId: 'siteId',
  headUserId: 'headUserId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.TeamScalarFieldEnum = {
  id: 'id',
  name: 'name',
  teamType: 'teamType',
  departmentId: 'departmentId',
  leadUserId: 'leadUserId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.MemberScalarFieldEnum = {
  id: 'id',
  memberNumber: 'memberNumber',
  firstName: 'firstName',
  lastName: 'lastName',
  dateOfBirth: 'dateOfBirth',
  sex: 'sex',
  phone: 'phone',
  email: 'email',
  status: 'status',
  riskLevel: 'riskLevel',
  emrPatientId: 'emrPatientId',
  crmContactId: 'crmContactId',
  organisationId: 'organisationId',
  siteId: 'siteId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.ProgrammeScalarFieldEnum = {
  id: 'id',
  name: 'name',
  description: 'description',
  programmeType: 'programmeType',
  status: 'status',
  organisationId: 'organisationId',
  eligibilityCriteria: 'eligibilityCriteria',
  enrollmentCapacity: 'enrollmentCapacity',
  slaDefinitions: 'slaDefinitions',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.ProgrammeEnrollmentScalarFieldEnum = {
  id: 'id',
  memberId: 'memberId',
  programmeId: 'programmeId',
  state: 'state',
  assignedTo: 'assignedTo',
  enrolledAt: 'enrolledAt',
  graduatedAt: 'graduatedAt',
  disenrolledAt: 'disenrolledAt',
  reasonCode: 'reasonCode',
  notes: 'notes',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.EnrollmentTransitionScalarFieldEnum = {
  id: 'id',
  enrollmentId: 'enrollmentId',
  fromState: 'fromState',
  toState: 'toState',
  actorId: 'actorId',
  actorRole: 'actorRole',
  reasonCode: 'reasonCode',
  notes: 'notes',
  timestamp: 'timestamp'
};

exports.Prisma.ConsentScalarFieldEnum = {
  id: 'id',
  memberId: 'memberId',
  enrollmentId: 'enrollmentId',
  consentType: 'consentType',
  channel: 'channel',
  collectedBy: 'collectedBy',
  collectedAt: 'collectedAt',
  documentVersion: 'documentVersion',
  status: 'status',
  withdrawnAt: 'withdrawnAt',
  withdrawnBy: 'withdrawnBy',
  withdrawalReason: 'withdrawalReason',
  createdAt: 'createdAt'
};

exports.Prisma.RoleScalarFieldEnum = {
  id: 'id',
  name: 'name',
  description: 'description',
  productScope: 'productScope',
  isBuiltIn: 'isBuiltIn',
  organisationId: 'organisationId',
  permissions: 'permissions',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.UserRoleScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  roleId: 'roleId',
  grantedBy: 'grantedBy',
  grantedAt: 'grantedAt',
  expiresAt: 'expiresAt',
  revokedAt: 'revokedAt',
  revokedBy: 'revokedBy'
};

exports.Prisma.AuditEventScalarFieldEnum = {
  id: 'id',
  eventId: 'eventId',
  timestamp: 'timestamp',
  service: 'service',
  entityType: 'entityType',
  entityId: 'entityId',
  action: 'action',
  actorId: 'actorId',
  actorRole: 'actorRole',
  correlationId: 'correlationId',
  ipAddress: 'ipAddress',
  fieldChanges: 'fieldChanges',
  reasonCode: 'reasonCode',
  notes: 'notes',
  memberId: 'memberId'
};

exports.Prisma.ReferenceTableScalarFieldEnum = {
  id: 'id',
  name: 'name',
  description: 'description',
  isBuiltIn: 'isBuiltIn',
  organisationId: 'organisationId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.ReferenceEntryScalarFieldEnum = {
  id: 'id',
  tableId: 'tableId',
  code: 'code',
  label: 'label',
  description: 'description',
  effectiveFrom: 'effectiveFrom',
  effectiveTo: 'effectiveTo',
  isActive: 'isActive',
  sortOrder: 'sortOrder',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.TemplateScalarFieldEnum = {
  id: 'id',
  name: 'name',
  description: 'description',
  templateType: 'templateType',
  status: 'status',
  contentBody: 'contentBody',
  variableTokens: 'variableTokens',
  organisationId: 'organisationId',
  programmeIds: 'programmeIds',
  versionNumber: 'versionNumber',
  createdBy: 'createdBy',
  approvedBy: 'approvedBy',
  approvedAt: 'approvedAt',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.AuditAlertRuleScalarFieldEnum = {
  id: 'id',
  name: 'name',
  description: 'description',
  isActive: 'isActive',
  service: 'service',
  entityType: 'entityType',
  action: 'action',
  actorRole: 'actorRole',
  threshold: 'threshold',
  windowMinutes: 'windowMinutes',
  severity: 'severity',
  createdBy: 'createdBy',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.SortOrder = {
  asc: 'asc',
  desc: 'desc'
};

exports.Prisma.NullableJsonNullValueInput = {
  DbNull: Prisma.DbNull,
  JsonNull: Prisma.JsonNull
};

exports.Prisma.JsonNullValueInput = {
  JsonNull: Prisma.JsonNull
};

exports.Prisma.QueryMode = {
  default: 'default',
  insensitive: 'insensitive'
};

exports.Prisma.NullsOrder = {
  first: 'first',
  last: 'last'
};

exports.Prisma.JsonNullValueFilter = {
  DbNull: Prisma.DbNull,
  JsonNull: Prisma.JsonNull,
  AnyNull: Prisma.AnyNull
};


exports.Prisma.ModelName = {
  Organisation: 'Organisation',
  Site: 'Site',
  Department: 'Department',
  Team: 'Team',
  Member: 'Member',
  Programme: 'Programme',
  ProgrammeEnrollment: 'ProgrammeEnrollment',
  EnrollmentTransition: 'EnrollmentTransition',
  Consent: 'Consent',
  Role: 'Role',
  UserRole: 'UserRole',
  AuditEvent: 'AuditEvent',
  ReferenceTable: 'ReferenceTable',
  ReferenceEntry: 'ReferenceEntry',
  Template: 'Template',
  AuditAlertRule: 'AuditAlertRule'
};

/**
 * This is a stub Prisma Client that will error at runtime if called.
 */
class PrismaClient {
  constructor() {
    return new Proxy(this, {
      get(target, prop) {
        let message
        const runtime = getRuntime()
        if (runtime.isEdge) {
          message = `PrismaClient is not configured to run in ${runtime.prettyName}. In order to run Prisma Client on edge runtime, either:
- Use Prisma Accelerate: https://pris.ly/d/accelerate
- Use Driver Adapters: https://pris.ly/d/driver-adapters
`;
        } else {
          message = 'PrismaClient is unable to run in this browser environment, or has been bundled for the browser (running in `' + runtime.prettyName + '`).'
        }
        
        message += `
If this is unexpected, please open an issue: https://pris.ly/prisma-prisma-bug-report`

        throw new Error(message)
      }
    })
  }
}

exports.PrismaClient = PrismaClient

Object.assign(exports, Prisma)
