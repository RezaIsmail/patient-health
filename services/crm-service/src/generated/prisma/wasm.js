
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

exports.Prisma.AccountScalarFieldEnum = {
  id: 'id',
  name: 'name',
  type: 'type',
  status: 'status',
  phone: 'phone',
  email: 'email',
  website: 'website',
  addressLine1: 'addressLine1',
  addressLine2: 'addressLine2',
  city: 'city',
  state: 'state',
  postalCode: 'postalCode',
  country: 'country',
  parentAccountId: 'parentAccountId',
  notes: 'notes',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.ContactScalarFieldEnum = {
  id: 'id',
  firstName: 'firstName',
  lastName: 'lastName',
  preferredName: 'preferredName',
  dateOfBirth: 'dateOfBirth',
  sex: 'sex',
  genderIdentity: 'genderIdentity',
  pronouns: 'pronouns',
  phone: 'phone',
  email: 'email',
  language: 'language',
  photoUrl: 'photoUrl',
  status: 'status',
  source: 'source',
  riskLevel: 'riskLevel',
  sdohFlags: 'sdohFlags',
  assignedTo: 'assignedTo',
  accountId: 'accountId',
  emrPatientId: 'emrPatientId',
  addressLine1: 'addressLine1',
  addressLine2: 'addressLine2',
  city: 'city',
  state: 'state',
  postalCode: 'postalCode',
  country: 'country',
  notes: 'notes',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.CarePlanScalarFieldEnum = {
  id: 'id',
  contactId: 'contactId',
  title: 'title',
  description: 'description',
  status: 'status',
  templateKey: 'templateKey',
  startDate: 'startDate',
  endDate: 'endDate',
  assignedTo: 'assignedTo',
  createdBy: 'createdBy',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.CarePlanProblemScalarFieldEnum = {
  id: 'id',
  carePlanId: 'carePlanId',
  description: 'description',
  snomedCode: 'snomedCode',
  icd10Code: 'icd10Code',
  status: 'status',
  onsetDate: 'onsetDate',
  createdAt: 'createdAt'
};

exports.Prisma.CarePlanGoalScalarFieldEnum = {
  id: 'id',
  carePlanId: 'carePlanId',
  problemId: 'problemId',
  description: 'description',
  targetDate: 'targetDate',
  status: 'status',
  achievedDate: 'achievedDate',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.CarePlanInterventionScalarFieldEnum = {
  id: 'id',
  carePlanId: 'carePlanId',
  goalId: 'goalId',
  description: 'description',
  type: 'type',
  frequency: 'frequency',
  assignedTo: 'assignedTo',
  status: 'status',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.CarePlanNoteScalarFieldEnum = {
  id: 'id',
  carePlanId: 'carePlanId',
  content: 'content',
  authorId: 'authorId',
  authorName: 'authorName',
  createdAt: 'createdAt'
};

exports.Prisma.CareTeamScalarFieldEnum = {
  id: 'id',
  contactId: 'contactId',
  name: 'name',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.CareTeamMemberScalarFieldEnum = {
  id: 'id',
  careTeamId: 'careTeamId',
  userId: 'userId',
  memberName: 'memberName',
  role: 'role',
  isPrimary: 'isPrimary',
  joinedAt: 'joinedAt',
  leftAt: 'leftAt'
};

exports.Prisma.ReferralScalarFieldEnum = {
  id: 'id',
  referralNumber: 'referralNumber',
  contactId: 'contactId',
  type: 'type',
  stage: 'stage',
  priority: 'priority',
  referringProvider: 'referringProvider',
  referringOrgName: 'referringOrgName',
  receivingProvider: 'receivingProvider',
  receivingOrgName: 'receivingOrgName',
  reasonCode: 'reasonCode',
  reasonDisplay: 'reasonDisplay',
  authorizationNumber: 'authorizationNumber',
  dueDate: 'dueDate',
  outcome: 'outcome',
  outcomeNotes: 'outcomeNotes',
  assignedTo: 'assignedTo',
  createdBy: 'createdBy',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.TaskScalarFieldEnum = {
  id: 'id',
  title: 'title',
  description: 'description',
  type: 'type',
  status: 'status',
  priority: 'priority',
  contactId: 'contactId',
  referralId: 'referralId',
  carePlanId: 'carePlanId',
  careGapId: 'careGapId',
  assignedTo: 'assignedTo',
  dueDate: 'dueDate',
  completedAt: 'completedAt',
  completionNotes: 'completionNotes',
  createdBy: 'createdBy',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.CareGapScalarFieldEnum = {
  id: 'id',
  contactId: 'contactId',
  gapType: 'gapType',
  description: 'description',
  status: 'status',
  priority: 'priority',
  identifiedAt: 'identifiedAt',
  identifiedBy: 'identifiedBy',
  targetDate: 'targetDate',
  closedAt: 'closedAt',
  closedBy: 'closedBy',
  declineReason: 'declineReason',
  notes: 'notes',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.CampaignScalarFieldEnum = {
  id: 'id',
  name: 'name',
  description: 'description',
  type: 'type',
  status: 'status',
  targetSegment: 'targetSegment',
  subject: 'subject',
  content: 'content',
  scheduledAt: 'scheduledAt',
  launchedAt: 'launchedAt',
  completedAt: 'completedAt',
  sentCount: 'sentCount',
  deliveredCount: 'deliveredCount',
  openedCount: 'openedCount',
  respondedCount: 'respondedCount',
  createdBy: 'createdBy',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.CampaignMemberScalarFieldEnum = {
  id: 'id',
  campaignId: 'campaignId',
  contactId: 'contactId',
  status: 'status',
  sentAt: 'sentAt',
  deliveredAt: 'deliveredAt',
  openedAt: 'openedAt',
  respondedAt: 'respondedAt',
  failureReason: 'failureReason',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.CommunicationScalarFieldEnum = {
  id: 'id',
  contactId: 'contactId',
  type: 'type',
  direction: 'direction',
  subject: 'subject',
  content: 'content',
  status: 'status',
  sentBy: 'sentBy',
  sentAt: 'sentAt',
  referralId: 'referralId',
  taskId: 'taskId',
  campaignId: 'campaignId',
  createdAt: 'createdAt'
};

exports.Prisma.AuditLogScalarFieldEnum = {
  id: 'id',
  contactId: 'contactId',
  userId: 'userId',
  action: 'action',
  resourceType: 'resourceType',
  resourceId: 'resourceId',
  changes: 'changes',
  ipAddress: 'ipAddress',
  correlationId: 'correlationId',
  createdAt: 'createdAt'
};

exports.Prisma.SortOrder = {
  asc: 'asc',
  desc: 'desc'
};

exports.Prisma.NullableJsonNullValueInput = {
  DbNull: Prisma.DbNull,
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
  Account: 'Account',
  Contact: 'Contact',
  CarePlan: 'CarePlan',
  CarePlanProblem: 'CarePlanProblem',
  CarePlanGoal: 'CarePlanGoal',
  CarePlanIntervention: 'CarePlanIntervention',
  CarePlanNote: 'CarePlanNote',
  CareTeam: 'CareTeam',
  CareTeamMember: 'CareTeamMember',
  Referral: 'Referral',
  Task: 'Task',
  CareGap: 'CareGap',
  Campaign: 'Campaign',
  CampaignMember: 'CampaignMember',
  Communication: 'Communication',
  AuditLog: 'AuditLog'
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
