
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model Patient
 * 
 */
export type Patient = $Result.DefaultSelection<Prisma.$PatientPayload>
/**
 * Model PatientAddress
 * 
 */
export type PatientAddress = $Result.DefaultSelection<Prisma.$PatientAddressPayload>
/**
 * Model EmergencyContact
 * 
 */
export type EmergencyContact = $Result.DefaultSelection<Prisma.$EmergencyContactPayload>
/**
 * Model PatientInsurance
 * 
 */
export type PatientInsurance = $Result.DefaultSelection<Prisma.$PatientInsurancePayload>
/**
 * Model Condition
 * 
 */
export type Condition = $Result.DefaultSelection<Prisma.$ConditionPayload>
/**
 * Model MedicationRequest
 * 
 */
export type MedicationRequest = $Result.DefaultSelection<Prisma.$MedicationRequestPayload>
/**
 * Model AllergyIntolerance
 * 
 */
export type AllergyIntolerance = $Result.DefaultSelection<Prisma.$AllergyIntolerancePayload>
/**
 * Model Observation
 * 
 */
export type Observation = $Result.DefaultSelection<Prisma.$ObservationPayload>
/**
 * Model Immunisation
 * 
 */
export type Immunisation = $Result.DefaultSelection<Prisma.$ImmunisationPayload>
/**
 * Model Encounter
 * 
 */
export type Encounter = $Result.DefaultSelection<Prisma.$EncounterPayload>
/**
 * Model Appointment
 * 
 */
export type Appointment = $Result.DefaultSelection<Prisma.$AppointmentPayload>
/**
 * Model ClinicalDocument
 * 
 */
export type ClinicalDocument = $Result.DefaultSelection<Prisma.$ClinicalDocumentPayload>
/**
 * Model AuditLog
 * 
 */
export type AuditLog = $Result.DefaultSelection<Prisma.$AuditLogPayload>

/**
 * ##  Prisma Client ʲˢ
 * 
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Patients
 * const patients = await prisma.patient.findMany()
 * ```
 *
 * 
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   * 
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Patients
   * const patients = await prisma.patient.findMany()
   * ```
   *
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): void;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

  /**
   * Add a middleware
   * @deprecated since 4.16.0. For new code, prefer client extensions instead.
   * @see https://pris.ly/d/extensions
   */
  $use(cb: Prisma.Middleware): void

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb, ExtArgs>

      /**
   * `prisma.patient`: Exposes CRUD operations for the **Patient** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Patients
    * const patients = await prisma.patient.findMany()
    * ```
    */
  get patient(): Prisma.PatientDelegate<ExtArgs>;

  /**
   * `prisma.patientAddress`: Exposes CRUD operations for the **PatientAddress** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more PatientAddresses
    * const patientAddresses = await prisma.patientAddress.findMany()
    * ```
    */
  get patientAddress(): Prisma.PatientAddressDelegate<ExtArgs>;

  /**
   * `prisma.emergencyContact`: Exposes CRUD operations for the **EmergencyContact** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more EmergencyContacts
    * const emergencyContacts = await prisma.emergencyContact.findMany()
    * ```
    */
  get emergencyContact(): Prisma.EmergencyContactDelegate<ExtArgs>;

  /**
   * `prisma.patientInsurance`: Exposes CRUD operations for the **PatientInsurance** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more PatientInsurances
    * const patientInsurances = await prisma.patientInsurance.findMany()
    * ```
    */
  get patientInsurance(): Prisma.PatientInsuranceDelegate<ExtArgs>;

  /**
   * `prisma.condition`: Exposes CRUD operations for the **Condition** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Conditions
    * const conditions = await prisma.condition.findMany()
    * ```
    */
  get condition(): Prisma.ConditionDelegate<ExtArgs>;

  /**
   * `prisma.medicationRequest`: Exposes CRUD operations for the **MedicationRequest** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more MedicationRequests
    * const medicationRequests = await prisma.medicationRequest.findMany()
    * ```
    */
  get medicationRequest(): Prisma.MedicationRequestDelegate<ExtArgs>;

  /**
   * `prisma.allergyIntolerance`: Exposes CRUD operations for the **AllergyIntolerance** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more AllergyIntolerances
    * const allergyIntolerances = await prisma.allergyIntolerance.findMany()
    * ```
    */
  get allergyIntolerance(): Prisma.AllergyIntoleranceDelegate<ExtArgs>;

  /**
   * `prisma.observation`: Exposes CRUD operations for the **Observation** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Observations
    * const observations = await prisma.observation.findMany()
    * ```
    */
  get observation(): Prisma.ObservationDelegate<ExtArgs>;

  /**
   * `prisma.immunisation`: Exposes CRUD operations for the **Immunisation** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Immunisations
    * const immunisations = await prisma.immunisation.findMany()
    * ```
    */
  get immunisation(): Prisma.ImmunisationDelegate<ExtArgs>;

  /**
   * `prisma.encounter`: Exposes CRUD operations for the **Encounter** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Encounters
    * const encounters = await prisma.encounter.findMany()
    * ```
    */
  get encounter(): Prisma.EncounterDelegate<ExtArgs>;

  /**
   * `prisma.appointment`: Exposes CRUD operations for the **Appointment** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Appointments
    * const appointments = await prisma.appointment.findMany()
    * ```
    */
  get appointment(): Prisma.AppointmentDelegate<ExtArgs>;

  /**
   * `prisma.clinicalDocument`: Exposes CRUD operations for the **ClinicalDocument** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ClinicalDocuments
    * const clinicalDocuments = await prisma.clinicalDocument.findMany()
    * ```
    */
  get clinicalDocument(): Prisma.ClinicalDocumentDelegate<ExtArgs>;

  /**
   * `prisma.auditLog`: Exposes CRUD operations for the **AuditLog** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more AuditLogs
    * const auditLogs = await prisma.auditLog.findMany()
    * ```
    */
  get auditLog(): Prisma.AuditLogDelegate<ExtArgs>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError
  export import NotFoundError = runtime.NotFoundError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics 
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 5.22.0
   * Query Engine version: 605197351a3c8bdd595af2d2a9bc3025bca48ea2
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion 

  /**
   * Utility Types
   */


  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? K : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    Patient: 'Patient',
    PatientAddress: 'PatientAddress',
    EmergencyContact: 'EmergencyContact',
    PatientInsurance: 'PatientInsurance',
    Condition: 'Condition',
    MedicationRequest: 'MedicationRequest',
    AllergyIntolerance: 'AllergyIntolerance',
    Observation: 'Observation',
    Immunisation: 'Immunisation',
    Encounter: 'Encounter',
    Appointment: 'Appointment',
    ClinicalDocument: 'ClinicalDocument',
    AuditLog: 'AuditLog'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb extends $Utils.Fn<{extArgs: $Extensions.InternalArgs, clientOptions: PrismaClientOptions }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], this['params']['clientOptions']>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, ClientOptions = {}> = {
    meta: {
      modelProps: "patient" | "patientAddress" | "emergencyContact" | "patientInsurance" | "condition" | "medicationRequest" | "allergyIntolerance" | "observation" | "immunisation" | "encounter" | "appointment" | "clinicalDocument" | "auditLog"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      Patient: {
        payload: Prisma.$PatientPayload<ExtArgs>
        fields: Prisma.PatientFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PatientFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PatientPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PatientFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PatientPayload>
          }
          findFirst: {
            args: Prisma.PatientFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PatientPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PatientFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PatientPayload>
          }
          findMany: {
            args: Prisma.PatientFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PatientPayload>[]
          }
          create: {
            args: Prisma.PatientCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PatientPayload>
          }
          createMany: {
            args: Prisma.PatientCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.PatientCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PatientPayload>[]
          }
          delete: {
            args: Prisma.PatientDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PatientPayload>
          }
          update: {
            args: Prisma.PatientUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PatientPayload>
          }
          deleteMany: {
            args: Prisma.PatientDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PatientUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.PatientUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PatientPayload>
          }
          aggregate: {
            args: Prisma.PatientAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePatient>
          }
          groupBy: {
            args: Prisma.PatientGroupByArgs<ExtArgs>
            result: $Utils.Optional<PatientGroupByOutputType>[]
          }
          count: {
            args: Prisma.PatientCountArgs<ExtArgs>
            result: $Utils.Optional<PatientCountAggregateOutputType> | number
          }
        }
      }
      PatientAddress: {
        payload: Prisma.$PatientAddressPayload<ExtArgs>
        fields: Prisma.PatientAddressFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PatientAddressFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PatientAddressPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PatientAddressFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PatientAddressPayload>
          }
          findFirst: {
            args: Prisma.PatientAddressFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PatientAddressPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PatientAddressFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PatientAddressPayload>
          }
          findMany: {
            args: Prisma.PatientAddressFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PatientAddressPayload>[]
          }
          create: {
            args: Prisma.PatientAddressCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PatientAddressPayload>
          }
          createMany: {
            args: Prisma.PatientAddressCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.PatientAddressCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PatientAddressPayload>[]
          }
          delete: {
            args: Prisma.PatientAddressDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PatientAddressPayload>
          }
          update: {
            args: Prisma.PatientAddressUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PatientAddressPayload>
          }
          deleteMany: {
            args: Prisma.PatientAddressDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PatientAddressUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.PatientAddressUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PatientAddressPayload>
          }
          aggregate: {
            args: Prisma.PatientAddressAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePatientAddress>
          }
          groupBy: {
            args: Prisma.PatientAddressGroupByArgs<ExtArgs>
            result: $Utils.Optional<PatientAddressGroupByOutputType>[]
          }
          count: {
            args: Prisma.PatientAddressCountArgs<ExtArgs>
            result: $Utils.Optional<PatientAddressCountAggregateOutputType> | number
          }
        }
      }
      EmergencyContact: {
        payload: Prisma.$EmergencyContactPayload<ExtArgs>
        fields: Prisma.EmergencyContactFieldRefs
        operations: {
          findUnique: {
            args: Prisma.EmergencyContactFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EmergencyContactPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.EmergencyContactFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EmergencyContactPayload>
          }
          findFirst: {
            args: Prisma.EmergencyContactFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EmergencyContactPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.EmergencyContactFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EmergencyContactPayload>
          }
          findMany: {
            args: Prisma.EmergencyContactFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EmergencyContactPayload>[]
          }
          create: {
            args: Prisma.EmergencyContactCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EmergencyContactPayload>
          }
          createMany: {
            args: Prisma.EmergencyContactCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.EmergencyContactCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EmergencyContactPayload>[]
          }
          delete: {
            args: Prisma.EmergencyContactDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EmergencyContactPayload>
          }
          update: {
            args: Prisma.EmergencyContactUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EmergencyContactPayload>
          }
          deleteMany: {
            args: Prisma.EmergencyContactDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.EmergencyContactUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.EmergencyContactUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EmergencyContactPayload>
          }
          aggregate: {
            args: Prisma.EmergencyContactAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateEmergencyContact>
          }
          groupBy: {
            args: Prisma.EmergencyContactGroupByArgs<ExtArgs>
            result: $Utils.Optional<EmergencyContactGroupByOutputType>[]
          }
          count: {
            args: Prisma.EmergencyContactCountArgs<ExtArgs>
            result: $Utils.Optional<EmergencyContactCountAggregateOutputType> | number
          }
        }
      }
      PatientInsurance: {
        payload: Prisma.$PatientInsurancePayload<ExtArgs>
        fields: Prisma.PatientInsuranceFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PatientInsuranceFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PatientInsurancePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PatientInsuranceFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PatientInsurancePayload>
          }
          findFirst: {
            args: Prisma.PatientInsuranceFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PatientInsurancePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PatientInsuranceFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PatientInsurancePayload>
          }
          findMany: {
            args: Prisma.PatientInsuranceFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PatientInsurancePayload>[]
          }
          create: {
            args: Prisma.PatientInsuranceCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PatientInsurancePayload>
          }
          createMany: {
            args: Prisma.PatientInsuranceCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.PatientInsuranceCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PatientInsurancePayload>[]
          }
          delete: {
            args: Prisma.PatientInsuranceDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PatientInsurancePayload>
          }
          update: {
            args: Prisma.PatientInsuranceUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PatientInsurancePayload>
          }
          deleteMany: {
            args: Prisma.PatientInsuranceDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PatientInsuranceUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.PatientInsuranceUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PatientInsurancePayload>
          }
          aggregate: {
            args: Prisma.PatientInsuranceAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePatientInsurance>
          }
          groupBy: {
            args: Prisma.PatientInsuranceGroupByArgs<ExtArgs>
            result: $Utils.Optional<PatientInsuranceGroupByOutputType>[]
          }
          count: {
            args: Prisma.PatientInsuranceCountArgs<ExtArgs>
            result: $Utils.Optional<PatientInsuranceCountAggregateOutputType> | number
          }
        }
      }
      Condition: {
        payload: Prisma.$ConditionPayload<ExtArgs>
        fields: Prisma.ConditionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ConditionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConditionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ConditionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConditionPayload>
          }
          findFirst: {
            args: Prisma.ConditionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConditionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ConditionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConditionPayload>
          }
          findMany: {
            args: Prisma.ConditionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConditionPayload>[]
          }
          create: {
            args: Prisma.ConditionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConditionPayload>
          }
          createMany: {
            args: Prisma.ConditionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ConditionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConditionPayload>[]
          }
          delete: {
            args: Prisma.ConditionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConditionPayload>
          }
          update: {
            args: Prisma.ConditionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConditionPayload>
          }
          deleteMany: {
            args: Prisma.ConditionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ConditionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.ConditionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConditionPayload>
          }
          aggregate: {
            args: Prisma.ConditionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateCondition>
          }
          groupBy: {
            args: Prisma.ConditionGroupByArgs<ExtArgs>
            result: $Utils.Optional<ConditionGroupByOutputType>[]
          }
          count: {
            args: Prisma.ConditionCountArgs<ExtArgs>
            result: $Utils.Optional<ConditionCountAggregateOutputType> | number
          }
        }
      }
      MedicationRequest: {
        payload: Prisma.$MedicationRequestPayload<ExtArgs>
        fields: Prisma.MedicationRequestFieldRefs
        operations: {
          findUnique: {
            args: Prisma.MedicationRequestFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MedicationRequestPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.MedicationRequestFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MedicationRequestPayload>
          }
          findFirst: {
            args: Prisma.MedicationRequestFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MedicationRequestPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.MedicationRequestFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MedicationRequestPayload>
          }
          findMany: {
            args: Prisma.MedicationRequestFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MedicationRequestPayload>[]
          }
          create: {
            args: Prisma.MedicationRequestCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MedicationRequestPayload>
          }
          createMany: {
            args: Prisma.MedicationRequestCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.MedicationRequestCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MedicationRequestPayload>[]
          }
          delete: {
            args: Prisma.MedicationRequestDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MedicationRequestPayload>
          }
          update: {
            args: Prisma.MedicationRequestUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MedicationRequestPayload>
          }
          deleteMany: {
            args: Prisma.MedicationRequestDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.MedicationRequestUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.MedicationRequestUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MedicationRequestPayload>
          }
          aggregate: {
            args: Prisma.MedicationRequestAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateMedicationRequest>
          }
          groupBy: {
            args: Prisma.MedicationRequestGroupByArgs<ExtArgs>
            result: $Utils.Optional<MedicationRequestGroupByOutputType>[]
          }
          count: {
            args: Prisma.MedicationRequestCountArgs<ExtArgs>
            result: $Utils.Optional<MedicationRequestCountAggregateOutputType> | number
          }
        }
      }
      AllergyIntolerance: {
        payload: Prisma.$AllergyIntolerancePayload<ExtArgs>
        fields: Prisma.AllergyIntoleranceFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AllergyIntoleranceFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AllergyIntolerancePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AllergyIntoleranceFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AllergyIntolerancePayload>
          }
          findFirst: {
            args: Prisma.AllergyIntoleranceFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AllergyIntolerancePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AllergyIntoleranceFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AllergyIntolerancePayload>
          }
          findMany: {
            args: Prisma.AllergyIntoleranceFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AllergyIntolerancePayload>[]
          }
          create: {
            args: Prisma.AllergyIntoleranceCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AllergyIntolerancePayload>
          }
          createMany: {
            args: Prisma.AllergyIntoleranceCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AllergyIntoleranceCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AllergyIntolerancePayload>[]
          }
          delete: {
            args: Prisma.AllergyIntoleranceDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AllergyIntolerancePayload>
          }
          update: {
            args: Prisma.AllergyIntoleranceUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AllergyIntolerancePayload>
          }
          deleteMany: {
            args: Prisma.AllergyIntoleranceDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AllergyIntoleranceUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.AllergyIntoleranceUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AllergyIntolerancePayload>
          }
          aggregate: {
            args: Prisma.AllergyIntoleranceAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAllergyIntolerance>
          }
          groupBy: {
            args: Prisma.AllergyIntoleranceGroupByArgs<ExtArgs>
            result: $Utils.Optional<AllergyIntoleranceGroupByOutputType>[]
          }
          count: {
            args: Prisma.AllergyIntoleranceCountArgs<ExtArgs>
            result: $Utils.Optional<AllergyIntoleranceCountAggregateOutputType> | number
          }
        }
      }
      Observation: {
        payload: Prisma.$ObservationPayload<ExtArgs>
        fields: Prisma.ObservationFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ObservationFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ObservationPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ObservationFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ObservationPayload>
          }
          findFirst: {
            args: Prisma.ObservationFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ObservationPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ObservationFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ObservationPayload>
          }
          findMany: {
            args: Prisma.ObservationFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ObservationPayload>[]
          }
          create: {
            args: Prisma.ObservationCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ObservationPayload>
          }
          createMany: {
            args: Prisma.ObservationCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ObservationCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ObservationPayload>[]
          }
          delete: {
            args: Prisma.ObservationDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ObservationPayload>
          }
          update: {
            args: Prisma.ObservationUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ObservationPayload>
          }
          deleteMany: {
            args: Prisma.ObservationDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ObservationUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.ObservationUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ObservationPayload>
          }
          aggregate: {
            args: Prisma.ObservationAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateObservation>
          }
          groupBy: {
            args: Prisma.ObservationGroupByArgs<ExtArgs>
            result: $Utils.Optional<ObservationGroupByOutputType>[]
          }
          count: {
            args: Prisma.ObservationCountArgs<ExtArgs>
            result: $Utils.Optional<ObservationCountAggregateOutputType> | number
          }
        }
      }
      Immunisation: {
        payload: Prisma.$ImmunisationPayload<ExtArgs>
        fields: Prisma.ImmunisationFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ImmunisationFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImmunisationPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ImmunisationFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImmunisationPayload>
          }
          findFirst: {
            args: Prisma.ImmunisationFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImmunisationPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ImmunisationFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImmunisationPayload>
          }
          findMany: {
            args: Prisma.ImmunisationFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImmunisationPayload>[]
          }
          create: {
            args: Prisma.ImmunisationCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImmunisationPayload>
          }
          createMany: {
            args: Prisma.ImmunisationCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ImmunisationCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImmunisationPayload>[]
          }
          delete: {
            args: Prisma.ImmunisationDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImmunisationPayload>
          }
          update: {
            args: Prisma.ImmunisationUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImmunisationPayload>
          }
          deleteMany: {
            args: Prisma.ImmunisationDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ImmunisationUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.ImmunisationUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImmunisationPayload>
          }
          aggregate: {
            args: Prisma.ImmunisationAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateImmunisation>
          }
          groupBy: {
            args: Prisma.ImmunisationGroupByArgs<ExtArgs>
            result: $Utils.Optional<ImmunisationGroupByOutputType>[]
          }
          count: {
            args: Prisma.ImmunisationCountArgs<ExtArgs>
            result: $Utils.Optional<ImmunisationCountAggregateOutputType> | number
          }
        }
      }
      Encounter: {
        payload: Prisma.$EncounterPayload<ExtArgs>
        fields: Prisma.EncounterFieldRefs
        operations: {
          findUnique: {
            args: Prisma.EncounterFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EncounterPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.EncounterFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EncounterPayload>
          }
          findFirst: {
            args: Prisma.EncounterFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EncounterPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.EncounterFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EncounterPayload>
          }
          findMany: {
            args: Prisma.EncounterFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EncounterPayload>[]
          }
          create: {
            args: Prisma.EncounterCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EncounterPayload>
          }
          createMany: {
            args: Prisma.EncounterCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.EncounterCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EncounterPayload>[]
          }
          delete: {
            args: Prisma.EncounterDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EncounterPayload>
          }
          update: {
            args: Prisma.EncounterUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EncounterPayload>
          }
          deleteMany: {
            args: Prisma.EncounterDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.EncounterUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.EncounterUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EncounterPayload>
          }
          aggregate: {
            args: Prisma.EncounterAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateEncounter>
          }
          groupBy: {
            args: Prisma.EncounterGroupByArgs<ExtArgs>
            result: $Utils.Optional<EncounterGroupByOutputType>[]
          }
          count: {
            args: Prisma.EncounterCountArgs<ExtArgs>
            result: $Utils.Optional<EncounterCountAggregateOutputType> | number
          }
        }
      }
      Appointment: {
        payload: Prisma.$AppointmentPayload<ExtArgs>
        fields: Prisma.AppointmentFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AppointmentFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AppointmentPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AppointmentFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AppointmentPayload>
          }
          findFirst: {
            args: Prisma.AppointmentFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AppointmentPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AppointmentFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AppointmentPayload>
          }
          findMany: {
            args: Prisma.AppointmentFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AppointmentPayload>[]
          }
          create: {
            args: Prisma.AppointmentCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AppointmentPayload>
          }
          createMany: {
            args: Prisma.AppointmentCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AppointmentCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AppointmentPayload>[]
          }
          delete: {
            args: Prisma.AppointmentDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AppointmentPayload>
          }
          update: {
            args: Prisma.AppointmentUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AppointmentPayload>
          }
          deleteMany: {
            args: Prisma.AppointmentDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AppointmentUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.AppointmentUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AppointmentPayload>
          }
          aggregate: {
            args: Prisma.AppointmentAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAppointment>
          }
          groupBy: {
            args: Prisma.AppointmentGroupByArgs<ExtArgs>
            result: $Utils.Optional<AppointmentGroupByOutputType>[]
          }
          count: {
            args: Prisma.AppointmentCountArgs<ExtArgs>
            result: $Utils.Optional<AppointmentCountAggregateOutputType> | number
          }
        }
      }
      ClinicalDocument: {
        payload: Prisma.$ClinicalDocumentPayload<ExtArgs>
        fields: Prisma.ClinicalDocumentFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ClinicalDocumentFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClinicalDocumentPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ClinicalDocumentFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClinicalDocumentPayload>
          }
          findFirst: {
            args: Prisma.ClinicalDocumentFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClinicalDocumentPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ClinicalDocumentFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClinicalDocumentPayload>
          }
          findMany: {
            args: Prisma.ClinicalDocumentFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClinicalDocumentPayload>[]
          }
          create: {
            args: Prisma.ClinicalDocumentCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClinicalDocumentPayload>
          }
          createMany: {
            args: Prisma.ClinicalDocumentCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ClinicalDocumentCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClinicalDocumentPayload>[]
          }
          delete: {
            args: Prisma.ClinicalDocumentDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClinicalDocumentPayload>
          }
          update: {
            args: Prisma.ClinicalDocumentUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClinicalDocumentPayload>
          }
          deleteMany: {
            args: Prisma.ClinicalDocumentDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ClinicalDocumentUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.ClinicalDocumentUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClinicalDocumentPayload>
          }
          aggregate: {
            args: Prisma.ClinicalDocumentAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateClinicalDocument>
          }
          groupBy: {
            args: Prisma.ClinicalDocumentGroupByArgs<ExtArgs>
            result: $Utils.Optional<ClinicalDocumentGroupByOutputType>[]
          }
          count: {
            args: Prisma.ClinicalDocumentCountArgs<ExtArgs>
            result: $Utils.Optional<ClinicalDocumentCountAggregateOutputType> | number
          }
        }
      }
      AuditLog: {
        payload: Prisma.$AuditLogPayload<ExtArgs>
        fields: Prisma.AuditLogFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AuditLogFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AuditLogFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>
          }
          findFirst: {
            args: Prisma.AuditLogFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AuditLogFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>
          }
          findMany: {
            args: Prisma.AuditLogFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>[]
          }
          create: {
            args: Prisma.AuditLogCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>
          }
          createMany: {
            args: Prisma.AuditLogCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AuditLogCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>[]
          }
          delete: {
            args: Prisma.AuditLogDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>
          }
          update: {
            args: Prisma.AuditLogUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>
          }
          deleteMany: {
            args: Prisma.AuditLogDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AuditLogUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.AuditLogUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>
          }
          aggregate: {
            args: Prisma.AuditLogAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAuditLog>
          }
          groupBy: {
            args: Prisma.AuditLogGroupByArgs<ExtArgs>
            result: $Utils.Optional<AuditLogGroupByOutputType>[]
          }
          count: {
            args: Prisma.AuditLogCountArgs<ExtArgs>
            result: $Utils.Optional<AuditLogCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Defaults to stdout
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events
     * log: [
     *   { emit: 'stdout', level: 'query' },
     *   { emit: 'stdout', level: 'info' },
     *   { emit: 'stdout', level: 'warn' }
     *   { emit: 'stdout', level: 'error' }
     * ]
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
  }


  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type GetLogType<T extends LogLevel | LogDefinition> = T extends LogDefinition ? T['emit'] extends 'event' ? T['level'] : never : never
  export type GetEvents<T extends any> = T extends Array<LogLevel | LogDefinition> ?
    GetLogType<T[0]> | GetLogType<T[1]> | GetLogType<T[2]> | GetLogType<T[3]>
    : never

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  /**
   * These options are being passed into the middleware as "params"
   */
  export type MiddlewareParams = {
    model?: ModelName
    action: PrismaAction
    args: any
    dataPath: string[]
    runInTransaction: boolean
  }

  /**
   * The `T` type makes sure, that the `return proceed` is not forgotten in the middleware implementation
   */
  export type Middleware<T = any> = (
    params: MiddlewareParams,
    next: (params: MiddlewareParams) => $Utils.JsPromise<T>,
  ) => $Utils.JsPromise<T>

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type PatientCountOutputType
   */

  export type PatientCountOutputType = {
    emergencyContacts: number
    insurances: number
    conditions: number
    medications: number
    allergies: number
    observations: number
    immunisations: number
    encounters: number
    appointments: number
    documents: number
    auditLogs: number
  }

  export type PatientCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    emergencyContacts?: boolean | PatientCountOutputTypeCountEmergencyContactsArgs
    insurances?: boolean | PatientCountOutputTypeCountInsurancesArgs
    conditions?: boolean | PatientCountOutputTypeCountConditionsArgs
    medications?: boolean | PatientCountOutputTypeCountMedicationsArgs
    allergies?: boolean | PatientCountOutputTypeCountAllergiesArgs
    observations?: boolean | PatientCountOutputTypeCountObservationsArgs
    immunisations?: boolean | PatientCountOutputTypeCountImmunisationsArgs
    encounters?: boolean | PatientCountOutputTypeCountEncountersArgs
    appointments?: boolean | PatientCountOutputTypeCountAppointmentsArgs
    documents?: boolean | PatientCountOutputTypeCountDocumentsArgs
    auditLogs?: boolean | PatientCountOutputTypeCountAuditLogsArgs
  }

  // Custom InputTypes
  /**
   * PatientCountOutputType without action
   */
  export type PatientCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PatientCountOutputType
     */
    select?: PatientCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * PatientCountOutputType without action
   */
  export type PatientCountOutputTypeCountEmergencyContactsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: EmergencyContactWhereInput
  }

  /**
   * PatientCountOutputType without action
   */
  export type PatientCountOutputTypeCountInsurancesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PatientInsuranceWhereInput
  }

  /**
   * PatientCountOutputType without action
   */
  export type PatientCountOutputTypeCountConditionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ConditionWhereInput
  }

  /**
   * PatientCountOutputType without action
   */
  export type PatientCountOutputTypeCountMedicationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MedicationRequestWhereInput
  }

  /**
   * PatientCountOutputType without action
   */
  export type PatientCountOutputTypeCountAllergiesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AllergyIntoleranceWhereInput
  }

  /**
   * PatientCountOutputType without action
   */
  export type PatientCountOutputTypeCountObservationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ObservationWhereInput
  }

  /**
   * PatientCountOutputType without action
   */
  export type PatientCountOutputTypeCountImmunisationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ImmunisationWhereInput
  }

  /**
   * PatientCountOutputType without action
   */
  export type PatientCountOutputTypeCountEncountersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: EncounterWhereInput
  }

  /**
   * PatientCountOutputType without action
   */
  export type PatientCountOutputTypeCountAppointmentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AppointmentWhereInput
  }

  /**
   * PatientCountOutputType without action
   */
  export type PatientCountOutputTypeCountDocumentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ClinicalDocumentWhereInput
  }

  /**
   * PatientCountOutputType without action
   */
  export type PatientCountOutputTypeCountAuditLogsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AuditLogWhereInput
  }


  /**
   * Count Type EncounterCountOutputType
   */

  export type EncounterCountOutputType = {
    conditions: number
    medications: number
    observations: number
    documents: number
  }

  export type EncounterCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    conditions?: boolean | EncounterCountOutputTypeCountConditionsArgs
    medications?: boolean | EncounterCountOutputTypeCountMedicationsArgs
    observations?: boolean | EncounterCountOutputTypeCountObservationsArgs
    documents?: boolean | EncounterCountOutputTypeCountDocumentsArgs
  }

  // Custom InputTypes
  /**
   * EncounterCountOutputType without action
   */
  export type EncounterCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EncounterCountOutputType
     */
    select?: EncounterCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * EncounterCountOutputType without action
   */
  export type EncounterCountOutputTypeCountConditionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ConditionWhereInput
  }

  /**
   * EncounterCountOutputType without action
   */
  export type EncounterCountOutputTypeCountMedicationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MedicationRequestWhereInput
  }

  /**
   * EncounterCountOutputType without action
   */
  export type EncounterCountOutputTypeCountObservationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ObservationWhereInput
  }

  /**
   * EncounterCountOutputType without action
   */
  export type EncounterCountOutputTypeCountDocumentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ClinicalDocumentWhereInput
  }


  /**
   * Models
   */

  /**
   * Model Patient
   */

  export type AggregatePatient = {
    _count: PatientCountAggregateOutputType | null
    _min: PatientMinAggregateOutputType | null
    _max: PatientMaxAggregateOutputType | null
  }

  export type PatientMinAggregateOutputType = {
    id: string | null
    mrn: string | null
    firstName: string | null
    lastName: string | null
    preferredName: string | null
    dateOfBirth: Date | null
    gender: string | null
    genderIdentity: string | null
    phone: string | null
    email: string | null
    photoUrl: string | null
    isActive: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type PatientMaxAggregateOutputType = {
    id: string | null
    mrn: string | null
    firstName: string | null
    lastName: string | null
    preferredName: string | null
    dateOfBirth: Date | null
    gender: string | null
    genderIdentity: string | null
    phone: string | null
    email: string | null
    photoUrl: string | null
    isActive: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type PatientCountAggregateOutputType = {
    id: number
    mrn: number
    firstName: number
    lastName: number
    preferredName: number
    dateOfBirth: number
    gender: number
    genderIdentity: number
    phone: number
    email: number
    photoUrl: number
    isActive: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type PatientMinAggregateInputType = {
    id?: true
    mrn?: true
    firstName?: true
    lastName?: true
    preferredName?: true
    dateOfBirth?: true
    gender?: true
    genderIdentity?: true
    phone?: true
    email?: true
    photoUrl?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
  }

  export type PatientMaxAggregateInputType = {
    id?: true
    mrn?: true
    firstName?: true
    lastName?: true
    preferredName?: true
    dateOfBirth?: true
    gender?: true
    genderIdentity?: true
    phone?: true
    email?: true
    photoUrl?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
  }

  export type PatientCountAggregateInputType = {
    id?: true
    mrn?: true
    firstName?: true
    lastName?: true
    preferredName?: true
    dateOfBirth?: true
    gender?: true
    genderIdentity?: true
    phone?: true
    email?: true
    photoUrl?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type PatientAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Patient to aggregate.
     */
    where?: PatientWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Patients to fetch.
     */
    orderBy?: PatientOrderByWithRelationInput | PatientOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PatientWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Patients from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Patients.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Patients
    **/
    _count?: true | PatientCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PatientMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PatientMaxAggregateInputType
  }

  export type GetPatientAggregateType<T extends PatientAggregateArgs> = {
        [P in keyof T & keyof AggregatePatient]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePatient[P]>
      : GetScalarType<T[P], AggregatePatient[P]>
  }




  export type PatientGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PatientWhereInput
    orderBy?: PatientOrderByWithAggregationInput | PatientOrderByWithAggregationInput[]
    by: PatientScalarFieldEnum[] | PatientScalarFieldEnum
    having?: PatientScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PatientCountAggregateInputType | true
    _min?: PatientMinAggregateInputType
    _max?: PatientMaxAggregateInputType
  }

  export type PatientGroupByOutputType = {
    id: string
    mrn: string
    firstName: string
    lastName: string
    preferredName: string | null
    dateOfBirth: Date
    gender: string
    genderIdentity: string | null
    phone: string | null
    email: string | null
    photoUrl: string | null
    isActive: boolean
    createdAt: Date
    updatedAt: Date
    _count: PatientCountAggregateOutputType | null
    _min: PatientMinAggregateOutputType | null
    _max: PatientMaxAggregateOutputType | null
  }

  type GetPatientGroupByPayload<T extends PatientGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PatientGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PatientGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PatientGroupByOutputType[P]>
            : GetScalarType<T[P], PatientGroupByOutputType[P]>
        }
      >
    >


  export type PatientSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    mrn?: boolean
    firstName?: boolean
    lastName?: boolean
    preferredName?: boolean
    dateOfBirth?: boolean
    gender?: boolean
    genderIdentity?: boolean
    phone?: boolean
    email?: boolean
    photoUrl?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    address?: boolean | Patient$addressArgs<ExtArgs>
    emergencyContacts?: boolean | Patient$emergencyContactsArgs<ExtArgs>
    insurances?: boolean | Patient$insurancesArgs<ExtArgs>
    conditions?: boolean | Patient$conditionsArgs<ExtArgs>
    medications?: boolean | Patient$medicationsArgs<ExtArgs>
    allergies?: boolean | Patient$allergiesArgs<ExtArgs>
    observations?: boolean | Patient$observationsArgs<ExtArgs>
    immunisations?: boolean | Patient$immunisationsArgs<ExtArgs>
    encounters?: boolean | Patient$encountersArgs<ExtArgs>
    appointments?: boolean | Patient$appointmentsArgs<ExtArgs>
    documents?: boolean | Patient$documentsArgs<ExtArgs>
    auditLogs?: boolean | Patient$auditLogsArgs<ExtArgs>
    _count?: boolean | PatientCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["patient"]>

  export type PatientSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    mrn?: boolean
    firstName?: boolean
    lastName?: boolean
    preferredName?: boolean
    dateOfBirth?: boolean
    gender?: boolean
    genderIdentity?: boolean
    phone?: boolean
    email?: boolean
    photoUrl?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["patient"]>

  export type PatientSelectScalar = {
    id?: boolean
    mrn?: boolean
    firstName?: boolean
    lastName?: boolean
    preferredName?: boolean
    dateOfBirth?: boolean
    gender?: boolean
    genderIdentity?: boolean
    phone?: boolean
    email?: boolean
    photoUrl?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type PatientInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    address?: boolean | Patient$addressArgs<ExtArgs>
    emergencyContacts?: boolean | Patient$emergencyContactsArgs<ExtArgs>
    insurances?: boolean | Patient$insurancesArgs<ExtArgs>
    conditions?: boolean | Patient$conditionsArgs<ExtArgs>
    medications?: boolean | Patient$medicationsArgs<ExtArgs>
    allergies?: boolean | Patient$allergiesArgs<ExtArgs>
    observations?: boolean | Patient$observationsArgs<ExtArgs>
    immunisations?: boolean | Patient$immunisationsArgs<ExtArgs>
    encounters?: boolean | Patient$encountersArgs<ExtArgs>
    appointments?: boolean | Patient$appointmentsArgs<ExtArgs>
    documents?: boolean | Patient$documentsArgs<ExtArgs>
    auditLogs?: boolean | Patient$auditLogsArgs<ExtArgs>
    _count?: boolean | PatientCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type PatientIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $PatientPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Patient"
    objects: {
      address: Prisma.$PatientAddressPayload<ExtArgs> | null
      emergencyContacts: Prisma.$EmergencyContactPayload<ExtArgs>[]
      insurances: Prisma.$PatientInsurancePayload<ExtArgs>[]
      conditions: Prisma.$ConditionPayload<ExtArgs>[]
      medications: Prisma.$MedicationRequestPayload<ExtArgs>[]
      allergies: Prisma.$AllergyIntolerancePayload<ExtArgs>[]
      observations: Prisma.$ObservationPayload<ExtArgs>[]
      immunisations: Prisma.$ImmunisationPayload<ExtArgs>[]
      encounters: Prisma.$EncounterPayload<ExtArgs>[]
      appointments: Prisma.$AppointmentPayload<ExtArgs>[]
      documents: Prisma.$ClinicalDocumentPayload<ExtArgs>[]
      auditLogs: Prisma.$AuditLogPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      mrn: string
      firstName: string
      lastName: string
      preferredName: string | null
      dateOfBirth: Date
      gender: string
      genderIdentity: string | null
      phone: string | null
      email: string | null
      photoUrl: string | null
      isActive: boolean
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["patient"]>
    composites: {}
  }

  type PatientGetPayload<S extends boolean | null | undefined | PatientDefaultArgs> = $Result.GetResult<Prisma.$PatientPayload, S>

  type PatientCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<PatientFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: PatientCountAggregateInputType | true
    }

  export interface PatientDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Patient'], meta: { name: 'Patient' } }
    /**
     * Find zero or one Patient that matches the filter.
     * @param {PatientFindUniqueArgs} args - Arguments to find a Patient
     * @example
     * // Get one Patient
     * const patient = await prisma.patient.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PatientFindUniqueArgs>(args: SelectSubset<T, PatientFindUniqueArgs<ExtArgs>>): Prisma__PatientClient<$Result.GetResult<Prisma.$PatientPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Patient that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {PatientFindUniqueOrThrowArgs} args - Arguments to find a Patient
     * @example
     * // Get one Patient
     * const patient = await prisma.patient.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PatientFindUniqueOrThrowArgs>(args: SelectSubset<T, PatientFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PatientClient<$Result.GetResult<Prisma.$PatientPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Patient that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PatientFindFirstArgs} args - Arguments to find a Patient
     * @example
     * // Get one Patient
     * const patient = await prisma.patient.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PatientFindFirstArgs>(args?: SelectSubset<T, PatientFindFirstArgs<ExtArgs>>): Prisma__PatientClient<$Result.GetResult<Prisma.$PatientPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Patient that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PatientFindFirstOrThrowArgs} args - Arguments to find a Patient
     * @example
     * // Get one Patient
     * const patient = await prisma.patient.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PatientFindFirstOrThrowArgs>(args?: SelectSubset<T, PatientFindFirstOrThrowArgs<ExtArgs>>): Prisma__PatientClient<$Result.GetResult<Prisma.$PatientPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Patients that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PatientFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Patients
     * const patients = await prisma.patient.findMany()
     * 
     * // Get first 10 Patients
     * const patients = await prisma.patient.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const patientWithIdOnly = await prisma.patient.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PatientFindManyArgs>(args?: SelectSubset<T, PatientFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PatientPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Patient.
     * @param {PatientCreateArgs} args - Arguments to create a Patient.
     * @example
     * // Create one Patient
     * const Patient = await prisma.patient.create({
     *   data: {
     *     // ... data to create a Patient
     *   }
     * })
     * 
     */
    create<T extends PatientCreateArgs>(args: SelectSubset<T, PatientCreateArgs<ExtArgs>>): Prisma__PatientClient<$Result.GetResult<Prisma.$PatientPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Patients.
     * @param {PatientCreateManyArgs} args - Arguments to create many Patients.
     * @example
     * // Create many Patients
     * const patient = await prisma.patient.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PatientCreateManyArgs>(args?: SelectSubset<T, PatientCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Patients and returns the data saved in the database.
     * @param {PatientCreateManyAndReturnArgs} args - Arguments to create many Patients.
     * @example
     * // Create many Patients
     * const patient = await prisma.patient.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Patients and only return the `id`
     * const patientWithIdOnly = await prisma.patient.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends PatientCreateManyAndReturnArgs>(args?: SelectSubset<T, PatientCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PatientPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Patient.
     * @param {PatientDeleteArgs} args - Arguments to delete one Patient.
     * @example
     * // Delete one Patient
     * const Patient = await prisma.patient.delete({
     *   where: {
     *     // ... filter to delete one Patient
     *   }
     * })
     * 
     */
    delete<T extends PatientDeleteArgs>(args: SelectSubset<T, PatientDeleteArgs<ExtArgs>>): Prisma__PatientClient<$Result.GetResult<Prisma.$PatientPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Patient.
     * @param {PatientUpdateArgs} args - Arguments to update one Patient.
     * @example
     * // Update one Patient
     * const patient = await prisma.patient.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PatientUpdateArgs>(args: SelectSubset<T, PatientUpdateArgs<ExtArgs>>): Prisma__PatientClient<$Result.GetResult<Prisma.$PatientPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Patients.
     * @param {PatientDeleteManyArgs} args - Arguments to filter Patients to delete.
     * @example
     * // Delete a few Patients
     * const { count } = await prisma.patient.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PatientDeleteManyArgs>(args?: SelectSubset<T, PatientDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Patients.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PatientUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Patients
     * const patient = await prisma.patient.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PatientUpdateManyArgs>(args: SelectSubset<T, PatientUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Patient.
     * @param {PatientUpsertArgs} args - Arguments to update or create a Patient.
     * @example
     * // Update or create a Patient
     * const patient = await prisma.patient.upsert({
     *   create: {
     *     // ... data to create a Patient
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Patient we want to update
     *   }
     * })
     */
    upsert<T extends PatientUpsertArgs>(args: SelectSubset<T, PatientUpsertArgs<ExtArgs>>): Prisma__PatientClient<$Result.GetResult<Prisma.$PatientPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Patients.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PatientCountArgs} args - Arguments to filter Patients to count.
     * @example
     * // Count the number of Patients
     * const count = await prisma.patient.count({
     *   where: {
     *     // ... the filter for the Patients we want to count
     *   }
     * })
    **/
    count<T extends PatientCountArgs>(
      args?: Subset<T, PatientCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PatientCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Patient.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PatientAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PatientAggregateArgs>(args: Subset<T, PatientAggregateArgs>): Prisma.PrismaPromise<GetPatientAggregateType<T>>

    /**
     * Group by Patient.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PatientGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends PatientGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PatientGroupByArgs['orderBy'] }
        : { orderBy?: PatientGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, PatientGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPatientGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Patient model
   */
  readonly fields: PatientFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Patient.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PatientClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    address<T extends Patient$addressArgs<ExtArgs> = {}>(args?: Subset<T, Patient$addressArgs<ExtArgs>>): Prisma__PatientAddressClient<$Result.GetResult<Prisma.$PatientAddressPayload<ExtArgs>, T, "findUniqueOrThrow"> | null, null, ExtArgs>
    emergencyContacts<T extends Patient$emergencyContactsArgs<ExtArgs> = {}>(args?: Subset<T, Patient$emergencyContactsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EmergencyContactPayload<ExtArgs>, T, "findMany"> | Null>
    insurances<T extends Patient$insurancesArgs<ExtArgs> = {}>(args?: Subset<T, Patient$insurancesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PatientInsurancePayload<ExtArgs>, T, "findMany"> | Null>
    conditions<T extends Patient$conditionsArgs<ExtArgs> = {}>(args?: Subset<T, Patient$conditionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ConditionPayload<ExtArgs>, T, "findMany"> | Null>
    medications<T extends Patient$medicationsArgs<ExtArgs> = {}>(args?: Subset<T, Patient$medicationsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MedicationRequestPayload<ExtArgs>, T, "findMany"> | Null>
    allergies<T extends Patient$allergiesArgs<ExtArgs> = {}>(args?: Subset<T, Patient$allergiesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AllergyIntolerancePayload<ExtArgs>, T, "findMany"> | Null>
    observations<T extends Patient$observationsArgs<ExtArgs> = {}>(args?: Subset<T, Patient$observationsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ObservationPayload<ExtArgs>, T, "findMany"> | Null>
    immunisations<T extends Patient$immunisationsArgs<ExtArgs> = {}>(args?: Subset<T, Patient$immunisationsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ImmunisationPayload<ExtArgs>, T, "findMany"> | Null>
    encounters<T extends Patient$encountersArgs<ExtArgs> = {}>(args?: Subset<T, Patient$encountersArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EncounterPayload<ExtArgs>, T, "findMany"> | Null>
    appointments<T extends Patient$appointmentsArgs<ExtArgs> = {}>(args?: Subset<T, Patient$appointmentsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AppointmentPayload<ExtArgs>, T, "findMany"> | Null>
    documents<T extends Patient$documentsArgs<ExtArgs> = {}>(args?: Subset<T, Patient$documentsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ClinicalDocumentPayload<ExtArgs>, T, "findMany"> | Null>
    auditLogs<T extends Patient$auditLogsArgs<ExtArgs> = {}>(args?: Subset<T, Patient$auditLogsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Patient model
   */ 
  interface PatientFieldRefs {
    readonly id: FieldRef<"Patient", 'String'>
    readonly mrn: FieldRef<"Patient", 'String'>
    readonly firstName: FieldRef<"Patient", 'String'>
    readonly lastName: FieldRef<"Patient", 'String'>
    readonly preferredName: FieldRef<"Patient", 'String'>
    readonly dateOfBirth: FieldRef<"Patient", 'DateTime'>
    readonly gender: FieldRef<"Patient", 'String'>
    readonly genderIdentity: FieldRef<"Patient", 'String'>
    readonly phone: FieldRef<"Patient", 'String'>
    readonly email: FieldRef<"Patient", 'String'>
    readonly photoUrl: FieldRef<"Patient", 'String'>
    readonly isActive: FieldRef<"Patient", 'Boolean'>
    readonly createdAt: FieldRef<"Patient", 'DateTime'>
    readonly updatedAt: FieldRef<"Patient", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Patient findUnique
   */
  export type PatientFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Patient
     */
    select?: PatientSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PatientInclude<ExtArgs> | null
    /**
     * Filter, which Patient to fetch.
     */
    where: PatientWhereUniqueInput
  }

  /**
   * Patient findUniqueOrThrow
   */
  export type PatientFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Patient
     */
    select?: PatientSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PatientInclude<ExtArgs> | null
    /**
     * Filter, which Patient to fetch.
     */
    where: PatientWhereUniqueInput
  }

  /**
   * Patient findFirst
   */
  export type PatientFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Patient
     */
    select?: PatientSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PatientInclude<ExtArgs> | null
    /**
     * Filter, which Patient to fetch.
     */
    where?: PatientWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Patients to fetch.
     */
    orderBy?: PatientOrderByWithRelationInput | PatientOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Patients.
     */
    cursor?: PatientWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Patients from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Patients.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Patients.
     */
    distinct?: PatientScalarFieldEnum | PatientScalarFieldEnum[]
  }

  /**
   * Patient findFirstOrThrow
   */
  export type PatientFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Patient
     */
    select?: PatientSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PatientInclude<ExtArgs> | null
    /**
     * Filter, which Patient to fetch.
     */
    where?: PatientWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Patients to fetch.
     */
    orderBy?: PatientOrderByWithRelationInput | PatientOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Patients.
     */
    cursor?: PatientWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Patients from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Patients.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Patients.
     */
    distinct?: PatientScalarFieldEnum | PatientScalarFieldEnum[]
  }

  /**
   * Patient findMany
   */
  export type PatientFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Patient
     */
    select?: PatientSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PatientInclude<ExtArgs> | null
    /**
     * Filter, which Patients to fetch.
     */
    where?: PatientWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Patients to fetch.
     */
    orderBy?: PatientOrderByWithRelationInput | PatientOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Patients.
     */
    cursor?: PatientWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Patients from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Patients.
     */
    skip?: number
    distinct?: PatientScalarFieldEnum | PatientScalarFieldEnum[]
  }

  /**
   * Patient create
   */
  export type PatientCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Patient
     */
    select?: PatientSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PatientInclude<ExtArgs> | null
    /**
     * The data needed to create a Patient.
     */
    data: XOR<PatientCreateInput, PatientUncheckedCreateInput>
  }

  /**
   * Patient createMany
   */
  export type PatientCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Patients.
     */
    data: PatientCreateManyInput | PatientCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Patient createManyAndReturn
   */
  export type PatientCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Patient
     */
    select?: PatientSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Patients.
     */
    data: PatientCreateManyInput | PatientCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Patient update
   */
  export type PatientUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Patient
     */
    select?: PatientSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PatientInclude<ExtArgs> | null
    /**
     * The data needed to update a Patient.
     */
    data: XOR<PatientUpdateInput, PatientUncheckedUpdateInput>
    /**
     * Choose, which Patient to update.
     */
    where: PatientWhereUniqueInput
  }

  /**
   * Patient updateMany
   */
  export type PatientUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Patients.
     */
    data: XOR<PatientUpdateManyMutationInput, PatientUncheckedUpdateManyInput>
    /**
     * Filter which Patients to update
     */
    where?: PatientWhereInput
  }

  /**
   * Patient upsert
   */
  export type PatientUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Patient
     */
    select?: PatientSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PatientInclude<ExtArgs> | null
    /**
     * The filter to search for the Patient to update in case it exists.
     */
    where: PatientWhereUniqueInput
    /**
     * In case the Patient found by the `where` argument doesn't exist, create a new Patient with this data.
     */
    create: XOR<PatientCreateInput, PatientUncheckedCreateInput>
    /**
     * In case the Patient was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PatientUpdateInput, PatientUncheckedUpdateInput>
  }

  /**
   * Patient delete
   */
  export type PatientDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Patient
     */
    select?: PatientSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PatientInclude<ExtArgs> | null
    /**
     * Filter which Patient to delete.
     */
    where: PatientWhereUniqueInput
  }

  /**
   * Patient deleteMany
   */
  export type PatientDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Patients to delete
     */
    where?: PatientWhereInput
  }

  /**
   * Patient.address
   */
  export type Patient$addressArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PatientAddress
     */
    select?: PatientAddressSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PatientAddressInclude<ExtArgs> | null
    where?: PatientAddressWhereInput
  }

  /**
   * Patient.emergencyContacts
   */
  export type Patient$emergencyContactsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EmergencyContact
     */
    select?: EmergencyContactSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EmergencyContactInclude<ExtArgs> | null
    where?: EmergencyContactWhereInput
    orderBy?: EmergencyContactOrderByWithRelationInput | EmergencyContactOrderByWithRelationInput[]
    cursor?: EmergencyContactWhereUniqueInput
    take?: number
    skip?: number
    distinct?: EmergencyContactScalarFieldEnum | EmergencyContactScalarFieldEnum[]
  }

  /**
   * Patient.insurances
   */
  export type Patient$insurancesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PatientInsurance
     */
    select?: PatientInsuranceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PatientInsuranceInclude<ExtArgs> | null
    where?: PatientInsuranceWhereInput
    orderBy?: PatientInsuranceOrderByWithRelationInput | PatientInsuranceOrderByWithRelationInput[]
    cursor?: PatientInsuranceWhereUniqueInput
    take?: number
    skip?: number
    distinct?: PatientInsuranceScalarFieldEnum | PatientInsuranceScalarFieldEnum[]
  }

  /**
   * Patient.conditions
   */
  export type Patient$conditionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Condition
     */
    select?: ConditionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConditionInclude<ExtArgs> | null
    where?: ConditionWhereInput
    orderBy?: ConditionOrderByWithRelationInput | ConditionOrderByWithRelationInput[]
    cursor?: ConditionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ConditionScalarFieldEnum | ConditionScalarFieldEnum[]
  }

  /**
   * Patient.medications
   */
  export type Patient$medicationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MedicationRequest
     */
    select?: MedicationRequestSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MedicationRequestInclude<ExtArgs> | null
    where?: MedicationRequestWhereInput
    orderBy?: MedicationRequestOrderByWithRelationInput | MedicationRequestOrderByWithRelationInput[]
    cursor?: MedicationRequestWhereUniqueInput
    take?: number
    skip?: number
    distinct?: MedicationRequestScalarFieldEnum | MedicationRequestScalarFieldEnum[]
  }

  /**
   * Patient.allergies
   */
  export type Patient$allergiesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AllergyIntolerance
     */
    select?: AllergyIntoleranceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AllergyIntoleranceInclude<ExtArgs> | null
    where?: AllergyIntoleranceWhereInput
    orderBy?: AllergyIntoleranceOrderByWithRelationInput | AllergyIntoleranceOrderByWithRelationInput[]
    cursor?: AllergyIntoleranceWhereUniqueInput
    take?: number
    skip?: number
    distinct?: AllergyIntoleranceScalarFieldEnum | AllergyIntoleranceScalarFieldEnum[]
  }

  /**
   * Patient.observations
   */
  export type Patient$observationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Observation
     */
    select?: ObservationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ObservationInclude<ExtArgs> | null
    where?: ObservationWhereInput
    orderBy?: ObservationOrderByWithRelationInput | ObservationOrderByWithRelationInput[]
    cursor?: ObservationWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ObservationScalarFieldEnum | ObservationScalarFieldEnum[]
  }

  /**
   * Patient.immunisations
   */
  export type Patient$immunisationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Immunisation
     */
    select?: ImmunisationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImmunisationInclude<ExtArgs> | null
    where?: ImmunisationWhereInput
    orderBy?: ImmunisationOrderByWithRelationInput | ImmunisationOrderByWithRelationInput[]
    cursor?: ImmunisationWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ImmunisationScalarFieldEnum | ImmunisationScalarFieldEnum[]
  }

  /**
   * Patient.encounters
   */
  export type Patient$encountersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Encounter
     */
    select?: EncounterSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EncounterInclude<ExtArgs> | null
    where?: EncounterWhereInput
    orderBy?: EncounterOrderByWithRelationInput | EncounterOrderByWithRelationInput[]
    cursor?: EncounterWhereUniqueInput
    take?: number
    skip?: number
    distinct?: EncounterScalarFieldEnum | EncounterScalarFieldEnum[]
  }

  /**
   * Patient.appointments
   */
  export type Patient$appointmentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Appointment
     */
    select?: AppointmentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AppointmentInclude<ExtArgs> | null
    where?: AppointmentWhereInput
    orderBy?: AppointmentOrderByWithRelationInput | AppointmentOrderByWithRelationInput[]
    cursor?: AppointmentWhereUniqueInput
    take?: number
    skip?: number
    distinct?: AppointmentScalarFieldEnum | AppointmentScalarFieldEnum[]
  }

  /**
   * Patient.documents
   */
  export type Patient$documentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClinicalDocument
     */
    select?: ClinicalDocumentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClinicalDocumentInclude<ExtArgs> | null
    where?: ClinicalDocumentWhereInput
    orderBy?: ClinicalDocumentOrderByWithRelationInput | ClinicalDocumentOrderByWithRelationInput[]
    cursor?: ClinicalDocumentWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ClinicalDocumentScalarFieldEnum | ClinicalDocumentScalarFieldEnum[]
  }

  /**
   * Patient.auditLogs
   */
  export type Patient$auditLogsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null
    where?: AuditLogWhereInput
    orderBy?: AuditLogOrderByWithRelationInput | AuditLogOrderByWithRelationInput[]
    cursor?: AuditLogWhereUniqueInput
    take?: number
    skip?: number
    distinct?: AuditLogScalarFieldEnum | AuditLogScalarFieldEnum[]
  }

  /**
   * Patient without action
   */
  export type PatientDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Patient
     */
    select?: PatientSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PatientInclude<ExtArgs> | null
  }


  /**
   * Model PatientAddress
   */

  export type AggregatePatientAddress = {
    _count: PatientAddressCountAggregateOutputType | null
    _min: PatientAddressMinAggregateOutputType | null
    _max: PatientAddressMaxAggregateOutputType | null
  }

  export type PatientAddressMinAggregateOutputType = {
    id: string | null
    patientId: string | null
    line1: string | null
    line2: string | null
    city: string | null
    state: string | null
    postalCode: string | null
    country: string | null
  }

  export type PatientAddressMaxAggregateOutputType = {
    id: string | null
    patientId: string | null
    line1: string | null
    line2: string | null
    city: string | null
    state: string | null
    postalCode: string | null
    country: string | null
  }

  export type PatientAddressCountAggregateOutputType = {
    id: number
    patientId: number
    line1: number
    line2: number
    city: number
    state: number
    postalCode: number
    country: number
    _all: number
  }


  export type PatientAddressMinAggregateInputType = {
    id?: true
    patientId?: true
    line1?: true
    line2?: true
    city?: true
    state?: true
    postalCode?: true
    country?: true
  }

  export type PatientAddressMaxAggregateInputType = {
    id?: true
    patientId?: true
    line1?: true
    line2?: true
    city?: true
    state?: true
    postalCode?: true
    country?: true
  }

  export type PatientAddressCountAggregateInputType = {
    id?: true
    patientId?: true
    line1?: true
    line2?: true
    city?: true
    state?: true
    postalCode?: true
    country?: true
    _all?: true
  }

  export type PatientAddressAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PatientAddress to aggregate.
     */
    where?: PatientAddressWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PatientAddresses to fetch.
     */
    orderBy?: PatientAddressOrderByWithRelationInput | PatientAddressOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PatientAddressWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PatientAddresses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PatientAddresses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned PatientAddresses
    **/
    _count?: true | PatientAddressCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PatientAddressMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PatientAddressMaxAggregateInputType
  }

  export type GetPatientAddressAggregateType<T extends PatientAddressAggregateArgs> = {
        [P in keyof T & keyof AggregatePatientAddress]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePatientAddress[P]>
      : GetScalarType<T[P], AggregatePatientAddress[P]>
  }




  export type PatientAddressGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PatientAddressWhereInput
    orderBy?: PatientAddressOrderByWithAggregationInput | PatientAddressOrderByWithAggregationInput[]
    by: PatientAddressScalarFieldEnum[] | PatientAddressScalarFieldEnum
    having?: PatientAddressScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PatientAddressCountAggregateInputType | true
    _min?: PatientAddressMinAggregateInputType
    _max?: PatientAddressMaxAggregateInputType
  }

  export type PatientAddressGroupByOutputType = {
    id: string
    patientId: string
    line1: string | null
    line2: string | null
    city: string | null
    state: string | null
    postalCode: string | null
    country: string
    _count: PatientAddressCountAggregateOutputType | null
    _min: PatientAddressMinAggregateOutputType | null
    _max: PatientAddressMaxAggregateOutputType | null
  }

  type GetPatientAddressGroupByPayload<T extends PatientAddressGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PatientAddressGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PatientAddressGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PatientAddressGroupByOutputType[P]>
            : GetScalarType<T[P], PatientAddressGroupByOutputType[P]>
        }
      >
    >


  export type PatientAddressSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    patientId?: boolean
    line1?: boolean
    line2?: boolean
    city?: boolean
    state?: boolean
    postalCode?: boolean
    country?: boolean
    patient?: boolean | PatientDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["patientAddress"]>

  export type PatientAddressSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    patientId?: boolean
    line1?: boolean
    line2?: boolean
    city?: boolean
    state?: boolean
    postalCode?: boolean
    country?: boolean
    patient?: boolean | PatientDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["patientAddress"]>

  export type PatientAddressSelectScalar = {
    id?: boolean
    patientId?: boolean
    line1?: boolean
    line2?: boolean
    city?: boolean
    state?: boolean
    postalCode?: boolean
    country?: boolean
  }

  export type PatientAddressInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    patient?: boolean | PatientDefaultArgs<ExtArgs>
  }
  export type PatientAddressIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    patient?: boolean | PatientDefaultArgs<ExtArgs>
  }

  export type $PatientAddressPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "PatientAddress"
    objects: {
      patient: Prisma.$PatientPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      patientId: string
      line1: string | null
      line2: string | null
      city: string | null
      state: string | null
      postalCode: string | null
      country: string
    }, ExtArgs["result"]["patientAddress"]>
    composites: {}
  }

  type PatientAddressGetPayload<S extends boolean | null | undefined | PatientAddressDefaultArgs> = $Result.GetResult<Prisma.$PatientAddressPayload, S>

  type PatientAddressCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<PatientAddressFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: PatientAddressCountAggregateInputType | true
    }

  export interface PatientAddressDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['PatientAddress'], meta: { name: 'PatientAddress' } }
    /**
     * Find zero or one PatientAddress that matches the filter.
     * @param {PatientAddressFindUniqueArgs} args - Arguments to find a PatientAddress
     * @example
     * // Get one PatientAddress
     * const patientAddress = await prisma.patientAddress.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PatientAddressFindUniqueArgs>(args: SelectSubset<T, PatientAddressFindUniqueArgs<ExtArgs>>): Prisma__PatientAddressClient<$Result.GetResult<Prisma.$PatientAddressPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one PatientAddress that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {PatientAddressFindUniqueOrThrowArgs} args - Arguments to find a PatientAddress
     * @example
     * // Get one PatientAddress
     * const patientAddress = await prisma.patientAddress.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PatientAddressFindUniqueOrThrowArgs>(args: SelectSubset<T, PatientAddressFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PatientAddressClient<$Result.GetResult<Prisma.$PatientAddressPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first PatientAddress that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PatientAddressFindFirstArgs} args - Arguments to find a PatientAddress
     * @example
     * // Get one PatientAddress
     * const patientAddress = await prisma.patientAddress.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PatientAddressFindFirstArgs>(args?: SelectSubset<T, PatientAddressFindFirstArgs<ExtArgs>>): Prisma__PatientAddressClient<$Result.GetResult<Prisma.$PatientAddressPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first PatientAddress that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PatientAddressFindFirstOrThrowArgs} args - Arguments to find a PatientAddress
     * @example
     * // Get one PatientAddress
     * const patientAddress = await prisma.patientAddress.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PatientAddressFindFirstOrThrowArgs>(args?: SelectSubset<T, PatientAddressFindFirstOrThrowArgs<ExtArgs>>): Prisma__PatientAddressClient<$Result.GetResult<Prisma.$PatientAddressPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more PatientAddresses that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PatientAddressFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all PatientAddresses
     * const patientAddresses = await prisma.patientAddress.findMany()
     * 
     * // Get first 10 PatientAddresses
     * const patientAddresses = await prisma.patientAddress.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const patientAddressWithIdOnly = await prisma.patientAddress.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PatientAddressFindManyArgs>(args?: SelectSubset<T, PatientAddressFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PatientAddressPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a PatientAddress.
     * @param {PatientAddressCreateArgs} args - Arguments to create a PatientAddress.
     * @example
     * // Create one PatientAddress
     * const PatientAddress = await prisma.patientAddress.create({
     *   data: {
     *     // ... data to create a PatientAddress
     *   }
     * })
     * 
     */
    create<T extends PatientAddressCreateArgs>(args: SelectSubset<T, PatientAddressCreateArgs<ExtArgs>>): Prisma__PatientAddressClient<$Result.GetResult<Prisma.$PatientAddressPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many PatientAddresses.
     * @param {PatientAddressCreateManyArgs} args - Arguments to create many PatientAddresses.
     * @example
     * // Create many PatientAddresses
     * const patientAddress = await prisma.patientAddress.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PatientAddressCreateManyArgs>(args?: SelectSubset<T, PatientAddressCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many PatientAddresses and returns the data saved in the database.
     * @param {PatientAddressCreateManyAndReturnArgs} args - Arguments to create many PatientAddresses.
     * @example
     * // Create many PatientAddresses
     * const patientAddress = await prisma.patientAddress.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many PatientAddresses and only return the `id`
     * const patientAddressWithIdOnly = await prisma.patientAddress.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends PatientAddressCreateManyAndReturnArgs>(args?: SelectSubset<T, PatientAddressCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PatientAddressPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a PatientAddress.
     * @param {PatientAddressDeleteArgs} args - Arguments to delete one PatientAddress.
     * @example
     * // Delete one PatientAddress
     * const PatientAddress = await prisma.patientAddress.delete({
     *   where: {
     *     // ... filter to delete one PatientAddress
     *   }
     * })
     * 
     */
    delete<T extends PatientAddressDeleteArgs>(args: SelectSubset<T, PatientAddressDeleteArgs<ExtArgs>>): Prisma__PatientAddressClient<$Result.GetResult<Prisma.$PatientAddressPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one PatientAddress.
     * @param {PatientAddressUpdateArgs} args - Arguments to update one PatientAddress.
     * @example
     * // Update one PatientAddress
     * const patientAddress = await prisma.patientAddress.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PatientAddressUpdateArgs>(args: SelectSubset<T, PatientAddressUpdateArgs<ExtArgs>>): Prisma__PatientAddressClient<$Result.GetResult<Prisma.$PatientAddressPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more PatientAddresses.
     * @param {PatientAddressDeleteManyArgs} args - Arguments to filter PatientAddresses to delete.
     * @example
     * // Delete a few PatientAddresses
     * const { count } = await prisma.patientAddress.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PatientAddressDeleteManyArgs>(args?: SelectSubset<T, PatientAddressDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PatientAddresses.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PatientAddressUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many PatientAddresses
     * const patientAddress = await prisma.patientAddress.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PatientAddressUpdateManyArgs>(args: SelectSubset<T, PatientAddressUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one PatientAddress.
     * @param {PatientAddressUpsertArgs} args - Arguments to update or create a PatientAddress.
     * @example
     * // Update or create a PatientAddress
     * const patientAddress = await prisma.patientAddress.upsert({
     *   create: {
     *     // ... data to create a PatientAddress
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the PatientAddress we want to update
     *   }
     * })
     */
    upsert<T extends PatientAddressUpsertArgs>(args: SelectSubset<T, PatientAddressUpsertArgs<ExtArgs>>): Prisma__PatientAddressClient<$Result.GetResult<Prisma.$PatientAddressPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of PatientAddresses.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PatientAddressCountArgs} args - Arguments to filter PatientAddresses to count.
     * @example
     * // Count the number of PatientAddresses
     * const count = await prisma.patientAddress.count({
     *   where: {
     *     // ... the filter for the PatientAddresses we want to count
     *   }
     * })
    **/
    count<T extends PatientAddressCountArgs>(
      args?: Subset<T, PatientAddressCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PatientAddressCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a PatientAddress.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PatientAddressAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PatientAddressAggregateArgs>(args: Subset<T, PatientAddressAggregateArgs>): Prisma.PrismaPromise<GetPatientAddressAggregateType<T>>

    /**
     * Group by PatientAddress.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PatientAddressGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends PatientAddressGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PatientAddressGroupByArgs['orderBy'] }
        : { orderBy?: PatientAddressGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, PatientAddressGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPatientAddressGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the PatientAddress model
   */
  readonly fields: PatientAddressFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for PatientAddress.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PatientAddressClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    patient<T extends PatientDefaultArgs<ExtArgs> = {}>(args?: Subset<T, PatientDefaultArgs<ExtArgs>>): Prisma__PatientClient<$Result.GetResult<Prisma.$PatientPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the PatientAddress model
   */ 
  interface PatientAddressFieldRefs {
    readonly id: FieldRef<"PatientAddress", 'String'>
    readonly patientId: FieldRef<"PatientAddress", 'String'>
    readonly line1: FieldRef<"PatientAddress", 'String'>
    readonly line2: FieldRef<"PatientAddress", 'String'>
    readonly city: FieldRef<"PatientAddress", 'String'>
    readonly state: FieldRef<"PatientAddress", 'String'>
    readonly postalCode: FieldRef<"PatientAddress", 'String'>
    readonly country: FieldRef<"PatientAddress", 'String'>
  }
    

  // Custom InputTypes
  /**
   * PatientAddress findUnique
   */
  export type PatientAddressFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PatientAddress
     */
    select?: PatientAddressSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PatientAddressInclude<ExtArgs> | null
    /**
     * Filter, which PatientAddress to fetch.
     */
    where: PatientAddressWhereUniqueInput
  }

  /**
   * PatientAddress findUniqueOrThrow
   */
  export type PatientAddressFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PatientAddress
     */
    select?: PatientAddressSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PatientAddressInclude<ExtArgs> | null
    /**
     * Filter, which PatientAddress to fetch.
     */
    where: PatientAddressWhereUniqueInput
  }

  /**
   * PatientAddress findFirst
   */
  export type PatientAddressFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PatientAddress
     */
    select?: PatientAddressSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PatientAddressInclude<ExtArgs> | null
    /**
     * Filter, which PatientAddress to fetch.
     */
    where?: PatientAddressWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PatientAddresses to fetch.
     */
    orderBy?: PatientAddressOrderByWithRelationInput | PatientAddressOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PatientAddresses.
     */
    cursor?: PatientAddressWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PatientAddresses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PatientAddresses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PatientAddresses.
     */
    distinct?: PatientAddressScalarFieldEnum | PatientAddressScalarFieldEnum[]
  }

  /**
   * PatientAddress findFirstOrThrow
   */
  export type PatientAddressFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PatientAddress
     */
    select?: PatientAddressSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PatientAddressInclude<ExtArgs> | null
    /**
     * Filter, which PatientAddress to fetch.
     */
    where?: PatientAddressWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PatientAddresses to fetch.
     */
    orderBy?: PatientAddressOrderByWithRelationInput | PatientAddressOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PatientAddresses.
     */
    cursor?: PatientAddressWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PatientAddresses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PatientAddresses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PatientAddresses.
     */
    distinct?: PatientAddressScalarFieldEnum | PatientAddressScalarFieldEnum[]
  }

  /**
   * PatientAddress findMany
   */
  export type PatientAddressFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PatientAddress
     */
    select?: PatientAddressSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PatientAddressInclude<ExtArgs> | null
    /**
     * Filter, which PatientAddresses to fetch.
     */
    where?: PatientAddressWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PatientAddresses to fetch.
     */
    orderBy?: PatientAddressOrderByWithRelationInput | PatientAddressOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing PatientAddresses.
     */
    cursor?: PatientAddressWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PatientAddresses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PatientAddresses.
     */
    skip?: number
    distinct?: PatientAddressScalarFieldEnum | PatientAddressScalarFieldEnum[]
  }

  /**
   * PatientAddress create
   */
  export type PatientAddressCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PatientAddress
     */
    select?: PatientAddressSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PatientAddressInclude<ExtArgs> | null
    /**
     * The data needed to create a PatientAddress.
     */
    data: XOR<PatientAddressCreateInput, PatientAddressUncheckedCreateInput>
  }

  /**
   * PatientAddress createMany
   */
  export type PatientAddressCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many PatientAddresses.
     */
    data: PatientAddressCreateManyInput | PatientAddressCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * PatientAddress createManyAndReturn
   */
  export type PatientAddressCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PatientAddress
     */
    select?: PatientAddressSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many PatientAddresses.
     */
    data: PatientAddressCreateManyInput | PatientAddressCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PatientAddressIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * PatientAddress update
   */
  export type PatientAddressUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PatientAddress
     */
    select?: PatientAddressSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PatientAddressInclude<ExtArgs> | null
    /**
     * The data needed to update a PatientAddress.
     */
    data: XOR<PatientAddressUpdateInput, PatientAddressUncheckedUpdateInput>
    /**
     * Choose, which PatientAddress to update.
     */
    where: PatientAddressWhereUniqueInput
  }

  /**
   * PatientAddress updateMany
   */
  export type PatientAddressUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update PatientAddresses.
     */
    data: XOR<PatientAddressUpdateManyMutationInput, PatientAddressUncheckedUpdateManyInput>
    /**
     * Filter which PatientAddresses to update
     */
    where?: PatientAddressWhereInput
  }

  /**
   * PatientAddress upsert
   */
  export type PatientAddressUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PatientAddress
     */
    select?: PatientAddressSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PatientAddressInclude<ExtArgs> | null
    /**
     * The filter to search for the PatientAddress to update in case it exists.
     */
    where: PatientAddressWhereUniqueInput
    /**
     * In case the PatientAddress found by the `where` argument doesn't exist, create a new PatientAddress with this data.
     */
    create: XOR<PatientAddressCreateInput, PatientAddressUncheckedCreateInput>
    /**
     * In case the PatientAddress was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PatientAddressUpdateInput, PatientAddressUncheckedUpdateInput>
  }

  /**
   * PatientAddress delete
   */
  export type PatientAddressDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PatientAddress
     */
    select?: PatientAddressSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PatientAddressInclude<ExtArgs> | null
    /**
     * Filter which PatientAddress to delete.
     */
    where: PatientAddressWhereUniqueInput
  }

  /**
   * PatientAddress deleteMany
   */
  export type PatientAddressDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PatientAddresses to delete
     */
    where?: PatientAddressWhereInput
  }

  /**
   * PatientAddress without action
   */
  export type PatientAddressDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PatientAddress
     */
    select?: PatientAddressSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PatientAddressInclude<ExtArgs> | null
  }


  /**
   * Model EmergencyContact
   */

  export type AggregateEmergencyContact = {
    _count: EmergencyContactCountAggregateOutputType | null
    _min: EmergencyContactMinAggregateOutputType | null
    _max: EmergencyContactMaxAggregateOutputType | null
  }

  export type EmergencyContactMinAggregateOutputType = {
    id: string | null
    patientId: string | null
    name: string | null
    relationship: string | null
    phone: string | null
  }

  export type EmergencyContactMaxAggregateOutputType = {
    id: string | null
    patientId: string | null
    name: string | null
    relationship: string | null
    phone: string | null
  }

  export type EmergencyContactCountAggregateOutputType = {
    id: number
    patientId: number
    name: number
    relationship: number
    phone: number
    _all: number
  }


  export type EmergencyContactMinAggregateInputType = {
    id?: true
    patientId?: true
    name?: true
    relationship?: true
    phone?: true
  }

  export type EmergencyContactMaxAggregateInputType = {
    id?: true
    patientId?: true
    name?: true
    relationship?: true
    phone?: true
  }

  export type EmergencyContactCountAggregateInputType = {
    id?: true
    patientId?: true
    name?: true
    relationship?: true
    phone?: true
    _all?: true
  }

  export type EmergencyContactAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which EmergencyContact to aggregate.
     */
    where?: EmergencyContactWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of EmergencyContacts to fetch.
     */
    orderBy?: EmergencyContactOrderByWithRelationInput | EmergencyContactOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: EmergencyContactWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` EmergencyContacts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` EmergencyContacts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned EmergencyContacts
    **/
    _count?: true | EmergencyContactCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: EmergencyContactMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: EmergencyContactMaxAggregateInputType
  }

  export type GetEmergencyContactAggregateType<T extends EmergencyContactAggregateArgs> = {
        [P in keyof T & keyof AggregateEmergencyContact]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateEmergencyContact[P]>
      : GetScalarType<T[P], AggregateEmergencyContact[P]>
  }




  export type EmergencyContactGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: EmergencyContactWhereInput
    orderBy?: EmergencyContactOrderByWithAggregationInput | EmergencyContactOrderByWithAggregationInput[]
    by: EmergencyContactScalarFieldEnum[] | EmergencyContactScalarFieldEnum
    having?: EmergencyContactScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: EmergencyContactCountAggregateInputType | true
    _min?: EmergencyContactMinAggregateInputType
    _max?: EmergencyContactMaxAggregateInputType
  }

  export type EmergencyContactGroupByOutputType = {
    id: string
    patientId: string
    name: string
    relationship: string
    phone: string
    _count: EmergencyContactCountAggregateOutputType | null
    _min: EmergencyContactMinAggregateOutputType | null
    _max: EmergencyContactMaxAggregateOutputType | null
  }

  type GetEmergencyContactGroupByPayload<T extends EmergencyContactGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<EmergencyContactGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof EmergencyContactGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], EmergencyContactGroupByOutputType[P]>
            : GetScalarType<T[P], EmergencyContactGroupByOutputType[P]>
        }
      >
    >


  export type EmergencyContactSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    patientId?: boolean
    name?: boolean
    relationship?: boolean
    phone?: boolean
    patient?: boolean | PatientDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["emergencyContact"]>

  export type EmergencyContactSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    patientId?: boolean
    name?: boolean
    relationship?: boolean
    phone?: boolean
    patient?: boolean | PatientDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["emergencyContact"]>

  export type EmergencyContactSelectScalar = {
    id?: boolean
    patientId?: boolean
    name?: boolean
    relationship?: boolean
    phone?: boolean
  }

  export type EmergencyContactInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    patient?: boolean | PatientDefaultArgs<ExtArgs>
  }
  export type EmergencyContactIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    patient?: boolean | PatientDefaultArgs<ExtArgs>
  }

  export type $EmergencyContactPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "EmergencyContact"
    objects: {
      patient: Prisma.$PatientPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      patientId: string
      name: string
      relationship: string
      phone: string
    }, ExtArgs["result"]["emergencyContact"]>
    composites: {}
  }

  type EmergencyContactGetPayload<S extends boolean | null | undefined | EmergencyContactDefaultArgs> = $Result.GetResult<Prisma.$EmergencyContactPayload, S>

  type EmergencyContactCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<EmergencyContactFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: EmergencyContactCountAggregateInputType | true
    }

  export interface EmergencyContactDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['EmergencyContact'], meta: { name: 'EmergencyContact' } }
    /**
     * Find zero or one EmergencyContact that matches the filter.
     * @param {EmergencyContactFindUniqueArgs} args - Arguments to find a EmergencyContact
     * @example
     * // Get one EmergencyContact
     * const emergencyContact = await prisma.emergencyContact.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends EmergencyContactFindUniqueArgs>(args: SelectSubset<T, EmergencyContactFindUniqueArgs<ExtArgs>>): Prisma__EmergencyContactClient<$Result.GetResult<Prisma.$EmergencyContactPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one EmergencyContact that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {EmergencyContactFindUniqueOrThrowArgs} args - Arguments to find a EmergencyContact
     * @example
     * // Get one EmergencyContact
     * const emergencyContact = await prisma.emergencyContact.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends EmergencyContactFindUniqueOrThrowArgs>(args: SelectSubset<T, EmergencyContactFindUniqueOrThrowArgs<ExtArgs>>): Prisma__EmergencyContactClient<$Result.GetResult<Prisma.$EmergencyContactPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first EmergencyContact that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EmergencyContactFindFirstArgs} args - Arguments to find a EmergencyContact
     * @example
     * // Get one EmergencyContact
     * const emergencyContact = await prisma.emergencyContact.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends EmergencyContactFindFirstArgs>(args?: SelectSubset<T, EmergencyContactFindFirstArgs<ExtArgs>>): Prisma__EmergencyContactClient<$Result.GetResult<Prisma.$EmergencyContactPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first EmergencyContact that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EmergencyContactFindFirstOrThrowArgs} args - Arguments to find a EmergencyContact
     * @example
     * // Get one EmergencyContact
     * const emergencyContact = await prisma.emergencyContact.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends EmergencyContactFindFirstOrThrowArgs>(args?: SelectSubset<T, EmergencyContactFindFirstOrThrowArgs<ExtArgs>>): Prisma__EmergencyContactClient<$Result.GetResult<Prisma.$EmergencyContactPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more EmergencyContacts that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EmergencyContactFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all EmergencyContacts
     * const emergencyContacts = await prisma.emergencyContact.findMany()
     * 
     * // Get first 10 EmergencyContacts
     * const emergencyContacts = await prisma.emergencyContact.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const emergencyContactWithIdOnly = await prisma.emergencyContact.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends EmergencyContactFindManyArgs>(args?: SelectSubset<T, EmergencyContactFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EmergencyContactPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a EmergencyContact.
     * @param {EmergencyContactCreateArgs} args - Arguments to create a EmergencyContact.
     * @example
     * // Create one EmergencyContact
     * const EmergencyContact = await prisma.emergencyContact.create({
     *   data: {
     *     // ... data to create a EmergencyContact
     *   }
     * })
     * 
     */
    create<T extends EmergencyContactCreateArgs>(args: SelectSubset<T, EmergencyContactCreateArgs<ExtArgs>>): Prisma__EmergencyContactClient<$Result.GetResult<Prisma.$EmergencyContactPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many EmergencyContacts.
     * @param {EmergencyContactCreateManyArgs} args - Arguments to create many EmergencyContacts.
     * @example
     * // Create many EmergencyContacts
     * const emergencyContact = await prisma.emergencyContact.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends EmergencyContactCreateManyArgs>(args?: SelectSubset<T, EmergencyContactCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many EmergencyContacts and returns the data saved in the database.
     * @param {EmergencyContactCreateManyAndReturnArgs} args - Arguments to create many EmergencyContacts.
     * @example
     * // Create many EmergencyContacts
     * const emergencyContact = await prisma.emergencyContact.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many EmergencyContacts and only return the `id`
     * const emergencyContactWithIdOnly = await prisma.emergencyContact.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends EmergencyContactCreateManyAndReturnArgs>(args?: SelectSubset<T, EmergencyContactCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EmergencyContactPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a EmergencyContact.
     * @param {EmergencyContactDeleteArgs} args - Arguments to delete one EmergencyContact.
     * @example
     * // Delete one EmergencyContact
     * const EmergencyContact = await prisma.emergencyContact.delete({
     *   where: {
     *     // ... filter to delete one EmergencyContact
     *   }
     * })
     * 
     */
    delete<T extends EmergencyContactDeleteArgs>(args: SelectSubset<T, EmergencyContactDeleteArgs<ExtArgs>>): Prisma__EmergencyContactClient<$Result.GetResult<Prisma.$EmergencyContactPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one EmergencyContact.
     * @param {EmergencyContactUpdateArgs} args - Arguments to update one EmergencyContact.
     * @example
     * // Update one EmergencyContact
     * const emergencyContact = await prisma.emergencyContact.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends EmergencyContactUpdateArgs>(args: SelectSubset<T, EmergencyContactUpdateArgs<ExtArgs>>): Prisma__EmergencyContactClient<$Result.GetResult<Prisma.$EmergencyContactPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more EmergencyContacts.
     * @param {EmergencyContactDeleteManyArgs} args - Arguments to filter EmergencyContacts to delete.
     * @example
     * // Delete a few EmergencyContacts
     * const { count } = await prisma.emergencyContact.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends EmergencyContactDeleteManyArgs>(args?: SelectSubset<T, EmergencyContactDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more EmergencyContacts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EmergencyContactUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many EmergencyContacts
     * const emergencyContact = await prisma.emergencyContact.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends EmergencyContactUpdateManyArgs>(args: SelectSubset<T, EmergencyContactUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one EmergencyContact.
     * @param {EmergencyContactUpsertArgs} args - Arguments to update or create a EmergencyContact.
     * @example
     * // Update or create a EmergencyContact
     * const emergencyContact = await prisma.emergencyContact.upsert({
     *   create: {
     *     // ... data to create a EmergencyContact
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the EmergencyContact we want to update
     *   }
     * })
     */
    upsert<T extends EmergencyContactUpsertArgs>(args: SelectSubset<T, EmergencyContactUpsertArgs<ExtArgs>>): Prisma__EmergencyContactClient<$Result.GetResult<Prisma.$EmergencyContactPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of EmergencyContacts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EmergencyContactCountArgs} args - Arguments to filter EmergencyContacts to count.
     * @example
     * // Count the number of EmergencyContacts
     * const count = await prisma.emergencyContact.count({
     *   where: {
     *     // ... the filter for the EmergencyContacts we want to count
     *   }
     * })
    **/
    count<T extends EmergencyContactCountArgs>(
      args?: Subset<T, EmergencyContactCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], EmergencyContactCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a EmergencyContact.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EmergencyContactAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends EmergencyContactAggregateArgs>(args: Subset<T, EmergencyContactAggregateArgs>): Prisma.PrismaPromise<GetEmergencyContactAggregateType<T>>

    /**
     * Group by EmergencyContact.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EmergencyContactGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends EmergencyContactGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: EmergencyContactGroupByArgs['orderBy'] }
        : { orderBy?: EmergencyContactGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, EmergencyContactGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetEmergencyContactGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the EmergencyContact model
   */
  readonly fields: EmergencyContactFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for EmergencyContact.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__EmergencyContactClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    patient<T extends PatientDefaultArgs<ExtArgs> = {}>(args?: Subset<T, PatientDefaultArgs<ExtArgs>>): Prisma__PatientClient<$Result.GetResult<Prisma.$PatientPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the EmergencyContact model
   */ 
  interface EmergencyContactFieldRefs {
    readonly id: FieldRef<"EmergencyContact", 'String'>
    readonly patientId: FieldRef<"EmergencyContact", 'String'>
    readonly name: FieldRef<"EmergencyContact", 'String'>
    readonly relationship: FieldRef<"EmergencyContact", 'String'>
    readonly phone: FieldRef<"EmergencyContact", 'String'>
  }
    

  // Custom InputTypes
  /**
   * EmergencyContact findUnique
   */
  export type EmergencyContactFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EmergencyContact
     */
    select?: EmergencyContactSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EmergencyContactInclude<ExtArgs> | null
    /**
     * Filter, which EmergencyContact to fetch.
     */
    where: EmergencyContactWhereUniqueInput
  }

  /**
   * EmergencyContact findUniqueOrThrow
   */
  export type EmergencyContactFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EmergencyContact
     */
    select?: EmergencyContactSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EmergencyContactInclude<ExtArgs> | null
    /**
     * Filter, which EmergencyContact to fetch.
     */
    where: EmergencyContactWhereUniqueInput
  }

  /**
   * EmergencyContact findFirst
   */
  export type EmergencyContactFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EmergencyContact
     */
    select?: EmergencyContactSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EmergencyContactInclude<ExtArgs> | null
    /**
     * Filter, which EmergencyContact to fetch.
     */
    where?: EmergencyContactWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of EmergencyContacts to fetch.
     */
    orderBy?: EmergencyContactOrderByWithRelationInput | EmergencyContactOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for EmergencyContacts.
     */
    cursor?: EmergencyContactWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` EmergencyContacts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` EmergencyContacts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of EmergencyContacts.
     */
    distinct?: EmergencyContactScalarFieldEnum | EmergencyContactScalarFieldEnum[]
  }

  /**
   * EmergencyContact findFirstOrThrow
   */
  export type EmergencyContactFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EmergencyContact
     */
    select?: EmergencyContactSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EmergencyContactInclude<ExtArgs> | null
    /**
     * Filter, which EmergencyContact to fetch.
     */
    where?: EmergencyContactWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of EmergencyContacts to fetch.
     */
    orderBy?: EmergencyContactOrderByWithRelationInput | EmergencyContactOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for EmergencyContacts.
     */
    cursor?: EmergencyContactWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` EmergencyContacts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` EmergencyContacts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of EmergencyContacts.
     */
    distinct?: EmergencyContactScalarFieldEnum | EmergencyContactScalarFieldEnum[]
  }

  /**
   * EmergencyContact findMany
   */
  export type EmergencyContactFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EmergencyContact
     */
    select?: EmergencyContactSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EmergencyContactInclude<ExtArgs> | null
    /**
     * Filter, which EmergencyContacts to fetch.
     */
    where?: EmergencyContactWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of EmergencyContacts to fetch.
     */
    orderBy?: EmergencyContactOrderByWithRelationInput | EmergencyContactOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing EmergencyContacts.
     */
    cursor?: EmergencyContactWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` EmergencyContacts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` EmergencyContacts.
     */
    skip?: number
    distinct?: EmergencyContactScalarFieldEnum | EmergencyContactScalarFieldEnum[]
  }

  /**
   * EmergencyContact create
   */
  export type EmergencyContactCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EmergencyContact
     */
    select?: EmergencyContactSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EmergencyContactInclude<ExtArgs> | null
    /**
     * The data needed to create a EmergencyContact.
     */
    data: XOR<EmergencyContactCreateInput, EmergencyContactUncheckedCreateInput>
  }

  /**
   * EmergencyContact createMany
   */
  export type EmergencyContactCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many EmergencyContacts.
     */
    data: EmergencyContactCreateManyInput | EmergencyContactCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * EmergencyContact createManyAndReturn
   */
  export type EmergencyContactCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EmergencyContact
     */
    select?: EmergencyContactSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many EmergencyContacts.
     */
    data: EmergencyContactCreateManyInput | EmergencyContactCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EmergencyContactIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * EmergencyContact update
   */
  export type EmergencyContactUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EmergencyContact
     */
    select?: EmergencyContactSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EmergencyContactInclude<ExtArgs> | null
    /**
     * The data needed to update a EmergencyContact.
     */
    data: XOR<EmergencyContactUpdateInput, EmergencyContactUncheckedUpdateInput>
    /**
     * Choose, which EmergencyContact to update.
     */
    where: EmergencyContactWhereUniqueInput
  }

  /**
   * EmergencyContact updateMany
   */
  export type EmergencyContactUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update EmergencyContacts.
     */
    data: XOR<EmergencyContactUpdateManyMutationInput, EmergencyContactUncheckedUpdateManyInput>
    /**
     * Filter which EmergencyContacts to update
     */
    where?: EmergencyContactWhereInput
  }

  /**
   * EmergencyContact upsert
   */
  export type EmergencyContactUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EmergencyContact
     */
    select?: EmergencyContactSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EmergencyContactInclude<ExtArgs> | null
    /**
     * The filter to search for the EmergencyContact to update in case it exists.
     */
    where: EmergencyContactWhereUniqueInput
    /**
     * In case the EmergencyContact found by the `where` argument doesn't exist, create a new EmergencyContact with this data.
     */
    create: XOR<EmergencyContactCreateInput, EmergencyContactUncheckedCreateInput>
    /**
     * In case the EmergencyContact was found with the provided `where` argument, update it with this data.
     */
    update: XOR<EmergencyContactUpdateInput, EmergencyContactUncheckedUpdateInput>
  }

  /**
   * EmergencyContact delete
   */
  export type EmergencyContactDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EmergencyContact
     */
    select?: EmergencyContactSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EmergencyContactInclude<ExtArgs> | null
    /**
     * Filter which EmergencyContact to delete.
     */
    where: EmergencyContactWhereUniqueInput
  }

  /**
   * EmergencyContact deleteMany
   */
  export type EmergencyContactDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which EmergencyContacts to delete
     */
    where?: EmergencyContactWhereInput
  }

  /**
   * EmergencyContact without action
   */
  export type EmergencyContactDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EmergencyContact
     */
    select?: EmergencyContactSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EmergencyContactInclude<ExtArgs> | null
  }


  /**
   * Model PatientInsurance
   */

  export type AggregatePatientInsurance = {
    _count: PatientInsuranceCountAggregateOutputType | null
    _avg: PatientInsuranceAvgAggregateOutputType | null
    _sum: PatientInsuranceSumAggregateOutputType | null
    _min: PatientInsuranceMinAggregateOutputType | null
    _max: PatientInsuranceMaxAggregateOutputType | null
  }

  export type PatientInsuranceAvgAggregateOutputType = {
    priority: number | null
  }

  export type PatientInsuranceSumAggregateOutputType = {
    priority: number | null
  }

  export type PatientInsuranceMinAggregateOutputType = {
    id: string | null
    patientId: string | null
    priority: number | null
    payerName: string | null
    memberId: string | null
    groupId: string | null
    subscriberName: string | null
    isActive: boolean | null
    createdAt: Date | null
  }

  export type PatientInsuranceMaxAggregateOutputType = {
    id: string | null
    patientId: string | null
    priority: number | null
    payerName: string | null
    memberId: string | null
    groupId: string | null
    subscriberName: string | null
    isActive: boolean | null
    createdAt: Date | null
  }

  export type PatientInsuranceCountAggregateOutputType = {
    id: number
    patientId: number
    priority: number
    payerName: number
    memberId: number
    groupId: number
    subscriberName: number
    isActive: number
    createdAt: number
    _all: number
  }


  export type PatientInsuranceAvgAggregateInputType = {
    priority?: true
  }

  export type PatientInsuranceSumAggregateInputType = {
    priority?: true
  }

  export type PatientInsuranceMinAggregateInputType = {
    id?: true
    patientId?: true
    priority?: true
    payerName?: true
    memberId?: true
    groupId?: true
    subscriberName?: true
    isActive?: true
    createdAt?: true
  }

  export type PatientInsuranceMaxAggregateInputType = {
    id?: true
    patientId?: true
    priority?: true
    payerName?: true
    memberId?: true
    groupId?: true
    subscriberName?: true
    isActive?: true
    createdAt?: true
  }

  export type PatientInsuranceCountAggregateInputType = {
    id?: true
    patientId?: true
    priority?: true
    payerName?: true
    memberId?: true
    groupId?: true
    subscriberName?: true
    isActive?: true
    createdAt?: true
    _all?: true
  }

  export type PatientInsuranceAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PatientInsurance to aggregate.
     */
    where?: PatientInsuranceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PatientInsurances to fetch.
     */
    orderBy?: PatientInsuranceOrderByWithRelationInput | PatientInsuranceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PatientInsuranceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PatientInsurances from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PatientInsurances.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned PatientInsurances
    **/
    _count?: true | PatientInsuranceCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: PatientInsuranceAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: PatientInsuranceSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PatientInsuranceMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PatientInsuranceMaxAggregateInputType
  }

  export type GetPatientInsuranceAggregateType<T extends PatientInsuranceAggregateArgs> = {
        [P in keyof T & keyof AggregatePatientInsurance]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePatientInsurance[P]>
      : GetScalarType<T[P], AggregatePatientInsurance[P]>
  }




  export type PatientInsuranceGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PatientInsuranceWhereInput
    orderBy?: PatientInsuranceOrderByWithAggregationInput | PatientInsuranceOrderByWithAggregationInput[]
    by: PatientInsuranceScalarFieldEnum[] | PatientInsuranceScalarFieldEnum
    having?: PatientInsuranceScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PatientInsuranceCountAggregateInputType | true
    _avg?: PatientInsuranceAvgAggregateInputType
    _sum?: PatientInsuranceSumAggregateInputType
    _min?: PatientInsuranceMinAggregateInputType
    _max?: PatientInsuranceMaxAggregateInputType
  }

  export type PatientInsuranceGroupByOutputType = {
    id: string
    patientId: string
    priority: number
    payerName: string
    memberId: string
    groupId: string | null
    subscriberName: string | null
    isActive: boolean
    createdAt: Date
    _count: PatientInsuranceCountAggregateOutputType | null
    _avg: PatientInsuranceAvgAggregateOutputType | null
    _sum: PatientInsuranceSumAggregateOutputType | null
    _min: PatientInsuranceMinAggregateOutputType | null
    _max: PatientInsuranceMaxAggregateOutputType | null
  }

  type GetPatientInsuranceGroupByPayload<T extends PatientInsuranceGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PatientInsuranceGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PatientInsuranceGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PatientInsuranceGroupByOutputType[P]>
            : GetScalarType<T[P], PatientInsuranceGroupByOutputType[P]>
        }
      >
    >


  export type PatientInsuranceSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    patientId?: boolean
    priority?: boolean
    payerName?: boolean
    memberId?: boolean
    groupId?: boolean
    subscriberName?: boolean
    isActive?: boolean
    createdAt?: boolean
    patient?: boolean | PatientDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["patientInsurance"]>

  export type PatientInsuranceSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    patientId?: boolean
    priority?: boolean
    payerName?: boolean
    memberId?: boolean
    groupId?: boolean
    subscriberName?: boolean
    isActive?: boolean
    createdAt?: boolean
    patient?: boolean | PatientDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["patientInsurance"]>

  export type PatientInsuranceSelectScalar = {
    id?: boolean
    patientId?: boolean
    priority?: boolean
    payerName?: boolean
    memberId?: boolean
    groupId?: boolean
    subscriberName?: boolean
    isActive?: boolean
    createdAt?: boolean
  }

  export type PatientInsuranceInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    patient?: boolean | PatientDefaultArgs<ExtArgs>
  }
  export type PatientInsuranceIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    patient?: boolean | PatientDefaultArgs<ExtArgs>
  }

  export type $PatientInsurancePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "PatientInsurance"
    objects: {
      patient: Prisma.$PatientPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      patientId: string
      priority: number
      payerName: string
      memberId: string
      groupId: string | null
      subscriberName: string | null
      isActive: boolean
      createdAt: Date
    }, ExtArgs["result"]["patientInsurance"]>
    composites: {}
  }

  type PatientInsuranceGetPayload<S extends boolean | null | undefined | PatientInsuranceDefaultArgs> = $Result.GetResult<Prisma.$PatientInsurancePayload, S>

  type PatientInsuranceCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<PatientInsuranceFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: PatientInsuranceCountAggregateInputType | true
    }

  export interface PatientInsuranceDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['PatientInsurance'], meta: { name: 'PatientInsurance' } }
    /**
     * Find zero or one PatientInsurance that matches the filter.
     * @param {PatientInsuranceFindUniqueArgs} args - Arguments to find a PatientInsurance
     * @example
     * // Get one PatientInsurance
     * const patientInsurance = await prisma.patientInsurance.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PatientInsuranceFindUniqueArgs>(args: SelectSubset<T, PatientInsuranceFindUniqueArgs<ExtArgs>>): Prisma__PatientInsuranceClient<$Result.GetResult<Prisma.$PatientInsurancePayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one PatientInsurance that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {PatientInsuranceFindUniqueOrThrowArgs} args - Arguments to find a PatientInsurance
     * @example
     * // Get one PatientInsurance
     * const patientInsurance = await prisma.patientInsurance.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PatientInsuranceFindUniqueOrThrowArgs>(args: SelectSubset<T, PatientInsuranceFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PatientInsuranceClient<$Result.GetResult<Prisma.$PatientInsurancePayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first PatientInsurance that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PatientInsuranceFindFirstArgs} args - Arguments to find a PatientInsurance
     * @example
     * // Get one PatientInsurance
     * const patientInsurance = await prisma.patientInsurance.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PatientInsuranceFindFirstArgs>(args?: SelectSubset<T, PatientInsuranceFindFirstArgs<ExtArgs>>): Prisma__PatientInsuranceClient<$Result.GetResult<Prisma.$PatientInsurancePayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first PatientInsurance that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PatientInsuranceFindFirstOrThrowArgs} args - Arguments to find a PatientInsurance
     * @example
     * // Get one PatientInsurance
     * const patientInsurance = await prisma.patientInsurance.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PatientInsuranceFindFirstOrThrowArgs>(args?: SelectSubset<T, PatientInsuranceFindFirstOrThrowArgs<ExtArgs>>): Prisma__PatientInsuranceClient<$Result.GetResult<Prisma.$PatientInsurancePayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more PatientInsurances that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PatientInsuranceFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all PatientInsurances
     * const patientInsurances = await prisma.patientInsurance.findMany()
     * 
     * // Get first 10 PatientInsurances
     * const patientInsurances = await prisma.patientInsurance.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const patientInsuranceWithIdOnly = await prisma.patientInsurance.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PatientInsuranceFindManyArgs>(args?: SelectSubset<T, PatientInsuranceFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PatientInsurancePayload<ExtArgs>, T, "findMany">>

    /**
     * Create a PatientInsurance.
     * @param {PatientInsuranceCreateArgs} args - Arguments to create a PatientInsurance.
     * @example
     * // Create one PatientInsurance
     * const PatientInsurance = await prisma.patientInsurance.create({
     *   data: {
     *     // ... data to create a PatientInsurance
     *   }
     * })
     * 
     */
    create<T extends PatientInsuranceCreateArgs>(args: SelectSubset<T, PatientInsuranceCreateArgs<ExtArgs>>): Prisma__PatientInsuranceClient<$Result.GetResult<Prisma.$PatientInsurancePayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many PatientInsurances.
     * @param {PatientInsuranceCreateManyArgs} args - Arguments to create many PatientInsurances.
     * @example
     * // Create many PatientInsurances
     * const patientInsurance = await prisma.patientInsurance.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PatientInsuranceCreateManyArgs>(args?: SelectSubset<T, PatientInsuranceCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many PatientInsurances and returns the data saved in the database.
     * @param {PatientInsuranceCreateManyAndReturnArgs} args - Arguments to create many PatientInsurances.
     * @example
     * // Create many PatientInsurances
     * const patientInsurance = await prisma.patientInsurance.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many PatientInsurances and only return the `id`
     * const patientInsuranceWithIdOnly = await prisma.patientInsurance.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends PatientInsuranceCreateManyAndReturnArgs>(args?: SelectSubset<T, PatientInsuranceCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PatientInsurancePayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a PatientInsurance.
     * @param {PatientInsuranceDeleteArgs} args - Arguments to delete one PatientInsurance.
     * @example
     * // Delete one PatientInsurance
     * const PatientInsurance = await prisma.patientInsurance.delete({
     *   where: {
     *     // ... filter to delete one PatientInsurance
     *   }
     * })
     * 
     */
    delete<T extends PatientInsuranceDeleteArgs>(args: SelectSubset<T, PatientInsuranceDeleteArgs<ExtArgs>>): Prisma__PatientInsuranceClient<$Result.GetResult<Prisma.$PatientInsurancePayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one PatientInsurance.
     * @param {PatientInsuranceUpdateArgs} args - Arguments to update one PatientInsurance.
     * @example
     * // Update one PatientInsurance
     * const patientInsurance = await prisma.patientInsurance.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PatientInsuranceUpdateArgs>(args: SelectSubset<T, PatientInsuranceUpdateArgs<ExtArgs>>): Prisma__PatientInsuranceClient<$Result.GetResult<Prisma.$PatientInsurancePayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more PatientInsurances.
     * @param {PatientInsuranceDeleteManyArgs} args - Arguments to filter PatientInsurances to delete.
     * @example
     * // Delete a few PatientInsurances
     * const { count } = await prisma.patientInsurance.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PatientInsuranceDeleteManyArgs>(args?: SelectSubset<T, PatientInsuranceDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PatientInsurances.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PatientInsuranceUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many PatientInsurances
     * const patientInsurance = await prisma.patientInsurance.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PatientInsuranceUpdateManyArgs>(args: SelectSubset<T, PatientInsuranceUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one PatientInsurance.
     * @param {PatientInsuranceUpsertArgs} args - Arguments to update or create a PatientInsurance.
     * @example
     * // Update or create a PatientInsurance
     * const patientInsurance = await prisma.patientInsurance.upsert({
     *   create: {
     *     // ... data to create a PatientInsurance
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the PatientInsurance we want to update
     *   }
     * })
     */
    upsert<T extends PatientInsuranceUpsertArgs>(args: SelectSubset<T, PatientInsuranceUpsertArgs<ExtArgs>>): Prisma__PatientInsuranceClient<$Result.GetResult<Prisma.$PatientInsurancePayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of PatientInsurances.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PatientInsuranceCountArgs} args - Arguments to filter PatientInsurances to count.
     * @example
     * // Count the number of PatientInsurances
     * const count = await prisma.patientInsurance.count({
     *   where: {
     *     // ... the filter for the PatientInsurances we want to count
     *   }
     * })
    **/
    count<T extends PatientInsuranceCountArgs>(
      args?: Subset<T, PatientInsuranceCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PatientInsuranceCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a PatientInsurance.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PatientInsuranceAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PatientInsuranceAggregateArgs>(args: Subset<T, PatientInsuranceAggregateArgs>): Prisma.PrismaPromise<GetPatientInsuranceAggregateType<T>>

    /**
     * Group by PatientInsurance.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PatientInsuranceGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends PatientInsuranceGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PatientInsuranceGroupByArgs['orderBy'] }
        : { orderBy?: PatientInsuranceGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, PatientInsuranceGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPatientInsuranceGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the PatientInsurance model
   */
  readonly fields: PatientInsuranceFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for PatientInsurance.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PatientInsuranceClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    patient<T extends PatientDefaultArgs<ExtArgs> = {}>(args?: Subset<T, PatientDefaultArgs<ExtArgs>>): Prisma__PatientClient<$Result.GetResult<Prisma.$PatientPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the PatientInsurance model
   */ 
  interface PatientInsuranceFieldRefs {
    readonly id: FieldRef<"PatientInsurance", 'String'>
    readonly patientId: FieldRef<"PatientInsurance", 'String'>
    readonly priority: FieldRef<"PatientInsurance", 'Int'>
    readonly payerName: FieldRef<"PatientInsurance", 'String'>
    readonly memberId: FieldRef<"PatientInsurance", 'String'>
    readonly groupId: FieldRef<"PatientInsurance", 'String'>
    readonly subscriberName: FieldRef<"PatientInsurance", 'String'>
    readonly isActive: FieldRef<"PatientInsurance", 'Boolean'>
    readonly createdAt: FieldRef<"PatientInsurance", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * PatientInsurance findUnique
   */
  export type PatientInsuranceFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PatientInsurance
     */
    select?: PatientInsuranceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PatientInsuranceInclude<ExtArgs> | null
    /**
     * Filter, which PatientInsurance to fetch.
     */
    where: PatientInsuranceWhereUniqueInput
  }

  /**
   * PatientInsurance findUniqueOrThrow
   */
  export type PatientInsuranceFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PatientInsurance
     */
    select?: PatientInsuranceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PatientInsuranceInclude<ExtArgs> | null
    /**
     * Filter, which PatientInsurance to fetch.
     */
    where: PatientInsuranceWhereUniqueInput
  }

  /**
   * PatientInsurance findFirst
   */
  export type PatientInsuranceFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PatientInsurance
     */
    select?: PatientInsuranceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PatientInsuranceInclude<ExtArgs> | null
    /**
     * Filter, which PatientInsurance to fetch.
     */
    where?: PatientInsuranceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PatientInsurances to fetch.
     */
    orderBy?: PatientInsuranceOrderByWithRelationInput | PatientInsuranceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PatientInsurances.
     */
    cursor?: PatientInsuranceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PatientInsurances from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PatientInsurances.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PatientInsurances.
     */
    distinct?: PatientInsuranceScalarFieldEnum | PatientInsuranceScalarFieldEnum[]
  }

  /**
   * PatientInsurance findFirstOrThrow
   */
  export type PatientInsuranceFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PatientInsurance
     */
    select?: PatientInsuranceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PatientInsuranceInclude<ExtArgs> | null
    /**
     * Filter, which PatientInsurance to fetch.
     */
    where?: PatientInsuranceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PatientInsurances to fetch.
     */
    orderBy?: PatientInsuranceOrderByWithRelationInput | PatientInsuranceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PatientInsurances.
     */
    cursor?: PatientInsuranceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PatientInsurances from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PatientInsurances.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PatientInsurances.
     */
    distinct?: PatientInsuranceScalarFieldEnum | PatientInsuranceScalarFieldEnum[]
  }

  /**
   * PatientInsurance findMany
   */
  export type PatientInsuranceFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PatientInsurance
     */
    select?: PatientInsuranceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PatientInsuranceInclude<ExtArgs> | null
    /**
     * Filter, which PatientInsurances to fetch.
     */
    where?: PatientInsuranceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PatientInsurances to fetch.
     */
    orderBy?: PatientInsuranceOrderByWithRelationInput | PatientInsuranceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing PatientInsurances.
     */
    cursor?: PatientInsuranceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PatientInsurances from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PatientInsurances.
     */
    skip?: number
    distinct?: PatientInsuranceScalarFieldEnum | PatientInsuranceScalarFieldEnum[]
  }

  /**
   * PatientInsurance create
   */
  export type PatientInsuranceCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PatientInsurance
     */
    select?: PatientInsuranceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PatientInsuranceInclude<ExtArgs> | null
    /**
     * The data needed to create a PatientInsurance.
     */
    data: XOR<PatientInsuranceCreateInput, PatientInsuranceUncheckedCreateInput>
  }

  /**
   * PatientInsurance createMany
   */
  export type PatientInsuranceCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many PatientInsurances.
     */
    data: PatientInsuranceCreateManyInput | PatientInsuranceCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * PatientInsurance createManyAndReturn
   */
  export type PatientInsuranceCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PatientInsurance
     */
    select?: PatientInsuranceSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many PatientInsurances.
     */
    data: PatientInsuranceCreateManyInput | PatientInsuranceCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PatientInsuranceIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * PatientInsurance update
   */
  export type PatientInsuranceUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PatientInsurance
     */
    select?: PatientInsuranceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PatientInsuranceInclude<ExtArgs> | null
    /**
     * The data needed to update a PatientInsurance.
     */
    data: XOR<PatientInsuranceUpdateInput, PatientInsuranceUncheckedUpdateInput>
    /**
     * Choose, which PatientInsurance to update.
     */
    where: PatientInsuranceWhereUniqueInput
  }

  /**
   * PatientInsurance updateMany
   */
  export type PatientInsuranceUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update PatientInsurances.
     */
    data: XOR<PatientInsuranceUpdateManyMutationInput, PatientInsuranceUncheckedUpdateManyInput>
    /**
     * Filter which PatientInsurances to update
     */
    where?: PatientInsuranceWhereInput
  }

  /**
   * PatientInsurance upsert
   */
  export type PatientInsuranceUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PatientInsurance
     */
    select?: PatientInsuranceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PatientInsuranceInclude<ExtArgs> | null
    /**
     * The filter to search for the PatientInsurance to update in case it exists.
     */
    where: PatientInsuranceWhereUniqueInput
    /**
     * In case the PatientInsurance found by the `where` argument doesn't exist, create a new PatientInsurance with this data.
     */
    create: XOR<PatientInsuranceCreateInput, PatientInsuranceUncheckedCreateInput>
    /**
     * In case the PatientInsurance was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PatientInsuranceUpdateInput, PatientInsuranceUncheckedUpdateInput>
  }

  /**
   * PatientInsurance delete
   */
  export type PatientInsuranceDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PatientInsurance
     */
    select?: PatientInsuranceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PatientInsuranceInclude<ExtArgs> | null
    /**
     * Filter which PatientInsurance to delete.
     */
    where: PatientInsuranceWhereUniqueInput
  }

  /**
   * PatientInsurance deleteMany
   */
  export type PatientInsuranceDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PatientInsurances to delete
     */
    where?: PatientInsuranceWhereInput
  }

  /**
   * PatientInsurance without action
   */
  export type PatientInsuranceDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PatientInsurance
     */
    select?: PatientInsuranceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PatientInsuranceInclude<ExtArgs> | null
  }


  /**
   * Model Condition
   */

  export type AggregateCondition = {
    _count: ConditionCountAggregateOutputType | null
    _min: ConditionMinAggregateOutputType | null
    _max: ConditionMaxAggregateOutputType | null
  }

  export type ConditionMinAggregateOutputType = {
    id: string | null
    patientId: string | null
    encounterId: string | null
    snomedCode: string | null
    icd10Code: string | null
    display: string | null
    clinicalStatus: string | null
    verificationStatus: string | null
    severity: string | null
    onsetDate: Date | null
    resolvedDate: Date | null
    recordedAt: Date | null
    recordedBy: string | null
  }

  export type ConditionMaxAggregateOutputType = {
    id: string | null
    patientId: string | null
    encounterId: string | null
    snomedCode: string | null
    icd10Code: string | null
    display: string | null
    clinicalStatus: string | null
    verificationStatus: string | null
    severity: string | null
    onsetDate: Date | null
    resolvedDate: Date | null
    recordedAt: Date | null
    recordedBy: string | null
  }

  export type ConditionCountAggregateOutputType = {
    id: number
    patientId: number
    encounterId: number
    snomedCode: number
    icd10Code: number
    display: number
    clinicalStatus: number
    verificationStatus: number
    severity: number
    onsetDate: number
    resolvedDate: number
    recordedAt: number
    recordedBy: number
    _all: number
  }


  export type ConditionMinAggregateInputType = {
    id?: true
    patientId?: true
    encounterId?: true
    snomedCode?: true
    icd10Code?: true
    display?: true
    clinicalStatus?: true
    verificationStatus?: true
    severity?: true
    onsetDate?: true
    resolvedDate?: true
    recordedAt?: true
    recordedBy?: true
  }

  export type ConditionMaxAggregateInputType = {
    id?: true
    patientId?: true
    encounterId?: true
    snomedCode?: true
    icd10Code?: true
    display?: true
    clinicalStatus?: true
    verificationStatus?: true
    severity?: true
    onsetDate?: true
    resolvedDate?: true
    recordedAt?: true
    recordedBy?: true
  }

  export type ConditionCountAggregateInputType = {
    id?: true
    patientId?: true
    encounterId?: true
    snomedCode?: true
    icd10Code?: true
    display?: true
    clinicalStatus?: true
    verificationStatus?: true
    severity?: true
    onsetDate?: true
    resolvedDate?: true
    recordedAt?: true
    recordedBy?: true
    _all?: true
  }

  export type ConditionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Condition to aggregate.
     */
    where?: ConditionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Conditions to fetch.
     */
    orderBy?: ConditionOrderByWithRelationInput | ConditionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ConditionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Conditions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Conditions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Conditions
    **/
    _count?: true | ConditionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ConditionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ConditionMaxAggregateInputType
  }

  export type GetConditionAggregateType<T extends ConditionAggregateArgs> = {
        [P in keyof T & keyof AggregateCondition]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCondition[P]>
      : GetScalarType<T[P], AggregateCondition[P]>
  }




  export type ConditionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ConditionWhereInput
    orderBy?: ConditionOrderByWithAggregationInput | ConditionOrderByWithAggregationInput[]
    by: ConditionScalarFieldEnum[] | ConditionScalarFieldEnum
    having?: ConditionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ConditionCountAggregateInputType | true
    _min?: ConditionMinAggregateInputType
    _max?: ConditionMaxAggregateInputType
  }

  export type ConditionGroupByOutputType = {
    id: string
    patientId: string
    encounterId: string | null
    snomedCode: string | null
    icd10Code: string | null
    display: string
    clinicalStatus: string
    verificationStatus: string
    severity: string | null
    onsetDate: Date | null
    resolvedDate: Date | null
    recordedAt: Date
    recordedBy: string
    _count: ConditionCountAggregateOutputType | null
    _min: ConditionMinAggregateOutputType | null
    _max: ConditionMaxAggregateOutputType | null
  }

  type GetConditionGroupByPayload<T extends ConditionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ConditionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ConditionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ConditionGroupByOutputType[P]>
            : GetScalarType<T[P], ConditionGroupByOutputType[P]>
        }
      >
    >


  export type ConditionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    patientId?: boolean
    encounterId?: boolean
    snomedCode?: boolean
    icd10Code?: boolean
    display?: boolean
    clinicalStatus?: boolean
    verificationStatus?: boolean
    severity?: boolean
    onsetDate?: boolean
    resolvedDate?: boolean
    recordedAt?: boolean
    recordedBy?: boolean
    patient?: boolean | PatientDefaultArgs<ExtArgs>
    encounter?: boolean | Condition$encounterArgs<ExtArgs>
  }, ExtArgs["result"]["condition"]>

  export type ConditionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    patientId?: boolean
    encounterId?: boolean
    snomedCode?: boolean
    icd10Code?: boolean
    display?: boolean
    clinicalStatus?: boolean
    verificationStatus?: boolean
    severity?: boolean
    onsetDate?: boolean
    resolvedDate?: boolean
    recordedAt?: boolean
    recordedBy?: boolean
    patient?: boolean | PatientDefaultArgs<ExtArgs>
    encounter?: boolean | Condition$encounterArgs<ExtArgs>
  }, ExtArgs["result"]["condition"]>

  export type ConditionSelectScalar = {
    id?: boolean
    patientId?: boolean
    encounterId?: boolean
    snomedCode?: boolean
    icd10Code?: boolean
    display?: boolean
    clinicalStatus?: boolean
    verificationStatus?: boolean
    severity?: boolean
    onsetDate?: boolean
    resolvedDate?: boolean
    recordedAt?: boolean
    recordedBy?: boolean
  }

  export type ConditionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    patient?: boolean | PatientDefaultArgs<ExtArgs>
    encounter?: boolean | Condition$encounterArgs<ExtArgs>
  }
  export type ConditionIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    patient?: boolean | PatientDefaultArgs<ExtArgs>
    encounter?: boolean | Condition$encounterArgs<ExtArgs>
  }

  export type $ConditionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Condition"
    objects: {
      patient: Prisma.$PatientPayload<ExtArgs>
      encounter: Prisma.$EncounterPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      patientId: string
      encounterId: string | null
      snomedCode: string | null
      icd10Code: string | null
      display: string
      clinicalStatus: string
      verificationStatus: string
      severity: string | null
      onsetDate: Date | null
      resolvedDate: Date | null
      recordedAt: Date
      recordedBy: string
    }, ExtArgs["result"]["condition"]>
    composites: {}
  }

  type ConditionGetPayload<S extends boolean | null | undefined | ConditionDefaultArgs> = $Result.GetResult<Prisma.$ConditionPayload, S>

  type ConditionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<ConditionFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: ConditionCountAggregateInputType | true
    }

  export interface ConditionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Condition'], meta: { name: 'Condition' } }
    /**
     * Find zero or one Condition that matches the filter.
     * @param {ConditionFindUniqueArgs} args - Arguments to find a Condition
     * @example
     * // Get one Condition
     * const condition = await prisma.condition.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ConditionFindUniqueArgs>(args: SelectSubset<T, ConditionFindUniqueArgs<ExtArgs>>): Prisma__ConditionClient<$Result.GetResult<Prisma.$ConditionPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Condition that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {ConditionFindUniqueOrThrowArgs} args - Arguments to find a Condition
     * @example
     * // Get one Condition
     * const condition = await prisma.condition.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ConditionFindUniqueOrThrowArgs>(args: SelectSubset<T, ConditionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ConditionClient<$Result.GetResult<Prisma.$ConditionPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Condition that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConditionFindFirstArgs} args - Arguments to find a Condition
     * @example
     * // Get one Condition
     * const condition = await prisma.condition.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ConditionFindFirstArgs>(args?: SelectSubset<T, ConditionFindFirstArgs<ExtArgs>>): Prisma__ConditionClient<$Result.GetResult<Prisma.$ConditionPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Condition that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConditionFindFirstOrThrowArgs} args - Arguments to find a Condition
     * @example
     * // Get one Condition
     * const condition = await prisma.condition.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ConditionFindFirstOrThrowArgs>(args?: SelectSubset<T, ConditionFindFirstOrThrowArgs<ExtArgs>>): Prisma__ConditionClient<$Result.GetResult<Prisma.$ConditionPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Conditions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConditionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Conditions
     * const conditions = await prisma.condition.findMany()
     * 
     * // Get first 10 Conditions
     * const conditions = await prisma.condition.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const conditionWithIdOnly = await prisma.condition.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ConditionFindManyArgs>(args?: SelectSubset<T, ConditionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ConditionPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Condition.
     * @param {ConditionCreateArgs} args - Arguments to create a Condition.
     * @example
     * // Create one Condition
     * const Condition = await prisma.condition.create({
     *   data: {
     *     // ... data to create a Condition
     *   }
     * })
     * 
     */
    create<T extends ConditionCreateArgs>(args: SelectSubset<T, ConditionCreateArgs<ExtArgs>>): Prisma__ConditionClient<$Result.GetResult<Prisma.$ConditionPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Conditions.
     * @param {ConditionCreateManyArgs} args - Arguments to create many Conditions.
     * @example
     * // Create many Conditions
     * const condition = await prisma.condition.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ConditionCreateManyArgs>(args?: SelectSubset<T, ConditionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Conditions and returns the data saved in the database.
     * @param {ConditionCreateManyAndReturnArgs} args - Arguments to create many Conditions.
     * @example
     * // Create many Conditions
     * const condition = await prisma.condition.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Conditions and only return the `id`
     * const conditionWithIdOnly = await prisma.condition.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ConditionCreateManyAndReturnArgs>(args?: SelectSubset<T, ConditionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ConditionPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Condition.
     * @param {ConditionDeleteArgs} args - Arguments to delete one Condition.
     * @example
     * // Delete one Condition
     * const Condition = await prisma.condition.delete({
     *   where: {
     *     // ... filter to delete one Condition
     *   }
     * })
     * 
     */
    delete<T extends ConditionDeleteArgs>(args: SelectSubset<T, ConditionDeleteArgs<ExtArgs>>): Prisma__ConditionClient<$Result.GetResult<Prisma.$ConditionPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Condition.
     * @param {ConditionUpdateArgs} args - Arguments to update one Condition.
     * @example
     * // Update one Condition
     * const condition = await prisma.condition.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ConditionUpdateArgs>(args: SelectSubset<T, ConditionUpdateArgs<ExtArgs>>): Prisma__ConditionClient<$Result.GetResult<Prisma.$ConditionPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Conditions.
     * @param {ConditionDeleteManyArgs} args - Arguments to filter Conditions to delete.
     * @example
     * // Delete a few Conditions
     * const { count } = await prisma.condition.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ConditionDeleteManyArgs>(args?: SelectSubset<T, ConditionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Conditions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConditionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Conditions
     * const condition = await prisma.condition.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ConditionUpdateManyArgs>(args: SelectSubset<T, ConditionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Condition.
     * @param {ConditionUpsertArgs} args - Arguments to update or create a Condition.
     * @example
     * // Update or create a Condition
     * const condition = await prisma.condition.upsert({
     *   create: {
     *     // ... data to create a Condition
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Condition we want to update
     *   }
     * })
     */
    upsert<T extends ConditionUpsertArgs>(args: SelectSubset<T, ConditionUpsertArgs<ExtArgs>>): Prisma__ConditionClient<$Result.GetResult<Prisma.$ConditionPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Conditions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConditionCountArgs} args - Arguments to filter Conditions to count.
     * @example
     * // Count the number of Conditions
     * const count = await prisma.condition.count({
     *   where: {
     *     // ... the filter for the Conditions we want to count
     *   }
     * })
    **/
    count<T extends ConditionCountArgs>(
      args?: Subset<T, ConditionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ConditionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Condition.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConditionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ConditionAggregateArgs>(args: Subset<T, ConditionAggregateArgs>): Prisma.PrismaPromise<GetConditionAggregateType<T>>

    /**
     * Group by Condition.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConditionGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ConditionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ConditionGroupByArgs['orderBy'] }
        : { orderBy?: ConditionGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ConditionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetConditionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Condition model
   */
  readonly fields: ConditionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Condition.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ConditionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    patient<T extends PatientDefaultArgs<ExtArgs> = {}>(args?: Subset<T, PatientDefaultArgs<ExtArgs>>): Prisma__PatientClient<$Result.GetResult<Prisma.$PatientPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    encounter<T extends Condition$encounterArgs<ExtArgs> = {}>(args?: Subset<T, Condition$encounterArgs<ExtArgs>>): Prisma__EncounterClient<$Result.GetResult<Prisma.$EncounterPayload<ExtArgs>, T, "findUniqueOrThrow"> | null, null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Condition model
   */ 
  interface ConditionFieldRefs {
    readonly id: FieldRef<"Condition", 'String'>
    readonly patientId: FieldRef<"Condition", 'String'>
    readonly encounterId: FieldRef<"Condition", 'String'>
    readonly snomedCode: FieldRef<"Condition", 'String'>
    readonly icd10Code: FieldRef<"Condition", 'String'>
    readonly display: FieldRef<"Condition", 'String'>
    readonly clinicalStatus: FieldRef<"Condition", 'String'>
    readonly verificationStatus: FieldRef<"Condition", 'String'>
    readonly severity: FieldRef<"Condition", 'String'>
    readonly onsetDate: FieldRef<"Condition", 'DateTime'>
    readonly resolvedDate: FieldRef<"Condition", 'DateTime'>
    readonly recordedAt: FieldRef<"Condition", 'DateTime'>
    readonly recordedBy: FieldRef<"Condition", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Condition findUnique
   */
  export type ConditionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Condition
     */
    select?: ConditionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConditionInclude<ExtArgs> | null
    /**
     * Filter, which Condition to fetch.
     */
    where: ConditionWhereUniqueInput
  }

  /**
   * Condition findUniqueOrThrow
   */
  export type ConditionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Condition
     */
    select?: ConditionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConditionInclude<ExtArgs> | null
    /**
     * Filter, which Condition to fetch.
     */
    where: ConditionWhereUniqueInput
  }

  /**
   * Condition findFirst
   */
  export type ConditionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Condition
     */
    select?: ConditionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConditionInclude<ExtArgs> | null
    /**
     * Filter, which Condition to fetch.
     */
    where?: ConditionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Conditions to fetch.
     */
    orderBy?: ConditionOrderByWithRelationInput | ConditionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Conditions.
     */
    cursor?: ConditionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Conditions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Conditions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Conditions.
     */
    distinct?: ConditionScalarFieldEnum | ConditionScalarFieldEnum[]
  }

  /**
   * Condition findFirstOrThrow
   */
  export type ConditionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Condition
     */
    select?: ConditionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConditionInclude<ExtArgs> | null
    /**
     * Filter, which Condition to fetch.
     */
    where?: ConditionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Conditions to fetch.
     */
    orderBy?: ConditionOrderByWithRelationInput | ConditionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Conditions.
     */
    cursor?: ConditionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Conditions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Conditions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Conditions.
     */
    distinct?: ConditionScalarFieldEnum | ConditionScalarFieldEnum[]
  }

  /**
   * Condition findMany
   */
  export type ConditionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Condition
     */
    select?: ConditionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConditionInclude<ExtArgs> | null
    /**
     * Filter, which Conditions to fetch.
     */
    where?: ConditionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Conditions to fetch.
     */
    orderBy?: ConditionOrderByWithRelationInput | ConditionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Conditions.
     */
    cursor?: ConditionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Conditions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Conditions.
     */
    skip?: number
    distinct?: ConditionScalarFieldEnum | ConditionScalarFieldEnum[]
  }

  /**
   * Condition create
   */
  export type ConditionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Condition
     */
    select?: ConditionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConditionInclude<ExtArgs> | null
    /**
     * The data needed to create a Condition.
     */
    data: XOR<ConditionCreateInput, ConditionUncheckedCreateInput>
  }

  /**
   * Condition createMany
   */
  export type ConditionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Conditions.
     */
    data: ConditionCreateManyInput | ConditionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Condition createManyAndReturn
   */
  export type ConditionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Condition
     */
    select?: ConditionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Conditions.
     */
    data: ConditionCreateManyInput | ConditionCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConditionIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Condition update
   */
  export type ConditionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Condition
     */
    select?: ConditionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConditionInclude<ExtArgs> | null
    /**
     * The data needed to update a Condition.
     */
    data: XOR<ConditionUpdateInput, ConditionUncheckedUpdateInput>
    /**
     * Choose, which Condition to update.
     */
    where: ConditionWhereUniqueInput
  }

  /**
   * Condition updateMany
   */
  export type ConditionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Conditions.
     */
    data: XOR<ConditionUpdateManyMutationInput, ConditionUncheckedUpdateManyInput>
    /**
     * Filter which Conditions to update
     */
    where?: ConditionWhereInput
  }

  /**
   * Condition upsert
   */
  export type ConditionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Condition
     */
    select?: ConditionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConditionInclude<ExtArgs> | null
    /**
     * The filter to search for the Condition to update in case it exists.
     */
    where: ConditionWhereUniqueInput
    /**
     * In case the Condition found by the `where` argument doesn't exist, create a new Condition with this data.
     */
    create: XOR<ConditionCreateInput, ConditionUncheckedCreateInput>
    /**
     * In case the Condition was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ConditionUpdateInput, ConditionUncheckedUpdateInput>
  }

  /**
   * Condition delete
   */
  export type ConditionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Condition
     */
    select?: ConditionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConditionInclude<ExtArgs> | null
    /**
     * Filter which Condition to delete.
     */
    where: ConditionWhereUniqueInput
  }

  /**
   * Condition deleteMany
   */
  export type ConditionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Conditions to delete
     */
    where?: ConditionWhereInput
  }

  /**
   * Condition.encounter
   */
  export type Condition$encounterArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Encounter
     */
    select?: EncounterSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EncounterInclude<ExtArgs> | null
    where?: EncounterWhereInput
  }

  /**
   * Condition without action
   */
  export type ConditionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Condition
     */
    select?: ConditionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConditionInclude<ExtArgs> | null
  }


  /**
   * Model MedicationRequest
   */

  export type AggregateMedicationRequest = {
    _count: MedicationRequestCountAggregateOutputType | null
    _min: MedicationRequestMinAggregateOutputType | null
    _max: MedicationRequestMaxAggregateOutputType | null
  }

  export type MedicationRequestMinAggregateOutputType = {
    id: string | null
    patientId: string | null
    encounterId: string | null
    rxNormCode: string | null
    medicationName: string | null
    dose: string | null
    frequency: string | null
    route: string | null
    status: string | null
    prescribedBy: string | null
    prescribedAt: Date | null
    discontinuedAt: Date | null
    discontinuedBy: string | null
    notes: string | null
  }

  export type MedicationRequestMaxAggregateOutputType = {
    id: string | null
    patientId: string | null
    encounterId: string | null
    rxNormCode: string | null
    medicationName: string | null
    dose: string | null
    frequency: string | null
    route: string | null
    status: string | null
    prescribedBy: string | null
    prescribedAt: Date | null
    discontinuedAt: Date | null
    discontinuedBy: string | null
    notes: string | null
  }

  export type MedicationRequestCountAggregateOutputType = {
    id: number
    patientId: number
    encounterId: number
    rxNormCode: number
    medicationName: number
    dose: number
    frequency: number
    route: number
    status: number
    prescribedBy: number
    prescribedAt: number
    discontinuedAt: number
    discontinuedBy: number
    notes: number
    _all: number
  }


  export type MedicationRequestMinAggregateInputType = {
    id?: true
    patientId?: true
    encounterId?: true
    rxNormCode?: true
    medicationName?: true
    dose?: true
    frequency?: true
    route?: true
    status?: true
    prescribedBy?: true
    prescribedAt?: true
    discontinuedAt?: true
    discontinuedBy?: true
    notes?: true
  }

  export type MedicationRequestMaxAggregateInputType = {
    id?: true
    patientId?: true
    encounterId?: true
    rxNormCode?: true
    medicationName?: true
    dose?: true
    frequency?: true
    route?: true
    status?: true
    prescribedBy?: true
    prescribedAt?: true
    discontinuedAt?: true
    discontinuedBy?: true
    notes?: true
  }

  export type MedicationRequestCountAggregateInputType = {
    id?: true
    patientId?: true
    encounterId?: true
    rxNormCode?: true
    medicationName?: true
    dose?: true
    frequency?: true
    route?: true
    status?: true
    prescribedBy?: true
    prescribedAt?: true
    discontinuedAt?: true
    discontinuedBy?: true
    notes?: true
    _all?: true
  }

  export type MedicationRequestAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which MedicationRequest to aggregate.
     */
    where?: MedicationRequestWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MedicationRequests to fetch.
     */
    orderBy?: MedicationRequestOrderByWithRelationInput | MedicationRequestOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: MedicationRequestWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MedicationRequests from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MedicationRequests.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned MedicationRequests
    **/
    _count?: true | MedicationRequestCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: MedicationRequestMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: MedicationRequestMaxAggregateInputType
  }

  export type GetMedicationRequestAggregateType<T extends MedicationRequestAggregateArgs> = {
        [P in keyof T & keyof AggregateMedicationRequest]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateMedicationRequest[P]>
      : GetScalarType<T[P], AggregateMedicationRequest[P]>
  }




  export type MedicationRequestGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MedicationRequestWhereInput
    orderBy?: MedicationRequestOrderByWithAggregationInput | MedicationRequestOrderByWithAggregationInput[]
    by: MedicationRequestScalarFieldEnum[] | MedicationRequestScalarFieldEnum
    having?: MedicationRequestScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: MedicationRequestCountAggregateInputType | true
    _min?: MedicationRequestMinAggregateInputType
    _max?: MedicationRequestMaxAggregateInputType
  }

  export type MedicationRequestGroupByOutputType = {
    id: string
    patientId: string
    encounterId: string | null
    rxNormCode: string | null
    medicationName: string
    dose: string | null
    frequency: string | null
    route: string | null
    status: string
    prescribedBy: string
    prescribedAt: Date
    discontinuedAt: Date | null
    discontinuedBy: string | null
    notes: string | null
    _count: MedicationRequestCountAggregateOutputType | null
    _min: MedicationRequestMinAggregateOutputType | null
    _max: MedicationRequestMaxAggregateOutputType | null
  }

  type GetMedicationRequestGroupByPayload<T extends MedicationRequestGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<MedicationRequestGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof MedicationRequestGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], MedicationRequestGroupByOutputType[P]>
            : GetScalarType<T[P], MedicationRequestGroupByOutputType[P]>
        }
      >
    >


  export type MedicationRequestSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    patientId?: boolean
    encounterId?: boolean
    rxNormCode?: boolean
    medicationName?: boolean
    dose?: boolean
    frequency?: boolean
    route?: boolean
    status?: boolean
    prescribedBy?: boolean
    prescribedAt?: boolean
    discontinuedAt?: boolean
    discontinuedBy?: boolean
    notes?: boolean
    patient?: boolean | PatientDefaultArgs<ExtArgs>
    encounter?: boolean | MedicationRequest$encounterArgs<ExtArgs>
  }, ExtArgs["result"]["medicationRequest"]>

  export type MedicationRequestSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    patientId?: boolean
    encounterId?: boolean
    rxNormCode?: boolean
    medicationName?: boolean
    dose?: boolean
    frequency?: boolean
    route?: boolean
    status?: boolean
    prescribedBy?: boolean
    prescribedAt?: boolean
    discontinuedAt?: boolean
    discontinuedBy?: boolean
    notes?: boolean
    patient?: boolean | PatientDefaultArgs<ExtArgs>
    encounter?: boolean | MedicationRequest$encounterArgs<ExtArgs>
  }, ExtArgs["result"]["medicationRequest"]>

  export type MedicationRequestSelectScalar = {
    id?: boolean
    patientId?: boolean
    encounterId?: boolean
    rxNormCode?: boolean
    medicationName?: boolean
    dose?: boolean
    frequency?: boolean
    route?: boolean
    status?: boolean
    prescribedBy?: boolean
    prescribedAt?: boolean
    discontinuedAt?: boolean
    discontinuedBy?: boolean
    notes?: boolean
  }

  export type MedicationRequestInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    patient?: boolean | PatientDefaultArgs<ExtArgs>
    encounter?: boolean | MedicationRequest$encounterArgs<ExtArgs>
  }
  export type MedicationRequestIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    patient?: boolean | PatientDefaultArgs<ExtArgs>
    encounter?: boolean | MedicationRequest$encounterArgs<ExtArgs>
  }

  export type $MedicationRequestPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "MedicationRequest"
    objects: {
      patient: Prisma.$PatientPayload<ExtArgs>
      encounter: Prisma.$EncounterPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      patientId: string
      encounterId: string | null
      rxNormCode: string | null
      medicationName: string
      dose: string | null
      frequency: string | null
      route: string | null
      status: string
      prescribedBy: string
      prescribedAt: Date
      discontinuedAt: Date | null
      discontinuedBy: string | null
      notes: string | null
    }, ExtArgs["result"]["medicationRequest"]>
    composites: {}
  }

  type MedicationRequestGetPayload<S extends boolean | null | undefined | MedicationRequestDefaultArgs> = $Result.GetResult<Prisma.$MedicationRequestPayload, S>

  type MedicationRequestCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<MedicationRequestFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: MedicationRequestCountAggregateInputType | true
    }

  export interface MedicationRequestDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['MedicationRequest'], meta: { name: 'MedicationRequest' } }
    /**
     * Find zero or one MedicationRequest that matches the filter.
     * @param {MedicationRequestFindUniqueArgs} args - Arguments to find a MedicationRequest
     * @example
     * // Get one MedicationRequest
     * const medicationRequest = await prisma.medicationRequest.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends MedicationRequestFindUniqueArgs>(args: SelectSubset<T, MedicationRequestFindUniqueArgs<ExtArgs>>): Prisma__MedicationRequestClient<$Result.GetResult<Prisma.$MedicationRequestPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one MedicationRequest that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {MedicationRequestFindUniqueOrThrowArgs} args - Arguments to find a MedicationRequest
     * @example
     * // Get one MedicationRequest
     * const medicationRequest = await prisma.medicationRequest.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends MedicationRequestFindUniqueOrThrowArgs>(args: SelectSubset<T, MedicationRequestFindUniqueOrThrowArgs<ExtArgs>>): Prisma__MedicationRequestClient<$Result.GetResult<Prisma.$MedicationRequestPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first MedicationRequest that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MedicationRequestFindFirstArgs} args - Arguments to find a MedicationRequest
     * @example
     * // Get one MedicationRequest
     * const medicationRequest = await prisma.medicationRequest.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends MedicationRequestFindFirstArgs>(args?: SelectSubset<T, MedicationRequestFindFirstArgs<ExtArgs>>): Prisma__MedicationRequestClient<$Result.GetResult<Prisma.$MedicationRequestPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first MedicationRequest that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MedicationRequestFindFirstOrThrowArgs} args - Arguments to find a MedicationRequest
     * @example
     * // Get one MedicationRequest
     * const medicationRequest = await prisma.medicationRequest.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends MedicationRequestFindFirstOrThrowArgs>(args?: SelectSubset<T, MedicationRequestFindFirstOrThrowArgs<ExtArgs>>): Prisma__MedicationRequestClient<$Result.GetResult<Prisma.$MedicationRequestPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more MedicationRequests that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MedicationRequestFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all MedicationRequests
     * const medicationRequests = await prisma.medicationRequest.findMany()
     * 
     * // Get first 10 MedicationRequests
     * const medicationRequests = await prisma.medicationRequest.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const medicationRequestWithIdOnly = await prisma.medicationRequest.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends MedicationRequestFindManyArgs>(args?: SelectSubset<T, MedicationRequestFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MedicationRequestPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a MedicationRequest.
     * @param {MedicationRequestCreateArgs} args - Arguments to create a MedicationRequest.
     * @example
     * // Create one MedicationRequest
     * const MedicationRequest = await prisma.medicationRequest.create({
     *   data: {
     *     // ... data to create a MedicationRequest
     *   }
     * })
     * 
     */
    create<T extends MedicationRequestCreateArgs>(args: SelectSubset<T, MedicationRequestCreateArgs<ExtArgs>>): Prisma__MedicationRequestClient<$Result.GetResult<Prisma.$MedicationRequestPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many MedicationRequests.
     * @param {MedicationRequestCreateManyArgs} args - Arguments to create many MedicationRequests.
     * @example
     * // Create many MedicationRequests
     * const medicationRequest = await prisma.medicationRequest.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends MedicationRequestCreateManyArgs>(args?: SelectSubset<T, MedicationRequestCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many MedicationRequests and returns the data saved in the database.
     * @param {MedicationRequestCreateManyAndReturnArgs} args - Arguments to create many MedicationRequests.
     * @example
     * // Create many MedicationRequests
     * const medicationRequest = await prisma.medicationRequest.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many MedicationRequests and only return the `id`
     * const medicationRequestWithIdOnly = await prisma.medicationRequest.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends MedicationRequestCreateManyAndReturnArgs>(args?: SelectSubset<T, MedicationRequestCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MedicationRequestPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a MedicationRequest.
     * @param {MedicationRequestDeleteArgs} args - Arguments to delete one MedicationRequest.
     * @example
     * // Delete one MedicationRequest
     * const MedicationRequest = await prisma.medicationRequest.delete({
     *   where: {
     *     // ... filter to delete one MedicationRequest
     *   }
     * })
     * 
     */
    delete<T extends MedicationRequestDeleteArgs>(args: SelectSubset<T, MedicationRequestDeleteArgs<ExtArgs>>): Prisma__MedicationRequestClient<$Result.GetResult<Prisma.$MedicationRequestPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one MedicationRequest.
     * @param {MedicationRequestUpdateArgs} args - Arguments to update one MedicationRequest.
     * @example
     * // Update one MedicationRequest
     * const medicationRequest = await prisma.medicationRequest.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends MedicationRequestUpdateArgs>(args: SelectSubset<T, MedicationRequestUpdateArgs<ExtArgs>>): Prisma__MedicationRequestClient<$Result.GetResult<Prisma.$MedicationRequestPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more MedicationRequests.
     * @param {MedicationRequestDeleteManyArgs} args - Arguments to filter MedicationRequests to delete.
     * @example
     * // Delete a few MedicationRequests
     * const { count } = await prisma.medicationRequest.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends MedicationRequestDeleteManyArgs>(args?: SelectSubset<T, MedicationRequestDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more MedicationRequests.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MedicationRequestUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many MedicationRequests
     * const medicationRequest = await prisma.medicationRequest.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends MedicationRequestUpdateManyArgs>(args: SelectSubset<T, MedicationRequestUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one MedicationRequest.
     * @param {MedicationRequestUpsertArgs} args - Arguments to update or create a MedicationRequest.
     * @example
     * // Update or create a MedicationRequest
     * const medicationRequest = await prisma.medicationRequest.upsert({
     *   create: {
     *     // ... data to create a MedicationRequest
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the MedicationRequest we want to update
     *   }
     * })
     */
    upsert<T extends MedicationRequestUpsertArgs>(args: SelectSubset<T, MedicationRequestUpsertArgs<ExtArgs>>): Prisma__MedicationRequestClient<$Result.GetResult<Prisma.$MedicationRequestPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of MedicationRequests.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MedicationRequestCountArgs} args - Arguments to filter MedicationRequests to count.
     * @example
     * // Count the number of MedicationRequests
     * const count = await prisma.medicationRequest.count({
     *   where: {
     *     // ... the filter for the MedicationRequests we want to count
     *   }
     * })
    **/
    count<T extends MedicationRequestCountArgs>(
      args?: Subset<T, MedicationRequestCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], MedicationRequestCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a MedicationRequest.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MedicationRequestAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends MedicationRequestAggregateArgs>(args: Subset<T, MedicationRequestAggregateArgs>): Prisma.PrismaPromise<GetMedicationRequestAggregateType<T>>

    /**
     * Group by MedicationRequest.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MedicationRequestGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends MedicationRequestGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: MedicationRequestGroupByArgs['orderBy'] }
        : { orderBy?: MedicationRequestGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, MedicationRequestGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetMedicationRequestGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the MedicationRequest model
   */
  readonly fields: MedicationRequestFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for MedicationRequest.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__MedicationRequestClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    patient<T extends PatientDefaultArgs<ExtArgs> = {}>(args?: Subset<T, PatientDefaultArgs<ExtArgs>>): Prisma__PatientClient<$Result.GetResult<Prisma.$PatientPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    encounter<T extends MedicationRequest$encounterArgs<ExtArgs> = {}>(args?: Subset<T, MedicationRequest$encounterArgs<ExtArgs>>): Prisma__EncounterClient<$Result.GetResult<Prisma.$EncounterPayload<ExtArgs>, T, "findUniqueOrThrow"> | null, null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the MedicationRequest model
   */ 
  interface MedicationRequestFieldRefs {
    readonly id: FieldRef<"MedicationRequest", 'String'>
    readonly patientId: FieldRef<"MedicationRequest", 'String'>
    readonly encounterId: FieldRef<"MedicationRequest", 'String'>
    readonly rxNormCode: FieldRef<"MedicationRequest", 'String'>
    readonly medicationName: FieldRef<"MedicationRequest", 'String'>
    readonly dose: FieldRef<"MedicationRequest", 'String'>
    readonly frequency: FieldRef<"MedicationRequest", 'String'>
    readonly route: FieldRef<"MedicationRequest", 'String'>
    readonly status: FieldRef<"MedicationRequest", 'String'>
    readonly prescribedBy: FieldRef<"MedicationRequest", 'String'>
    readonly prescribedAt: FieldRef<"MedicationRequest", 'DateTime'>
    readonly discontinuedAt: FieldRef<"MedicationRequest", 'DateTime'>
    readonly discontinuedBy: FieldRef<"MedicationRequest", 'String'>
    readonly notes: FieldRef<"MedicationRequest", 'String'>
  }
    

  // Custom InputTypes
  /**
   * MedicationRequest findUnique
   */
  export type MedicationRequestFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MedicationRequest
     */
    select?: MedicationRequestSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MedicationRequestInclude<ExtArgs> | null
    /**
     * Filter, which MedicationRequest to fetch.
     */
    where: MedicationRequestWhereUniqueInput
  }

  /**
   * MedicationRequest findUniqueOrThrow
   */
  export type MedicationRequestFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MedicationRequest
     */
    select?: MedicationRequestSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MedicationRequestInclude<ExtArgs> | null
    /**
     * Filter, which MedicationRequest to fetch.
     */
    where: MedicationRequestWhereUniqueInput
  }

  /**
   * MedicationRequest findFirst
   */
  export type MedicationRequestFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MedicationRequest
     */
    select?: MedicationRequestSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MedicationRequestInclude<ExtArgs> | null
    /**
     * Filter, which MedicationRequest to fetch.
     */
    where?: MedicationRequestWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MedicationRequests to fetch.
     */
    orderBy?: MedicationRequestOrderByWithRelationInput | MedicationRequestOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for MedicationRequests.
     */
    cursor?: MedicationRequestWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MedicationRequests from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MedicationRequests.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of MedicationRequests.
     */
    distinct?: MedicationRequestScalarFieldEnum | MedicationRequestScalarFieldEnum[]
  }

  /**
   * MedicationRequest findFirstOrThrow
   */
  export type MedicationRequestFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MedicationRequest
     */
    select?: MedicationRequestSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MedicationRequestInclude<ExtArgs> | null
    /**
     * Filter, which MedicationRequest to fetch.
     */
    where?: MedicationRequestWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MedicationRequests to fetch.
     */
    orderBy?: MedicationRequestOrderByWithRelationInput | MedicationRequestOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for MedicationRequests.
     */
    cursor?: MedicationRequestWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MedicationRequests from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MedicationRequests.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of MedicationRequests.
     */
    distinct?: MedicationRequestScalarFieldEnum | MedicationRequestScalarFieldEnum[]
  }

  /**
   * MedicationRequest findMany
   */
  export type MedicationRequestFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MedicationRequest
     */
    select?: MedicationRequestSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MedicationRequestInclude<ExtArgs> | null
    /**
     * Filter, which MedicationRequests to fetch.
     */
    where?: MedicationRequestWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MedicationRequests to fetch.
     */
    orderBy?: MedicationRequestOrderByWithRelationInput | MedicationRequestOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing MedicationRequests.
     */
    cursor?: MedicationRequestWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MedicationRequests from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MedicationRequests.
     */
    skip?: number
    distinct?: MedicationRequestScalarFieldEnum | MedicationRequestScalarFieldEnum[]
  }

  /**
   * MedicationRequest create
   */
  export type MedicationRequestCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MedicationRequest
     */
    select?: MedicationRequestSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MedicationRequestInclude<ExtArgs> | null
    /**
     * The data needed to create a MedicationRequest.
     */
    data: XOR<MedicationRequestCreateInput, MedicationRequestUncheckedCreateInput>
  }

  /**
   * MedicationRequest createMany
   */
  export type MedicationRequestCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many MedicationRequests.
     */
    data: MedicationRequestCreateManyInput | MedicationRequestCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * MedicationRequest createManyAndReturn
   */
  export type MedicationRequestCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MedicationRequest
     */
    select?: MedicationRequestSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many MedicationRequests.
     */
    data: MedicationRequestCreateManyInput | MedicationRequestCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MedicationRequestIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * MedicationRequest update
   */
  export type MedicationRequestUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MedicationRequest
     */
    select?: MedicationRequestSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MedicationRequestInclude<ExtArgs> | null
    /**
     * The data needed to update a MedicationRequest.
     */
    data: XOR<MedicationRequestUpdateInput, MedicationRequestUncheckedUpdateInput>
    /**
     * Choose, which MedicationRequest to update.
     */
    where: MedicationRequestWhereUniqueInput
  }

  /**
   * MedicationRequest updateMany
   */
  export type MedicationRequestUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update MedicationRequests.
     */
    data: XOR<MedicationRequestUpdateManyMutationInput, MedicationRequestUncheckedUpdateManyInput>
    /**
     * Filter which MedicationRequests to update
     */
    where?: MedicationRequestWhereInput
  }

  /**
   * MedicationRequest upsert
   */
  export type MedicationRequestUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MedicationRequest
     */
    select?: MedicationRequestSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MedicationRequestInclude<ExtArgs> | null
    /**
     * The filter to search for the MedicationRequest to update in case it exists.
     */
    where: MedicationRequestWhereUniqueInput
    /**
     * In case the MedicationRequest found by the `where` argument doesn't exist, create a new MedicationRequest with this data.
     */
    create: XOR<MedicationRequestCreateInput, MedicationRequestUncheckedCreateInput>
    /**
     * In case the MedicationRequest was found with the provided `where` argument, update it with this data.
     */
    update: XOR<MedicationRequestUpdateInput, MedicationRequestUncheckedUpdateInput>
  }

  /**
   * MedicationRequest delete
   */
  export type MedicationRequestDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MedicationRequest
     */
    select?: MedicationRequestSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MedicationRequestInclude<ExtArgs> | null
    /**
     * Filter which MedicationRequest to delete.
     */
    where: MedicationRequestWhereUniqueInput
  }

  /**
   * MedicationRequest deleteMany
   */
  export type MedicationRequestDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which MedicationRequests to delete
     */
    where?: MedicationRequestWhereInput
  }

  /**
   * MedicationRequest.encounter
   */
  export type MedicationRequest$encounterArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Encounter
     */
    select?: EncounterSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EncounterInclude<ExtArgs> | null
    where?: EncounterWhereInput
  }

  /**
   * MedicationRequest without action
   */
  export type MedicationRequestDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MedicationRequest
     */
    select?: MedicationRequestSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MedicationRequestInclude<ExtArgs> | null
  }


  /**
   * Model AllergyIntolerance
   */

  export type AggregateAllergyIntolerance = {
    _count: AllergyIntoleranceCountAggregateOutputType | null
    _min: AllergyIntoleranceMinAggregateOutputType | null
    _max: AllergyIntoleranceMaxAggregateOutputType | null
  }

  export type AllergyIntoleranceMinAggregateOutputType = {
    id: string | null
    patientId: string | null
    substance: string | null
    substanceCode: string | null
    type: string | null
    criticality: string | null
    clinicalStatus: string | null
    reaction: string | null
    reactionSeverity: string | null
    onsetDate: Date | null
    recordedAt: Date | null
    recordedBy: string | null
  }

  export type AllergyIntoleranceMaxAggregateOutputType = {
    id: string | null
    patientId: string | null
    substance: string | null
    substanceCode: string | null
    type: string | null
    criticality: string | null
    clinicalStatus: string | null
    reaction: string | null
    reactionSeverity: string | null
    onsetDate: Date | null
    recordedAt: Date | null
    recordedBy: string | null
  }

  export type AllergyIntoleranceCountAggregateOutputType = {
    id: number
    patientId: number
    substance: number
    substanceCode: number
    type: number
    criticality: number
    clinicalStatus: number
    reaction: number
    reactionSeverity: number
    onsetDate: number
    recordedAt: number
    recordedBy: number
    _all: number
  }


  export type AllergyIntoleranceMinAggregateInputType = {
    id?: true
    patientId?: true
    substance?: true
    substanceCode?: true
    type?: true
    criticality?: true
    clinicalStatus?: true
    reaction?: true
    reactionSeverity?: true
    onsetDate?: true
    recordedAt?: true
    recordedBy?: true
  }

  export type AllergyIntoleranceMaxAggregateInputType = {
    id?: true
    patientId?: true
    substance?: true
    substanceCode?: true
    type?: true
    criticality?: true
    clinicalStatus?: true
    reaction?: true
    reactionSeverity?: true
    onsetDate?: true
    recordedAt?: true
    recordedBy?: true
  }

  export type AllergyIntoleranceCountAggregateInputType = {
    id?: true
    patientId?: true
    substance?: true
    substanceCode?: true
    type?: true
    criticality?: true
    clinicalStatus?: true
    reaction?: true
    reactionSeverity?: true
    onsetDate?: true
    recordedAt?: true
    recordedBy?: true
    _all?: true
  }

  export type AllergyIntoleranceAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AllergyIntolerance to aggregate.
     */
    where?: AllergyIntoleranceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AllergyIntolerances to fetch.
     */
    orderBy?: AllergyIntoleranceOrderByWithRelationInput | AllergyIntoleranceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AllergyIntoleranceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AllergyIntolerances from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AllergyIntolerances.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned AllergyIntolerances
    **/
    _count?: true | AllergyIntoleranceCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AllergyIntoleranceMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AllergyIntoleranceMaxAggregateInputType
  }

  export type GetAllergyIntoleranceAggregateType<T extends AllergyIntoleranceAggregateArgs> = {
        [P in keyof T & keyof AggregateAllergyIntolerance]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAllergyIntolerance[P]>
      : GetScalarType<T[P], AggregateAllergyIntolerance[P]>
  }




  export type AllergyIntoleranceGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AllergyIntoleranceWhereInput
    orderBy?: AllergyIntoleranceOrderByWithAggregationInput | AllergyIntoleranceOrderByWithAggregationInput[]
    by: AllergyIntoleranceScalarFieldEnum[] | AllergyIntoleranceScalarFieldEnum
    having?: AllergyIntoleranceScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AllergyIntoleranceCountAggregateInputType | true
    _min?: AllergyIntoleranceMinAggregateInputType
    _max?: AllergyIntoleranceMaxAggregateInputType
  }

  export type AllergyIntoleranceGroupByOutputType = {
    id: string
    patientId: string
    substance: string
    substanceCode: string | null
    type: string
    criticality: string | null
    clinicalStatus: string
    reaction: string | null
    reactionSeverity: string | null
    onsetDate: Date | null
    recordedAt: Date
    recordedBy: string
    _count: AllergyIntoleranceCountAggregateOutputType | null
    _min: AllergyIntoleranceMinAggregateOutputType | null
    _max: AllergyIntoleranceMaxAggregateOutputType | null
  }

  type GetAllergyIntoleranceGroupByPayload<T extends AllergyIntoleranceGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AllergyIntoleranceGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AllergyIntoleranceGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AllergyIntoleranceGroupByOutputType[P]>
            : GetScalarType<T[P], AllergyIntoleranceGroupByOutputType[P]>
        }
      >
    >


  export type AllergyIntoleranceSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    patientId?: boolean
    substance?: boolean
    substanceCode?: boolean
    type?: boolean
    criticality?: boolean
    clinicalStatus?: boolean
    reaction?: boolean
    reactionSeverity?: boolean
    onsetDate?: boolean
    recordedAt?: boolean
    recordedBy?: boolean
    patient?: boolean | PatientDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["allergyIntolerance"]>

  export type AllergyIntoleranceSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    patientId?: boolean
    substance?: boolean
    substanceCode?: boolean
    type?: boolean
    criticality?: boolean
    clinicalStatus?: boolean
    reaction?: boolean
    reactionSeverity?: boolean
    onsetDate?: boolean
    recordedAt?: boolean
    recordedBy?: boolean
    patient?: boolean | PatientDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["allergyIntolerance"]>

  export type AllergyIntoleranceSelectScalar = {
    id?: boolean
    patientId?: boolean
    substance?: boolean
    substanceCode?: boolean
    type?: boolean
    criticality?: boolean
    clinicalStatus?: boolean
    reaction?: boolean
    reactionSeverity?: boolean
    onsetDate?: boolean
    recordedAt?: boolean
    recordedBy?: boolean
  }

  export type AllergyIntoleranceInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    patient?: boolean | PatientDefaultArgs<ExtArgs>
  }
  export type AllergyIntoleranceIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    patient?: boolean | PatientDefaultArgs<ExtArgs>
  }

  export type $AllergyIntolerancePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "AllergyIntolerance"
    objects: {
      patient: Prisma.$PatientPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      patientId: string
      substance: string
      substanceCode: string | null
      type: string
      criticality: string | null
      clinicalStatus: string
      reaction: string | null
      reactionSeverity: string | null
      onsetDate: Date | null
      recordedAt: Date
      recordedBy: string
    }, ExtArgs["result"]["allergyIntolerance"]>
    composites: {}
  }

  type AllergyIntoleranceGetPayload<S extends boolean | null | undefined | AllergyIntoleranceDefaultArgs> = $Result.GetResult<Prisma.$AllergyIntolerancePayload, S>

  type AllergyIntoleranceCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<AllergyIntoleranceFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: AllergyIntoleranceCountAggregateInputType | true
    }

  export interface AllergyIntoleranceDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['AllergyIntolerance'], meta: { name: 'AllergyIntolerance' } }
    /**
     * Find zero or one AllergyIntolerance that matches the filter.
     * @param {AllergyIntoleranceFindUniqueArgs} args - Arguments to find a AllergyIntolerance
     * @example
     * // Get one AllergyIntolerance
     * const allergyIntolerance = await prisma.allergyIntolerance.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AllergyIntoleranceFindUniqueArgs>(args: SelectSubset<T, AllergyIntoleranceFindUniqueArgs<ExtArgs>>): Prisma__AllergyIntoleranceClient<$Result.GetResult<Prisma.$AllergyIntolerancePayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one AllergyIntolerance that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {AllergyIntoleranceFindUniqueOrThrowArgs} args - Arguments to find a AllergyIntolerance
     * @example
     * // Get one AllergyIntolerance
     * const allergyIntolerance = await prisma.allergyIntolerance.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AllergyIntoleranceFindUniqueOrThrowArgs>(args: SelectSubset<T, AllergyIntoleranceFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AllergyIntoleranceClient<$Result.GetResult<Prisma.$AllergyIntolerancePayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first AllergyIntolerance that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AllergyIntoleranceFindFirstArgs} args - Arguments to find a AllergyIntolerance
     * @example
     * // Get one AllergyIntolerance
     * const allergyIntolerance = await prisma.allergyIntolerance.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AllergyIntoleranceFindFirstArgs>(args?: SelectSubset<T, AllergyIntoleranceFindFirstArgs<ExtArgs>>): Prisma__AllergyIntoleranceClient<$Result.GetResult<Prisma.$AllergyIntolerancePayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first AllergyIntolerance that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AllergyIntoleranceFindFirstOrThrowArgs} args - Arguments to find a AllergyIntolerance
     * @example
     * // Get one AllergyIntolerance
     * const allergyIntolerance = await prisma.allergyIntolerance.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AllergyIntoleranceFindFirstOrThrowArgs>(args?: SelectSubset<T, AllergyIntoleranceFindFirstOrThrowArgs<ExtArgs>>): Prisma__AllergyIntoleranceClient<$Result.GetResult<Prisma.$AllergyIntolerancePayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more AllergyIntolerances that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AllergyIntoleranceFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all AllergyIntolerances
     * const allergyIntolerances = await prisma.allergyIntolerance.findMany()
     * 
     * // Get first 10 AllergyIntolerances
     * const allergyIntolerances = await prisma.allergyIntolerance.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const allergyIntoleranceWithIdOnly = await prisma.allergyIntolerance.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AllergyIntoleranceFindManyArgs>(args?: SelectSubset<T, AllergyIntoleranceFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AllergyIntolerancePayload<ExtArgs>, T, "findMany">>

    /**
     * Create a AllergyIntolerance.
     * @param {AllergyIntoleranceCreateArgs} args - Arguments to create a AllergyIntolerance.
     * @example
     * // Create one AllergyIntolerance
     * const AllergyIntolerance = await prisma.allergyIntolerance.create({
     *   data: {
     *     // ... data to create a AllergyIntolerance
     *   }
     * })
     * 
     */
    create<T extends AllergyIntoleranceCreateArgs>(args: SelectSubset<T, AllergyIntoleranceCreateArgs<ExtArgs>>): Prisma__AllergyIntoleranceClient<$Result.GetResult<Prisma.$AllergyIntolerancePayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many AllergyIntolerances.
     * @param {AllergyIntoleranceCreateManyArgs} args - Arguments to create many AllergyIntolerances.
     * @example
     * // Create many AllergyIntolerances
     * const allergyIntolerance = await prisma.allergyIntolerance.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AllergyIntoleranceCreateManyArgs>(args?: SelectSubset<T, AllergyIntoleranceCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many AllergyIntolerances and returns the data saved in the database.
     * @param {AllergyIntoleranceCreateManyAndReturnArgs} args - Arguments to create many AllergyIntolerances.
     * @example
     * // Create many AllergyIntolerances
     * const allergyIntolerance = await prisma.allergyIntolerance.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many AllergyIntolerances and only return the `id`
     * const allergyIntoleranceWithIdOnly = await prisma.allergyIntolerance.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AllergyIntoleranceCreateManyAndReturnArgs>(args?: SelectSubset<T, AllergyIntoleranceCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AllergyIntolerancePayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a AllergyIntolerance.
     * @param {AllergyIntoleranceDeleteArgs} args - Arguments to delete one AllergyIntolerance.
     * @example
     * // Delete one AllergyIntolerance
     * const AllergyIntolerance = await prisma.allergyIntolerance.delete({
     *   where: {
     *     // ... filter to delete one AllergyIntolerance
     *   }
     * })
     * 
     */
    delete<T extends AllergyIntoleranceDeleteArgs>(args: SelectSubset<T, AllergyIntoleranceDeleteArgs<ExtArgs>>): Prisma__AllergyIntoleranceClient<$Result.GetResult<Prisma.$AllergyIntolerancePayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one AllergyIntolerance.
     * @param {AllergyIntoleranceUpdateArgs} args - Arguments to update one AllergyIntolerance.
     * @example
     * // Update one AllergyIntolerance
     * const allergyIntolerance = await prisma.allergyIntolerance.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AllergyIntoleranceUpdateArgs>(args: SelectSubset<T, AllergyIntoleranceUpdateArgs<ExtArgs>>): Prisma__AllergyIntoleranceClient<$Result.GetResult<Prisma.$AllergyIntolerancePayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more AllergyIntolerances.
     * @param {AllergyIntoleranceDeleteManyArgs} args - Arguments to filter AllergyIntolerances to delete.
     * @example
     * // Delete a few AllergyIntolerances
     * const { count } = await prisma.allergyIntolerance.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AllergyIntoleranceDeleteManyArgs>(args?: SelectSubset<T, AllergyIntoleranceDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AllergyIntolerances.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AllergyIntoleranceUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many AllergyIntolerances
     * const allergyIntolerance = await prisma.allergyIntolerance.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AllergyIntoleranceUpdateManyArgs>(args: SelectSubset<T, AllergyIntoleranceUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one AllergyIntolerance.
     * @param {AllergyIntoleranceUpsertArgs} args - Arguments to update or create a AllergyIntolerance.
     * @example
     * // Update or create a AllergyIntolerance
     * const allergyIntolerance = await prisma.allergyIntolerance.upsert({
     *   create: {
     *     // ... data to create a AllergyIntolerance
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the AllergyIntolerance we want to update
     *   }
     * })
     */
    upsert<T extends AllergyIntoleranceUpsertArgs>(args: SelectSubset<T, AllergyIntoleranceUpsertArgs<ExtArgs>>): Prisma__AllergyIntoleranceClient<$Result.GetResult<Prisma.$AllergyIntolerancePayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of AllergyIntolerances.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AllergyIntoleranceCountArgs} args - Arguments to filter AllergyIntolerances to count.
     * @example
     * // Count the number of AllergyIntolerances
     * const count = await prisma.allergyIntolerance.count({
     *   where: {
     *     // ... the filter for the AllergyIntolerances we want to count
     *   }
     * })
    **/
    count<T extends AllergyIntoleranceCountArgs>(
      args?: Subset<T, AllergyIntoleranceCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AllergyIntoleranceCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a AllergyIntolerance.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AllergyIntoleranceAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AllergyIntoleranceAggregateArgs>(args: Subset<T, AllergyIntoleranceAggregateArgs>): Prisma.PrismaPromise<GetAllergyIntoleranceAggregateType<T>>

    /**
     * Group by AllergyIntolerance.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AllergyIntoleranceGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AllergyIntoleranceGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AllergyIntoleranceGroupByArgs['orderBy'] }
        : { orderBy?: AllergyIntoleranceGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AllergyIntoleranceGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAllergyIntoleranceGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the AllergyIntolerance model
   */
  readonly fields: AllergyIntoleranceFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for AllergyIntolerance.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AllergyIntoleranceClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    patient<T extends PatientDefaultArgs<ExtArgs> = {}>(args?: Subset<T, PatientDefaultArgs<ExtArgs>>): Prisma__PatientClient<$Result.GetResult<Prisma.$PatientPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the AllergyIntolerance model
   */ 
  interface AllergyIntoleranceFieldRefs {
    readonly id: FieldRef<"AllergyIntolerance", 'String'>
    readonly patientId: FieldRef<"AllergyIntolerance", 'String'>
    readonly substance: FieldRef<"AllergyIntolerance", 'String'>
    readonly substanceCode: FieldRef<"AllergyIntolerance", 'String'>
    readonly type: FieldRef<"AllergyIntolerance", 'String'>
    readonly criticality: FieldRef<"AllergyIntolerance", 'String'>
    readonly clinicalStatus: FieldRef<"AllergyIntolerance", 'String'>
    readonly reaction: FieldRef<"AllergyIntolerance", 'String'>
    readonly reactionSeverity: FieldRef<"AllergyIntolerance", 'String'>
    readonly onsetDate: FieldRef<"AllergyIntolerance", 'DateTime'>
    readonly recordedAt: FieldRef<"AllergyIntolerance", 'DateTime'>
    readonly recordedBy: FieldRef<"AllergyIntolerance", 'String'>
  }
    

  // Custom InputTypes
  /**
   * AllergyIntolerance findUnique
   */
  export type AllergyIntoleranceFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AllergyIntolerance
     */
    select?: AllergyIntoleranceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AllergyIntoleranceInclude<ExtArgs> | null
    /**
     * Filter, which AllergyIntolerance to fetch.
     */
    where: AllergyIntoleranceWhereUniqueInput
  }

  /**
   * AllergyIntolerance findUniqueOrThrow
   */
  export type AllergyIntoleranceFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AllergyIntolerance
     */
    select?: AllergyIntoleranceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AllergyIntoleranceInclude<ExtArgs> | null
    /**
     * Filter, which AllergyIntolerance to fetch.
     */
    where: AllergyIntoleranceWhereUniqueInput
  }

  /**
   * AllergyIntolerance findFirst
   */
  export type AllergyIntoleranceFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AllergyIntolerance
     */
    select?: AllergyIntoleranceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AllergyIntoleranceInclude<ExtArgs> | null
    /**
     * Filter, which AllergyIntolerance to fetch.
     */
    where?: AllergyIntoleranceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AllergyIntolerances to fetch.
     */
    orderBy?: AllergyIntoleranceOrderByWithRelationInput | AllergyIntoleranceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AllergyIntolerances.
     */
    cursor?: AllergyIntoleranceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AllergyIntolerances from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AllergyIntolerances.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AllergyIntolerances.
     */
    distinct?: AllergyIntoleranceScalarFieldEnum | AllergyIntoleranceScalarFieldEnum[]
  }

  /**
   * AllergyIntolerance findFirstOrThrow
   */
  export type AllergyIntoleranceFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AllergyIntolerance
     */
    select?: AllergyIntoleranceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AllergyIntoleranceInclude<ExtArgs> | null
    /**
     * Filter, which AllergyIntolerance to fetch.
     */
    where?: AllergyIntoleranceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AllergyIntolerances to fetch.
     */
    orderBy?: AllergyIntoleranceOrderByWithRelationInput | AllergyIntoleranceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AllergyIntolerances.
     */
    cursor?: AllergyIntoleranceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AllergyIntolerances from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AllergyIntolerances.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AllergyIntolerances.
     */
    distinct?: AllergyIntoleranceScalarFieldEnum | AllergyIntoleranceScalarFieldEnum[]
  }

  /**
   * AllergyIntolerance findMany
   */
  export type AllergyIntoleranceFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AllergyIntolerance
     */
    select?: AllergyIntoleranceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AllergyIntoleranceInclude<ExtArgs> | null
    /**
     * Filter, which AllergyIntolerances to fetch.
     */
    where?: AllergyIntoleranceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AllergyIntolerances to fetch.
     */
    orderBy?: AllergyIntoleranceOrderByWithRelationInput | AllergyIntoleranceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing AllergyIntolerances.
     */
    cursor?: AllergyIntoleranceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AllergyIntolerances from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AllergyIntolerances.
     */
    skip?: number
    distinct?: AllergyIntoleranceScalarFieldEnum | AllergyIntoleranceScalarFieldEnum[]
  }

  /**
   * AllergyIntolerance create
   */
  export type AllergyIntoleranceCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AllergyIntolerance
     */
    select?: AllergyIntoleranceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AllergyIntoleranceInclude<ExtArgs> | null
    /**
     * The data needed to create a AllergyIntolerance.
     */
    data: XOR<AllergyIntoleranceCreateInput, AllergyIntoleranceUncheckedCreateInput>
  }

  /**
   * AllergyIntolerance createMany
   */
  export type AllergyIntoleranceCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many AllergyIntolerances.
     */
    data: AllergyIntoleranceCreateManyInput | AllergyIntoleranceCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * AllergyIntolerance createManyAndReturn
   */
  export type AllergyIntoleranceCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AllergyIntolerance
     */
    select?: AllergyIntoleranceSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many AllergyIntolerances.
     */
    data: AllergyIntoleranceCreateManyInput | AllergyIntoleranceCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AllergyIntoleranceIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * AllergyIntolerance update
   */
  export type AllergyIntoleranceUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AllergyIntolerance
     */
    select?: AllergyIntoleranceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AllergyIntoleranceInclude<ExtArgs> | null
    /**
     * The data needed to update a AllergyIntolerance.
     */
    data: XOR<AllergyIntoleranceUpdateInput, AllergyIntoleranceUncheckedUpdateInput>
    /**
     * Choose, which AllergyIntolerance to update.
     */
    where: AllergyIntoleranceWhereUniqueInput
  }

  /**
   * AllergyIntolerance updateMany
   */
  export type AllergyIntoleranceUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update AllergyIntolerances.
     */
    data: XOR<AllergyIntoleranceUpdateManyMutationInput, AllergyIntoleranceUncheckedUpdateManyInput>
    /**
     * Filter which AllergyIntolerances to update
     */
    where?: AllergyIntoleranceWhereInput
  }

  /**
   * AllergyIntolerance upsert
   */
  export type AllergyIntoleranceUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AllergyIntolerance
     */
    select?: AllergyIntoleranceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AllergyIntoleranceInclude<ExtArgs> | null
    /**
     * The filter to search for the AllergyIntolerance to update in case it exists.
     */
    where: AllergyIntoleranceWhereUniqueInput
    /**
     * In case the AllergyIntolerance found by the `where` argument doesn't exist, create a new AllergyIntolerance with this data.
     */
    create: XOR<AllergyIntoleranceCreateInput, AllergyIntoleranceUncheckedCreateInput>
    /**
     * In case the AllergyIntolerance was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AllergyIntoleranceUpdateInput, AllergyIntoleranceUncheckedUpdateInput>
  }

  /**
   * AllergyIntolerance delete
   */
  export type AllergyIntoleranceDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AllergyIntolerance
     */
    select?: AllergyIntoleranceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AllergyIntoleranceInclude<ExtArgs> | null
    /**
     * Filter which AllergyIntolerance to delete.
     */
    where: AllergyIntoleranceWhereUniqueInput
  }

  /**
   * AllergyIntolerance deleteMany
   */
  export type AllergyIntoleranceDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AllergyIntolerances to delete
     */
    where?: AllergyIntoleranceWhereInput
  }

  /**
   * AllergyIntolerance without action
   */
  export type AllergyIntoleranceDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AllergyIntolerance
     */
    select?: AllergyIntoleranceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AllergyIntoleranceInclude<ExtArgs> | null
  }


  /**
   * Model Observation
   */

  export type AggregateObservation = {
    _count: ObservationCountAggregateOutputType | null
    _avg: ObservationAvgAggregateOutputType | null
    _sum: ObservationSumAggregateOutputType | null
    _min: ObservationMinAggregateOutputType | null
    _max: ObservationMaxAggregateOutputType | null
  }

  export type ObservationAvgAggregateOutputType = {
    valueQuantity: number | null
    referenceRangeLow: number | null
    referenceRangeHigh: number | null
  }

  export type ObservationSumAggregateOutputType = {
    valueQuantity: number | null
    referenceRangeLow: number | null
    referenceRangeHigh: number | null
  }

  export type ObservationMinAggregateOutputType = {
    id: string | null
    patientId: string | null
    encounterId: string | null
    category: string | null
    loincCode: string | null
    display: string | null
    valueQuantity: number | null
    valueUnit: string | null
    valueString: string | null
    referenceRangeLow: number | null
    referenceRangeHigh: number | null
    isAbnormal: boolean | null
    status: string | null
    effectiveAt: Date | null
    recordedBy: string | null
  }

  export type ObservationMaxAggregateOutputType = {
    id: string | null
    patientId: string | null
    encounterId: string | null
    category: string | null
    loincCode: string | null
    display: string | null
    valueQuantity: number | null
    valueUnit: string | null
    valueString: string | null
    referenceRangeLow: number | null
    referenceRangeHigh: number | null
    isAbnormal: boolean | null
    status: string | null
    effectiveAt: Date | null
    recordedBy: string | null
  }

  export type ObservationCountAggregateOutputType = {
    id: number
    patientId: number
    encounterId: number
    category: number
    loincCode: number
    display: number
    valueQuantity: number
    valueUnit: number
    valueString: number
    referenceRangeLow: number
    referenceRangeHigh: number
    isAbnormal: number
    status: number
    effectiveAt: number
    recordedBy: number
    _all: number
  }


  export type ObservationAvgAggregateInputType = {
    valueQuantity?: true
    referenceRangeLow?: true
    referenceRangeHigh?: true
  }

  export type ObservationSumAggregateInputType = {
    valueQuantity?: true
    referenceRangeLow?: true
    referenceRangeHigh?: true
  }

  export type ObservationMinAggregateInputType = {
    id?: true
    patientId?: true
    encounterId?: true
    category?: true
    loincCode?: true
    display?: true
    valueQuantity?: true
    valueUnit?: true
    valueString?: true
    referenceRangeLow?: true
    referenceRangeHigh?: true
    isAbnormal?: true
    status?: true
    effectiveAt?: true
    recordedBy?: true
  }

  export type ObservationMaxAggregateInputType = {
    id?: true
    patientId?: true
    encounterId?: true
    category?: true
    loincCode?: true
    display?: true
    valueQuantity?: true
    valueUnit?: true
    valueString?: true
    referenceRangeLow?: true
    referenceRangeHigh?: true
    isAbnormal?: true
    status?: true
    effectiveAt?: true
    recordedBy?: true
  }

  export type ObservationCountAggregateInputType = {
    id?: true
    patientId?: true
    encounterId?: true
    category?: true
    loincCode?: true
    display?: true
    valueQuantity?: true
    valueUnit?: true
    valueString?: true
    referenceRangeLow?: true
    referenceRangeHigh?: true
    isAbnormal?: true
    status?: true
    effectiveAt?: true
    recordedBy?: true
    _all?: true
  }

  export type ObservationAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Observation to aggregate.
     */
    where?: ObservationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Observations to fetch.
     */
    orderBy?: ObservationOrderByWithRelationInput | ObservationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ObservationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Observations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Observations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Observations
    **/
    _count?: true | ObservationCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ObservationAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ObservationSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ObservationMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ObservationMaxAggregateInputType
  }

  export type GetObservationAggregateType<T extends ObservationAggregateArgs> = {
        [P in keyof T & keyof AggregateObservation]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateObservation[P]>
      : GetScalarType<T[P], AggregateObservation[P]>
  }




  export type ObservationGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ObservationWhereInput
    orderBy?: ObservationOrderByWithAggregationInput | ObservationOrderByWithAggregationInput[]
    by: ObservationScalarFieldEnum[] | ObservationScalarFieldEnum
    having?: ObservationScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ObservationCountAggregateInputType | true
    _avg?: ObservationAvgAggregateInputType
    _sum?: ObservationSumAggregateInputType
    _min?: ObservationMinAggregateInputType
    _max?: ObservationMaxAggregateInputType
  }

  export type ObservationGroupByOutputType = {
    id: string
    patientId: string
    encounterId: string | null
    category: string
    loincCode: string | null
    display: string
    valueQuantity: number | null
    valueUnit: string | null
    valueString: string | null
    referenceRangeLow: number | null
    referenceRangeHigh: number | null
    isAbnormal: boolean
    status: string
    effectiveAt: Date
    recordedBy: string
    _count: ObservationCountAggregateOutputType | null
    _avg: ObservationAvgAggregateOutputType | null
    _sum: ObservationSumAggregateOutputType | null
    _min: ObservationMinAggregateOutputType | null
    _max: ObservationMaxAggregateOutputType | null
  }

  type GetObservationGroupByPayload<T extends ObservationGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ObservationGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ObservationGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ObservationGroupByOutputType[P]>
            : GetScalarType<T[P], ObservationGroupByOutputType[P]>
        }
      >
    >


  export type ObservationSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    patientId?: boolean
    encounterId?: boolean
    category?: boolean
    loincCode?: boolean
    display?: boolean
    valueQuantity?: boolean
    valueUnit?: boolean
    valueString?: boolean
    referenceRangeLow?: boolean
    referenceRangeHigh?: boolean
    isAbnormal?: boolean
    status?: boolean
    effectiveAt?: boolean
    recordedBy?: boolean
    patient?: boolean | PatientDefaultArgs<ExtArgs>
    encounter?: boolean | Observation$encounterArgs<ExtArgs>
  }, ExtArgs["result"]["observation"]>

  export type ObservationSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    patientId?: boolean
    encounterId?: boolean
    category?: boolean
    loincCode?: boolean
    display?: boolean
    valueQuantity?: boolean
    valueUnit?: boolean
    valueString?: boolean
    referenceRangeLow?: boolean
    referenceRangeHigh?: boolean
    isAbnormal?: boolean
    status?: boolean
    effectiveAt?: boolean
    recordedBy?: boolean
    patient?: boolean | PatientDefaultArgs<ExtArgs>
    encounter?: boolean | Observation$encounterArgs<ExtArgs>
  }, ExtArgs["result"]["observation"]>

  export type ObservationSelectScalar = {
    id?: boolean
    patientId?: boolean
    encounterId?: boolean
    category?: boolean
    loincCode?: boolean
    display?: boolean
    valueQuantity?: boolean
    valueUnit?: boolean
    valueString?: boolean
    referenceRangeLow?: boolean
    referenceRangeHigh?: boolean
    isAbnormal?: boolean
    status?: boolean
    effectiveAt?: boolean
    recordedBy?: boolean
  }

  export type ObservationInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    patient?: boolean | PatientDefaultArgs<ExtArgs>
    encounter?: boolean | Observation$encounterArgs<ExtArgs>
  }
  export type ObservationIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    patient?: boolean | PatientDefaultArgs<ExtArgs>
    encounter?: boolean | Observation$encounterArgs<ExtArgs>
  }

  export type $ObservationPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Observation"
    objects: {
      patient: Prisma.$PatientPayload<ExtArgs>
      encounter: Prisma.$EncounterPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      patientId: string
      encounterId: string | null
      category: string
      loincCode: string | null
      display: string
      valueQuantity: number | null
      valueUnit: string | null
      valueString: string | null
      referenceRangeLow: number | null
      referenceRangeHigh: number | null
      isAbnormal: boolean
      status: string
      effectiveAt: Date
      recordedBy: string
    }, ExtArgs["result"]["observation"]>
    composites: {}
  }

  type ObservationGetPayload<S extends boolean | null | undefined | ObservationDefaultArgs> = $Result.GetResult<Prisma.$ObservationPayload, S>

  type ObservationCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<ObservationFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: ObservationCountAggregateInputType | true
    }

  export interface ObservationDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Observation'], meta: { name: 'Observation' } }
    /**
     * Find zero or one Observation that matches the filter.
     * @param {ObservationFindUniqueArgs} args - Arguments to find a Observation
     * @example
     * // Get one Observation
     * const observation = await prisma.observation.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ObservationFindUniqueArgs>(args: SelectSubset<T, ObservationFindUniqueArgs<ExtArgs>>): Prisma__ObservationClient<$Result.GetResult<Prisma.$ObservationPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Observation that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {ObservationFindUniqueOrThrowArgs} args - Arguments to find a Observation
     * @example
     * // Get one Observation
     * const observation = await prisma.observation.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ObservationFindUniqueOrThrowArgs>(args: SelectSubset<T, ObservationFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ObservationClient<$Result.GetResult<Prisma.$ObservationPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Observation that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ObservationFindFirstArgs} args - Arguments to find a Observation
     * @example
     * // Get one Observation
     * const observation = await prisma.observation.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ObservationFindFirstArgs>(args?: SelectSubset<T, ObservationFindFirstArgs<ExtArgs>>): Prisma__ObservationClient<$Result.GetResult<Prisma.$ObservationPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Observation that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ObservationFindFirstOrThrowArgs} args - Arguments to find a Observation
     * @example
     * // Get one Observation
     * const observation = await prisma.observation.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ObservationFindFirstOrThrowArgs>(args?: SelectSubset<T, ObservationFindFirstOrThrowArgs<ExtArgs>>): Prisma__ObservationClient<$Result.GetResult<Prisma.$ObservationPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Observations that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ObservationFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Observations
     * const observations = await prisma.observation.findMany()
     * 
     * // Get first 10 Observations
     * const observations = await prisma.observation.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const observationWithIdOnly = await prisma.observation.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ObservationFindManyArgs>(args?: SelectSubset<T, ObservationFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ObservationPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Observation.
     * @param {ObservationCreateArgs} args - Arguments to create a Observation.
     * @example
     * // Create one Observation
     * const Observation = await prisma.observation.create({
     *   data: {
     *     // ... data to create a Observation
     *   }
     * })
     * 
     */
    create<T extends ObservationCreateArgs>(args: SelectSubset<T, ObservationCreateArgs<ExtArgs>>): Prisma__ObservationClient<$Result.GetResult<Prisma.$ObservationPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Observations.
     * @param {ObservationCreateManyArgs} args - Arguments to create many Observations.
     * @example
     * // Create many Observations
     * const observation = await prisma.observation.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ObservationCreateManyArgs>(args?: SelectSubset<T, ObservationCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Observations and returns the data saved in the database.
     * @param {ObservationCreateManyAndReturnArgs} args - Arguments to create many Observations.
     * @example
     * // Create many Observations
     * const observation = await prisma.observation.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Observations and only return the `id`
     * const observationWithIdOnly = await prisma.observation.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ObservationCreateManyAndReturnArgs>(args?: SelectSubset<T, ObservationCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ObservationPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Observation.
     * @param {ObservationDeleteArgs} args - Arguments to delete one Observation.
     * @example
     * // Delete one Observation
     * const Observation = await prisma.observation.delete({
     *   where: {
     *     // ... filter to delete one Observation
     *   }
     * })
     * 
     */
    delete<T extends ObservationDeleteArgs>(args: SelectSubset<T, ObservationDeleteArgs<ExtArgs>>): Prisma__ObservationClient<$Result.GetResult<Prisma.$ObservationPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Observation.
     * @param {ObservationUpdateArgs} args - Arguments to update one Observation.
     * @example
     * // Update one Observation
     * const observation = await prisma.observation.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ObservationUpdateArgs>(args: SelectSubset<T, ObservationUpdateArgs<ExtArgs>>): Prisma__ObservationClient<$Result.GetResult<Prisma.$ObservationPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Observations.
     * @param {ObservationDeleteManyArgs} args - Arguments to filter Observations to delete.
     * @example
     * // Delete a few Observations
     * const { count } = await prisma.observation.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ObservationDeleteManyArgs>(args?: SelectSubset<T, ObservationDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Observations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ObservationUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Observations
     * const observation = await prisma.observation.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ObservationUpdateManyArgs>(args: SelectSubset<T, ObservationUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Observation.
     * @param {ObservationUpsertArgs} args - Arguments to update or create a Observation.
     * @example
     * // Update or create a Observation
     * const observation = await prisma.observation.upsert({
     *   create: {
     *     // ... data to create a Observation
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Observation we want to update
     *   }
     * })
     */
    upsert<T extends ObservationUpsertArgs>(args: SelectSubset<T, ObservationUpsertArgs<ExtArgs>>): Prisma__ObservationClient<$Result.GetResult<Prisma.$ObservationPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Observations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ObservationCountArgs} args - Arguments to filter Observations to count.
     * @example
     * // Count the number of Observations
     * const count = await prisma.observation.count({
     *   where: {
     *     // ... the filter for the Observations we want to count
     *   }
     * })
    **/
    count<T extends ObservationCountArgs>(
      args?: Subset<T, ObservationCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ObservationCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Observation.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ObservationAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ObservationAggregateArgs>(args: Subset<T, ObservationAggregateArgs>): Prisma.PrismaPromise<GetObservationAggregateType<T>>

    /**
     * Group by Observation.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ObservationGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ObservationGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ObservationGroupByArgs['orderBy'] }
        : { orderBy?: ObservationGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ObservationGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetObservationGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Observation model
   */
  readonly fields: ObservationFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Observation.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ObservationClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    patient<T extends PatientDefaultArgs<ExtArgs> = {}>(args?: Subset<T, PatientDefaultArgs<ExtArgs>>): Prisma__PatientClient<$Result.GetResult<Prisma.$PatientPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    encounter<T extends Observation$encounterArgs<ExtArgs> = {}>(args?: Subset<T, Observation$encounterArgs<ExtArgs>>): Prisma__EncounterClient<$Result.GetResult<Prisma.$EncounterPayload<ExtArgs>, T, "findUniqueOrThrow"> | null, null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Observation model
   */ 
  interface ObservationFieldRefs {
    readonly id: FieldRef<"Observation", 'String'>
    readonly patientId: FieldRef<"Observation", 'String'>
    readonly encounterId: FieldRef<"Observation", 'String'>
    readonly category: FieldRef<"Observation", 'String'>
    readonly loincCode: FieldRef<"Observation", 'String'>
    readonly display: FieldRef<"Observation", 'String'>
    readonly valueQuantity: FieldRef<"Observation", 'Float'>
    readonly valueUnit: FieldRef<"Observation", 'String'>
    readonly valueString: FieldRef<"Observation", 'String'>
    readonly referenceRangeLow: FieldRef<"Observation", 'Float'>
    readonly referenceRangeHigh: FieldRef<"Observation", 'Float'>
    readonly isAbnormal: FieldRef<"Observation", 'Boolean'>
    readonly status: FieldRef<"Observation", 'String'>
    readonly effectiveAt: FieldRef<"Observation", 'DateTime'>
    readonly recordedBy: FieldRef<"Observation", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Observation findUnique
   */
  export type ObservationFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Observation
     */
    select?: ObservationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ObservationInclude<ExtArgs> | null
    /**
     * Filter, which Observation to fetch.
     */
    where: ObservationWhereUniqueInput
  }

  /**
   * Observation findUniqueOrThrow
   */
  export type ObservationFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Observation
     */
    select?: ObservationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ObservationInclude<ExtArgs> | null
    /**
     * Filter, which Observation to fetch.
     */
    where: ObservationWhereUniqueInput
  }

  /**
   * Observation findFirst
   */
  export type ObservationFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Observation
     */
    select?: ObservationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ObservationInclude<ExtArgs> | null
    /**
     * Filter, which Observation to fetch.
     */
    where?: ObservationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Observations to fetch.
     */
    orderBy?: ObservationOrderByWithRelationInput | ObservationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Observations.
     */
    cursor?: ObservationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Observations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Observations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Observations.
     */
    distinct?: ObservationScalarFieldEnum | ObservationScalarFieldEnum[]
  }

  /**
   * Observation findFirstOrThrow
   */
  export type ObservationFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Observation
     */
    select?: ObservationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ObservationInclude<ExtArgs> | null
    /**
     * Filter, which Observation to fetch.
     */
    where?: ObservationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Observations to fetch.
     */
    orderBy?: ObservationOrderByWithRelationInput | ObservationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Observations.
     */
    cursor?: ObservationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Observations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Observations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Observations.
     */
    distinct?: ObservationScalarFieldEnum | ObservationScalarFieldEnum[]
  }

  /**
   * Observation findMany
   */
  export type ObservationFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Observation
     */
    select?: ObservationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ObservationInclude<ExtArgs> | null
    /**
     * Filter, which Observations to fetch.
     */
    where?: ObservationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Observations to fetch.
     */
    orderBy?: ObservationOrderByWithRelationInput | ObservationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Observations.
     */
    cursor?: ObservationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Observations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Observations.
     */
    skip?: number
    distinct?: ObservationScalarFieldEnum | ObservationScalarFieldEnum[]
  }

  /**
   * Observation create
   */
  export type ObservationCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Observation
     */
    select?: ObservationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ObservationInclude<ExtArgs> | null
    /**
     * The data needed to create a Observation.
     */
    data: XOR<ObservationCreateInput, ObservationUncheckedCreateInput>
  }

  /**
   * Observation createMany
   */
  export type ObservationCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Observations.
     */
    data: ObservationCreateManyInput | ObservationCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Observation createManyAndReturn
   */
  export type ObservationCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Observation
     */
    select?: ObservationSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Observations.
     */
    data: ObservationCreateManyInput | ObservationCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ObservationIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Observation update
   */
  export type ObservationUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Observation
     */
    select?: ObservationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ObservationInclude<ExtArgs> | null
    /**
     * The data needed to update a Observation.
     */
    data: XOR<ObservationUpdateInput, ObservationUncheckedUpdateInput>
    /**
     * Choose, which Observation to update.
     */
    where: ObservationWhereUniqueInput
  }

  /**
   * Observation updateMany
   */
  export type ObservationUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Observations.
     */
    data: XOR<ObservationUpdateManyMutationInput, ObservationUncheckedUpdateManyInput>
    /**
     * Filter which Observations to update
     */
    where?: ObservationWhereInput
  }

  /**
   * Observation upsert
   */
  export type ObservationUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Observation
     */
    select?: ObservationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ObservationInclude<ExtArgs> | null
    /**
     * The filter to search for the Observation to update in case it exists.
     */
    where: ObservationWhereUniqueInput
    /**
     * In case the Observation found by the `where` argument doesn't exist, create a new Observation with this data.
     */
    create: XOR<ObservationCreateInput, ObservationUncheckedCreateInput>
    /**
     * In case the Observation was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ObservationUpdateInput, ObservationUncheckedUpdateInput>
  }

  /**
   * Observation delete
   */
  export type ObservationDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Observation
     */
    select?: ObservationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ObservationInclude<ExtArgs> | null
    /**
     * Filter which Observation to delete.
     */
    where: ObservationWhereUniqueInput
  }

  /**
   * Observation deleteMany
   */
  export type ObservationDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Observations to delete
     */
    where?: ObservationWhereInput
  }

  /**
   * Observation.encounter
   */
  export type Observation$encounterArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Encounter
     */
    select?: EncounterSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EncounterInclude<ExtArgs> | null
    where?: EncounterWhereInput
  }

  /**
   * Observation without action
   */
  export type ObservationDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Observation
     */
    select?: ObservationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ObservationInclude<ExtArgs> | null
  }


  /**
   * Model Immunisation
   */

  export type AggregateImmunisation = {
    _count: ImmunisationCountAggregateOutputType | null
    _min: ImmunisationMinAggregateOutputType | null
    _max: ImmunisationMaxAggregateOutputType | null
  }

  export type ImmunisationMinAggregateOutputType = {
    id: string | null
    patientId: string | null
    vaccineCode: string | null
    vaccineName: string | null
    status: string | null
    occurrenceDate: Date | null
    lotNumber: string | null
    site: string | null
    route: string | null
    administeredBy: string | null
    primarySource: boolean | null
    notes: string | null
    createdAt: Date | null
  }

  export type ImmunisationMaxAggregateOutputType = {
    id: string | null
    patientId: string | null
    vaccineCode: string | null
    vaccineName: string | null
    status: string | null
    occurrenceDate: Date | null
    lotNumber: string | null
    site: string | null
    route: string | null
    administeredBy: string | null
    primarySource: boolean | null
    notes: string | null
    createdAt: Date | null
  }

  export type ImmunisationCountAggregateOutputType = {
    id: number
    patientId: number
    vaccineCode: number
    vaccineName: number
    status: number
    occurrenceDate: number
    lotNumber: number
    site: number
    route: number
    administeredBy: number
    primarySource: number
    notes: number
    createdAt: number
    _all: number
  }


  export type ImmunisationMinAggregateInputType = {
    id?: true
    patientId?: true
    vaccineCode?: true
    vaccineName?: true
    status?: true
    occurrenceDate?: true
    lotNumber?: true
    site?: true
    route?: true
    administeredBy?: true
    primarySource?: true
    notes?: true
    createdAt?: true
  }

  export type ImmunisationMaxAggregateInputType = {
    id?: true
    patientId?: true
    vaccineCode?: true
    vaccineName?: true
    status?: true
    occurrenceDate?: true
    lotNumber?: true
    site?: true
    route?: true
    administeredBy?: true
    primarySource?: true
    notes?: true
    createdAt?: true
  }

  export type ImmunisationCountAggregateInputType = {
    id?: true
    patientId?: true
    vaccineCode?: true
    vaccineName?: true
    status?: true
    occurrenceDate?: true
    lotNumber?: true
    site?: true
    route?: true
    administeredBy?: true
    primarySource?: true
    notes?: true
    createdAt?: true
    _all?: true
  }

  export type ImmunisationAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Immunisation to aggregate.
     */
    where?: ImmunisationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Immunisations to fetch.
     */
    orderBy?: ImmunisationOrderByWithRelationInput | ImmunisationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ImmunisationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Immunisations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Immunisations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Immunisations
    **/
    _count?: true | ImmunisationCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ImmunisationMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ImmunisationMaxAggregateInputType
  }

  export type GetImmunisationAggregateType<T extends ImmunisationAggregateArgs> = {
        [P in keyof T & keyof AggregateImmunisation]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateImmunisation[P]>
      : GetScalarType<T[P], AggregateImmunisation[P]>
  }




  export type ImmunisationGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ImmunisationWhereInput
    orderBy?: ImmunisationOrderByWithAggregationInput | ImmunisationOrderByWithAggregationInput[]
    by: ImmunisationScalarFieldEnum[] | ImmunisationScalarFieldEnum
    having?: ImmunisationScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ImmunisationCountAggregateInputType | true
    _min?: ImmunisationMinAggregateInputType
    _max?: ImmunisationMaxAggregateInputType
  }

  export type ImmunisationGroupByOutputType = {
    id: string
    patientId: string
    vaccineCode: string | null
    vaccineName: string
    status: string
    occurrenceDate: Date
    lotNumber: string | null
    site: string | null
    route: string | null
    administeredBy: string | null
    primarySource: boolean
    notes: string | null
    createdAt: Date
    _count: ImmunisationCountAggregateOutputType | null
    _min: ImmunisationMinAggregateOutputType | null
    _max: ImmunisationMaxAggregateOutputType | null
  }

  type GetImmunisationGroupByPayload<T extends ImmunisationGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ImmunisationGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ImmunisationGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ImmunisationGroupByOutputType[P]>
            : GetScalarType<T[P], ImmunisationGroupByOutputType[P]>
        }
      >
    >


  export type ImmunisationSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    patientId?: boolean
    vaccineCode?: boolean
    vaccineName?: boolean
    status?: boolean
    occurrenceDate?: boolean
    lotNumber?: boolean
    site?: boolean
    route?: boolean
    administeredBy?: boolean
    primarySource?: boolean
    notes?: boolean
    createdAt?: boolean
    patient?: boolean | PatientDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["immunisation"]>

  export type ImmunisationSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    patientId?: boolean
    vaccineCode?: boolean
    vaccineName?: boolean
    status?: boolean
    occurrenceDate?: boolean
    lotNumber?: boolean
    site?: boolean
    route?: boolean
    administeredBy?: boolean
    primarySource?: boolean
    notes?: boolean
    createdAt?: boolean
    patient?: boolean | PatientDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["immunisation"]>

  export type ImmunisationSelectScalar = {
    id?: boolean
    patientId?: boolean
    vaccineCode?: boolean
    vaccineName?: boolean
    status?: boolean
    occurrenceDate?: boolean
    lotNumber?: boolean
    site?: boolean
    route?: boolean
    administeredBy?: boolean
    primarySource?: boolean
    notes?: boolean
    createdAt?: boolean
  }

  export type ImmunisationInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    patient?: boolean | PatientDefaultArgs<ExtArgs>
  }
  export type ImmunisationIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    patient?: boolean | PatientDefaultArgs<ExtArgs>
  }

  export type $ImmunisationPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Immunisation"
    objects: {
      patient: Prisma.$PatientPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      patientId: string
      vaccineCode: string | null
      vaccineName: string
      status: string
      occurrenceDate: Date
      lotNumber: string | null
      site: string | null
      route: string | null
      administeredBy: string | null
      primarySource: boolean
      notes: string | null
      createdAt: Date
    }, ExtArgs["result"]["immunisation"]>
    composites: {}
  }

  type ImmunisationGetPayload<S extends boolean | null | undefined | ImmunisationDefaultArgs> = $Result.GetResult<Prisma.$ImmunisationPayload, S>

  type ImmunisationCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<ImmunisationFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: ImmunisationCountAggregateInputType | true
    }

  export interface ImmunisationDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Immunisation'], meta: { name: 'Immunisation' } }
    /**
     * Find zero or one Immunisation that matches the filter.
     * @param {ImmunisationFindUniqueArgs} args - Arguments to find a Immunisation
     * @example
     * // Get one Immunisation
     * const immunisation = await prisma.immunisation.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ImmunisationFindUniqueArgs>(args: SelectSubset<T, ImmunisationFindUniqueArgs<ExtArgs>>): Prisma__ImmunisationClient<$Result.GetResult<Prisma.$ImmunisationPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Immunisation that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {ImmunisationFindUniqueOrThrowArgs} args - Arguments to find a Immunisation
     * @example
     * // Get one Immunisation
     * const immunisation = await prisma.immunisation.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ImmunisationFindUniqueOrThrowArgs>(args: SelectSubset<T, ImmunisationFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ImmunisationClient<$Result.GetResult<Prisma.$ImmunisationPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Immunisation that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ImmunisationFindFirstArgs} args - Arguments to find a Immunisation
     * @example
     * // Get one Immunisation
     * const immunisation = await prisma.immunisation.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ImmunisationFindFirstArgs>(args?: SelectSubset<T, ImmunisationFindFirstArgs<ExtArgs>>): Prisma__ImmunisationClient<$Result.GetResult<Prisma.$ImmunisationPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Immunisation that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ImmunisationFindFirstOrThrowArgs} args - Arguments to find a Immunisation
     * @example
     * // Get one Immunisation
     * const immunisation = await prisma.immunisation.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ImmunisationFindFirstOrThrowArgs>(args?: SelectSubset<T, ImmunisationFindFirstOrThrowArgs<ExtArgs>>): Prisma__ImmunisationClient<$Result.GetResult<Prisma.$ImmunisationPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Immunisations that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ImmunisationFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Immunisations
     * const immunisations = await prisma.immunisation.findMany()
     * 
     * // Get first 10 Immunisations
     * const immunisations = await prisma.immunisation.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const immunisationWithIdOnly = await prisma.immunisation.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ImmunisationFindManyArgs>(args?: SelectSubset<T, ImmunisationFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ImmunisationPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Immunisation.
     * @param {ImmunisationCreateArgs} args - Arguments to create a Immunisation.
     * @example
     * // Create one Immunisation
     * const Immunisation = await prisma.immunisation.create({
     *   data: {
     *     // ... data to create a Immunisation
     *   }
     * })
     * 
     */
    create<T extends ImmunisationCreateArgs>(args: SelectSubset<T, ImmunisationCreateArgs<ExtArgs>>): Prisma__ImmunisationClient<$Result.GetResult<Prisma.$ImmunisationPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Immunisations.
     * @param {ImmunisationCreateManyArgs} args - Arguments to create many Immunisations.
     * @example
     * // Create many Immunisations
     * const immunisation = await prisma.immunisation.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ImmunisationCreateManyArgs>(args?: SelectSubset<T, ImmunisationCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Immunisations and returns the data saved in the database.
     * @param {ImmunisationCreateManyAndReturnArgs} args - Arguments to create many Immunisations.
     * @example
     * // Create many Immunisations
     * const immunisation = await prisma.immunisation.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Immunisations and only return the `id`
     * const immunisationWithIdOnly = await prisma.immunisation.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ImmunisationCreateManyAndReturnArgs>(args?: SelectSubset<T, ImmunisationCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ImmunisationPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Immunisation.
     * @param {ImmunisationDeleteArgs} args - Arguments to delete one Immunisation.
     * @example
     * // Delete one Immunisation
     * const Immunisation = await prisma.immunisation.delete({
     *   where: {
     *     // ... filter to delete one Immunisation
     *   }
     * })
     * 
     */
    delete<T extends ImmunisationDeleteArgs>(args: SelectSubset<T, ImmunisationDeleteArgs<ExtArgs>>): Prisma__ImmunisationClient<$Result.GetResult<Prisma.$ImmunisationPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Immunisation.
     * @param {ImmunisationUpdateArgs} args - Arguments to update one Immunisation.
     * @example
     * // Update one Immunisation
     * const immunisation = await prisma.immunisation.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ImmunisationUpdateArgs>(args: SelectSubset<T, ImmunisationUpdateArgs<ExtArgs>>): Prisma__ImmunisationClient<$Result.GetResult<Prisma.$ImmunisationPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Immunisations.
     * @param {ImmunisationDeleteManyArgs} args - Arguments to filter Immunisations to delete.
     * @example
     * // Delete a few Immunisations
     * const { count } = await prisma.immunisation.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ImmunisationDeleteManyArgs>(args?: SelectSubset<T, ImmunisationDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Immunisations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ImmunisationUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Immunisations
     * const immunisation = await prisma.immunisation.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ImmunisationUpdateManyArgs>(args: SelectSubset<T, ImmunisationUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Immunisation.
     * @param {ImmunisationUpsertArgs} args - Arguments to update or create a Immunisation.
     * @example
     * // Update or create a Immunisation
     * const immunisation = await prisma.immunisation.upsert({
     *   create: {
     *     // ... data to create a Immunisation
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Immunisation we want to update
     *   }
     * })
     */
    upsert<T extends ImmunisationUpsertArgs>(args: SelectSubset<T, ImmunisationUpsertArgs<ExtArgs>>): Prisma__ImmunisationClient<$Result.GetResult<Prisma.$ImmunisationPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Immunisations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ImmunisationCountArgs} args - Arguments to filter Immunisations to count.
     * @example
     * // Count the number of Immunisations
     * const count = await prisma.immunisation.count({
     *   where: {
     *     // ... the filter for the Immunisations we want to count
     *   }
     * })
    **/
    count<T extends ImmunisationCountArgs>(
      args?: Subset<T, ImmunisationCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ImmunisationCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Immunisation.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ImmunisationAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ImmunisationAggregateArgs>(args: Subset<T, ImmunisationAggregateArgs>): Prisma.PrismaPromise<GetImmunisationAggregateType<T>>

    /**
     * Group by Immunisation.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ImmunisationGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ImmunisationGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ImmunisationGroupByArgs['orderBy'] }
        : { orderBy?: ImmunisationGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ImmunisationGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetImmunisationGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Immunisation model
   */
  readonly fields: ImmunisationFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Immunisation.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ImmunisationClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    patient<T extends PatientDefaultArgs<ExtArgs> = {}>(args?: Subset<T, PatientDefaultArgs<ExtArgs>>): Prisma__PatientClient<$Result.GetResult<Prisma.$PatientPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Immunisation model
   */ 
  interface ImmunisationFieldRefs {
    readonly id: FieldRef<"Immunisation", 'String'>
    readonly patientId: FieldRef<"Immunisation", 'String'>
    readonly vaccineCode: FieldRef<"Immunisation", 'String'>
    readonly vaccineName: FieldRef<"Immunisation", 'String'>
    readonly status: FieldRef<"Immunisation", 'String'>
    readonly occurrenceDate: FieldRef<"Immunisation", 'DateTime'>
    readonly lotNumber: FieldRef<"Immunisation", 'String'>
    readonly site: FieldRef<"Immunisation", 'String'>
    readonly route: FieldRef<"Immunisation", 'String'>
    readonly administeredBy: FieldRef<"Immunisation", 'String'>
    readonly primarySource: FieldRef<"Immunisation", 'Boolean'>
    readonly notes: FieldRef<"Immunisation", 'String'>
    readonly createdAt: FieldRef<"Immunisation", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Immunisation findUnique
   */
  export type ImmunisationFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Immunisation
     */
    select?: ImmunisationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImmunisationInclude<ExtArgs> | null
    /**
     * Filter, which Immunisation to fetch.
     */
    where: ImmunisationWhereUniqueInput
  }

  /**
   * Immunisation findUniqueOrThrow
   */
  export type ImmunisationFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Immunisation
     */
    select?: ImmunisationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImmunisationInclude<ExtArgs> | null
    /**
     * Filter, which Immunisation to fetch.
     */
    where: ImmunisationWhereUniqueInput
  }

  /**
   * Immunisation findFirst
   */
  export type ImmunisationFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Immunisation
     */
    select?: ImmunisationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImmunisationInclude<ExtArgs> | null
    /**
     * Filter, which Immunisation to fetch.
     */
    where?: ImmunisationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Immunisations to fetch.
     */
    orderBy?: ImmunisationOrderByWithRelationInput | ImmunisationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Immunisations.
     */
    cursor?: ImmunisationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Immunisations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Immunisations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Immunisations.
     */
    distinct?: ImmunisationScalarFieldEnum | ImmunisationScalarFieldEnum[]
  }

  /**
   * Immunisation findFirstOrThrow
   */
  export type ImmunisationFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Immunisation
     */
    select?: ImmunisationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImmunisationInclude<ExtArgs> | null
    /**
     * Filter, which Immunisation to fetch.
     */
    where?: ImmunisationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Immunisations to fetch.
     */
    orderBy?: ImmunisationOrderByWithRelationInput | ImmunisationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Immunisations.
     */
    cursor?: ImmunisationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Immunisations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Immunisations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Immunisations.
     */
    distinct?: ImmunisationScalarFieldEnum | ImmunisationScalarFieldEnum[]
  }

  /**
   * Immunisation findMany
   */
  export type ImmunisationFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Immunisation
     */
    select?: ImmunisationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImmunisationInclude<ExtArgs> | null
    /**
     * Filter, which Immunisations to fetch.
     */
    where?: ImmunisationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Immunisations to fetch.
     */
    orderBy?: ImmunisationOrderByWithRelationInput | ImmunisationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Immunisations.
     */
    cursor?: ImmunisationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Immunisations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Immunisations.
     */
    skip?: number
    distinct?: ImmunisationScalarFieldEnum | ImmunisationScalarFieldEnum[]
  }

  /**
   * Immunisation create
   */
  export type ImmunisationCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Immunisation
     */
    select?: ImmunisationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImmunisationInclude<ExtArgs> | null
    /**
     * The data needed to create a Immunisation.
     */
    data: XOR<ImmunisationCreateInput, ImmunisationUncheckedCreateInput>
  }

  /**
   * Immunisation createMany
   */
  export type ImmunisationCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Immunisations.
     */
    data: ImmunisationCreateManyInput | ImmunisationCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Immunisation createManyAndReturn
   */
  export type ImmunisationCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Immunisation
     */
    select?: ImmunisationSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Immunisations.
     */
    data: ImmunisationCreateManyInput | ImmunisationCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImmunisationIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Immunisation update
   */
  export type ImmunisationUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Immunisation
     */
    select?: ImmunisationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImmunisationInclude<ExtArgs> | null
    /**
     * The data needed to update a Immunisation.
     */
    data: XOR<ImmunisationUpdateInput, ImmunisationUncheckedUpdateInput>
    /**
     * Choose, which Immunisation to update.
     */
    where: ImmunisationWhereUniqueInput
  }

  /**
   * Immunisation updateMany
   */
  export type ImmunisationUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Immunisations.
     */
    data: XOR<ImmunisationUpdateManyMutationInput, ImmunisationUncheckedUpdateManyInput>
    /**
     * Filter which Immunisations to update
     */
    where?: ImmunisationWhereInput
  }

  /**
   * Immunisation upsert
   */
  export type ImmunisationUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Immunisation
     */
    select?: ImmunisationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImmunisationInclude<ExtArgs> | null
    /**
     * The filter to search for the Immunisation to update in case it exists.
     */
    where: ImmunisationWhereUniqueInput
    /**
     * In case the Immunisation found by the `where` argument doesn't exist, create a new Immunisation with this data.
     */
    create: XOR<ImmunisationCreateInput, ImmunisationUncheckedCreateInput>
    /**
     * In case the Immunisation was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ImmunisationUpdateInput, ImmunisationUncheckedUpdateInput>
  }

  /**
   * Immunisation delete
   */
  export type ImmunisationDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Immunisation
     */
    select?: ImmunisationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImmunisationInclude<ExtArgs> | null
    /**
     * Filter which Immunisation to delete.
     */
    where: ImmunisationWhereUniqueInput
  }

  /**
   * Immunisation deleteMany
   */
  export type ImmunisationDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Immunisations to delete
     */
    where?: ImmunisationWhereInput
  }

  /**
   * Immunisation without action
   */
  export type ImmunisationDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Immunisation
     */
    select?: ImmunisationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImmunisationInclude<ExtArgs> | null
  }


  /**
   * Model Encounter
   */

  export type AggregateEncounter = {
    _count: EncounterCountAggregateOutputType | null
    _min: EncounterMinAggregateOutputType | null
    _max: EncounterMaxAggregateOutputType | null
  }

  export type EncounterMinAggregateOutputType = {
    id: string | null
    patientId: string | null
    status: string | null
    encounterClass: string | null
    type: string | null
    reasonCode: string | null
    reasonDisplay: string | null
    startTime: Date | null
    endTime: Date | null
    providerId: string | null
    locationId: string | null
    notes: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type EncounterMaxAggregateOutputType = {
    id: string | null
    patientId: string | null
    status: string | null
    encounterClass: string | null
    type: string | null
    reasonCode: string | null
    reasonDisplay: string | null
    startTime: Date | null
    endTime: Date | null
    providerId: string | null
    locationId: string | null
    notes: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type EncounterCountAggregateOutputType = {
    id: number
    patientId: number
    status: number
    encounterClass: number
    type: number
    reasonCode: number
    reasonDisplay: number
    startTime: number
    endTime: number
    providerId: number
    locationId: number
    notes: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type EncounterMinAggregateInputType = {
    id?: true
    patientId?: true
    status?: true
    encounterClass?: true
    type?: true
    reasonCode?: true
    reasonDisplay?: true
    startTime?: true
    endTime?: true
    providerId?: true
    locationId?: true
    notes?: true
    createdAt?: true
    updatedAt?: true
  }

  export type EncounterMaxAggregateInputType = {
    id?: true
    patientId?: true
    status?: true
    encounterClass?: true
    type?: true
    reasonCode?: true
    reasonDisplay?: true
    startTime?: true
    endTime?: true
    providerId?: true
    locationId?: true
    notes?: true
    createdAt?: true
    updatedAt?: true
  }

  export type EncounterCountAggregateInputType = {
    id?: true
    patientId?: true
    status?: true
    encounterClass?: true
    type?: true
    reasonCode?: true
    reasonDisplay?: true
    startTime?: true
    endTime?: true
    providerId?: true
    locationId?: true
    notes?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type EncounterAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Encounter to aggregate.
     */
    where?: EncounterWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Encounters to fetch.
     */
    orderBy?: EncounterOrderByWithRelationInput | EncounterOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: EncounterWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Encounters from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Encounters.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Encounters
    **/
    _count?: true | EncounterCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: EncounterMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: EncounterMaxAggregateInputType
  }

  export type GetEncounterAggregateType<T extends EncounterAggregateArgs> = {
        [P in keyof T & keyof AggregateEncounter]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateEncounter[P]>
      : GetScalarType<T[P], AggregateEncounter[P]>
  }




  export type EncounterGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: EncounterWhereInput
    orderBy?: EncounterOrderByWithAggregationInput | EncounterOrderByWithAggregationInput[]
    by: EncounterScalarFieldEnum[] | EncounterScalarFieldEnum
    having?: EncounterScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: EncounterCountAggregateInputType | true
    _min?: EncounterMinAggregateInputType
    _max?: EncounterMaxAggregateInputType
  }

  export type EncounterGroupByOutputType = {
    id: string
    patientId: string
    status: string
    encounterClass: string
    type: string | null
    reasonCode: string | null
    reasonDisplay: string | null
    startTime: Date | null
    endTime: Date | null
    providerId: string
    locationId: string | null
    notes: string | null
    createdAt: Date
    updatedAt: Date
    _count: EncounterCountAggregateOutputType | null
    _min: EncounterMinAggregateOutputType | null
    _max: EncounterMaxAggregateOutputType | null
  }

  type GetEncounterGroupByPayload<T extends EncounterGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<EncounterGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof EncounterGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], EncounterGroupByOutputType[P]>
            : GetScalarType<T[P], EncounterGroupByOutputType[P]>
        }
      >
    >


  export type EncounterSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    patientId?: boolean
    status?: boolean
    encounterClass?: boolean
    type?: boolean
    reasonCode?: boolean
    reasonDisplay?: boolean
    startTime?: boolean
    endTime?: boolean
    providerId?: boolean
    locationId?: boolean
    notes?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    patient?: boolean | PatientDefaultArgs<ExtArgs>
    conditions?: boolean | Encounter$conditionsArgs<ExtArgs>
    medications?: boolean | Encounter$medicationsArgs<ExtArgs>
    observations?: boolean | Encounter$observationsArgs<ExtArgs>
    documents?: boolean | Encounter$documentsArgs<ExtArgs>
    _count?: boolean | EncounterCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["encounter"]>

  export type EncounterSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    patientId?: boolean
    status?: boolean
    encounterClass?: boolean
    type?: boolean
    reasonCode?: boolean
    reasonDisplay?: boolean
    startTime?: boolean
    endTime?: boolean
    providerId?: boolean
    locationId?: boolean
    notes?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    patient?: boolean | PatientDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["encounter"]>

  export type EncounterSelectScalar = {
    id?: boolean
    patientId?: boolean
    status?: boolean
    encounterClass?: boolean
    type?: boolean
    reasonCode?: boolean
    reasonDisplay?: boolean
    startTime?: boolean
    endTime?: boolean
    providerId?: boolean
    locationId?: boolean
    notes?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type EncounterInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    patient?: boolean | PatientDefaultArgs<ExtArgs>
    conditions?: boolean | Encounter$conditionsArgs<ExtArgs>
    medications?: boolean | Encounter$medicationsArgs<ExtArgs>
    observations?: boolean | Encounter$observationsArgs<ExtArgs>
    documents?: boolean | Encounter$documentsArgs<ExtArgs>
    _count?: boolean | EncounterCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type EncounterIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    patient?: boolean | PatientDefaultArgs<ExtArgs>
  }

  export type $EncounterPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Encounter"
    objects: {
      patient: Prisma.$PatientPayload<ExtArgs>
      conditions: Prisma.$ConditionPayload<ExtArgs>[]
      medications: Prisma.$MedicationRequestPayload<ExtArgs>[]
      observations: Prisma.$ObservationPayload<ExtArgs>[]
      documents: Prisma.$ClinicalDocumentPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      patientId: string
      status: string
      encounterClass: string
      type: string | null
      reasonCode: string | null
      reasonDisplay: string | null
      startTime: Date | null
      endTime: Date | null
      providerId: string
      locationId: string | null
      notes: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["encounter"]>
    composites: {}
  }

  type EncounterGetPayload<S extends boolean | null | undefined | EncounterDefaultArgs> = $Result.GetResult<Prisma.$EncounterPayload, S>

  type EncounterCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<EncounterFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: EncounterCountAggregateInputType | true
    }

  export interface EncounterDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Encounter'], meta: { name: 'Encounter' } }
    /**
     * Find zero or one Encounter that matches the filter.
     * @param {EncounterFindUniqueArgs} args - Arguments to find a Encounter
     * @example
     * // Get one Encounter
     * const encounter = await prisma.encounter.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends EncounterFindUniqueArgs>(args: SelectSubset<T, EncounterFindUniqueArgs<ExtArgs>>): Prisma__EncounterClient<$Result.GetResult<Prisma.$EncounterPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Encounter that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {EncounterFindUniqueOrThrowArgs} args - Arguments to find a Encounter
     * @example
     * // Get one Encounter
     * const encounter = await prisma.encounter.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends EncounterFindUniqueOrThrowArgs>(args: SelectSubset<T, EncounterFindUniqueOrThrowArgs<ExtArgs>>): Prisma__EncounterClient<$Result.GetResult<Prisma.$EncounterPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Encounter that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EncounterFindFirstArgs} args - Arguments to find a Encounter
     * @example
     * // Get one Encounter
     * const encounter = await prisma.encounter.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends EncounterFindFirstArgs>(args?: SelectSubset<T, EncounterFindFirstArgs<ExtArgs>>): Prisma__EncounterClient<$Result.GetResult<Prisma.$EncounterPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Encounter that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EncounterFindFirstOrThrowArgs} args - Arguments to find a Encounter
     * @example
     * // Get one Encounter
     * const encounter = await prisma.encounter.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends EncounterFindFirstOrThrowArgs>(args?: SelectSubset<T, EncounterFindFirstOrThrowArgs<ExtArgs>>): Prisma__EncounterClient<$Result.GetResult<Prisma.$EncounterPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Encounters that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EncounterFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Encounters
     * const encounters = await prisma.encounter.findMany()
     * 
     * // Get first 10 Encounters
     * const encounters = await prisma.encounter.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const encounterWithIdOnly = await prisma.encounter.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends EncounterFindManyArgs>(args?: SelectSubset<T, EncounterFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EncounterPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Encounter.
     * @param {EncounterCreateArgs} args - Arguments to create a Encounter.
     * @example
     * // Create one Encounter
     * const Encounter = await prisma.encounter.create({
     *   data: {
     *     // ... data to create a Encounter
     *   }
     * })
     * 
     */
    create<T extends EncounterCreateArgs>(args: SelectSubset<T, EncounterCreateArgs<ExtArgs>>): Prisma__EncounterClient<$Result.GetResult<Prisma.$EncounterPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Encounters.
     * @param {EncounterCreateManyArgs} args - Arguments to create many Encounters.
     * @example
     * // Create many Encounters
     * const encounter = await prisma.encounter.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends EncounterCreateManyArgs>(args?: SelectSubset<T, EncounterCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Encounters and returns the data saved in the database.
     * @param {EncounterCreateManyAndReturnArgs} args - Arguments to create many Encounters.
     * @example
     * // Create many Encounters
     * const encounter = await prisma.encounter.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Encounters and only return the `id`
     * const encounterWithIdOnly = await prisma.encounter.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends EncounterCreateManyAndReturnArgs>(args?: SelectSubset<T, EncounterCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EncounterPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Encounter.
     * @param {EncounterDeleteArgs} args - Arguments to delete one Encounter.
     * @example
     * // Delete one Encounter
     * const Encounter = await prisma.encounter.delete({
     *   where: {
     *     // ... filter to delete one Encounter
     *   }
     * })
     * 
     */
    delete<T extends EncounterDeleteArgs>(args: SelectSubset<T, EncounterDeleteArgs<ExtArgs>>): Prisma__EncounterClient<$Result.GetResult<Prisma.$EncounterPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Encounter.
     * @param {EncounterUpdateArgs} args - Arguments to update one Encounter.
     * @example
     * // Update one Encounter
     * const encounter = await prisma.encounter.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends EncounterUpdateArgs>(args: SelectSubset<T, EncounterUpdateArgs<ExtArgs>>): Prisma__EncounterClient<$Result.GetResult<Prisma.$EncounterPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Encounters.
     * @param {EncounterDeleteManyArgs} args - Arguments to filter Encounters to delete.
     * @example
     * // Delete a few Encounters
     * const { count } = await prisma.encounter.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends EncounterDeleteManyArgs>(args?: SelectSubset<T, EncounterDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Encounters.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EncounterUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Encounters
     * const encounter = await prisma.encounter.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends EncounterUpdateManyArgs>(args: SelectSubset<T, EncounterUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Encounter.
     * @param {EncounterUpsertArgs} args - Arguments to update or create a Encounter.
     * @example
     * // Update or create a Encounter
     * const encounter = await prisma.encounter.upsert({
     *   create: {
     *     // ... data to create a Encounter
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Encounter we want to update
     *   }
     * })
     */
    upsert<T extends EncounterUpsertArgs>(args: SelectSubset<T, EncounterUpsertArgs<ExtArgs>>): Prisma__EncounterClient<$Result.GetResult<Prisma.$EncounterPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Encounters.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EncounterCountArgs} args - Arguments to filter Encounters to count.
     * @example
     * // Count the number of Encounters
     * const count = await prisma.encounter.count({
     *   where: {
     *     // ... the filter for the Encounters we want to count
     *   }
     * })
    **/
    count<T extends EncounterCountArgs>(
      args?: Subset<T, EncounterCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], EncounterCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Encounter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EncounterAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends EncounterAggregateArgs>(args: Subset<T, EncounterAggregateArgs>): Prisma.PrismaPromise<GetEncounterAggregateType<T>>

    /**
     * Group by Encounter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EncounterGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends EncounterGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: EncounterGroupByArgs['orderBy'] }
        : { orderBy?: EncounterGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, EncounterGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetEncounterGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Encounter model
   */
  readonly fields: EncounterFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Encounter.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__EncounterClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    patient<T extends PatientDefaultArgs<ExtArgs> = {}>(args?: Subset<T, PatientDefaultArgs<ExtArgs>>): Prisma__PatientClient<$Result.GetResult<Prisma.$PatientPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    conditions<T extends Encounter$conditionsArgs<ExtArgs> = {}>(args?: Subset<T, Encounter$conditionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ConditionPayload<ExtArgs>, T, "findMany"> | Null>
    medications<T extends Encounter$medicationsArgs<ExtArgs> = {}>(args?: Subset<T, Encounter$medicationsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MedicationRequestPayload<ExtArgs>, T, "findMany"> | Null>
    observations<T extends Encounter$observationsArgs<ExtArgs> = {}>(args?: Subset<T, Encounter$observationsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ObservationPayload<ExtArgs>, T, "findMany"> | Null>
    documents<T extends Encounter$documentsArgs<ExtArgs> = {}>(args?: Subset<T, Encounter$documentsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ClinicalDocumentPayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Encounter model
   */ 
  interface EncounterFieldRefs {
    readonly id: FieldRef<"Encounter", 'String'>
    readonly patientId: FieldRef<"Encounter", 'String'>
    readonly status: FieldRef<"Encounter", 'String'>
    readonly encounterClass: FieldRef<"Encounter", 'String'>
    readonly type: FieldRef<"Encounter", 'String'>
    readonly reasonCode: FieldRef<"Encounter", 'String'>
    readonly reasonDisplay: FieldRef<"Encounter", 'String'>
    readonly startTime: FieldRef<"Encounter", 'DateTime'>
    readonly endTime: FieldRef<"Encounter", 'DateTime'>
    readonly providerId: FieldRef<"Encounter", 'String'>
    readonly locationId: FieldRef<"Encounter", 'String'>
    readonly notes: FieldRef<"Encounter", 'String'>
    readonly createdAt: FieldRef<"Encounter", 'DateTime'>
    readonly updatedAt: FieldRef<"Encounter", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Encounter findUnique
   */
  export type EncounterFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Encounter
     */
    select?: EncounterSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EncounterInclude<ExtArgs> | null
    /**
     * Filter, which Encounter to fetch.
     */
    where: EncounterWhereUniqueInput
  }

  /**
   * Encounter findUniqueOrThrow
   */
  export type EncounterFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Encounter
     */
    select?: EncounterSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EncounterInclude<ExtArgs> | null
    /**
     * Filter, which Encounter to fetch.
     */
    where: EncounterWhereUniqueInput
  }

  /**
   * Encounter findFirst
   */
  export type EncounterFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Encounter
     */
    select?: EncounterSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EncounterInclude<ExtArgs> | null
    /**
     * Filter, which Encounter to fetch.
     */
    where?: EncounterWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Encounters to fetch.
     */
    orderBy?: EncounterOrderByWithRelationInput | EncounterOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Encounters.
     */
    cursor?: EncounterWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Encounters from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Encounters.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Encounters.
     */
    distinct?: EncounterScalarFieldEnum | EncounterScalarFieldEnum[]
  }

  /**
   * Encounter findFirstOrThrow
   */
  export type EncounterFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Encounter
     */
    select?: EncounterSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EncounterInclude<ExtArgs> | null
    /**
     * Filter, which Encounter to fetch.
     */
    where?: EncounterWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Encounters to fetch.
     */
    orderBy?: EncounterOrderByWithRelationInput | EncounterOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Encounters.
     */
    cursor?: EncounterWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Encounters from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Encounters.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Encounters.
     */
    distinct?: EncounterScalarFieldEnum | EncounterScalarFieldEnum[]
  }

  /**
   * Encounter findMany
   */
  export type EncounterFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Encounter
     */
    select?: EncounterSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EncounterInclude<ExtArgs> | null
    /**
     * Filter, which Encounters to fetch.
     */
    where?: EncounterWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Encounters to fetch.
     */
    orderBy?: EncounterOrderByWithRelationInput | EncounterOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Encounters.
     */
    cursor?: EncounterWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Encounters from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Encounters.
     */
    skip?: number
    distinct?: EncounterScalarFieldEnum | EncounterScalarFieldEnum[]
  }

  /**
   * Encounter create
   */
  export type EncounterCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Encounter
     */
    select?: EncounterSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EncounterInclude<ExtArgs> | null
    /**
     * The data needed to create a Encounter.
     */
    data: XOR<EncounterCreateInput, EncounterUncheckedCreateInput>
  }

  /**
   * Encounter createMany
   */
  export type EncounterCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Encounters.
     */
    data: EncounterCreateManyInput | EncounterCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Encounter createManyAndReturn
   */
  export type EncounterCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Encounter
     */
    select?: EncounterSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Encounters.
     */
    data: EncounterCreateManyInput | EncounterCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EncounterIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Encounter update
   */
  export type EncounterUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Encounter
     */
    select?: EncounterSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EncounterInclude<ExtArgs> | null
    /**
     * The data needed to update a Encounter.
     */
    data: XOR<EncounterUpdateInput, EncounterUncheckedUpdateInput>
    /**
     * Choose, which Encounter to update.
     */
    where: EncounterWhereUniqueInput
  }

  /**
   * Encounter updateMany
   */
  export type EncounterUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Encounters.
     */
    data: XOR<EncounterUpdateManyMutationInput, EncounterUncheckedUpdateManyInput>
    /**
     * Filter which Encounters to update
     */
    where?: EncounterWhereInput
  }

  /**
   * Encounter upsert
   */
  export type EncounterUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Encounter
     */
    select?: EncounterSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EncounterInclude<ExtArgs> | null
    /**
     * The filter to search for the Encounter to update in case it exists.
     */
    where: EncounterWhereUniqueInput
    /**
     * In case the Encounter found by the `where` argument doesn't exist, create a new Encounter with this data.
     */
    create: XOR<EncounterCreateInput, EncounterUncheckedCreateInput>
    /**
     * In case the Encounter was found with the provided `where` argument, update it with this data.
     */
    update: XOR<EncounterUpdateInput, EncounterUncheckedUpdateInput>
  }

  /**
   * Encounter delete
   */
  export type EncounterDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Encounter
     */
    select?: EncounterSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EncounterInclude<ExtArgs> | null
    /**
     * Filter which Encounter to delete.
     */
    where: EncounterWhereUniqueInput
  }

  /**
   * Encounter deleteMany
   */
  export type EncounterDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Encounters to delete
     */
    where?: EncounterWhereInput
  }

  /**
   * Encounter.conditions
   */
  export type Encounter$conditionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Condition
     */
    select?: ConditionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConditionInclude<ExtArgs> | null
    where?: ConditionWhereInput
    orderBy?: ConditionOrderByWithRelationInput | ConditionOrderByWithRelationInput[]
    cursor?: ConditionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ConditionScalarFieldEnum | ConditionScalarFieldEnum[]
  }

  /**
   * Encounter.medications
   */
  export type Encounter$medicationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MedicationRequest
     */
    select?: MedicationRequestSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MedicationRequestInclude<ExtArgs> | null
    where?: MedicationRequestWhereInput
    orderBy?: MedicationRequestOrderByWithRelationInput | MedicationRequestOrderByWithRelationInput[]
    cursor?: MedicationRequestWhereUniqueInput
    take?: number
    skip?: number
    distinct?: MedicationRequestScalarFieldEnum | MedicationRequestScalarFieldEnum[]
  }

  /**
   * Encounter.observations
   */
  export type Encounter$observationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Observation
     */
    select?: ObservationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ObservationInclude<ExtArgs> | null
    where?: ObservationWhereInput
    orderBy?: ObservationOrderByWithRelationInput | ObservationOrderByWithRelationInput[]
    cursor?: ObservationWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ObservationScalarFieldEnum | ObservationScalarFieldEnum[]
  }

  /**
   * Encounter.documents
   */
  export type Encounter$documentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClinicalDocument
     */
    select?: ClinicalDocumentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClinicalDocumentInclude<ExtArgs> | null
    where?: ClinicalDocumentWhereInput
    orderBy?: ClinicalDocumentOrderByWithRelationInput | ClinicalDocumentOrderByWithRelationInput[]
    cursor?: ClinicalDocumentWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ClinicalDocumentScalarFieldEnum | ClinicalDocumentScalarFieldEnum[]
  }

  /**
   * Encounter without action
   */
  export type EncounterDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Encounter
     */
    select?: EncounterSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EncounterInclude<ExtArgs> | null
  }


  /**
   * Model Appointment
   */

  export type AggregateAppointment = {
    _count: AppointmentCountAggregateOutputType | null
    _avg: AppointmentAvgAggregateOutputType | null
    _sum: AppointmentSumAggregateOutputType | null
    _min: AppointmentMinAggregateOutputType | null
    _max: AppointmentMaxAggregateOutputType | null
  }

  export type AppointmentAvgAggregateOutputType = {
    durationMinutes: number | null
  }

  export type AppointmentSumAggregateOutputType = {
    durationMinutes: number | null
  }

  export type AppointmentMinAggregateOutputType = {
    id: string | null
    patientId: string | null
    providerId: string | null
    status: string | null
    serviceType: string | null
    description: string | null
    startTime: Date | null
    endTime: Date | null
    durationMinutes: number | null
    locationId: string | null
    notes: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type AppointmentMaxAggregateOutputType = {
    id: string | null
    patientId: string | null
    providerId: string | null
    status: string | null
    serviceType: string | null
    description: string | null
    startTime: Date | null
    endTime: Date | null
    durationMinutes: number | null
    locationId: string | null
    notes: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type AppointmentCountAggregateOutputType = {
    id: number
    patientId: number
    providerId: number
    status: number
    serviceType: number
    description: number
    startTime: number
    endTime: number
    durationMinutes: number
    locationId: number
    notes: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type AppointmentAvgAggregateInputType = {
    durationMinutes?: true
  }

  export type AppointmentSumAggregateInputType = {
    durationMinutes?: true
  }

  export type AppointmentMinAggregateInputType = {
    id?: true
    patientId?: true
    providerId?: true
    status?: true
    serviceType?: true
    description?: true
    startTime?: true
    endTime?: true
    durationMinutes?: true
    locationId?: true
    notes?: true
    createdAt?: true
    updatedAt?: true
  }

  export type AppointmentMaxAggregateInputType = {
    id?: true
    patientId?: true
    providerId?: true
    status?: true
    serviceType?: true
    description?: true
    startTime?: true
    endTime?: true
    durationMinutes?: true
    locationId?: true
    notes?: true
    createdAt?: true
    updatedAt?: true
  }

  export type AppointmentCountAggregateInputType = {
    id?: true
    patientId?: true
    providerId?: true
    status?: true
    serviceType?: true
    description?: true
    startTime?: true
    endTime?: true
    durationMinutes?: true
    locationId?: true
    notes?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type AppointmentAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Appointment to aggregate.
     */
    where?: AppointmentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Appointments to fetch.
     */
    orderBy?: AppointmentOrderByWithRelationInput | AppointmentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AppointmentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Appointments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Appointments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Appointments
    **/
    _count?: true | AppointmentCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: AppointmentAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: AppointmentSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AppointmentMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AppointmentMaxAggregateInputType
  }

  export type GetAppointmentAggregateType<T extends AppointmentAggregateArgs> = {
        [P in keyof T & keyof AggregateAppointment]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAppointment[P]>
      : GetScalarType<T[P], AggregateAppointment[P]>
  }




  export type AppointmentGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AppointmentWhereInput
    orderBy?: AppointmentOrderByWithAggregationInput | AppointmentOrderByWithAggregationInput[]
    by: AppointmentScalarFieldEnum[] | AppointmentScalarFieldEnum
    having?: AppointmentScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AppointmentCountAggregateInputType | true
    _avg?: AppointmentAvgAggregateInputType
    _sum?: AppointmentSumAggregateInputType
    _min?: AppointmentMinAggregateInputType
    _max?: AppointmentMaxAggregateInputType
  }

  export type AppointmentGroupByOutputType = {
    id: string
    patientId: string
    providerId: string
    status: string
    serviceType: string | null
    description: string | null
    startTime: Date
    endTime: Date
    durationMinutes: number
    locationId: string | null
    notes: string | null
    createdAt: Date
    updatedAt: Date
    _count: AppointmentCountAggregateOutputType | null
    _avg: AppointmentAvgAggregateOutputType | null
    _sum: AppointmentSumAggregateOutputType | null
    _min: AppointmentMinAggregateOutputType | null
    _max: AppointmentMaxAggregateOutputType | null
  }

  type GetAppointmentGroupByPayload<T extends AppointmentGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AppointmentGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AppointmentGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AppointmentGroupByOutputType[P]>
            : GetScalarType<T[P], AppointmentGroupByOutputType[P]>
        }
      >
    >


  export type AppointmentSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    patientId?: boolean
    providerId?: boolean
    status?: boolean
    serviceType?: boolean
    description?: boolean
    startTime?: boolean
    endTime?: boolean
    durationMinutes?: boolean
    locationId?: boolean
    notes?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    patient?: boolean | PatientDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["appointment"]>

  export type AppointmentSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    patientId?: boolean
    providerId?: boolean
    status?: boolean
    serviceType?: boolean
    description?: boolean
    startTime?: boolean
    endTime?: boolean
    durationMinutes?: boolean
    locationId?: boolean
    notes?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    patient?: boolean | PatientDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["appointment"]>

  export type AppointmentSelectScalar = {
    id?: boolean
    patientId?: boolean
    providerId?: boolean
    status?: boolean
    serviceType?: boolean
    description?: boolean
    startTime?: boolean
    endTime?: boolean
    durationMinutes?: boolean
    locationId?: boolean
    notes?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type AppointmentInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    patient?: boolean | PatientDefaultArgs<ExtArgs>
  }
  export type AppointmentIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    patient?: boolean | PatientDefaultArgs<ExtArgs>
  }

  export type $AppointmentPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Appointment"
    objects: {
      patient: Prisma.$PatientPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      patientId: string
      providerId: string
      status: string
      serviceType: string | null
      description: string | null
      startTime: Date
      endTime: Date
      durationMinutes: number
      locationId: string | null
      notes: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["appointment"]>
    composites: {}
  }

  type AppointmentGetPayload<S extends boolean | null | undefined | AppointmentDefaultArgs> = $Result.GetResult<Prisma.$AppointmentPayload, S>

  type AppointmentCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<AppointmentFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: AppointmentCountAggregateInputType | true
    }

  export interface AppointmentDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Appointment'], meta: { name: 'Appointment' } }
    /**
     * Find zero or one Appointment that matches the filter.
     * @param {AppointmentFindUniqueArgs} args - Arguments to find a Appointment
     * @example
     * // Get one Appointment
     * const appointment = await prisma.appointment.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AppointmentFindUniqueArgs>(args: SelectSubset<T, AppointmentFindUniqueArgs<ExtArgs>>): Prisma__AppointmentClient<$Result.GetResult<Prisma.$AppointmentPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Appointment that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {AppointmentFindUniqueOrThrowArgs} args - Arguments to find a Appointment
     * @example
     * // Get one Appointment
     * const appointment = await prisma.appointment.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AppointmentFindUniqueOrThrowArgs>(args: SelectSubset<T, AppointmentFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AppointmentClient<$Result.GetResult<Prisma.$AppointmentPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Appointment that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AppointmentFindFirstArgs} args - Arguments to find a Appointment
     * @example
     * // Get one Appointment
     * const appointment = await prisma.appointment.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AppointmentFindFirstArgs>(args?: SelectSubset<T, AppointmentFindFirstArgs<ExtArgs>>): Prisma__AppointmentClient<$Result.GetResult<Prisma.$AppointmentPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Appointment that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AppointmentFindFirstOrThrowArgs} args - Arguments to find a Appointment
     * @example
     * // Get one Appointment
     * const appointment = await prisma.appointment.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AppointmentFindFirstOrThrowArgs>(args?: SelectSubset<T, AppointmentFindFirstOrThrowArgs<ExtArgs>>): Prisma__AppointmentClient<$Result.GetResult<Prisma.$AppointmentPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Appointments that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AppointmentFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Appointments
     * const appointments = await prisma.appointment.findMany()
     * 
     * // Get first 10 Appointments
     * const appointments = await prisma.appointment.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const appointmentWithIdOnly = await prisma.appointment.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AppointmentFindManyArgs>(args?: SelectSubset<T, AppointmentFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AppointmentPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Appointment.
     * @param {AppointmentCreateArgs} args - Arguments to create a Appointment.
     * @example
     * // Create one Appointment
     * const Appointment = await prisma.appointment.create({
     *   data: {
     *     // ... data to create a Appointment
     *   }
     * })
     * 
     */
    create<T extends AppointmentCreateArgs>(args: SelectSubset<T, AppointmentCreateArgs<ExtArgs>>): Prisma__AppointmentClient<$Result.GetResult<Prisma.$AppointmentPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Appointments.
     * @param {AppointmentCreateManyArgs} args - Arguments to create many Appointments.
     * @example
     * // Create many Appointments
     * const appointment = await prisma.appointment.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AppointmentCreateManyArgs>(args?: SelectSubset<T, AppointmentCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Appointments and returns the data saved in the database.
     * @param {AppointmentCreateManyAndReturnArgs} args - Arguments to create many Appointments.
     * @example
     * // Create many Appointments
     * const appointment = await prisma.appointment.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Appointments and only return the `id`
     * const appointmentWithIdOnly = await prisma.appointment.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AppointmentCreateManyAndReturnArgs>(args?: SelectSubset<T, AppointmentCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AppointmentPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Appointment.
     * @param {AppointmentDeleteArgs} args - Arguments to delete one Appointment.
     * @example
     * // Delete one Appointment
     * const Appointment = await prisma.appointment.delete({
     *   where: {
     *     // ... filter to delete one Appointment
     *   }
     * })
     * 
     */
    delete<T extends AppointmentDeleteArgs>(args: SelectSubset<T, AppointmentDeleteArgs<ExtArgs>>): Prisma__AppointmentClient<$Result.GetResult<Prisma.$AppointmentPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Appointment.
     * @param {AppointmentUpdateArgs} args - Arguments to update one Appointment.
     * @example
     * // Update one Appointment
     * const appointment = await prisma.appointment.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AppointmentUpdateArgs>(args: SelectSubset<T, AppointmentUpdateArgs<ExtArgs>>): Prisma__AppointmentClient<$Result.GetResult<Prisma.$AppointmentPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Appointments.
     * @param {AppointmentDeleteManyArgs} args - Arguments to filter Appointments to delete.
     * @example
     * // Delete a few Appointments
     * const { count } = await prisma.appointment.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AppointmentDeleteManyArgs>(args?: SelectSubset<T, AppointmentDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Appointments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AppointmentUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Appointments
     * const appointment = await prisma.appointment.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AppointmentUpdateManyArgs>(args: SelectSubset<T, AppointmentUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Appointment.
     * @param {AppointmentUpsertArgs} args - Arguments to update or create a Appointment.
     * @example
     * // Update or create a Appointment
     * const appointment = await prisma.appointment.upsert({
     *   create: {
     *     // ... data to create a Appointment
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Appointment we want to update
     *   }
     * })
     */
    upsert<T extends AppointmentUpsertArgs>(args: SelectSubset<T, AppointmentUpsertArgs<ExtArgs>>): Prisma__AppointmentClient<$Result.GetResult<Prisma.$AppointmentPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Appointments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AppointmentCountArgs} args - Arguments to filter Appointments to count.
     * @example
     * // Count the number of Appointments
     * const count = await prisma.appointment.count({
     *   where: {
     *     // ... the filter for the Appointments we want to count
     *   }
     * })
    **/
    count<T extends AppointmentCountArgs>(
      args?: Subset<T, AppointmentCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AppointmentCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Appointment.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AppointmentAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AppointmentAggregateArgs>(args: Subset<T, AppointmentAggregateArgs>): Prisma.PrismaPromise<GetAppointmentAggregateType<T>>

    /**
     * Group by Appointment.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AppointmentGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AppointmentGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AppointmentGroupByArgs['orderBy'] }
        : { orderBy?: AppointmentGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AppointmentGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAppointmentGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Appointment model
   */
  readonly fields: AppointmentFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Appointment.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AppointmentClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    patient<T extends PatientDefaultArgs<ExtArgs> = {}>(args?: Subset<T, PatientDefaultArgs<ExtArgs>>): Prisma__PatientClient<$Result.GetResult<Prisma.$PatientPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Appointment model
   */ 
  interface AppointmentFieldRefs {
    readonly id: FieldRef<"Appointment", 'String'>
    readonly patientId: FieldRef<"Appointment", 'String'>
    readonly providerId: FieldRef<"Appointment", 'String'>
    readonly status: FieldRef<"Appointment", 'String'>
    readonly serviceType: FieldRef<"Appointment", 'String'>
    readonly description: FieldRef<"Appointment", 'String'>
    readonly startTime: FieldRef<"Appointment", 'DateTime'>
    readonly endTime: FieldRef<"Appointment", 'DateTime'>
    readonly durationMinutes: FieldRef<"Appointment", 'Int'>
    readonly locationId: FieldRef<"Appointment", 'String'>
    readonly notes: FieldRef<"Appointment", 'String'>
    readonly createdAt: FieldRef<"Appointment", 'DateTime'>
    readonly updatedAt: FieldRef<"Appointment", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Appointment findUnique
   */
  export type AppointmentFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Appointment
     */
    select?: AppointmentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AppointmentInclude<ExtArgs> | null
    /**
     * Filter, which Appointment to fetch.
     */
    where: AppointmentWhereUniqueInput
  }

  /**
   * Appointment findUniqueOrThrow
   */
  export type AppointmentFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Appointment
     */
    select?: AppointmentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AppointmentInclude<ExtArgs> | null
    /**
     * Filter, which Appointment to fetch.
     */
    where: AppointmentWhereUniqueInput
  }

  /**
   * Appointment findFirst
   */
  export type AppointmentFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Appointment
     */
    select?: AppointmentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AppointmentInclude<ExtArgs> | null
    /**
     * Filter, which Appointment to fetch.
     */
    where?: AppointmentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Appointments to fetch.
     */
    orderBy?: AppointmentOrderByWithRelationInput | AppointmentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Appointments.
     */
    cursor?: AppointmentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Appointments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Appointments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Appointments.
     */
    distinct?: AppointmentScalarFieldEnum | AppointmentScalarFieldEnum[]
  }

  /**
   * Appointment findFirstOrThrow
   */
  export type AppointmentFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Appointment
     */
    select?: AppointmentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AppointmentInclude<ExtArgs> | null
    /**
     * Filter, which Appointment to fetch.
     */
    where?: AppointmentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Appointments to fetch.
     */
    orderBy?: AppointmentOrderByWithRelationInput | AppointmentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Appointments.
     */
    cursor?: AppointmentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Appointments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Appointments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Appointments.
     */
    distinct?: AppointmentScalarFieldEnum | AppointmentScalarFieldEnum[]
  }

  /**
   * Appointment findMany
   */
  export type AppointmentFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Appointment
     */
    select?: AppointmentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AppointmentInclude<ExtArgs> | null
    /**
     * Filter, which Appointments to fetch.
     */
    where?: AppointmentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Appointments to fetch.
     */
    orderBy?: AppointmentOrderByWithRelationInput | AppointmentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Appointments.
     */
    cursor?: AppointmentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Appointments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Appointments.
     */
    skip?: number
    distinct?: AppointmentScalarFieldEnum | AppointmentScalarFieldEnum[]
  }

  /**
   * Appointment create
   */
  export type AppointmentCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Appointment
     */
    select?: AppointmentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AppointmentInclude<ExtArgs> | null
    /**
     * The data needed to create a Appointment.
     */
    data: XOR<AppointmentCreateInput, AppointmentUncheckedCreateInput>
  }

  /**
   * Appointment createMany
   */
  export type AppointmentCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Appointments.
     */
    data: AppointmentCreateManyInput | AppointmentCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Appointment createManyAndReturn
   */
  export type AppointmentCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Appointment
     */
    select?: AppointmentSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Appointments.
     */
    data: AppointmentCreateManyInput | AppointmentCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AppointmentIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Appointment update
   */
  export type AppointmentUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Appointment
     */
    select?: AppointmentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AppointmentInclude<ExtArgs> | null
    /**
     * The data needed to update a Appointment.
     */
    data: XOR<AppointmentUpdateInput, AppointmentUncheckedUpdateInput>
    /**
     * Choose, which Appointment to update.
     */
    where: AppointmentWhereUniqueInput
  }

  /**
   * Appointment updateMany
   */
  export type AppointmentUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Appointments.
     */
    data: XOR<AppointmentUpdateManyMutationInput, AppointmentUncheckedUpdateManyInput>
    /**
     * Filter which Appointments to update
     */
    where?: AppointmentWhereInput
  }

  /**
   * Appointment upsert
   */
  export type AppointmentUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Appointment
     */
    select?: AppointmentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AppointmentInclude<ExtArgs> | null
    /**
     * The filter to search for the Appointment to update in case it exists.
     */
    where: AppointmentWhereUniqueInput
    /**
     * In case the Appointment found by the `where` argument doesn't exist, create a new Appointment with this data.
     */
    create: XOR<AppointmentCreateInput, AppointmentUncheckedCreateInput>
    /**
     * In case the Appointment was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AppointmentUpdateInput, AppointmentUncheckedUpdateInput>
  }

  /**
   * Appointment delete
   */
  export type AppointmentDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Appointment
     */
    select?: AppointmentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AppointmentInclude<ExtArgs> | null
    /**
     * Filter which Appointment to delete.
     */
    where: AppointmentWhereUniqueInput
  }

  /**
   * Appointment deleteMany
   */
  export type AppointmentDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Appointments to delete
     */
    where?: AppointmentWhereInput
  }

  /**
   * Appointment without action
   */
  export type AppointmentDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Appointment
     */
    select?: AppointmentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AppointmentInclude<ExtArgs> | null
  }


  /**
   * Model ClinicalDocument
   */

  export type AggregateClinicalDocument = {
    _count: ClinicalDocumentCountAggregateOutputType | null
    _min: ClinicalDocumentMinAggregateOutputType | null
    _max: ClinicalDocumentMaxAggregateOutputType | null
  }

  export type ClinicalDocumentMinAggregateOutputType = {
    id: string | null
    patientId: string | null
    encounterId: string | null
    type: string | null
    title: string | null
    content: string | null
    status: string | null
    authorId: string | null
    authorName: string | null
    signedAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ClinicalDocumentMaxAggregateOutputType = {
    id: string | null
    patientId: string | null
    encounterId: string | null
    type: string | null
    title: string | null
    content: string | null
    status: string | null
    authorId: string | null
    authorName: string | null
    signedAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ClinicalDocumentCountAggregateOutputType = {
    id: number
    patientId: number
    encounterId: number
    type: number
    title: number
    content: number
    status: number
    authorId: number
    authorName: number
    signedAt: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type ClinicalDocumentMinAggregateInputType = {
    id?: true
    patientId?: true
    encounterId?: true
    type?: true
    title?: true
    content?: true
    status?: true
    authorId?: true
    authorName?: true
    signedAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ClinicalDocumentMaxAggregateInputType = {
    id?: true
    patientId?: true
    encounterId?: true
    type?: true
    title?: true
    content?: true
    status?: true
    authorId?: true
    authorName?: true
    signedAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ClinicalDocumentCountAggregateInputType = {
    id?: true
    patientId?: true
    encounterId?: true
    type?: true
    title?: true
    content?: true
    status?: true
    authorId?: true
    authorName?: true
    signedAt?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type ClinicalDocumentAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ClinicalDocument to aggregate.
     */
    where?: ClinicalDocumentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ClinicalDocuments to fetch.
     */
    orderBy?: ClinicalDocumentOrderByWithRelationInput | ClinicalDocumentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ClinicalDocumentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ClinicalDocuments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ClinicalDocuments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ClinicalDocuments
    **/
    _count?: true | ClinicalDocumentCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ClinicalDocumentMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ClinicalDocumentMaxAggregateInputType
  }

  export type GetClinicalDocumentAggregateType<T extends ClinicalDocumentAggregateArgs> = {
        [P in keyof T & keyof AggregateClinicalDocument]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateClinicalDocument[P]>
      : GetScalarType<T[P], AggregateClinicalDocument[P]>
  }




  export type ClinicalDocumentGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ClinicalDocumentWhereInput
    orderBy?: ClinicalDocumentOrderByWithAggregationInput | ClinicalDocumentOrderByWithAggregationInput[]
    by: ClinicalDocumentScalarFieldEnum[] | ClinicalDocumentScalarFieldEnum
    having?: ClinicalDocumentScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ClinicalDocumentCountAggregateInputType | true
    _min?: ClinicalDocumentMinAggregateInputType
    _max?: ClinicalDocumentMaxAggregateInputType
  }

  export type ClinicalDocumentGroupByOutputType = {
    id: string
    patientId: string
    encounterId: string | null
    type: string
    title: string
    content: string
    status: string
    authorId: string
    authorName: string
    signedAt: Date | null
    createdAt: Date
    updatedAt: Date
    _count: ClinicalDocumentCountAggregateOutputType | null
    _min: ClinicalDocumentMinAggregateOutputType | null
    _max: ClinicalDocumentMaxAggregateOutputType | null
  }

  type GetClinicalDocumentGroupByPayload<T extends ClinicalDocumentGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ClinicalDocumentGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ClinicalDocumentGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ClinicalDocumentGroupByOutputType[P]>
            : GetScalarType<T[P], ClinicalDocumentGroupByOutputType[P]>
        }
      >
    >


  export type ClinicalDocumentSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    patientId?: boolean
    encounterId?: boolean
    type?: boolean
    title?: boolean
    content?: boolean
    status?: boolean
    authorId?: boolean
    authorName?: boolean
    signedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    patient?: boolean | PatientDefaultArgs<ExtArgs>
    encounter?: boolean | ClinicalDocument$encounterArgs<ExtArgs>
  }, ExtArgs["result"]["clinicalDocument"]>

  export type ClinicalDocumentSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    patientId?: boolean
    encounterId?: boolean
    type?: boolean
    title?: boolean
    content?: boolean
    status?: boolean
    authorId?: boolean
    authorName?: boolean
    signedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    patient?: boolean | PatientDefaultArgs<ExtArgs>
    encounter?: boolean | ClinicalDocument$encounterArgs<ExtArgs>
  }, ExtArgs["result"]["clinicalDocument"]>

  export type ClinicalDocumentSelectScalar = {
    id?: boolean
    patientId?: boolean
    encounterId?: boolean
    type?: boolean
    title?: boolean
    content?: boolean
    status?: boolean
    authorId?: boolean
    authorName?: boolean
    signedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type ClinicalDocumentInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    patient?: boolean | PatientDefaultArgs<ExtArgs>
    encounter?: boolean | ClinicalDocument$encounterArgs<ExtArgs>
  }
  export type ClinicalDocumentIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    patient?: boolean | PatientDefaultArgs<ExtArgs>
    encounter?: boolean | ClinicalDocument$encounterArgs<ExtArgs>
  }

  export type $ClinicalDocumentPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ClinicalDocument"
    objects: {
      patient: Prisma.$PatientPayload<ExtArgs>
      encounter: Prisma.$EncounterPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      patientId: string
      encounterId: string | null
      type: string
      title: string
      content: string
      status: string
      authorId: string
      authorName: string
      signedAt: Date | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["clinicalDocument"]>
    composites: {}
  }

  type ClinicalDocumentGetPayload<S extends boolean | null | undefined | ClinicalDocumentDefaultArgs> = $Result.GetResult<Prisma.$ClinicalDocumentPayload, S>

  type ClinicalDocumentCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<ClinicalDocumentFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: ClinicalDocumentCountAggregateInputType | true
    }

  export interface ClinicalDocumentDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ClinicalDocument'], meta: { name: 'ClinicalDocument' } }
    /**
     * Find zero or one ClinicalDocument that matches the filter.
     * @param {ClinicalDocumentFindUniqueArgs} args - Arguments to find a ClinicalDocument
     * @example
     * // Get one ClinicalDocument
     * const clinicalDocument = await prisma.clinicalDocument.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ClinicalDocumentFindUniqueArgs>(args: SelectSubset<T, ClinicalDocumentFindUniqueArgs<ExtArgs>>): Prisma__ClinicalDocumentClient<$Result.GetResult<Prisma.$ClinicalDocumentPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one ClinicalDocument that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {ClinicalDocumentFindUniqueOrThrowArgs} args - Arguments to find a ClinicalDocument
     * @example
     * // Get one ClinicalDocument
     * const clinicalDocument = await prisma.clinicalDocument.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ClinicalDocumentFindUniqueOrThrowArgs>(args: SelectSubset<T, ClinicalDocumentFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ClinicalDocumentClient<$Result.GetResult<Prisma.$ClinicalDocumentPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first ClinicalDocument that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClinicalDocumentFindFirstArgs} args - Arguments to find a ClinicalDocument
     * @example
     * // Get one ClinicalDocument
     * const clinicalDocument = await prisma.clinicalDocument.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ClinicalDocumentFindFirstArgs>(args?: SelectSubset<T, ClinicalDocumentFindFirstArgs<ExtArgs>>): Prisma__ClinicalDocumentClient<$Result.GetResult<Prisma.$ClinicalDocumentPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first ClinicalDocument that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClinicalDocumentFindFirstOrThrowArgs} args - Arguments to find a ClinicalDocument
     * @example
     * // Get one ClinicalDocument
     * const clinicalDocument = await prisma.clinicalDocument.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ClinicalDocumentFindFirstOrThrowArgs>(args?: SelectSubset<T, ClinicalDocumentFindFirstOrThrowArgs<ExtArgs>>): Prisma__ClinicalDocumentClient<$Result.GetResult<Prisma.$ClinicalDocumentPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more ClinicalDocuments that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClinicalDocumentFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ClinicalDocuments
     * const clinicalDocuments = await prisma.clinicalDocument.findMany()
     * 
     * // Get first 10 ClinicalDocuments
     * const clinicalDocuments = await prisma.clinicalDocument.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const clinicalDocumentWithIdOnly = await prisma.clinicalDocument.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ClinicalDocumentFindManyArgs>(args?: SelectSubset<T, ClinicalDocumentFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ClinicalDocumentPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a ClinicalDocument.
     * @param {ClinicalDocumentCreateArgs} args - Arguments to create a ClinicalDocument.
     * @example
     * // Create one ClinicalDocument
     * const ClinicalDocument = await prisma.clinicalDocument.create({
     *   data: {
     *     // ... data to create a ClinicalDocument
     *   }
     * })
     * 
     */
    create<T extends ClinicalDocumentCreateArgs>(args: SelectSubset<T, ClinicalDocumentCreateArgs<ExtArgs>>): Prisma__ClinicalDocumentClient<$Result.GetResult<Prisma.$ClinicalDocumentPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many ClinicalDocuments.
     * @param {ClinicalDocumentCreateManyArgs} args - Arguments to create many ClinicalDocuments.
     * @example
     * // Create many ClinicalDocuments
     * const clinicalDocument = await prisma.clinicalDocument.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ClinicalDocumentCreateManyArgs>(args?: SelectSubset<T, ClinicalDocumentCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ClinicalDocuments and returns the data saved in the database.
     * @param {ClinicalDocumentCreateManyAndReturnArgs} args - Arguments to create many ClinicalDocuments.
     * @example
     * // Create many ClinicalDocuments
     * const clinicalDocument = await prisma.clinicalDocument.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ClinicalDocuments and only return the `id`
     * const clinicalDocumentWithIdOnly = await prisma.clinicalDocument.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ClinicalDocumentCreateManyAndReturnArgs>(args?: SelectSubset<T, ClinicalDocumentCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ClinicalDocumentPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a ClinicalDocument.
     * @param {ClinicalDocumentDeleteArgs} args - Arguments to delete one ClinicalDocument.
     * @example
     * // Delete one ClinicalDocument
     * const ClinicalDocument = await prisma.clinicalDocument.delete({
     *   where: {
     *     // ... filter to delete one ClinicalDocument
     *   }
     * })
     * 
     */
    delete<T extends ClinicalDocumentDeleteArgs>(args: SelectSubset<T, ClinicalDocumentDeleteArgs<ExtArgs>>): Prisma__ClinicalDocumentClient<$Result.GetResult<Prisma.$ClinicalDocumentPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one ClinicalDocument.
     * @param {ClinicalDocumentUpdateArgs} args - Arguments to update one ClinicalDocument.
     * @example
     * // Update one ClinicalDocument
     * const clinicalDocument = await prisma.clinicalDocument.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ClinicalDocumentUpdateArgs>(args: SelectSubset<T, ClinicalDocumentUpdateArgs<ExtArgs>>): Prisma__ClinicalDocumentClient<$Result.GetResult<Prisma.$ClinicalDocumentPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more ClinicalDocuments.
     * @param {ClinicalDocumentDeleteManyArgs} args - Arguments to filter ClinicalDocuments to delete.
     * @example
     * // Delete a few ClinicalDocuments
     * const { count } = await prisma.clinicalDocument.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ClinicalDocumentDeleteManyArgs>(args?: SelectSubset<T, ClinicalDocumentDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ClinicalDocuments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClinicalDocumentUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ClinicalDocuments
     * const clinicalDocument = await prisma.clinicalDocument.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ClinicalDocumentUpdateManyArgs>(args: SelectSubset<T, ClinicalDocumentUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one ClinicalDocument.
     * @param {ClinicalDocumentUpsertArgs} args - Arguments to update or create a ClinicalDocument.
     * @example
     * // Update or create a ClinicalDocument
     * const clinicalDocument = await prisma.clinicalDocument.upsert({
     *   create: {
     *     // ... data to create a ClinicalDocument
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ClinicalDocument we want to update
     *   }
     * })
     */
    upsert<T extends ClinicalDocumentUpsertArgs>(args: SelectSubset<T, ClinicalDocumentUpsertArgs<ExtArgs>>): Prisma__ClinicalDocumentClient<$Result.GetResult<Prisma.$ClinicalDocumentPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of ClinicalDocuments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClinicalDocumentCountArgs} args - Arguments to filter ClinicalDocuments to count.
     * @example
     * // Count the number of ClinicalDocuments
     * const count = await prisma.clinicalDocument.count({
     *   where: {
     *     // ... the filter for the ClinicalDocuments we want to count
     *   }
     * })
    **/
    count<T extends ClinicalDocumentCountArgs>(
      args?: Subset<T, ClinicalDocumentCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ClinicalDocumentCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ClinicalDocument.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClinicalDocumentAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ClinicalDocumentAggregateArgs>(args: Subset<T, ClinicalDocumentAggregateArgs>): Prisma.PrismaPromise<GetClinicalDocumentAggregateType<T>>

    /**
     * Group by ClinicalDocument.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClinicalDocumentGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ClinicalDocumentGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ClinicalDocumentGroupByArgs['orderBy'] }
        : { orderBy?: ClinicalDocumentGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ClinicalDocumentGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetClinicalDocumentGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ClinicalDocument model
   */
  readonly fields: ClinicalDocumentFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ClinicalDocument.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ClinicalDocumentClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    patient<T extends PatientDefaultArgs<ExtArgs> = {}>(args?: Subset<T, PatientDefaultArgs<ExtArgs>>): Prisma__PatientClient<$Result.GetResult<Prisma.$PatientPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    encounter<T extends ClinicalDocument$encounterArgs<ExtArgs> = {}>(args?: Subset<T, ClinicalDocument$encounterArgs<ExtArgs>>): Prisma__EncounterClient<$Result.GetResult<Prisma.$EncounterPayload<ExtArgs>, T, "findUniqueOrThrow"> | null, null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the ClinicalDocument model
   */ 
  interface ClinicalDocumentFieldRefs {
    readonly id: FieldRef<"ClinicalDocument", 'String'>
    readonly patientId: FieldRef<"ClinicalDocument", 'String'>
    readonly encounterId: FieldRef<"ClinicalDocument", 'String'>
    readonly type: FieldRef<"ClinicalDocument", 'String'>
    readonly title: FieldRef<"ClinicalDocument", 'String'>
    readonly content: FieldRef<"ClinicalDocument", 'String'>
    readonly status: FieldRef<"ClinicalDocument", 'String'>
    readonly authorId: FieldRef<"ClinicalDocument", 'String'>
    readonly authorName: FieldRef<"ClinicalDocument", 'String'>
    readonly signedAt: FieldRef<"ClinicalDocument", 'DateTime'>
    readonly createdAt: FieldRef<"ClinicalDocument", 'DateTime'>
    readonly updatedAt: FieldRef<"ClinicalDocument", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ClinicalDocument findUnique
   */
  export type ClinicalDocumentFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClinicalDocument
     */
    select?: ClinicalDocumentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClinicalDocumentInclude<ExtArgs> | null
    /**
     * Filter, which ClinicalDocument to fetch.
     */
    where: ClinicalDocumentWhereUniqueInput
  }

  /**
   * ClinicalDocument findUniqueOrThrow
   */
  export type ClinicalDocumentFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClinicalDocument
     */
    select?: ClinicalDocumentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClinicalDocumentInclude<ExtArgs> | null
    /**
     * Filter, which ClinicalDocument to fetch.
     */
    where: ClinicalDocumentWhereUniqueInput
  }

  /**
   * ClinicalDocument findFirst
   */
  export type ClinicalDocumentFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClinicalDocument
     */
    select?: ClinicalDocumentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClinicalDocumentInclude<ExtArgs> | null
    /**
     * Filter, which ClinicalDocument to fetch.
     */
    where?: ClinicalDocumentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ClinicalDocuments to fetch.
     */
    orderBy?: ClinicalDocumentOrderByWithRelationInput | ClinicalDocumentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ClinicalDocuments.
     */
    cursor?: ClinicalDocumentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ClinicalDocuments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ClinicalDocuments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ClinicalDocuments.
     */
    distinct?: ClinicalDocumentScalarFieldEnum | ClinicalDocumentScalarFieldEnum[]
  }

  /**
   * ClinicalDocument findFirstOrThrow
   */
  export type ClinicalDocumentFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClinicalDocument
     */
    select?: ClinicalDocumentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClinicalDocumentInclude<ExtArgs> | null
    /**
     * Filter, which ClinicalDocument to fetch.
     */
    where?: ClinicalDocumentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ClinicalDocuments to fetch.
     */
    orderBy?: ClinicalDocumentOrderByWithRelationInput | ClinicalDocumentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ClinicalDocuments.
     */
    cursor?: ClinicalDocumentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ClinicalDocuments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ClinicalDocuments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ClinicalDocuments.
     */
    distinct?: ClinicalDocumentScalarFieldEnum | ClinicalDocumentScalarFieldEnum[]
  }

  /**
   * ClinicalDocument findMany
   */
  export type ClinicalDocumentFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClinicalDocument
     */
    select?: ClinicalDocumentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClinicalDocumentInclude<ExtArgs> | null
    /**
     * Filter, which ClinicalDocuments to fetch.
     */
    where?: ClinicalDocumentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ClinicalDocuments to fetch.
     */
    orderBy?: ClinicalDocumentOrderByWithRelationInput | ClinicalDocumentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ClinicalDocuments.
     */
    cursor?: ClinicalDocumentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ClinicalDocuments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ClinicalDocuments.
     */
    skip?: number
    distinct?: ClinicalDocumentScalarFieldEnum | ClinicalDocumentScalarFieldEnum[]
  }

  /**
   * ClinicalDocument create
   */
  export type ClinicalDocumentCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClinicalDocument
     */
    select?: ClinicalDocumentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClinicalDocumentInclude<ExtArgs> | null
    /**
     * The data needed to create a ClinicalDocument.
     */
    data: XOR<ClinicalDocumentCreateInput, ClinicalDocumentUncheckedCreateInput>
  }

  /**
   * ClinicalDocument createMany
   */
  export type ClinicalDocumentCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ClinicalDocuments.
     */
    data: ClinicalDocumentCreateManyInput | ClinicalDocumentCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ClinicalDocument createManyAndReturn
   */
  export type ClinicalDocumentCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClinicalDocument
     */
    select?: ClinicalDocumentSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many ClinicalDocuments.
     */
    data: ClinicalDocumentCreateManyInput | ClinicalDocumentCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClinicalDocumentIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * ClinicalDocument update
   */
  export type ClinicalDocumentUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClinicalDocument
     */
    select?: ClinicalDocumentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClinicalDocumentInclude<ExtArgs> | null
    /**
     * The data needed to update a ClinicalDocument.
     */
    data: XOR<ClinicalDocumentUpdateInput, ClinicalDocumentUncheckedUpdateInput>
    /**
     * Choose, which ClinicalDocument to update.
     */
    where: ClinicalDocumentWhereUniqueInput
  }

  /**
   * ClinicalDocument updateMany
   */
  export type ClinicalDocumentUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ClinicalDocuments.
     */
    data: XOR<ClinicalDocumentUpdateManyMutationInput, ClinicalDocumentUncheckedUpdateManyInput>
    /**
     * Filter which ClinicalDocuments to update
     */
    where?: ClinicalDocumentWhereInput
  }

  /**
   * ClinicalDocument upsert
   */
  export type ClinicalDocumentUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClinicalDocument
     */
    select?: ClinicalDocumentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClinicalDocumentInclude<ExtArgs> | null
    /**
     * The filter to search for the ClinicalDocument to update in case it exists.
     */
    where: ClinicalDocumentWhereUniqueInput
    /**
     * In case the ClinicalDocument found by the `where` argument doesn't exist, create a new ClinicalDocument with this data.
     */
    create: XOR<ClinicalDocumentCreateInput, ClinicalDocumentUncheckedCreateInput>
    /**
     * In case the ClinicalDocument was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ClinicalDocumentUpdateInput, ClinicalDocumentUncheckedUpdateInput>
  }

  /**
   * ClinicalDocument delete
   */
  export type ClinicalDocumentDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClinicalDocument
     */
    select?: ClinicalDocumentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClinicalDocumentInclude<ExtArgs> | null
    /**
     * Filter which ClinicalDocument to delete.
     */
    where: ClinicalDocumentWhereUniqueInput
  }

  /**
   * ClinicalDocument deleteMany
   */
  export type ClinicalDocumentDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ClinicalDocuments to delete
     */
    where?: ClinicalDocumentWhereInput
  }

  /**
   * ClinicalDocument.encounter
   */
  export type ClinicalDocument$encounterArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Encounter
     */
    select?: EncounterSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EncounterInclude<ExtArgs> | null
    where?: EncounterWhereInput
  }

  /**
   * ClinicalDocument without action
   */
  export type ClinicalDocumentDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClinicalDocument
     */
    select?: ClinicalDocumentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClinicalDocumentInclude<ExtArgs> | null
  }


  /**
   * Model AuditLog
   */

  export type AggregateAuditLog = {
    _count: AuditLogCountAggregateOutputType | null
    _min: AuditLogMinAggregateOutputType | null
    _max: AuditLogMaxAggregateOutputType | null
  }

  export type AuditLogMinAggregateOutputType = {
    id: string | null
    patientId: string | null
    userId: string | null
    action: string | null
    resourceType: string | null
    resourceId: string | null
    ipAddress: string | null
    correlationId: string | null
    createdAt: Date | null
  }

  export type AuditLogMaxAggregateOutputType = {
    id: string | null
    patientId: string | null
    userId: string | null
    action: string | null
    resourceType: string | null
    resourceId: string | null
    ipAddress: string | null
    correlationId: string | null
    createdAt: Date | null
  }

  export type AuditLogCountAggregateOutputType = {
    id: number
    patientId: number
    userId: number
    action: number
    resourceType: number
    resourceId: number
    changes: number
    ipAddress: number
    correlationId: number
    createdAt: number
    _all: number
  }


  export type AuditLogMinAggregateInputType = {
    id?: true
    patientId?: true
    userId?: true
    action?: true
    resourceType?: true
    resourceId?: true
    ipAddress?: true
    correlationId?: true
    createdAt?: true
  }

  export type AuditLogMaxAggregateInputType = {
    id?: true
    patientId?: true
    userId?: true
    action?: true
    resourceType?: true
    resourceId?: true
    ipAddress?: true
    correlationId?: true
    createdAt?: true
  }

  export type AuditLogCountAggregateInputType = {
    id?: true
    patientId?: true
    userId?: true
    action?: true
    resourceType?: true
    resourceId?: true
    changes?: true
    ipAddress?: true
    correlationId?: true
    createdAt?: true
    _all?: true
  }

  export type AuditLogAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AuditLog to aggregate.
     */
    where?: AuditLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AuditLogs to fetch.
     */
    orderBy?: AuditLogOrderByWithRelationInput | AuditLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AuditLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AuditLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AuditLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned AuditLogs
    **/
    _count?: true | AuditLogCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AuditLogMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AuditLogMaxAggregateInputType
  }

  export type GetAuditLogAggregateType<T extends AuditLogAggregateArgs> = {
        [P in keyof T & keyof AggregateAuditLog]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAuditLog[P]>
      : GetScalarType<T[P], AggregateAuditLog[P]>
  }




  export type AuditLogGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AuditLogWhereInput
    orderBy?: AuditLogOrderByWithAggregationInput | AuditLogOrderByWithAggregationInput[]
    by: AuditLogScalarFieldEnum[] | AuditLogScalarFieldEnum
    having?: AuditLogScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AuditLogCountAggregateInputType | true
    _min?: AuditLogMinAggregateInputType
    _max?: AuditLogMaxAggregateInputType
  }

  export type AuditLogGroupByOutputType = {
    id: string
    patientId: string | null
    userId: string
    action: string
    resourceType: string
    resourceId: string | null
    changes: JsonValue | null
    ipAddress: string | null
    correlationId: string | null
    createdAt: Date
    _count: AuditLogCountAggregateOutputType | null
    _min: AuditLogMinAggregateOutputType | null
    _max: AuditLogMaxAggregateOutputType | null
  }

  type GetAuditLogGroupByPayload<T extends AuditLogGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AuditLogGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AuditLogGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AuditLogGroupByOutputType[P]>
            : GetScalarType<T[P], AuditLogGroupByOutputType[P]>
        }
      >
    >


  export type AuditLogSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    patientId?: boolean
    userId?: boolean
    action?: boolean
    resourceType?: boolean
    resourceId?: boolean
    changes?: boolean
    ipAddress?: boolean
    correlationId?: boolean
    createdAt?: boolean
    patient?: boolean | AuditLog$patientArgs<ExtArgs>
  }, ExtArgs["result"]["auditLog"]>

  export type AuditLogSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    patientId?: boolean
    userId?: boolean
    action?: boolean
    resourceType?: boolean
    resourceId?: boolean
    changes?: boolean
    ipAddress?: boolean
    correlationId?: boolean
    createdAt?: boolean
    patient?: boolean | AuditLog$patientArgs<ExtArgs>
  }, ExtArgs["result"]["auditLog"]>

  export type AuditLogSelectScalar = {
    id?: boolean
    patientId?: boolean
    userId?: boolean
    action?: boolean
    resourceType?: boolean
    resourceId?: boolean
    changes?: boolean
    ipAddress?: boolean
    correlationId?: boolean
    createdAt?: boolean
  }

  export type AuditLogInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    patient?: boolean | AuditLog$patientArgs<ExtArgs>
  }
  export type AuditLogIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    patient?: boolean | AuditLog$patientArgs<ExtArgs>
  }

  export type $AuditLogPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "AuditLog"
    objects: {
      patient: Prisma.$PatientPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      patientId: string | null
      userId: string
      action: string
      resourceType: string
      resourceId: string | null
      changes: Prisma.JsonValue | null
      ipAddress: string | null
      correlationId: string | null
      createdAt: Date
    }, ExtArgs["result"]["auditLog"]>
    composites: {}
  }

  type AuditLogGetPayload<S extends boolean | null | undefined | AuditLogDefaultArgs> = $Result.GetResult<Prisma.$AuditLogPayload, S>

  type AuditLogCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<AuditLogFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: AuditLogCountAggregateInputType | true
    }

  export interface AuditLogDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['AuditLog'], meta: { name: 'AuditLog' } }
    /**
     * Find zero or one AuditLog that matches the filter.
     * @param {AuditLogFindUniqueArgs} args - Arguments to find a AuditLog
     * @example
     * // Get one AuditLog
     * const auditLog = await prisma.auditLog.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AuditLogFindUniqueArgs>(args: SelectSubset<T, AuditLogFindUniqueArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one AuditLog that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {AuditLogFindUniqueOrThrowArgs} args - Arguments to find a AuditLog
     * @example
     * // Get one AuditLog
     * const auditLog = await prisma.auditLog.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AuditLogFindUniqueOrThrowArgs>(args: SelectSubset<T, AuditLogFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first AuditLog that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogFindFirstArgs} args - Arguments to find a AuditLog
     * @example
     * // Get one AuditLog
     * const auditLog = await prisma.auditLog.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AuditLogFindFirstArgs>(args?: SelectSubset<T, AuditLogFindFirstArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first AuditLog that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogFindFirstOrThrowArgs} args - Arguments to find a AuditLog
     * @example
     * // Get one AuditLog
     * const auditLog = await prisma.auditLog.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AuditLogFindFirstOrThrowArgs>(args?: SelectSubset<T, AuditLogFindFirstOrThrowArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more AuditLogs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all AuditLogs
     * const auditLogs = await prisma.auditLog.findMany()
     * 
     * // Get first 10 AuditLogs
     * const auditLogs = await prisma.auditLog.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const auditLogWithIdOnly = await prisma.auditLog.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AuditLogFindManyArgs>(args?: SelectSubset<T, AuditLogFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a AuditLog.
     * @param {AuditLogCreateArgs} args - Arguments to create a AuditLog.
     * @example
     * // Create one AuditLog
     * const AuditLog = await prisma.auditLog.create({
     *   data: {
     *     // ... data to create a AuditLog
     *   }
     * })
     * 
     */
    create<T extends AuditLogCreateArgs>(args: SelectSubset<T, AuditLogCreateArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many AuditLogs.
     * @param {AuditLogCreateManyArgs} args - Arguments to create many AuditLogs.
     * @example
     * // Create many AuditLogs
     * const auditLog = await prisma.auditLog.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AuditLogCreateManyArgs>(args?: SelectSubset<T, AuditLogCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many AuditLogs and returns the data saved in the database.
     * @param {AuditLogCreateManyAndReturnArgs} args - Arguments to create many AuditLogs.
     * @example
     * // Create many AuditLogs
     * const auditLog = await prisma.auditLog.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many AuditLogs and only return the `id`
     * const auditLogWithIdOnly = await prisma.auditLog.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AuditLogCreateManyAndReturnArgs>(args?: SelectSubset<T, AuditLogCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a AuditLog.
     * @param {AuditLogDeleteArgs} args - Arguments to delete one AuditLog.
     * @example
     * // Delete one AuditLog
     * const AuditLog = await prisma.auditLog.delete({
     *   where: {
     *     // ... filter to delete one AuditLog
     *   }
     * })
     * 
     */
    delete<T extends AuditLogDeleteArgs>(args: SelectSubset<T, AuditLogDeleteArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one AuditLog.
     * @param {AuditLogUpdateArgs} args - Arguments to update one AuditLog.
     * @example
     * // Update one AuditLog
     * const auditLog = await prisma.auditLog.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AuditLogUpdateArgs>(args: SelectSubset<T, AuditLogUpdateArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more AuditLogs.
     * @param {AuditLogDeleteManyArgs} args - Arguments to filter AuditLogs to delete.
     * @example
     * // Delete a few AuditLogs
     * const { count } = await prisma.auditLog.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AuditLogDeleteManyArgs>(args?: SelectSubset<T, AuditLogDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AuditLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many AuditLogs
     * const auditLog = await prisma.auditLog.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AuditLogUpdateManyArgs>(args: SelectSubset<T, AuditLogUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one AuditLog.
     * @param {AuditLogUpsertArgs} args - Arguments to update or create a AuditLog.
     * @example
     * // Update or create a AuditLog
     * const auditLog = await prisma.auditLog.upsert({
     *   create: {
     *     // ... data to create a AuditLog
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the AuditLog we want to update
     *   }
     * })
     */
    upsert<T extends AuditLogUpsertArgs>(args: SelectSubset<T, AuditLogUpsertArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of AuditLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogCountArgs} args - Arguments to filter AuditLogs to count.
     * @example
     * // Count the number of AuditLogs
     * const count = await prisma.auditLog.count({
     *   where: {
     *     // ... the filter for the AuditLogs we want to count
     *   }
     * })
    **/
    count<T extends AuditLogCountArgs>(
      args?: Subset<T, AuditLogCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AuditLogCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a AuditLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AuditLogAggregateArgs>(args: Subset<T, AuditLogAggregateArgs>): Prisma.PrismaPromise<GetAuditLogAggregateType<T>>

    /**
     * Group by AuditLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AuditLogGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AuditLogGroupByArgs['orderBy'] }
        : { orderBy?: AuditLogGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AuditLogGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAuditLogGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the AuditLog model
   */
  readonly fields: AuditLogFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for AuditLog.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AuditLogClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    patient<T extends AuditLog$patientArgs<ExtArgs> = {}>(args?: Subset<T, AuditLog$patientArgs<ExtArgs>>): Prisma__PatientClient<$Result.GetResult<Prisma.$PatientPayload<ExtArgs>, T, "findUniqueOrThrow"> | null, null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the AuditLog model
   */ 
  interface AuditLogFieldRefs {
    readonly id: FieldRef<"AuditLog", 'String'>
    readonly patientId: FieldRef<"AuditLog", 'String'>
    readonly userId: FieldRef<"AuditLog", 'String'>
    readonly action: FieldRef<"AuditLog", 'String'>
    readonly resourceType: FieldRef<"AuditLog", 'String'>
    readonly resourceId: FieldRef<"AuditLog", 'String'>
    readonly changes: FieldRef<"AuditLog", 'Json'>
    readonly ipAddress: FieldRef<"AuditLog", 'String'>
    readonly correlationId: FieldRef<"AuditLog", 'String'>
    readonly createdAt: FieldRef<"AuditLog", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * AuditLog findUnique
   */
  export type AuditLogFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null
    /**
     * Filter, which AuditLog to fetch.
     */
    where: AuditLogWhereUniqueInput
  }

  /**
   * AuditLog findUniqueOrThrow
   */
  export type AuditLogFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null
    /**
     * Filter, which AuditLog to fetch.
     */
    where: AuditLogWhereUniqueInput
  }

  /**
   * AuditLog findFirst
   */
  export type AuditLogFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null
    /**
     * Filter, which AuditLog to fetch.
     */
    where?: AuditLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AuditLogs to fetch.
     */
    orderBy?: AuditLogOrderByWithRelationInput | AuditLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AuditLogs.
     */
    cursor?: AuditLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AuditLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AuditLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AuditLogs.
     */
    distinct?: AuditLogScalarFieldEnum | AuditLogScalarFieldEnum[]
  }

  /**
   * AuditLog findFirstOrThrow
   */
  export type AuditLogFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null
    /**
     * Filter, which AuditLog to fetch.
     */
    where?: AuditLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AuditLogs to fetch.
     */
    orderBy?: AuditLogOrderByWithRelationInput | AuditLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AuditLogs.
     */
    cursor?: AuditLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AuditLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AuditLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AuditLogs.
     */
    distinct?: AuditLogScalarFieldEnum | AuditLogScalarFieldEnum[]
  }

  /**
   * AuditLog findMany
   */
  export type AuditLogFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null
    /**
     * Filter, which AuditLogs to fetch.
     */
    where?: AuditLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AuditLogs to fetch.
     */
    orderBy?: AuditLogOrderByWithRelationInput | AuditLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing AuditLogs.
     */
    cursor?: AuditLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AuditLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AuditLogs.
     */
    skip?: number
    distinct?: AuditLogScalarFieldEnum | AuditLogScalarFieldEnum[]
  }

  /**
   * AuditLog create
   */
  export type AuditLogCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null
    /**
     * The data needed to create a AuditLog.
     */
    data: XOR<AuditLogCreateInput, AuditLogUncheckedCreateInput>
  }

  /**
   * AuditLog createMany
   */
  export type AuditLogCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many AuditLogs.
     */
    data: AuditLogCreateManyInput | AuditLogCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * AuditLog createManyAndReturn
   */
  export type AuditLogCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many AuditLogs.
     */
    data: AuditLogCreateManyInput | AuditLogCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * AuditLog update
   */
  export type AuditLogUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null
    /**
     * The data needed to update a AuditLog.
     */
    data: XOR<AuditLogUpdateInput, AuditLogUncheckedUpdateInput>
    /**
     * Choose, which AuditLog to update.
     */
    where: AuditLogWhereUniqueInput
  }

  /**
   * AuditLog updateMany
   */
  export type AuditLogUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update AuditLogs.
     */
    data: XOR<AuditLogUpdateManyMutationInput, AuditLogUncheckedUpdateManyInput>
    /**
     * Filter which AuditLogs to update
     */
    where?: AuditLogWhereInput
  }

  /**
   * AuditLog upsert
   */
  export type AuditLogUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null
    /**
     * The filter to search for the AuditLog to update in case it exists.
     */
    where: AuditLogWhereUniqueInput
    /**
     * In case the AuditLog found by the `where` argument doesn't exist, create a new AuditLog with this data.
     */
    create: XOR<AuditLogCreateInput, AuditLogUncheckedCreateInput>
    /**
     * In case the AuditLog was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AuditLogUpdateInput, AuditLogUncheckedUpdateInput>
  }

  /**
   * AuditLog delete
   */
  export type AuditLogDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null
    /**
     * Filter which AuditLog to delete.
     */
    where: AuditLogWhereUniqueInput
  }

  /**
   * AuditLog deleteMany
   */
  export type AuditLogDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AuditLogs to delete
     */
    where?: AuditLogWhereInput
  }

  /**
   * AuditLog.patient
   */
  export type AuditLog$patientArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Patient
     */
    select?: PatientSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PatientInclude<ExtArgs> | null
    where?: PatientWhereInput
  }

  /**
   * AuditLog without action
   */
  export type AuditLogDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const PatientScalarFieldEnum: {
    id: 'id',
    mrn: 'mrn',
    firstName: 'firstName',
    lastName: 'lastName',
    preferredName: 'preferredName',
    dateOfBirth: 'dateOfBirth',
    gender: 'gender',
    genderIdentity: 'genderIdentity',
    phone: 'phone',
    email: 'email',
    photoUrl: 'photoUrl',
    isActive: 'isActive',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type PatientScalarFieldEnum = (typeof PatientScalarFieldEnum)[keyof typeof PatientScalarFieldEnum]


  export const PatientAddressScalarFieldEnum: {
    id: 'id',
    patientId: 'patientId',
    line1: 'line1',
    line2: 'line2',
    city: 'city',
    state: 'state',
    postalCode: 'postalCode',
    country: 'country'
  };

  export type PatientAddressScalarFieldEnum = (typeof PatientAddressScalarFieldEnum)[keyof typeof PatientAddressScalarFieldEnum]


  export const EmergencyContactScalarFieldEnum: {
    id: 'id',
    patientId: 'patientId',
    name: 'name',
    relationship: 'relationship',
    phone: 'phone'
  };

  export type EmergencyContactScalarFieldEnum = (typeof EmergencyContactScalarFieldEnum)[keyof typeof EmergencyContactScalarFieldEnum]


  export const PatientInsuranceScalarFieldEnum: {
    id: 'id',
    patientId: 'patientId',
    priority: 'priority',
    payerName: 'payerName',
    memberId: 'memberId',
    groupId: 'groupId',
    subscriberName: 'subscriberName',
    isActive: 'isActive',
    createdAt: 'createdAt'
  };

  export type PatientInsuranceScalarFieldEnum = (typeof PatientInsuranceScalarFieldEnum)[keyof typeof PatientInsuranceScalarFieldEnum]


  export const ConditionScalarFieldEnum: {
    id: 'id',
    patientId: 'patientId',
    encounterId: 'encounterId',
    snomedCode: 'snomedCode',
    icd10Code: 'icd10Code',
    display: 'display',
    clinicalStatus: 'clinicalStatus',
    verificationStatus: 'verificationStatus',
    severity: 'severity',
    onsetDate: 'onsetDate',
    resolvedDate: 'resolvedDate',
    recordedAt: 'recordedAt',
    recordedBy: 'recordedBy'
  };

  export type ConditionScalarFieldEnum = (typeof ConditionScalarFieldEnum)[keyof typeof ConditionScalarFieldEnum]


  export const MedicationRequestScalarFieldEnum: {
    id: 'id',
    patientId: 'patientId',
    encounterId: 'encounterId',
    rxNormCode: 'rxNormCode',
    medicationName: 'medicationName',
    dose: 'dose',
    frequency: 'frequency',
    route: 'route',
    status: 'status',
    prescribedBy: 'prescribedBy',
    prescribedAt: 'prescribedAt',
    discontinuedAt: 'discontinuedAt',
    discontinuedBy: 'discontinuedBy',
    notes: 'notes'
  };

  export type MedicationRequestScalarFieldEnum = (typeof MedicationRequestScalarFieldEnum)[keyof typeof MedicationRequestScalarFieldEnum]


  export const AllergyIntoleranceScalarFieldEnum: {
    id: 'id',
    patientId: 'patientId',
    substance: 'substance',
    substanceCode: 'substanceCode',
    type: 'type',
    criticality: 'criticality',
    clinicalStatus: 'clinicalStatus',
    reaction: 'reaction',
    reactionSeverity: 'reactionSeverity',
    onsetDate: 'onsetDate',
    recordedAt: 'recordedAt',
    recordedBy: 'recordedBy'
  };

  export type AllergyIntoleranceScalarFieldEnum = (typeof AllergyIntoleranceScalarFieldEnum)[keyof typeof AllergyIntoleranceScalarFieldEnum]


  export const ObservationScalarFieldEnum: {
    id: 'id',
    patientId: 'patientId',
    encounterId: 'encounterId',
    category: 'category',
    loincCode: 'loincCode',
    display: 'display',
    valueQuantity: 'valueQuantity',
    valueUnit: 'valueUnit',
    valueString: 'valueString',
    referenceRangeLow: 'referenceRangeLow',
    referenceRangeHigh: 'referenceRangeHigh',
    isAbnormal: 'isAbnormal',
    status: 'status',
    effectiveAt: 'effectiveAt',
    recordedBy: 'recordedBy'
  };

  export type ObservationScalarFieldEnum = (typeof ObservationScalarFieldEnum)[keyof typeof ObservationScalarFieldEnum]


  export const ImmunisationScalarFieldEnum: {
    id: 'id',
    patientId: 'patientId',
    vaccineCode: 'vaccineCode',
    vaccineName: 'vaccineName',
    status: 'status',
    occurrenceDate: 'occurrenceDate',
    lotNumber: 'lotNumber',
    site: 'site',
    route: 'route',
    administeredBy: 'administeredBy',
    primarySource: 'primarySource',
    notes: 'notes',
    createdAt: 'createdAt'
  };

  export type ImmunisationScalarFieldEnum = (typeof ImmunisationScalarFieldEnum)[keyof typeof ImmunisationScalarFieldEnum]


  export const EncounterScalarFieldEnum: {
    id: 'id',
    patientId: 'patientId',
    status: 'status',
    encounterClass: 'encounterClass',
    type: 'type',
    reasonCode: 'reasonCode',
    reasonDisplay: 'reasonDisplay',
    startTime: 'startTime',
    endTime: 'endTime',
    providerId: 'providerId',
    locationId: 'locationId',
    notes: 'notes',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type EncounterScalarFieldEnum = (typeof EncounterScalarFieldEnum)[keyof typeof EncounterScalarFieldEnum]


  export const AppointmentScalarFieldEnum: {
    id: 'id',
    patientId: 'patientId',
    providerId: 'providerId',
    status: 'status',
    serviceType: 'serviceType',
    description: 'description',
    startTime: 'startTime',
    endTime: 'endTime',
    durationMinutes: 'durationMinutes',
    locationId: 'locationId',
    notes: 'notes',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type AppointmentScalarFieldEnum = (typeof AppointmentScalarFieldEnum)[keyof typeof AppointmentScalarFieldEnum]


  export const ClinicalDocumentScalarFieldEnum: {
    id: 'id',
    patientId: 'patientId',
    encounterId: 'encounterId',
    type: 'type',
    title: 'title',
    content: 'content',
    status: 'status',
    authorId: 'authorId',
    authorName: 'authorName',
    signedAt: 'signedAt',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type ClinicalDocumentScalarFieldEnum = (typeof ClinicalDocumentScalarFieldEnum)[keyof typeof ClinicalDocumentScalarFieldEnum]


  export const AuditLogScalarFieldEnum: {
    id: 'id',
    patientId: 'patientId',
    userId: 'userId',
    action: 'action',
    resourceType: 'resourceType',
    resourceId: 'resourceId',
    changes: 'changes',
    ipAddress: 'ipAddress',
    correlationId: 'correlationId',
    createdAt: 'createdAt'
  };

  export type AuditLogScalarFieldEnum = (typeof AuditLogScalarFieldEnum)[keyof typeof AuditLogScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const NullableJsonNullValueInput: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull
  };

  export type NullableJsonNullValueInput = (typeof NullableJsonNullValueInput)[keyof typeof NullableJsonNullValueInput]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  export const JsonNullValueFilter: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull,
    AnyNull: typeof AnyNull
  };

  export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter]


  /**
   * Field references 
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    


  /**
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>
    
  /**
   * Deep Input Types
   */


  export type PatientWhereInput = {
    AND?: PatientWhereInput | PatientWhereInput[]
    OR?: PatientWhereInput[]
    NOT?: PatientWhereInput | PatientWhereInput[]
    id?: StringFilter<"Patient"> | string
    mrn?: StringFilter<"Patient"> | string
    firstName?: StringFilter<"Patient"> | string
    lastName?: StringFilter<"Patient"> | string
    preferredName?: StringNullableFilter<"Patient"> | string | null
    dateOfBirth?: DateTimeFilter<"Patient"> | Date | string
    gender?: StringFilter<"Patient"> | string
    genderIdentity?: StringNullableFilter<"Patient"> | string | null
    phone?: StringNullableFilter<"Patient"> | string | null
    email?: StringNullableFilter<"Patient"> | string | null
    photoUrl?: StringNullableFilter<"Patient"> | string | null
    isActive?: BoolFilter<"Patient"> | boolean
    createdAt?: DateTimeFilter<"Patient"> | Date | string
    updatedAt?: DateTimeFilter<"Patient"> | Date | string
    address?: XOR<PatientAddressNullableRelationFilter, PatientAddressWhereInput> | null
    emergencyContacts?: EmergencyContactListRelationFilter
    insurances?: PatientInsuranceListRelationFilter
    conditions?: ConditionListRelationFilter
    medications?: MedicationRequestListRelationFilter
    allergies?: AllergyIntoleranceListRelationFilter
    observations?: ObservationListRelationFilter
    immunisations?: ImmunisationListRelationFilter
    encounters?: EncounterListRelationFilter
    appointments?: AppointmentListRelationFilter
    documents?: ClinicalDocumentListRelationFilter
    auditLogs?: AuditLogListRelationFilter
  }

  export type PatientOrderByWithRelationInput = {
    id?: SortOrder
    mrn?: SortOrder
    firstName?: SortOrder
    lastName?: SortOrder
    preferredName?: SortOrderInput | SortOrder
    dateOfBirth?: SortOrder
    gender?: SortOrder
    genderIdentity?: SortOrderInput | SortOrder
    phone?: SortOrderInput | SortOrder
    email?: SortOrderInput | SortOrder
    photoUrl?: SortOrderInput | SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    address?: PatientAddressOrderByWithRelationInput
    emergencyContacts?: EmergencyContactOrderByRelationAggregateInput
    insurances?: PatientInsuranceOrderByRelationAggregateInput
    conditions?: ConditionOrderByRelationAggregateInput
    medications?: MedicationRequestOrderByRelationAggregateInput
    allergies?: AllergyIntoleranceOrderByRelationAggregateInput
    observations?: ObservationOrderByRelationAggregateInput
    immunisations?: ImmunisationOrderByRelationAggregateInput
    encounters?: EncounterOrderByRelationAggregateInput
    appointments?: AppointmentOrderByRelationAggregateInput
    documents?: ClinicalDocumentOrderByRelationAggregateInput
    auditLogs?: AuditLogOrderByRelationAggregateInput
  }

  export type PatientWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    mrn?: string
    AND?: PatientWhereInput | PatientWhereInput[]
    OR?: PatientWhereInput[]
    NOT?: PatientWhereInput | PatientWhereInput[]
    firstName?: StringFilter<"Patient"> | string
    lastName?: StringFilter<"Patient"> | string
    preferredName?: StringNullableFilter<"Patient"> | string | null
    dateOfBirth?: DateTimeFilter<"Patient"> | Date | string
    gender?: StringFilter<"Patient"> | string
    genderIdentity?: StringNullableFilter<"Patient"> | string | null
    phone?: StringNullableFilter<"Patient"> | string | null
    email?: StringNullableFilter<"Patient"> | string | null
    photoUrl?: StringNullableFilter<"Patient"> | string | null
    isActive?: BoolFilter<"Patient"> | boolean
    createdAt?: DateTimeFilter<"Patient"> | Date | string
    updatedAt?: DateTimeFilter<"Patient"> | Date | string
    address?: XOR<PatientAddressNullableRelationFilter, PatientAddressWhereInput> | null
    emergencyContacts?: EmergencyContactListRelationFilter
    insurances?: PatientInsuranceListRelationFilter
    conditions?: ConditionListRelationFilter
    medications?: MedicationRequestListRelationFilter
    allergies?: AllergyIntoleranceListRelationFilter
    observations?: ObservationListRelationFilter
    immunisations?: ImmunisationListRelationFilter
    encounters?: EncounterListRelationFilter
    appointments?: AppointmentListRelationFilter
    documents?: ClinicalDocumentListRelationFilter
    auditLogs?: AuditLogListRelationFilter
  }, "id" | "mrn">

  export type PatientOrderByWithAggregationInput = {
    id?: SortOrder
    mrn?: SortOrder
    firstName?: SortOrder
    lastName?: SortOrder
    preferredName?: SortOrderInput | SortOrder
    dateOfBirth?: SortOrder
    gender?: SortOrder
    genderIdentity?: SortOrderInput | SortOrder
    phone?: SortOrderInput | SortOrder
    email?: SortOrderInput | SortOrder
    photoUrl?: SortOrderInput | SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: PatientCountOrderByAggregateInput
    _max?: PatientMaxOrderByAggregateInput
    _min?: PatientMinOrderByAggregateInput
  }

  export type PatientScalarWhereWithAggregatesInput = {
    AND?: PatientScalarWhereWithAggregatesInput | PatientScalarWhereWithAggregatesInput[]
    OR?: PatientScalarWhereWithAggregatesInput[]
    NOT?: PatientScalarWhereWithAggregatesInput | PatientScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Patient"> | string
    mrn?: StringWithAggregatesFilter<"Patient"> | string
    firstName?: StringWithAggregatesFilter<"Patient"> | string
    lastName?: StringWithAggregatesFilter<"Patient"> | string
    preferredName?: StringNullableWithAggregatesFilter<"Patient"> | string | null
    dateOfBirth?: DateTimeWithAggregatesFilter<"Patient"> | Date | string
    gender?: StringWithAggregatesFilter<"Patient"> | string
    genderIdentity?: StringNullableWithAggregatesFilter<"Patient"> | string | null
    phone?: StringNullableWithAggregatesFilter<"Patient"> | string | null
    email?: StringNullableWithAggregatesFilter<"Patient"> | string | null
    photoUrl?: StringNullableWithAggregatesFilter<"Patient"> | string | null
    isActive?: BoolWithAggregatesFilter<"Patient"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"Patient"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Patient"> | Date | string
  }

  export type PatientAddressWhereInput = {
    AND?: PatientAddressWhereInput | PatientAddressWhereInput[]
    OR?: PatientAddressWhereInput[]
    NOT?: PatientAddressWhereInput | PatientAddressWhereInput[]
    id?: StringFilter<"PatientAddress"> | string
    patientId?: StringFilter<"PatientAddress"> | string
    line1?: StringNullableFilter<"PatientAddress"> | string | null
    line2?: StringNullableFilter<"PatientAddress"> | string | null
    city?: StringNullableFilter<"PatientAddress"> | string | null
    state?: StringNullableFilter<"PatientAddress"> | string | null
    postalCode?: StringNullableFilter<"PatientAddress"> | string | null
    country?: StringFilter<"PatientAddress"> | string
    patient?: XOR<PatientRelationFilter, PatientWhereInput>
  }

  export type PatientAddressOrderByWithRelationInput = {
    id?: SortOrder
    patientId?: SortOrder
    line1?: SortOrderInput | SortOrder
    line2?: SortOrderInput | SortOrder
    city?: SortOrderInput | SortOrder
    state?: SortOrderInput | SortOrder
    postalCode?: SortOrderInput | SortOrder
    country?: SortOrder
    patient?: PatientOrderByWithRelationInput
  }

  export type PatientAddressWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    patientId?: string
    AND?: PatientAddressWhereInput | PatientAddressWhereInput[]
    OR?: PatientAddressWhereInput[]
    NOT?: PatientAddressWhereInput | PatientAddressWhereInput[]
    line1?: StringNullableFilter<"PatientAddress"> | string | null
    line2?: StringNullableFilter<"PatientAddress"> | string | null
    city?: StringNullableFilter<"PatientAddress"> | string | null
    state?: StringNullableFilter<"PatientAddress"> | string | null
    postalCode?: StringNullableFilter<"PatientAddress"> | string | null
    country?: StringFilter<"PatientAddress"> | string
    patient?: XOR<PatientRelationFilter, PatientWhereInput>
  }, "id" | "patientId">

  export type PatientAddressOrderByWithAggregationInput = {
    id?: SortOrder
    patientId?: SortOrder
    line1?: SortOrderInput | SortOrder
    line2?: SortOrderInput | SortOrder
    city?: SortOrderInput | SortOrder
    state?: SortOrderInput | SortOrder
    postalCode?: SortOrderInput | SortOrder
    country?: SortOrder
    _count?: PatientAddressCountOrderByAggregateInput
    _max?: PatientAddressMaxOrderByAggregateInput
    _min?: PatientAddressMinOrderByAggregateInput
  }

  export type PatientAddressScalarWhereWithAggregatesInput = {
    AND?: PatientAddressScalarWhereWithAggregatesInput | PatientAddressScalarWhereWithAggregatesInput[]
    OR?: PatientAddressScalarWhereWithAggregatesInput[]
    NOT?: PatientAddressScalarWhereWithAggregatesInput | PatientAddressScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"PatientAddress"> | string
    patientId?: StringWithAggregatesFilter<"PatientAddress"> | string
    line1?: StringNullableWithAggregatesFilter<"PatientAddress"> | string | null
    line2?: StringNullableWithAggregatesFilter<"PatientAddress"> | string | null
    city?: StringNullableWithAggregatesFilter<"PatientAddress"> | string | null
    state?: StringNullableWithAggregatesFilter<"PatientAddress"> | string | null
    postalCode?: StringNullableWithAggregatesFilter<"PatientAddress"> | string | null
    country?: StringWithAggregatesFilter<"PatientAddress"> | string
  }

  export type EmergencyContactWhereInput = {
    AND?: EmergencyContactWhereInput | EmergencyContactWhereInput[]
    OR?: EmergencyContactWhereInput[]
    NOT?: EmergencyContactWhereInput | EmergencyContactWhereInput[]
    id?: StringFilter<"EmergencyContact"> | string
    patientId?: StringFilter<"EmergencyContact"> | string
    name?: StringFilter<"EmergencyContact"> | string
    relationship?: StringFilter<"EmergencyContact"> | string
    phone?: StringFilter<"EmergencyContact"> | string
    patient?: XOR<PatientRelationFilter, PatientWhereInput>
  }

  export type EmergencyContactOrderByWithRelationInput = {
    id?: SortOrder
    patientId?: SortOrder
    name?: SortOrder
    relationship?: SortOrder
    phone?: SortOrder
    patient?: PatientOrderByWithRelationInput
  }

  export type EmergencyContactWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: EmergencyContactWhereInput | EmergencyContactWhereInput[]
    OR?: EmergencyContactWhereInput[]
    NOT?: EmergencyContactWhereInput | EmergencyContactWhereInput[]
    patientId?: StringFilter<"EmergencyContact"> | string
    name?: StringFilter<"EmergencyContact"> | string
    relationship?: StringFilter<"EmergencyContact"> | string
    phone?: StringFilter<"EmergencyContact"> | string
    patient?: XOR<PatientRelationFilter, PatientWhereInput>
  }, "id">

  export type EmergencyContactOrderByWithAggregationInput = {
    id?: SortOrder
    patientId?: SortOrder
    name?: SortOrder
    relationship?: SortOrder
    phone?: SortOrder
    _count?: EmergencyContactCountOrderByAggregateInput
    _max?: EmergencyContactMaxOrderByAggregateInput
    _min?: EmergencyContactMinOrderByAggregateInput
  }

  export type EmergencyContactScalarWhereWithAggregatesInput = {
    AND?: EmergencyContactScalarWhereWithAggregatesInput | EmergencyContactScalarWhereWithAggregatesInput[]
    OR?: EmergencyContactScalarWhereWithAggregatesInput[]
    NOT?: EmergencyContactScalarWhereWithAggregatesInput | EmergencyContactScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"EmergencyContact"> | string
    patientId?: StringWithAggregatesFilter<"EmergencyContact"> | string
    name?: StringWithAggregatesFilter<"EmergencyContact"> | string
    relationship?: StringWithAggregatesFilter<"EmergencyContact"> | string
    phone?: StringWithAggregatesFilter<"EmergencyContact"> | string
  }

  export type PatientInsuranceWhereInput = {
    AND?: PatientInsuranceWhereInput | PatientInsuranceWhereInput[]
    OR?: PatientInsuranceWhereInput[]
    NOT?: PatientInsuranceWhereInput | PatientInsuranceWhereInput[]
    id?: StringFilter<"PatientInsurance"> | string
    patientId?: StringFilter<"PatientInsurance"> | string
    priority?: IntFilter<"PatientInsurance"> | number
    payerName?: StringFilter<"PatientInsurance"> | string
    memberId?: StringFilter<"PatientInsurance"> | string
    groupId?: StringNullableFilter<"PatientInsurance"> | string | null
    subscriberName?: StringNullableFilter<"PatientInsurance"> | string | null
    isActive?: BoolFilter<"PatientInsurance"> | boolean
    createdAt?: DateTimeFilter<"PatientInsurance"> | Date | string
    patient?: XOR<PatientRelationFilter, PatientWhereInput>
  }

  export type PatientInsuranceOrderByWithRelationInput = {
    id?: SortOrder
    patientId?: SortOrder
    priority?: SortOrder
    payerName?: SortOrder
    memberId?: SortOrder
    groupId?: SortOrderInput | SortOrder
    subscriberName?: SortOrderInput | SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    patient?: PatientOrderByWithRelationInput
  }

  export type PatientInsuranceWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: PatientInsuranceWhereInput | PatientInsuranceWhereInput[]
    OR?: PatientInsuranceWhereInput[]
    NOT?: PatientInsuranceWhereInput | PatientInsuranceWhereInput[]
    patientId?: StringFilter<"PatientInsurance"> | string
    priority?: IntFilter<"PatientInsurance"> | number
    payerName?: StringFilter<"PatientInsurance"> | string
    memberId?: StringFilter<"PatientInsurance"> | string
    groupId?: StringNullableFilter<"PatientInsurance"> | string | null
    subscriberName?: StringNullableFilter<"PatientInsurance"> | string | null
    isActive?: BoolFilter<"PatientInsurance"> | boolean
    createdAt?: DateTimeFilter<"PatientInsurance"> | Date | string
    patient?: XOR<PatientRelationFilter, PatientWhereInput>
  }, "id">

  export type PatientInsuranceOrderByWithAggregationInput = {
    id?: SortOrder
    patientId?: SortOrder
    priority?: SortOrder
    payerName?: SortOrder
    memberId?: SortOrder
    groupId?: SortOrderInput | SortOrder
    subscriberName?: SortOrderInput | SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    _count?: PatientInsuranceCountOrderByAggregateInput
    _avg?: PatientInsuranceAvgOrderByAggregateInput
    _max?: PatientInsuranceMaxOrderByAggregateInput
    _min?: PatientInsuranceMinOrderByAggregateInput
    _sum?: PatientInsuranceSumOrderByAggregateInput
  }

  export type PatientInsuranceScalarWhereWithAggregatesInput = {
    AND?: PatientInsuranceScalarWhereWithAggregatesInput | PatientInsuranceScalarWhereWithAggregatesInput[]
    OR?: PatientInsuranceScalarWhereWithAggregatesInput[]
    NOT?: PatientInsuranceScalarWhereWithAggregatesInput | PatientInsuranceScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"PatientInsurance"> | string
    patientId?: StringWithAggregatesFilter<"PatientInsurance"> | string
    priority?: IntWithAggregatesFilter<"PatientInsurance"> | number
    payerName?: StringWithAggregatesFilter<"PatientInsurance"> | string
    memberId?: StringWithAggregatesFilter<"PatientInsurance"> | string
    groupId?: StringNullableWithAggregatesFilter<"PatientInsurance"> | string | null
    subscriberName?: StringNullableWithAggregatesFilter<"PatientInsurance"> | string | null
    isActive?: BoolWithAggregatesFilter<"PatientInsurance"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"PatientInsurance"> | Date | string
  }

  export type ConditionWhereInput = {
    AND?: ConditionWhereInput | ConditionWhereInput[]
    OR?: ConditionWhereInput[]
    NOT?: ConditionWhereInput | ConditionWhereInput[]
    id?: StringFilter<"Condition"> | string
    patientId?: StringFilter<"Condition"> | string
    encounterId?: StringNullableFilter<"Condition"> | string | null
    snomedCode?: StringNullableFilter<"Condition"> | string | null
    icd10Code?: StringNullableFilter<"Condition"> | string | null
    display?: StringFilter<"Condition"> | string
    clinicalStatus?: StringFilter<"Condition"> | string
    verificationStatus?: StringFilter<"Condition"> | string
    severity?: StringNullableFilter<"Condition"> | string | null
    onsetDate?: DateTimeNullableFilter<"Condition"> | Date | string | null
    resolvedDate?: DateTimeNullableFilter<"Condition"> | Date | string | null
    recordedAt?: DateTimeFilter<"Condition"> | Date | string
    recordedBy?: StringFilter<"Condition"> | string
    patient?: XOR<PatientRelationFilter, PatientWhereInput>
    encounter?: XOR<EncounterNullableRelationFilter, EncounterWhereInput> | null
  }

  export type ConditionOrderByWithRelationInput = {
    id?: SortOrder
    patientId?: SortOrder
    encounterId?: SortOrderInput | SortOrder
    snomedCode?: SortOrderInput | SortOrder
    icd10Code?: SortOrderInput | SortOrder
    display?: SortOrder
    clinicalStatus?: SortOrder
    verificationStatus?: SortOrder
    severity?: SortOrderInput | SortOrder
    onsetDate?: SortOrderInput | SortOrder
    resolvedDate?: SortOrderInput | SortOrder
    recordedAt?: SortOrder
    recordedBy?: SortOrder
    patient?: PatientOrderByWithRelationInput
    encounter?: EncounterOrderByWithRelationInput
  }

  export type ConditionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ConditionWhereInput | ConditionWhereInput[]
    OR?: ConditionWhereInput[]
    NOT?: ConditionWhereInput | ConditionWhereInput[]
    patientId?: StringFilter<"Condition"> | string
    encounterId?: StringNullableFilter<"Condition"> | string | null
    snomedCode?: StringNullableFilter<"Condition"> | string | null
    icd10Code?: StringNullableFilter<"Condition"> | string | null
    display?: StringFilter<"Condition"> | string
    clinicalStatus?: StringFilter<"Condition"> | string
    verificationStatus?: StringFilter<"Condition"> | string
    severity?: StringNullableFilter<"Condition"> | string | null
    onsetDate?: DateTimeNullableFilter<"Condition"> | Date | string | null
    resolvedDate?: DateTimeNullableFilter<"Condition"> | Date | string | null
    recordedAt?: DateTimeFilter<"Condition"> | Date | string
    recordedBy?: StringFilter<"Condition"> | string
    patient?: XOR<PatientRelationFilter, PatientWhereInput>
    encounter?: XOR<EncounterNullableRelationFilter, EncounterWhereInput> | null
  }, "id">

  export type ConditionOrderByWithAggregationInput = {
    id?: SortOrder
    patientId?: SortOrder
    encounterId?: SortOrderInput | SortOrder
    snomedCode?: SortOrderInput | SortOrder
    icd10Code?: SortOrderInput | SortOrder
    display?: SortOrder
    clinicalStatus?: SortOrder
    verificationStatus?: SortOrder
    severity?: SortOrderInput | SortOrder
    onsetDate?: SortOrderInput | SortOrder
    resolvedDate?: SortOrderInput | SortOrder
    recordedAt?: SortOrder
    recordedBy?: SortOrder
    _count?: ConditionCountOrderByAggregateInput
    _max?: ConditionMaxOrderByAggregateInput
    _min?: ConditionMinOrderByAggregateInput
  }

  export type ConditionScalarWhereWithAggregatesInput = {
    AND?: ConditionScalarWhereWithAggregatesInput | ConditionScalarWhereWithAggregatesInput[]
    OR?: ConditionScalarWhereWithAggregatesInput[]
    NOT?: ConditionScalarWhereWithAggregatesInput | ConditionScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Condition"> | string
    patientId?: StringWithAggregatesFilter<"Condition"> | string
    encounterId?: StringNullableWithAggregatesFilter<"Condition"> | string | null
    snomedCode?: StringNullableWithAggregatesFilter<"Condition"> | string | null
    icd10Code?: StringNullableWithAggregatesFilter<"Condition"> | string | null
    display?: StringWithAggregatesFilter<"Condition"> | string
    clinicalStatus?: StringWithAggregatesFilter<"Condition"> | string
    verificationStatus?: StringWithAggregatesFilter<"Condition"> | string
    severity?: StringNullableWithAggregatesFilter<"Condition"> | string | null
    onsetDate?: DateTimeNullableWithAggregatesFilter<"Condition"> | Date | string | null
    resolvedDate?: DateTimeNullableWithAggregatesFilter<"Condition"> | Date | string | null
    recordedAt?: DateTimeWithAggregatesFilter<"Condition"> | Date | string
    recordedBy?: StringWithAggregatesFilter<"Condition"> | string
  }

  export type MedicationRequestWhereInput = {
    AND?: MedicationRequestWhereInput | MedicationRequestWhereInput[]
    OR?: MedicationRequestWhereInput[]
    NOT?: MedicationRequestWhereInput | MedicationRequestWhereInput[]
    id?: StringFilter<"MedicationRequest"> | string
    patientId?: StringFilter<"MedicationRequest"> | string
    encounterId?: StringNullableFilter<"MedicationRequest"> | string | null
    rxNormCode?: StringNullableFilter<"MedicationRequest"> | string | null
    medicationName?: StringFilter<"MedicationRequest"> | string
    dose?: StringNullableFilter<"MedicationRequest"> | string | null
    frequency?: StringNullableFilter<"MedicationRequest"> | string | null
    route?: StringNullableFilter<"MedicationRequest"> | string | null
    status?: StringFilter<"MedicationRequest"> | string
    prescribedBy?: StringFilter<"MedicationRequest"> | string
    prescribedAt?: DateTimeFilter<"MedicationRequest"> | Date | string
    discontinuedAt?: DateTimeNullableFilter<"MedicationRequest"> | Date | string | null
    discontinuedBy?: StringNullableFilter<"MedicationRequest"> | string | null
    notes?: StringNullableFilter<"MedicationRequest"> | string | null
    patient?: XOR<PatientRelationFilter, PatientWhereInput>
    encounter?: XOR<EncounterNullableRelationFilter, EncounterWhereInput> | null
  }

  export type MedicationRequestOrderByWithRelationInput = {
    id?: SortOrder
    patientId?: SortOrder
    encounterId?: SortOrderInput | SortOrder
    rxNormCode?: SortOrderInput | SortOrder
    medicationName?: SortOrder
    dose?: SortOrderInput | SortOrder
    frequency?: SortOrderInput | SortOrder
    route?: SortOrderInput | SortOrder
    status?: SortOrder
    prescribedBy?: SortOrder
    prescribedAt?: SortOrder
    discontinuedAt?: SortOrderInput | SortOrder
    discontinuedBy?: SortOrderInput | SortOrder
    notes?: SortOrderInput | SortOrder
    patient?: PatientOrderByWithRelationInput
    encounter?: EncounterOrderByWithRelationInput
  }

  export type MedicationRequestWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: MedicationRequestWhereInput | MedicationRequestWhereInput[]
    OR?: MedicationRequestWhereInput[]
    NOT?: MedicationRequestWhereInput | MedicationRequestWhereInput[]
    patientId?: StringFilter<"MedicationRequest"> | string
    encounterId?: StringNullableFilter<"MedicationRequest"> | string | null
    rxNormCode?: StringNullableFilter<"MedicationRequest"> | string | null
    medicationName?: StringFilter<"MedicationRequest"> | string
    dose?: StringNullableFilter<"MedicationRequest"> | string | null
    frequency?: StringNullableFilter<"MedicationRequest"> | string | null
    route?: StringNullableFilter<"MedicationRequest"> | string | null
    status?: StringFilter<"MedicationRequest"> | string
    prescribedBy?: StringFilter<"MedicationRequest"> | string
    prescribedAt?: DateTimeFilter<"MedicationRequest"> | Date | string
    discontinuedAt?: DateTimeNullableFilter<"MedicationRequest"> | Date | string | null
    discontinuedBy?: StringNullableFilter<"MedicationRequest"> | string | null
    notes?: StringNullableFilter<"MedicationRequest"> | string | null
    patient?: XOR<PatientRelationFilter, PatientWhereInput>
    encounter?: XOR<EncounterNullableRelationFilter, EncounterWhereInput> | null
  }, "id">

  export type MedicationRequestOrderByWithAggregationInput = {
    id?: SortOrder
    patientId?: SortOrder
    encounterId?: SortOrderInput | SortOrder
    rxNormCode?: SortOrderInput | SortOrder
    medicationName?: SortOrder
    dose?: SortOrderInput | SortOrder
    frequency?: SortOrderInput | SortOrder
    route?: SortOrderInput | SortOrder
    status?: SortOrder
    prescribedBy?: SortOrder
    prescribedAt?: SortOrder
    discontinuedAt?: SortOrderInput | SortOrder
    discontinuedBy?: SortOrderInput | SortOrder
    notes?: SortOrderInput | SortOrder
    _count?: MedicationRequestCountOrderByAggregateInput
    _max?: MedicationRequestMaxOrderByAggregateInput
    _min?: MedicationRequestMinOrderByAggregateInput
  }

  export type MedicationRequestScalarWhereWithAggregatesInput = {
    AND?: MedicationRequestScalarWhereWithAggregatesInput | MedicationRequestScalarWhereWithAggregatesInput[]
    OR?: MedicationRequestScalarWhereWithAggregatesInput[]
    NOT?: MedicationRequestScalarWhereWithAggregatesInput | MedicationRequestScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"MedicationRequest"> | string
    patientId?: StringWithAggregatesFilter<"MedicationRequest"> | string
    encounterId?: StringNullableWithAggregatesFilter<"MedicationRequest"> | string | null
    rxNormCode?: StringNullableWithAggregatesFilter<"MedicationRequest"> | string | null
    medicationName?: StringWithAggregatesFilter<"MedicationRequest"> | string
    dose?: StringNullableWithAggregatesFilter<"MedicationRequest"> | string | null
    frequency?: StringNullableWithAggregatesFilter<"MedicationRequest"> | string | null
    route?: StringNullableWithAggregatesFilter<"MedicationRequest"> | string | null
    status?: StringWithAggregatesFilter<"MedicationRequest"> | string
    prescribedBy?: StringWithAggregatesFilter<"MedicationRequest"> | string
    prescribedAt?: DateTimeWithAggregatesFilter<"MedicationRequest"> | Date | string
    discontinuedAt?: DateTimeNullableWithAggregatesFilter<"MedicationRequest"> | Date | string | null
    discontinuedBy?: StringNullableWithAggregatesFilter<"MedicationRequest"> | string | null
    notes?: StringNullableWithAggregatesFilter<"MedicationRequest"> | string | null
  }

  export type AllergyIntoleranceWhereInput = {
    AND?: AllergyIntoleranceWhereInput | AllergyIntoleranceWhereInput[]
    OR?: AllergyIntoleranceWhereInput[]
    NOT?: AllergyIntoleranceWhereInput | AllergyIntoleranceWhereInput[]
    id?: StringFilter<"AllergyIntolerance"> | string
    patientId?: StringFilter<"AllergyIntolerance"> | string
    substance?: StringFilter<"AllergyIntolerance"> | string
    substanceCode?: StringNullableFilter<"AllergyIntolerance"> | string | null
    type?: StringFilter<"AllergyIntolerance"> | string
    criticality?: StringNullableFilter<"AllergyIntolerance"> | string | null
    clinicalStatus?: StringFilter<"AllergyIntolerance"> | string
    reaction?: StringNullableFilter<"AllergyIntolerance"> | string | null
    reactionSeverity?: StringNullableFilter<"AllergyIntolerance"> | string | null
    onsetDate?: DateTimeNullableFilter<"AllergyIntolerance"> | Date | string | null
    recordedAt?: DateTimeFilter<"AllergyIntolerance"> | Date | string
    recordedBy?: StringFilter<"AllergyIntolerance"> | string
    patient?: XOR<PatientRelationFilter, PatientWhereInput>
  }

  export type AllergyIntoleranceOrderByWithRelationInput = {
    id?: SortOrder
    patientId?: SortOrder
    substance?: SortOrder
    substanceCode?: SortOrderInput | SortOrder
    type?: SortOrder
    criticality?: SortOrderInput | SortOrder
    clinicalStatus?: SortOrder
    reaction?: SortOrderInput | SortOrder
    reactionSeverity?: SortOrderInput | SortOrder
    onsetDate?: SortOrderInput | SortOrder
    recordedAt?: SortOrder
    recordedBy?: SortOrder
    patient?: PatientOrderByWithRelationInput
  }

  export type AllergyIntoleranceWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: AllergyIntoleranceWhereInput | AllergyIntoleranceWhereInput[]
    OR?: AllergyIntoleranceWhereInput[]
    NOT?: AllergyIntoleranceWhereInput | AllergyIntoleranceWhereInput[]
    patientId?: StringFilter<"AllergyIntolerance"> | string
    substance?: StringFilter<"AllergyIntolerance"> | string
    substanceCode?: StringNullableFilter<"AllergyIntolerance"> | string | null
    type?: StringFilter<"AllergyIntolerance"> | string
    criticality?: StringNullableFilter<"AllergyIntolerance"> | string | null
    clinicalStatus?: StringFilter<"AllergyIntolerance"> | string
    reaction?: StringNullableFilter<"AllergyIntolerance"> | string | null
    reactionSeverity?: StringNullableFilter<"AllergyIntolerance"> | string | null
    onsetDate?: DateTimeNullableFilter<"AllergyIntolerance"> | Date | string | null
    recordedAt?: DateTimeFilter<"AllergyIntolerance"> | Date | string
    recordedBy?: StringFilter<"AllergyIntolerance"> | string
    patient?: XOR<PatientRelationFilter, PatientWhereInput>
  }, "id">

  export type AllergyIntoleranceOrderByWithAggregationInput = {
    id?: SortOrder
    patientId?: SortOrder
    substance?: SortOrder
    substanceCode?: SortOrderInput | SortOrder
    type?: SortOrder
    criticality?: SortOrderInput | SortOrder
    clinicalStatus?: SortOrder
    reaction?: SortOrderInput | SortOrder
    reactionSeverity?: SortOrderInput | SortOrder
    onsetDate?: SortOrderInput | SortOrder
    recordedAt?: SortOrder
    recordedBy?: SortOrder
    _count?: AllergyIntoleranceCountOrderByAggregateInput
    _max?: AllergyIntoleranceMaxOrderByAggregateInput
    _min?: AllergyIntoleranceMinOrderByAggregateInput
  }

  export type AllergyIntoleranceScalarWhereWithAggregatesInput = {
    AND?: AllergyIntoleranceScalarWhereWithAggregatesInput | AllergyIntoleranceScalarWhereWithAggregatesInput[]
    OR?: AllergyIntoleranceScalarWhereWithAggregatesInput[]
    NOT?: AllergyIntoleranceScalarWhereWithAggregatesInput | AllergyIntoleranceScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"AllergyIntolerance"> | string
    patientId?: StringWithAggregatesFilter<"AllergyIntolerance"> | string
    substance?: StringWithAggregatesFilter<"AllergyIntolerance"> | string
    substanceCode?: StringNullableWithAggregatesFilter<"AllergyIntolerance"> | string | null
    type?: StringWithAggregatesFilter<"AllergyIntolerance"> | string
    criticality?: StringNullableWithAggregatesFilter<"AllergyIntolerance"> | string | null
    clinicalStatus?: StringWithAggregatesFilter<"AllergyIntolerance"> | string
    reaction?: StringNullableWithAggregatesFilter<"AllergyIntolerance"> | string | null
    reactionSeverity?: StringNullableWithAggregatesFilter<"AllergyIntolerance"> | string | null
    onsetDate?: DateTimeNullableWithAggregatesFilter<"AllergyIntolerance"> | Date | string | null
    recordedAt?: DateTimeWithAggregatesFilter<"AllergyIntolerance"> | Date | string
    recordedBy?: StringWithAggregatesFilter<"AllergyIntolerance"> | string
  }

  export type ObservationWhereInput = {
    AND?: ObservationWhereInput | ObservationWhereInput[]
    OR?: ObservationWhereInput[]
    NOT?: ObservationWhereInput | ObservationWhereInput[]
    id?: StringFilter<"Observation"> | string
    patientId?: StringFilter<"Observation"> | string
    encounterId?: StringNullableFilter<"Observation"> | string | null
    category?: StringFilter<"Observation"> | string
    loincCode?: StringNullableFilter<"Observation"> | string | null
    display?: StringFilter<"Observation"> | string
    valueQuantity?: FloatNullableFilter<"Observation"> | number | null
    valueUnit?: StringNullableFilter<"Observation"> | string | null
    valueString?: StringNullableFilter<"Observation"> | string | null
    referenceRangeLow?: FloatNullableFilter<"Observation"> | number | null
    referenceRangeHigh?: FloatNullableFilter<"Observation"> | number | null
    isAbnormal?: BoolFilter<"Observation"> | boolean
    status?: StringFilter<"Observation"> | string
    effectiveAt?: DateTimeFilter<"Observation"> | Date | string
    recordedBy?: StringFilter<"Observation"> | string
    patient?: XOR<PatientRelationFilter, PatientWhereInput>
    encounter?: XOR<EncounterNullableRelationFilter, EncounterWhereInput> | null
  }

  export type ObservationOrderByWithRelationInput = {
    id?: SortOrder
    patientId?: SortOrder
    encounterId?: SortOrderInput | SortOrder
    category?: SortOrder
    loincCode?: SortOrderInput | SortOrder
    display?: SortOrder
    valueQuantity?: SortOrderInput | SortOrder
    valueUnit?: SortOrderInput | SortOrder
    valueString?: SortOrderInput | SortOrder
    referenceRangeLow?: SortOrderInput | SortOrder
    referenceRangeHigh?: SortOrderInput | SortOrder
    isAbnormal?: SortOrder
    status?: SortOrder
    effectiveAt?: SortOrder
    recordedBy?: SortOrder
    patient?: PatientOrderByWithRelationInput
    encounter?: EncounterOrderByWithRelationInput
  }

  export type ObservationWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ObservationWhereInput | ObservationWhereInput[]
    OR?: ObservationWhereInput[]
    NOT?: ObservationWhereInput | ObservationWhereInput[]
    patientId?: StringFilter<"Observation"> | string
    encounterId?: StringNullableFilter<"Observation"> | string | null
    category?: StringFilter<"Observation"> | string
    loincCode?: StringNullableFilter<"Observation"> | string | null
    display?: StringFilter<"Observation"> | string
    valueQuantity?: FloatNullableFilter<"Observation"> | number | null
    valueUnit?: StringNullableFilter<"Observation"> | string | null
    valueString?: StringNullableFilter<"Observation"> | string | null
    referenceRangeLow?: FloatNullableFilter<"Observation"> | number | null
    referenceRangeHigh?: FloatNullableFilter<"Observation"> | number | null
    isAbnormal?: BoolFilter<"Observation"> | boolean
    status?: StringFilter<"Observation"> | string
    effectiveAt?: DateTimeFilter<"Observation"> | Date | string
    recordedBy?: StringFilter<"Observation"> | string
    patient?: XOR<PatientRelationFilter, PatientWhereInput>
    encounter?: XOR<EncounterNullableRelationFilter, EncounterWhereInput> | null
  }, "id">

  export type ObservationOrderByWithAggregationInput = {
    id?: SortOrder
    patientId?: SortOrder
    encounterId?: SortOrderInput | SortOrder
    category?: SortOrder
    loincCode?: SortOrderInput | SortOrder
    display?: SortOrder
    valueQuantity?: SortOrderInput | SortOrder
    valueUnit?: SortOrderInput | SortOrder
    valueString?: SortOrderInput | SortOrder
    referenceRangeLow?: SortOrderInput | SortOrder
    referenceRangeHigh?: SortOrderInput | SortOrder
    isAbnormal?: SortOrder
    status?: SortOrder
    effectiveAt?: SortOrder
    recordedBy?: SortOrder
    _count?: ObservationCountOrderByAggregateInput
    _avg?: ObservationAvgOrderByAggregateInput
    _max?: ObservationMaxOrderByAggregateInput
    _min?: ObservationMinOrderByAggregateInput
    _sum?: ObservationSumOrderByAggregateInput
  }

  export type ObservationScalarWhereWithAggregatesInput = {
    AND?: ObservationScalarWhereWithAggregatesInput | ObservationScalarWhereWithAggregatesInput[]
    OR?: ObservationScalarWhereWithAggregatesInput[]
    NOT?: ObservationScalarWhereWithAggregatesInput | ObservationScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Observation"> | string
    patientId?: StringWithAggregatesFilter<"Observation"> | string
    encounterId?: StringNullableWithAggregatesFilter<"Observation"> | string | null
    category?: StringWithAggregatesFilter<"Observation"> | string
    loincCode?: StringNullableWithAggregatesFilter<"Observation"> | string | null
    display?: StringWithAggregatesFilter<"Observation"> | string
    valueQuantity?: FloatNullableWithAggregatesFilter<"Observation"> | number | null
    valueUnit?: StringNullableWithAggregatesFilter<"Observation"> | string | null
    valueString?: StringNullableWithAggregatesFilter<"Observation"> | string | null
    referenceRangeLow?: FloatNullableWithAggregatesFilter<"Observation"> | number | null
    referenceRangeHigh?: FloatNullableWithAggregatesFilter<"Observation"> | number | null
    isAbnormal?: BoolWithAggregatesFilter<"Observation"> | boolean
    status?: StringWithAggregatesFilter<"Observation"> | string
    effectiveAt?: DateTimeWithAggregatesFilter<"Observation"> | Date | string
    recordedBy?: StringWithAggregatesFilter<"Observation"> | string
  }

  export type ImmunisationWhereInput = {
    AND?: ImmunisationWhereInput | ImmunisationWhereInput[]
    OR?: ImmunisationWhereInput[]
    NOT?: ImmunisationWhereInput | ImmunisationWhereInput[]
    id?: StringFilter<"Immunisation"> | string
    patientId?: StringFilter<"Immunisation"> | string
    vaccineCode?: StringNullableFilter<"Immunisation"> | string | null
    vaccineName?: StringFilter<"Immunisation"> | string
    status?: StringFilter<"Immunisation"> | string
    occurrenceDate?: DateTimeFilter<"Immunisation"> | Date | string
    lotNumber?: StringNullableFilter<"Immunisation"> | string | null
    site?: StringNullableFilter<"Immunisation"> | string | null
    route?: StringNullableFilter<"Immunisation"> | string | null
    administeredBy?: StringNullableFilter<"Immunisation"> | string | null
    primarySource?: BoolFilter<"Immunisation"> | boolean
    notes?: StringNullableFilter<"Immunisation"> | string | null
    createdAt?: DateTimeFilter<"Immunisation"> | Date | string
    patient?: XOR<PatientRelationFilter, PatientWhereInput>
  }

  export type ImmunisationOrderByWithRelationInput = {
    id?: SortOrder
    patientId?: SortOrder
    vaccineCode?: SortOrderInput | SortOrder
    vaccineName?: SortOrder
    status?: SortOrder
    occurrenceDate?: SortOrder
    lotNumber?: SortOrderInput | SortOrder
    site?: SortOrderInput | SortOrder
    route?: SortOrderInput | SortOrder
    administeredBy?: SortOrderInput | SortOrder
    primarySource?: SortOrder
    notes?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    patient?: PatientOrderByWithRelationInput
  }

  export type ImmunisationWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ImmunisationWhereInput | ImmunisationWhereInput[]
    OR?: ImmunisationWhereInput[]
    NOT?: ImmunisationWhereInput | ImmunisationWhereInput[]
    patientId?: StringFilter<"Immunisation"> | string
    vaccineCode?: StringNullableFilter<"Immunisation"> | string | null
    vaccineName?: StringFilter<"Immunisation"> | string
    status?: StringFilter<"Immunisation"> | string
    occurrenceDate?: DateTimeFilter<"Immunisation"> | Date | string
    lotNumber?: StringNullableFilter<"Immunisation"> | string | null
    site?: StringNullableFilter<"Immunisation"> | string | null
    route?: StringNullableFilter<"Immunisation"> | string | null
    administeredBy?: StringNullableFilter<"Immunisation"> | string | null
    primarySource?: BoolFilter<"Immunisation"> | boolean
    notes?: StringNullableFilter<"Immunisation"> | string | null
    createdAt?: DateTimeFilter<"Immunisation"> | Date | string
    patient?: XOR<PatientRelationFilter, PatientWhereInput>
  }, "id">

  export type ImmunisationOrderByWithAggregationInput = {
    id?: SortOrder
    patientId?: SortOrder
    vaccineCode?: SortOrderInput | SortOrder
    vaccineName?: SortOrder
    status?: SortOrder
    occurrenceDate?: SortOrder
    lotNumber?: SortOrderInput | SortOrder
    site?: SortOrderInput | SortOrder
    route?: SortOrderInput | SortOrder
    administeredBy?: SortOrderInput | SortOrder
    primarySource?: SortOrder
    notes?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: ImmunisationCountOrderByAggregateInput
    _max?: ImmunisationMaxOrderByAggregateInput
    _min?: ImmunisationMinOrderByAggregateInput
  }

  export type ImmunisationScalarWhereWithAggregatesInput = {
    AND?: ImmunisationScalarWhereWithAggregatesInput | ImmunisationScalarWhereWithAggregatesInput[]
    OR?: ImmunisationScalarWhereWithAggregatesInput[]
    NOT?: ImmunisationScalarWhereWithAggregatesInput | ImmunisationScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Immunisation"> | string
    patientId?: StringWithAggregatesFilter<"Immunisation"> | string
    vaccineCode?: StringNullableWithAggregatesFilter<"Immunisation"> | string | null
    vaccineName?: StringWithAggregatesFilter<"Immunisation"> | string
    status?: StringWithAggregatesFilter<"Immunisation"> | string
    occurrenceDate?: DateTimeWithAggregatesFilter<"Immunisation"> | Date | string
    lotNumber?: StringNullableWithAggregatesFilter<"Immunisation"> | string | null
    site?: StringNullableWithAggregatesFilter<"Immunisation"> | string | null
    route?: StringNullableWithAggregatesFilter<"Immunisation"> | string | null
    administeredBy?: StringNullableWithAggregatesFilter<"Immunisation"> | string | null
    primarySource?: BoolWithAggregatesFilter<"Immunisation"> | boolean
    notes?: StringNullableWithAggregatesFilter<"Immunisation"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Immunisation"> | Date | string
  }

  export type EncounterWhereInput = {
    AND?: EncounterWhereInput | EncounterWhereInput[]
    OR?: EncounterWhereInput[]
    NOT?: EncounterWhereInput | EncounterWhereInput[]
    id?: StringFilter<"Encounter"> | string
    patientId?: StringFilter<"Encounter"> | string
    status?: StringFilter<"Encounter"> | string
    encounterClass?: StringFilter<"Encounter"> | string
    type?: StringNullableFilter<"Encounter"> | string | null
    reasonCode?: StringNullableFilter<"Encounter"> | string | null
    reasonDisplay?: StringNullableFilter<"Encounter"> | string | null
    startTime?: DateTimeNullableFilter<"Encounter"> | Date | string | null
    endTime?: DateTimeNullableFilter<"Encounter"> | Date | string | null
    providerId?: StringFilter<"Encounter"> | string
    locationId?: StringNullableFilter<"Encounter"> | string | null
    notes?: StringNullableFilter<"Encounter"> | string | null
    createdAt?: DateTimeFilter<"Encounter"> | Date | string
    updatedAt?: DateTimeFilter<"Encounter"> | Date | string
    patient?: XOR<PatientRelationFilter, PatientWhereInput>
    conditions?: ConditionListRelationFilter
    medications?: MedicationRequestListRelationFilter
    observations?: ObservationListRelationFilter
    documents?: ClinicalDocumentListRelationFilter
  }

  export type EncounterOrderByWithRelationInput = {
    id?: SortOrder
    patientId?: SortOrder
    status?: SortOrder
    encounterClass?: SortOrder
    type?: SortOrderInput | SortOrder
    reasonCode?: SortOrderInput | SortOrder
    reasonDisplay?: SortOrderInput | SortOrder
    startTime?: SortOrderInput | SortOrder
    endTime?: SortOrderInput | SortOrder
    providerId?: SortOrder
    locationId?: SortOrderInput | SortOrder
    notes?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    patient?: PatientOrderByWithRelationInput
    conditions?: ConditionOrderByRelationAggregateInput
    medications?: MedicationRequestOrderByRelationAggregateInput
    observations?: ObservationOrderByRelationAggregateInput
    documents?: ClinicalDocumentOrderByRelationAggregateInput
  }

  export type EncounterWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: EncounterWhereInput | EncounterWhereInput[]
    OR?: EncounterWhereInput[]
    NOT?: EncounterWhereInput | EncounterWhereInput[]
    patientId?: StringFilter<"Encounter"> | string
    status?: StringFilter<"Encounter"> | string
    encounterClass?: StringFilter<"Encounter"> | string
    type?: StringNullableFilter<"Encounter"> | string | null
    reasonCode?: StringNullableFilter<"Encounter"> | string | null
    reasonDisplay?: StringNullableFilter<"Encounter"> | string | null
    startTime?: DateTimeNullableFilter<"Encounter"> | Date | string | null
    endTime?: DateTimeNullableFilter<"Encounter"> | Date | string | null
    providerId?: StringFilter<"Encounter"> | string
    locationId?: StringNullableFilter<"Encounter"> | string | null
    notes?: StringNullableFilter<"Encounter"> | string | null
    createdAt?: DateTimeFilter<"Encounter"> | Date | string
    updatedAt?: DateTimeFilter<"Encounter"> | Date | string
    patient?: XOR<PatientRelationFilter, PatientWhereInput>
    conditions?: ConditionListRelationFilter
    medications?: MedicationRequestListRelationFilter
    observations?: ObservationListRelationFilter
    documents?: ClinicalDocumentListRelationFilter
  }, "id">

  export type EncounterOrderByWithAggregationInput = {
    id?: SortOrder
    patientId?: SortOrder
    status?: SortOrder
    encounterClass?: SortOrder
    type?: SortOrderInput | SortOrder
    reasonCode?: SortOrderInput | SortOrder
    reasonDisplay?: SortOrderInput | SortOrder
    startTime?: SortOrderInput | SortOrder
    endTime?: SortOrderInput | SortOrder
    providerId?: SortOrder
    locationId?: SortOrderInput | SortOrder
    notes?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: EncounterCountOrderByAggregateInput
    _max?: EncounterMaxOrderByAggregateInput
    _min?: EncounterMinOrderByAggregateInput
  }

  export type EncounterScalarWhereWithAggregatesInput = {
    AND?: EncounterScalarWhereWithAggregatesInput | EncounterScalarWhereWithAggregatesInput[]
    OR?: EncounterScalarWhereWithAggregatesInput[]
    NOT?: EncounterScalarWhereWithAggregatesInput | EncounterScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Encounter"> | string
    patientId?: StringWithAggregatesFilter<"Encounter"> | string
    status?: StringWithAggregatesFilter<"Encounter"> | string
    encounterClass?: StringWithAggregatesFilter<"Encounter"> | string
    type?: StringNullableWithAggregatesFilter<"Encounter"> | string | null
    reasonCode?: StringNullableWithAggregatesFilter<"Encounter"> | string | null
    reasonDisplay?: StringNullableWithAggregatesFilter<"Encounter"> | string | null
    startTime?: DateTimeNullableWithAggregatesFilter<"Encounter"> | Date | string | null
    endTime?: DateTimeNullableWithAggregatesFilter<"Encounter"> | Date | string | null
    providerId?: StringWithAggregatesFilter<"Encounter"> | string
    locationId?: StringNullableWithAggregatesFilter<"Encounter"> | string | null
    notes?: StringNullableWithAggregatesFilter<"Encounter"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Encounter"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Encounter"> | Date | string
  }

  export type AppointmentWhereInput = {
    AND?: AppointmentWhereInput | AppointmentWhereInput[]
    OR?: AppointmentWhereInput[]
    NOT?: AppointmentWhereInput | AppointmentWhereInput[]
    id?: StringFilter<"Appointment"> | string
    patientId?: StringFilter<"Appointment"> | string
    providerId?: StringFilter<"Appointment"> | string
    status?: StringFilter<"Appointment"> | string
    serviceType?: StringNullableFilter<"Appointment"> | string | null
    description?: StringNullableFilter<"Appointment"> | string | null
    startTime?: DateTimeFilter<"Appointment"> | Date | string
    endTime?: DateTimeFilter<"Appointment"> | Date | string
    durationMinutes?: IntFilter<"Appointment"> | number
    locationId?: StringNullableFilter<"Appointment"> | string | null
    notes?: StringNullableFilter<"Appointment"> | string | null
    createdAt?: DateTimeFilter<"Appointment"> | Date | string
    updatedAt?: DateTimeFilter<"Appointment"> | Date | string
    patient?: XOR<PatientRelationFilter, PatientWhereInput>
  }

  export type AppointmentOrderByWithRelationInput = {
    id?: SortOrder
    patientId?: SortOrder
    providerId?: SortOrder
    status?: SortOrder
    serviceType?: SortOrderInput | SortOrder
    description?: SortOrderInput | SortOrder
    startTime?: SortOrder
    endTime?: SortOrder
    durationMinutes?: SortOrder
    locationId?: SortOrderInput | SortOrder
    notes?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    patient?: PatientOrderByWithRelationInput
  }

  export type AppointmentWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: AppointmentWhereInput | AppointmentWhereInput[]
    OR?: AppointmentWhereInput[]
    NOT?: AppointmentWhereInput | AppointmentWhereInput[]
    patientId?: StringFilter<"Appointment"> | string
    providerId?: StringFilter<"Appointment"> | string
    status?: StringFilter<"Appointment"> | string
    serviceType?: StringNullableFilter<"Appointment"> | string | null
    description?: StringNullableFilter<"Appointment"> | string | null
    startTime?: DateTimeFilter<"Appointment"> | Date | string
    endTime?: DateTimeFilter<"Appointment"> | Date | string
    durationMinutes?: IntFilter<"Appointment"> | number
    locationId?: StringNullableFilter<"Appointment"> | string | null
    notes?: StringNullableFilter<"Appointment"> | string | null
    createdAt?: DateTimeFilter<"Appointment"> | Date | string
    updatedAt?: DateTimeFilter<"Appointment"> | Date | string
    patient?: XOR<PatientRelationFilter, PatientWhereInput>
  }, "id">

  export type AppointmentOrderByWithAggregationInput = {
    id?: SortOrder
    patientId?: SortOrder
    providerId?: SortOrder
    status?: SortOrder
    serviceType?: SortOrderInput | SortOrder
    description?: SortOrderInput | SortOrder
    startTime?: SortOrder
    endTime?: SortOrder
    durationMinutes?: SortOrder
    locationId?: SortOrderInput | SortOrder
    notes?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: AppointmentCountOrderByAggregateInput
    _avg?: AppointmentAvgOrderByAggregateInput
    _max?: AppointmentMaxOrderByAggregateInput
    _min?: AppointmentMinOrderByAggregateInput
    _sum?: AppointmentSumOrderByAggregateInput
  }

  export type AppointmentScalarWhereWithAggregatesInput = {
    AND?: AppointmentScalarWhereWithAggregatesInput | AppointmentScalarWhereWithAggregatesInput[]
    OR?: AppointmentScalarWhereWithAggregatesInput[]
    NOT?: AppointmentScalarWhereWithAggregatesInput | AppointmentScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Appointment"> | string
    patientId?: StringWithAggregatesFilter<"Appointment"> | string
    providerId?: StringWithAggregatesFilter<"Appointment"> | string
    status?: StringWithAggregatesFilter<"Appointment"> | string
    serviceType?: StringNullableWithAggregatesFilter<"Appointment"> | string | null
    description?: StringNullableWithAggregatesFilter<"Appointment"> | string | null
    startTime?: DateTimeWithAggregatesFilter<"Appointment"> | Date | string
    endTime?: DateTimeWithAggregatesFilter<"Appointment"> | Date | string
    durationMinutes?: IntWithAggregatesFilter<"Appointment"> | number
    locationId?: StringNullableWithAggregatesFilter<"Appointment"> | string | null
    notes?: StringNullableWithAggregatesFilter<"Appointment"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Appointment"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Appointment"> | Date | string
  }

  export type ClinicalDocumentWhereInput = {
    AND?: ClinicalDocumentWhereInput | ClinicalDocumentWhereInput[]
    OR?: ClinicalDocumentWhereInput[]
    NOT?: ClinicalDocumentWhereInput | ClinicalDocumentWhereInput[]
    id?: StringFilter<"ClinicalDocument"> | string
    patientId?: StringFilter<"ClinicalDocument"> | string
    encounterId?: StringNullableFilter<"ClinicalDocument"> | string | null
    type?: StringFilter<"ClinicalDocument"> | string
    title?: StringFilter<"ClinicalDocument"> | string
    content?: StringFilter<"ClinicalDocument"> | string
    status?: StringFilter<"ClinicalDocument"> | string
    authorId?: StringFilter<"ClinicalDocument"> | string
    authorName?: StringFilter<"ClinicalDocument"> | string
    signedAt?: DateTimeNullableFilter<"ClinicalDocument"> | Date | string | null
    createdAt?: DateTimeFilter<"ClinicalDocument"> | Date | string
    updatedAt?: DateTimeFilter<"ClinicalDocument"> | Date | string
    patient?: XOR<PatientRelationFilter, PatientWhereInput>
    encounter?: XOR<EncounterNullableRelationFilter, EncounterWhereInput> | null
  }

  export type ClinicalDocumentOrderByWithRelationInput = {
    id?: SortOrder
    patientId?: SortOrder
    encounterId?: SortOrderInput | SortOrder
    type?: SortOrder
    title?: SortOrder
    content?: SortOrder
    status?: SortOrder
    authorId?: SortOrder
    authorName?: SortOrder
    signedAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    patient?: PatientOrderByWithRelationInput
    encounter?: EncounterOrderByWithRelationInput
  }

  export type ClinicalDocumentWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ClinicalDocumentWhereInput | ClinicalDocumentWhereInput[]
    OR?: ClinicalDocumentWhereInput[]
    NOT?: ClinicalDocumentWhereInput | ClinicalDocumentWhereInput[]
    patientId?: StringFilter<"ClinicalDocument"> | string
    encounterId?: StringNullableFilter<"ClinicalDocument"> | string | null
    type?: StringFilter<"ClinicalDocument"> | string
    title?: StringFilter<"ClinicalDocument"> | string
    content?: StringFilter<"ClinicalDocument"> | string
    status?: StringFilter<"ClinicalDocument"> | string
    authorId?: StringFilter<"ClinicalDocument"> | string
    authorName?: StringFilter<"ClinicalDocument"> | string
    signedAt?: DateTimeNullableFilter<"ClinicalDocument"> | Date | string | null
    createdAt?: DateTimeFilter<"ClinicalDocument"> | Date | string
    updatedAt?: DateTimeFilter<"ClinicalDocument"> | Date | string
    patient?: XOR<PatientRelationFilter, PatientWhereInput>
    encounter?: XOR<EncounterNullableRelationFilter, EncounterWhereInput> | null
  }, "id">

  export type ClinicalDocumentOrderByWithAggregationInput = {
    id?: SortOrder
    patientId?: SortOrder
    encounterId?: SortOrderInput | SortOrder
    type?: SortOrder
    title?: SortOrder
    content?: SortOrder
    status?: SortOrder
    authorId?: SortOrder
    authorName?: SortOrder
    signedAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: ClinicalDocumentCountOrderByAggregateInput
    _max?: ClinicalDocumentMaxOrderByAggregateInput
    _min?: ClinicalDocumentMinOrderByAggregateInput
  }

  export type ClinicalDocumentScalarWhereWithAggregatesInput = {
    AND?: ClinicalDocumentScalarWhereWithAggregatesInput | ClinicalDocumentScalarWhereWithAggregatesInput[]
    OR?: ClinicalDocumentScalarWhereWithAggregatesInput[]
    NOT?: ClinicalDocumentScalarWhereWithAggregatesInput | ClinicalDocumentScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"ClinicalDocument"> | string
    patientId?: StringWithAggregatesFilter<"ClinicalDocument"> | string
    encounterId?: StringNullableWithAggregatesFilter<"ClinicalDocument"> | string | null
    type?: StringWithAggregatesFilter<"ClinicalDocument"> | string
    title?: StringWithAggregatesFilter<"ClinicalDocument"> | string
    content?: StringWithAggregatesFilter<"ClinicalDocument"> | string
    status?: StringWithAggregatesFilter<"ClinicalDocument"> | string
    authorId?: StringWithAggregatesFilter<"ClinicalDocument"> | string
    authorName?: StringWithAggregatesFilter<"ClinicalDocument"> | string
    signedAt?: DateTimeNullableWithAggregatesFilter<"ClinicalDocument"> | Date | string | null
    createdAt?: DateTimeWithAggregatesFilter<"ClinicalDocument"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"ClinicalDocument"> | Date | string
  }

  export type AuditLogWhereInput = {
    AND?: AuditLogWhereInput | AuditLogWhereInput[]
    OR?: AuditLogWhereInput[]
    NOT?: AuditLogWhereInput | AuditLogWhereInput[]
    id?: StringFilter<"AuditLog"> | string
    patientId?: StringNullableFilter<"AuditLog"> | string | null
    userId?: StringFilter<"AuditLog"> | string
    action?: StringFilter<"AuditLog"> | string
    resourceType?: StringFilter<"AuditLog"> | string
    resourceId?: StringNullableFilter<"AuditLog"> | string | null
    changes?: JsonNullableFilter<"AuditLog">
    ipAddress?: StringNullableFilter<"AuditLog"> | string | null
    correlationId?: StringNullableFilter<"AuditLog"> | string | null
    createdAt?: DateTimeFilter<"AuditLog"> | Date | string
    patient?: XOR<PatientNullableRelationFilter, PatientWhereInput> | null
  }

  export type AuditLogOrderByWithRelationInput = {
    id?: SortOrder
    patientId?: SortOrderInput | SortOrder
    userId?: SortOrder
    action?: SortOrder
    resourceType?: SortOrder
    resourceId?: SortOrderInput | SortOrder
    changes?: SortOrderInput | SortOrder
    ipAddress?: SortOrderInput | SortOrder
    correlationId?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    patient?: PatientOrderByWithRelationInput
  }

  export type AuditLogWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: AuditLogWhereInput | AuditLogWhereInput[]
    OR?: AuditLogWhereInput[]
    NOT?: AuditLogWhereInput | AuditLogWhereInput[]
    patientId?: StringNullableFilter<"AuditLog"> | string | null
    userId?: StringFilter<"AuditLog"> | string
    action?: StringFilter<"AuditLog"> | string
    resourceType?: StringFilter<"AuditLog"> | string
    resourceId?: StringNullableFilter<"AuditLog"> | string | null
    changes?: JsonNullableFilter<"AuditLog">
    ipAddress?: StringNullableFilter<"AuditLog"> | string | null
    correlationId?: StringNullableFilter<"AuditLog"> | string | null
    createdAt?: DateTimeFilter<"AuditLog"> | Date | string
    patient?: XOR<PatientNullableRelationFilter, PatientWhereInput> | null
  }, "id">

  export type AuditLogOrderByWithAggregationInput = {
    id?: SortOrder
    patientId?: SortOrderInput | SortOrder
    userId?: SortOrder
    action?: SortOrder
    resourceType?: SortOrder
    resourceId?: SortOrderInput | SortOrder
    changes?: SortOrderInput | SortOrder
    ipAddress?: SortOrderInput | SortOrder
    correlationId?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: AuditLogCountOrderByAggregateInput
    _max?: AuditLogMaxOrderByAggregateInput
    _min?: AuditLogMinOrderByAggregateInput
  }

  export type AuditLogScalarWhereWithAggregatesInput = {
    AND?: AuditLogScalarWhereWithAggregatesInput | AuditLogScalarWhereWithAggregatesInput[]
    OR?: AuditLogScalarWhereWithAggregatesInput[]
    NOT?: AuditLogScalarWhereWithAggregatesInput | AuditLogScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"AuditLog"> | string
    patientId?: StringNullableWithAggregatesFilter<"AuditLog"> | string | null
    userId?: StringWithAggregatesFilter<"AuditLog"> | string
    action?: StringWithAggregatesFilter<"AuditLog"> | string
    resourceType?: StringWithAggregatesFilter<"AuditLog"> | string
    resourceId?: StringNullableWithAggregatesFilter<"AuditLog"> | string | null
    changes?: JsonNullableWithAggregatesFilter<"AuditLog">
    ipAddress?: StringNullableWithAggregatesFilter<"AuditLog"> | string | null
    correlationId?: StringNullableWithAggregatesFilter<"AuditLog"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"AuditLog"> | Date | string
  }

  export type PatientCreateInput = {
    id?: string
    mrn: string
    firstName: string
    lastName: string
    preferredName?: string | null
    dateOfBirth: Date | string
    gender: string
    genderIdentity?: string | null
    phone?: string | null
    email?: string | null
    photoUrl?: string | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    address?: PatientAddressCreateNestedOneWithoutPatientInput
    emergencyContacts?: EmergencyContactCreateNestedManyWithoutPatientInput
    insurances?: PatientInsuranceCreateNestedManyWithoutPatientInput
    conditions?: ConditionCreateNestedManyWithoutPatientInput
    medications?: MedicationRequestCreateNestedManyWithoutPatientInput
    allergies?: AllergyIntoleranceCreateNestedManyWithoutPatientInput
    observations?: ObservationCreateNestedManyWithoutPatientInput
    immunisations?: ImmunisationCreateNestedManyWithoutPatientInput
    encounters?: EncounterCreateNestedManyWithoutPatientInput
    appointments?: AppointmentCreateNestedManyWithoutPatientInput
    documents?: ClinicalDocumentCreateNestedManyWithoutPatientInput
    auditLogs?: AuditLogCreateNestedManyWithoutPatientInput
  }

  export type PatientUncheckedCreateInput = {
    id?: string
    mrn: string
    firstName: string
    lastName: string
    preferredName?: string | null
    dateOfBirth: Date | string
    gender: string
    genderIdentity?: string | null
    phone?: string | null
    email?: string | null
    photoUrl?: string | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    address?: PatientAddressUncheckedCreateNestedOneWithoutPatientInput
    emergencyContacts?: EmergencyContactUncheckedCreateNestedManyWithoutPatientInput
    insurances?: PatientInsuranceUncheckedCreateNestedManyWithoutPatientInput
    conditions?: ConditionUncheckedCreateNestedManyWithoutPatientInput
    medications?: MedicationRequestUncheckedCreateNestedManyWithoutPatientInput
    allergies?: AllergyIntoleranceUncheckedCreateNestedManyWithoutPatientInput
    observations?: ObservationUncheckedCreateNestedManyWithoutPatientInput
    immunisations?: ImmunisationUncheckedCreateNestedManyWithoutPatientInput
    encounters?: EncounterUncheckedCreateNestedManyWithoutPatientInput
    appointments?: AppointmentUncheckedCreateNestedManyWithoutPatientInput
    documents?: ClinicalDocumentUncheckedCreateNestedManyWithoutPatientInput
    auditLogs?: AuditLogUncheckedCreateNestedManyWithoutPatientInput
  }

  export type PatientUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    mrn?: StringFieldUpdateOperationsInput | string
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    preferredName?: NullableStringFieldUpdateOperationsInput | string | null
    dateOfBirth?: DateTimeFieldUpdateOperationsInput | Date | string
    gender?: StringFieldUpdateOperationsInput | string
    genderIdentity?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    photoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    address?: PatientAddressUpdateOneWithoutPatientNestedInput
    emergencyContacts?: EmergencyContactUpdateManyWithoutPatientNestedInput
    insurances?: PatientInsuranceUpdateManyWithoutPatientNestedInput
    conditions?: ConditionUpdateManyWithoutPatientNestedInput
    medications?: MedicationRequestUpdateManyWithoutPatientNestedInput
    allergies?: AllergyIntoleranceUpdateManyWithoutPatientNestedInput
    observations?: ObservationUpdateManyWithoutPatientNestedInput
    immunisations?: ImmunisationUpdateManyWithoutPatientNestedInput
    encounters?: EncounterUpdateManyWithoutPatientNestedInput
    appointments?: AppointmentUpdateManyWithoutPatientNestedInput
    documents?: ClinicalDocumentUpdateManyWithoutPatientNestedInput
    auditLogs?: AuditLogUpdateManyWithoutPatientNestedInput
  }

  export type PatientUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    mrn?: StringFieldUpdateOperationsInput | string
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    preferredName?: NullableStringFieldUpdateOperationsInput | string | null
    dateOfBirth?: DateTimeFieldUpdateOperationsInput | Date | string
    gender?: StringFieldUpdateOperationsInput | string
    genderIdentity?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    photoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    address?: PatientAddressUncheckedUpdateOneWithoutPatientNestedInput
    emergencyContacts?: EmergencyContactUncheckedUpdateManyWithoutPatientNestedInput
    insurances?: PatientInsuranceUncheckedUpdateManyWithoutPatientNestedInput
    conditions?: ConditionUncheckedUpdateManyWithoutPatientNestedInput
    medications?: MedicationRequestUncheckedUpdateManyWithoutPatientNestedInput
    allergies?: AllergyIntoleranceUncheckedUpdateManyWithoutPatientNestedInput
    observations?: ObservationUncheckedUpdateManyWithoutPatientNestedInput
    immunisations?: ImmunisationUncheckedUpdateManyWithoutPatientNestedInput
    encounters?: EncounterUncheckedUpdateManyWithoutPatientNestedInput
    appointments?: AppointmentUncheckedUpdateManyWithoutPatientNestedInput
    documents?: ClinicalDocumentUncheckedUpdateManyWithoutPatientNestedInput
    auditLogs?: AuditLogUncheckedUpdateManyWithoutPatientNestedInput
  }

  export type PatientCreateManyInput = {
    id?: string
    mrn: string
    firstName: string
    lastName: string
    preferredName?: string | null
    dateOfBirth: Date | string
    gender: string
    genderIdentity?: string | null
    phone?: string | null
    email?: string | null
    photoUrl?: string | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PatientUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    mrn?: StringFieldUpdateOperationsInput | string
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    preferredName?: NullableStringFieldUpdateOperationsInput | string | null
    dateOfBirth?: DateTimeFieldUpdateOperationsInput | Date | string
    gender?: StringFieldUpdateOperationsInput | string
    genderIdentity?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    photoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PatientUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    mrn?: StringFieldUpdateOperationsInput | string
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    preferredName?: NullableStringFieldUpdateOperationsInput | string | null
    dateOfBirth?: DateTimeFieldUpdateOperationsInput | Date | string
    gender?: StringFieldUpdateOperationsInput | string
    genderIdentity?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    photoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PatientAddressCreateInput = {
    id?: string
    line1?: string | null
    line2?: string | null
    city?: string | null
    state?: string | null
    postalCode?: string | null
    country?: string
    patient: PatientCreateNestedOneWithoutAddressInput
  }

  export type PatientAddressUncheckedCreateInput = {
    id?: string
    patientId: string
    line1?: string | null
    line2?: string | null
    city?: string | null
    state?: string | null
    postalCode?: string | null
    country?: string
  }

  export type PatientAddressUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    line1?: NullableStringFieldUpdateOperationsInput | string | null
    line2?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    state?: NullableStringFieldUpdateOperationsInput | string | null
    postalCode?: NullableStringFieldUpdateOperationsInput | string | null
    country?: StringFieldUpdateOperationsInput | string
    patient?: PatientUpdateOneRequiredWithoutAddressNestedInput
  }

  export type PatientAddressUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    line1?: NullableStringFieldUpdateOperationsInput | string | null
    line2?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    state?: NullableStringFieldUpdateOperationsInput | string | null
    postalCode?: NullableStringFieldUpdateOperationsInput | string | null
    country?: StringFieldUpdateOperationsInput | string
  }

  export type PatientAddressCreateManyInput = {
    id?: string
    patientId: string
    line1?: string | null
    line2?: string | null
    city?: string | null
    state?: string | null
    postalCode?: string | null
    country?: string
  }

  export type PatientAddressUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    line1?: NullableStringFieldUpdateOperationsInput | string | null
    line2?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    state?: NullableStringFieldUpdateOperationsInput | string | null
    postalCode?: NullableStringFieldUpdateOperationsInput | string | null
    country?: StringFieldUpdateOperationsInput | string
  }

  export type PatientAddressUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    line1?: NullableStringFieldUpdateOperationsInput | string | null
    line2?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    state?: NullableStringFieldUpdateOperationsInput | string | null
    postalCode?: NullableStringFieldUpdateOperationsInput | string | null
    country?: StringFieldUpdateOperationsInput | string
  }

  export type EmergencyContactCreateInput = {
    id?: string
    name: string
    relationship: string
    phone: string
    patient: PatientCreateNestedOneWithoutEmergencyContactsInput
  }

  export type EmergencyContactUncheckedCreateInput = {
    id?: string
    patientId: string
    name: string
    relationship: string
    phone: string
  }

  export type EmergencyContactUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    relationship?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    patient?: PatientUpdateOneRequiredWithoutEmergencyContactsNestedInput
  }

  export type EmergencyContactUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    relationship?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
  }

  export type EmergencyContactCreateManyInput = {
    id?: string
    patientId: string
    name: string
    relationship: string
    phone: string
  }

  export type EmergencyContactUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    relationship?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
  }

  export type EmergencyContactUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    relationship?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
  }

  export type PatientInsuranceCreateInput = {
    id?: string
    priority?: number
    payerName: string
    memberId: string
    groupId?: string | null
    subscriberName?: string | null
    isActive?: boolean
    createdAt?: Date | string
    patient: PatientCreateNestedOneWithoutInsurancesInput
  }

  export type PatientInsuranceUncheckedCreateInput = {
    id?: string
    patientId: string
    priority?: number
    payerName: string
    memberId: string
    groupId?: string | null
    subscriberName?: string | null
    isActive?: boolean
    createdAt?: Date | string
  }

  export type PatientInsuranceUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    priority?: IntFieldUpdateOperationsInput | number
    payerName?: StringFieldUpdateOperationsInput | string
    memberId?: StringFieldUpdateOperationsInput | string
    groupId?: NullableStringFieldUpdateOperationsInput | string | null
    subscriberName?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    patient?: PatientUpdateOneRequiredWithoutInsurancesNestedInput
  }

  export type PatientInsuranceUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    priority?: IntFieldUpdateOperationsInput | number
    payerName?: StringFieldUpdateOperationsInput | string
    memberId?: StringFieldUpdateOperationsInput | string
    groupId?: NullableStringFieldUpdateOperationsInput | string | null
    subscriberName?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PatientInsuranceCreateManyInput = {
    id?: string
    patientId: string
    priority?: number
    payerName: string
    memberId: string
    groupId?: string | null
    subscriberName?: string | null
    isActive?: boolean
    createdAt?: Date | string
  }

  export type PatientInsuranceUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    priority?: IntFieldUpdateOperationsInput | number
    payerName?: StringFieldUpdateOperationsInput | string
    memberId?: StringFieldUpdateOperationsInput | string
    groupId?: NullableStringFieldUpdateOperationsInput | string | null
    subscriberName?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PatientInsuranceUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    priority?: IntFieldUpdateOperationsInput | number
    payerName?: StringFieldUpdateOperationsInput | string
    memberId?: StringFieldUpdateOperationsInput | string
    groupId?: NullableStringFieldUpdateOperationsInput | string | null
    subscriberName?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ConditionCreateInput = {
    id?: string
    snomedCode?: string | null
    icd10Code?: string | null
    display: string
    clinicalStatus?: string
    verificationStatus?: string
    severity?: string | null
    onsetDate?: Date | string | null
    resolvedDate?: Date | string | null
    recordedAt?: Date | string
    recordedBy: string
    patient: PatientCreateNestedOneWithoutConditionsInput
    encounter?: EncounterCreateNestedOneWithoutConditionsInput
  }

  export type ConditionUncheckedCreateInput = {
    id?: string
    patientId: string
    encounterId?: string | null
    snomedCode?: string | null
    icd10Code?: string | null
    display: string
    clinicalStatus?: string
    verificationStatus?: string
    severity?: string | null
    onsetDate?: Date | string | null
    resolvedDate?: Date | string | null
    recordedAt?: Date | string
    recordedBy: string
  }

  export type ConditionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    snomedCode?: NullableStringFieldUpdateOperationsInput | string | null
    icd10Code?: NullableStringFieldUpdateOperationsInput | string | null
    display?: StringFieldUpdateOperationsInput | string
    clinicalStatus?: StringFieldUpdateOperationsInput | string
    verificationStatus?: StringFieldUpdateOperationsInput | string
    severity?: NullableStringFieldUpdateOperationsInput | string | null
    onsetDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    resolvedDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    recordedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    recordedBy?: StringFieldUpdateOperationsInput | string
    patient?: PatientUpdateOneRequiredWithoutConditionsNestedInput
    encounter?: EncounterUpdateOneWithoutConditionsNestedInput
  }

  export type ConditionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    encounterId?: NullableStringFieldUpdateOperationsInput | string | null
    snomedCode?: NullableStringFieldUpdateOperationsInput | string | null
    icd10Code?: NullableStringFieldUpdateOperationsInput | string | null
    display?: StringFieldUpdateOperationsInput | string
    clinicalStatus?: StringFieldUpdateOperationsInput | string
    verificationStatus?: StringFieldUpdateOperationsInput | string
    severity?: NullableStringFieldUpdateOperationsInput | string | null
    onsetDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    resolvedDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    recordedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    recordedBy?: StringFieldUpdateOperationsInput | string
  }

  export type ConditionCreateManyInput = {
    id?: string
    patientId: string
    encounterId?: string | null
    snomedCode?: string | null
    icd10Code?: string | null
    display: string
    clinicalStatus?: string
    verificationStatus?: string
    severity?: string | null
    onsetDate?: Date | string | null
    resolvedDate?: Date | string | null
    recordedAt?: Date | string
    recordedBy: string
  }

  export type ConditionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    snomedCode?: NullableStringFieldUpdateOperationsInput | string | null
    icd10Code?: NullableStringFieldUpdateOperationsInput | string | null
    display?: StringFieldUpdateOperationsInput | string
    clinicalStatus?: StringFieldUpdateOperationsInput | string
    verificationStatus?: StringFieldUpdateOperationsInput | string
    severity?: NullableStringFieldUpdateOperationsInput | string | null
    onsetDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    resolvedDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    recordedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    recordedBy?: StringFieldUpdateOperationsInput | string
  }

  export type ConditionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    encounterId?: NullableStringFieldUpdateOperationsInput | string | null
    snomedCode?: NullableStringFieldUpdateOperationsInput | string | null
    icd10Code?: NullableStringFieldUpdateOperationsInput | string | null
    display?: StringFieldUpdateOperationsInput | string
    clinicalStatus?: StringFieldUpdateOperationsInput | string
    verificationStatus?: StringFieldUpdateOperationsInput | string
    severity?: NullableStringFieldUpdateOperationsInput | string | null
    onsetDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    resolvedDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    recordedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    recordedBy?: StringFieldUpdateOperationsInput | string
  }

  export type MedicationRequestCreateInput = {
    id?: string
    rxNormCode?: string | null
    medicationName: string
    dose?: string | null
    frequency?: string | null
    route?: string | null
    status?: string
    prescribedBy: string
    prescribedAt?: Date | string
    discontinuedAt?: Date | string | null
    discontinuedBy?: string | null
    notes?: string | null
    patient: PatientCreateNestedOneWithoutMedicationsInput
    encounter?: EncounterCreateNestedOneWithoutMedicationsInput
  }

  export type MedicationRequestUncheckedCreateInput = {
    id?: string
    patientId: string
    encounterId?: string | null
    rxNormCode?: string | null
    medicationName: string
    dose?: string | null
    frequency?: string | null
    route?: string | null
    status?: string
    prescribedBy: string
    prescribedAt?: Date | string
    discontinuedAt?: Date | string | null
    discontinuedBy?: string | null
    notes?: string | null
  }

  export type MedicationRequestUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    rxNormCode?: NullableStringFieldUpdateOperationsInput | string | null
    medicationName?: StringFieldUpdateOperationsInput | string
    dose?: NullableStringFieldUpdateOperationsInput | string | null
    frequency?: NullableStringFieldUpdateOperationsInput | string | null
    route?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    prescribedBy?: StringFieldUpdateOperationsInput | string
    prescribedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    discontinuedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    discontinuedBy?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    patient?: PatientUpdateOneRequiredWithoutMedicationsNestedInput
    encounter?: EncounterUpdateOneWithoutMedicationsNestedInput
  }

  export type MedicationRequestUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    encounterId?: NullableStringFieldUpdateOperationsInput | string | null
    rxNormCode?: NullableStringFieldUpdateOperationsInput | string | null
    medicationName?: StringFieldUpdateOperationsInput | string
    dose?: NullableStringFieldUpdateOperationsInput | string | null
    frequency?: NullableStringFieldUpdateOperationsInput | string | null
    route?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    prescribedBy?: StringFieldUpdateOperationsInput | string
    prescribedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    discontinuedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    discontinuedBy?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type MedicationRequestCreateManyInput = {
    id?: string
    patientId: string
    encounterId?: string | null
    rxNormCode?: string | null
    medicationName: string
    dose?: string | null
    frequency?: string | null
    route?: string | null
    status?: string
    prescribedBy: string
    prescribedAt?: Date | string
    discontinuedAt?: Date | string | null
    discontinuedBy?: string | null
    notes?: string | null
  }

  export type MedicationRequestUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    rxNormCode?: NullableStringFieldUpdateOperationsInput | string | null
    medicationName?: StringFieldUpdateOperationsInput | string
    dose?: NullableStringFieldUpdateOperationsInput | string | null
    frequency?: NullableStringFieldUpdateOperationsInput | string | null
    route?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    prescribedBy?: StringFieldUpdateOperationsInput | string
    prescribedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    discontinuedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    discontinuedBy?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type MedicationRequestUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    encounterId?: NullableStringFieldUpdateOperationsInput | string | null
    rxNormCode?: NullableStringFieldUpdateOperationsInput | string | null
    medicationName?: StringFieldUpdateOperationsInput | string
    dose?: NullableStringFieldUpdateOperationsInput | string | null
    frequency?: NullableStringFieldUpdateOperationsInput | string | null
    route?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    prescribedBy?: StringFieldUpdateOperationsInput | string
    prescribedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    discontinuedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    discontinuedBy?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type AllergyIntoleranceCreateInput = {
    id?: string
    substance: string
    substanceCode?: string | null
    type?: string
    criticality?: string | null
    clinicalStatus?: string
    reaction?: string | null
    reactionSeverity?: string | null
    onsetDate?: Date | string | null
    recordedAt?: Date | string
    recordedBy: string
    patient: PatientCreateNestedOneWithoutAllergiesInput
  }

  export type AllergyIntoleranceUncheckedCreateInput = {
    id?: string
    patientId: string
    substance: string
    substanceCode?: string | null
    type?: string
    criticality?: string | null
    clinicalStatus?: string
    reaction?: string | null
    reactionSeverity?: string | null
    onsetDate?: Date | string | null
    recordedAt?: Date | string
    recordedBy: string
  }

  export type AllergyIntoleranceUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    substance?: StringFieldUpdateOperationsInput | string
    substanceCode?: NullableStringFieldUpdateOperationsInput | string | null
    type?: StringFieldUpdateOperationsInput | string
    criticality?: NullableStringFieldUpdateOperationsInput | string | null
    clinicalStatus?: StringFieldUpdateOperationsInput | string
    reaction?: NullableStringFieldUpdateOperationsInput | string | null
    reactionSeverity?: NullableStringFieldUpdateOperationsInput | string | null
    onsetDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    recordedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    recordedBy?: StringFieldUpdateOperationsInput | string
    patient?: PatientUpdateOneRequiredWithoutAllergiesNestedInput
  }

  export type AllergyIntoleranceUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    substance?: StringFieldUpdateOperationsInput | string
    substanceCode?: NullableStringFieldUpdateOperationsInput | string | null
    type?: StringFieldUpdateOperationsInput | string
    criticality?: NullableStringFieldUpdateOperationsInput | string | null
    clinicalStatus?: StringFieldUpdateOperationsInput | string
    reaction?: NullableStringFieldUpdateOperationsInput | string | null
    reactionSeverity?: NullableStringFieldUpdateOperationsInput | string | null
    onsetDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    recordedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    recordedBy?: StringFieldUpdateOperationsInput | string
  }

  export type AllergyIntoleranceCreateManyInput = {
    id?: string
    patientId: string
    substance: string
    substanceCode?: string | null
    type?: string
    criticality?: string | null
    clinicalStatus?: string
    reaction?: string | null
    reactionSeverity?: string | null
    onsetDate?: Date | string | null
    recordedAt?: Date | string
    recordedBy: string
  }

  export type AllergyIntoleranceUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    substance?: StringFieldUpdateOperationsInput | string
    substanceCode?: NullableStringFieldUpdateOperationsInput | string | null
    type?: StringFieldUpdateOperationsInput | string
    criticality?: NullableStringFieldUpdateOperationsInput | string | null
    clinicalStatus?: StringFieldUpdateOperationsInput | string
    reaction?: NullableStringFieldUpdateOperationsInput | string | null
    reactionSeverity?: NullableStringFieldUpdateOperationsInput | string | null
    onsetDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    recordedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    recordedBy?: StringFieldUpdateOperationsInput | string
  }

  export type AllergyIntoleranceUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    substance?: StringFieldUpdateOperationsInput | string
    substanceCode?: NullableStringFieldUpdateOperationsInput | string | null
    type?: StringFieldUpdateOperationsInput | string
    criticality?: NullableStringFieldUpdateOperationsInput | string | null
    clinicalStatus?: StringFieldUpdateOperationsInput | string
    reaction?: NullableStringFieldUpdateOperationsInput | string | null
    reactionSeverity?: NullableStringFieldUpdateOperationsInput | string | null
    onsetDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    recordedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    recordedBy?: StringFieldUpdateOperationsInput | string
  }

  export type ObservationCreateInput = {
    id?: string
    category: string
    loincCode?: string | null
    display: string
    valueQuantity?: number | null
    valueUnit?: string | null
    valueString?: string | null
    referenceRangeLow?: number | null
    referenceRangeHigh?: number | null
    isAbnormal?: boolean
    status?: string
    effectiveAt: Date | string
    recordedBy: string
    patient: PatientCreateNestedOneWithoutObservationsInput
    encounter?: EncounterCreateNestedOneWithoutObservationsInput
  }

  export type ObservationUncheckedCreateInput = {
    id?: string
    patientId: string
    encounterId?: string | null
    category: string
    loincCode?: string | null
    display: string
    valueQuantity?: number | null
    valueUnit?: string | null
    valueString?: string | null
    referenceRangeLow?: number | null
    referenceRangeHigh?: number | null
    isAbnormal?: boolean
    status?: string
    effectiveAt: Date | string
    recordedBy: string
  }

  export type ObservationUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    loincCode?: NullableStringFieldUpdateOperationsInput | string | null
    display?: StringFieldUpdateOperationsInput | string
    valueQuantity?: NullableFloatFieldUpdateOperationsInput | number | null
    valueUnit?: NullableStringFieldUpdateOperationsInput | string | null
    valueString?: NullableStringFieldUpdateOperationsInput | string | null
    referenceRangeLow?: NullableFloatFieldUpdateOperationsInput | number | null
    referenceRangeHigh?: NullableFloatFieldUpdateOperationsInput | number | null
    isAbnormal?: BoolFieldUpdateOperationsInput | boolean
    status?: StringFieldUpdateOperationsInput | string
    effectiveAt?: DateTimeFieldUpdateOperationsInput | Date | string
    recordedBy?: StringFieldUpdateOperationsInput | string
    patient?: PatientUpdateOneRequiredWithoutObservationsNestedInput
    encounter?: EncounterUpdateOneWithoutObservationsNestedInput
  }

  export type ObservationUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    encounterId?: NullableStringFieldUpdateOperationsInput | string | null
    category?: StringFieldUpdateOperationsInput | string
    loincCode?: NullableStringFieldUpdateOperationsInput | string | null
    display?: StringFieldUpdateOperationsInput | string
    valueQuantity?: NullableFloatFieldUpdateOperationsInput | number | null
    valueUnit?: NullableStringFieldUpdateOperationsInput | string | null
    valueString?: NullableStringFieldUpdateOperationsInput | string | null
    referenceRangeLow?: NullableFloatFieldUpdateOperationsInput | number | null
    referenceRangeHigh?: NullableFloatFieldUpdateOperationsInput | number | null
    isAbnormal?: BoolFieldUpdateOperationsInput | boolean
    status?: StringFieldUpdateOperationsInput | string
    effectiveAt?: DateTimeFieldUpdateOperationsInput | Date | string
    recordedBy?: StringFieldUpdateOperationsInput | string
  }

  export type ObservationCreateManyInput = {
    id?: string
    patientId: string
    encounterId?: string | null
    category: string
    loincCode?: string | null
    display: string
    valueQuantity?: number | null
    valueUnit?: string | null
    valueString?: string | null
    referenceRangeLow?: number | null
    referenceRangeHigh?: number | null
    isAbnormal?: boolean
    status?: string
    effectiveAt: Date | string
    recordedBy: string
  }

  export type ObservationUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    loincCode?: NullableStringFieldUpdateOperationsInput | string | null
    display?: StringFieldUpdateOperationsInput | string
    valueQuantity?: NullableFloatFieldUpdateOperationsInput | number | null
    valueUnit?: NullableStringFieldUpdateOperationsInput | string | null
    valueString?: NullableStringFieldUpdateOperationsInput | string | null
    referenceRangeLow?: NullableFloatFieldUpdateOperationsInput | number | null
    referenceRangeHigh?: NullableFloatFieldUpdateOperationsInput | number | null
    isAbnormal?: BoolFieldUpdateOperationsInput | boolean
    status?: StringFieldUpdateOperationsInput | string
    effectiveAt?: DateTimeFieldUpdateOperationsInput | Date | string
    recordedBy?: StringFieldUpdateOperationsInput | string
  }

  export type ObservationUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    encounterId?: NullableStringFieldUpdateOperationsInput | string | null
    category?: StringFieldUpdateOperationsInput | string
    loincCode?: NullableStringFieldUpdateOperationsInput | string | null
    display?: StringFieldUpdateOperationsInput | string
    valueQuantity?: NullableFloatFieldUpdateOperationsInput | number | null
    valueUnit?: NullableStringFieldUpdateOperationsInput | string | null
    valueString?: NullableStringFieldUpdateOperationsInput | string | null
    referenceRangeLow?: NullableFloatFieldUpdateOperationsInput | number | null
    referenceRangeHigh?: NullableFloatFieldUpdateOperationsInput | number | null
    isAbnormal?: BoolFieldUpdateOperationsInput | boolean
    status?: StringFieldUpdateOperationsInput | string
    effectiveAt?: DateTimeFieldUpdateOperationsInput | Date | string
    recordedBy?: StringFieldUpdateOperationsInput | string
  }

  export type ImmunisationCreateInput = {
    id?: string
    vaccineCode?: string | null
    vaccineName: string
    status?: string
    occurrenceDate: Date | string
    lotNumber?: string | null
    site?: string | null
    route?: string | null
    administeredBy?: string | null
    primarySource?: boolean
    notes?: string | null
    createdAt?: Date | string
    patient: PatientCreateNestedOneWithoutImmunisationsInput
  }

  export type ImmunisationUncheckedCreateInput = {
    id?: string
    patientId: string
    vaccineCode?: string | null
    vaccineName: string
    status?: string
    occurrenceDate: Date | string
    lotNumber?: string | null
    site?: string | null
    route?: string | null
    administeredBy?: string | null
    primarySource?: boolean
    notes?: string | null
    createdAt?: Date | string
  }

  export type ImmunisationUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    vaccineCode?: NullableStringFieldUpdateOperationsInput | string | null
    vaccineName?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    occurrenceDate?: DateTimeFieldUpdateOperationsInput | Date | string
    lotNumber?: NullableStringFieldUpdateOperationsInput | string | null
    site?: NullableStringFieldUpdateOperationsInput | string | null
    route?: NullableStringFieldUpdateOperationsInput | string | null
    administeredBy?: NullableStringFieldUpdateOperationsInput | string | null
    primarySource?: BoolFieldUpdateOperationsInput | boolean
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    patient?: PatientUpdateOneRequiredWithoutImmunisationsNestedInput
  }

  export type ImmunisationUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    vaccineCode?: NullableStringFieldUpdateOperationsInput | string | null
    vaccineName?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    occurrenceDate?: DateTimeFieldUpdateOperationsInput | Date | string
    lotNumber?: NullableStringFieldUpdateOperationsInput | string | null
    site?: NullableStringFieldUpdateOperationsInput | string | null
    route?: NullableStringFieldUpdateOperationsInput | string | null
    administeredBy?: NullableStringFieldUpdateOperationsInput | string | null
    primarySource?: BoolFieldUpdateOperationsInput | boolean
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ImmunisationCreateManyInput = {
    id?: string
    patientId: string
    vaccineCode?: string | null
    vaccineName: string
    status?: string
    occurrenceDate: Date | string
    lotNumber?: string | null
    site?: string | null
    route?: string | null
    administeredBy?: string | null
    primarySource?: boolean
    notes?: string | null
    createdAt?: Date | string
  }

  export type ImmunisationUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    vaccineCode?: NullableStringFieldUpdateOperationsInput | string | null
    vaccineName?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    occurrenceDate?: DateTimeFieldUpdateOperationsInput | Date | string
    lotNumber?: NullableStringFieldUpdateOperationsInput | string | null
    site?: NullableStringFieldUpdateOperationsInput | string | null
    route?: NullableStringFieldUpdateOperationsInput | string | null
    administeredBy?: NullableStringFieldUpdateOperationsInput | string | null
    primarySource?: BoolFieldUpdateOperationsInput | boolean
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ImmunisationUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    vaccineCode?: NullableStringFieldUpdateOperationsInput | string | null
    vaccineName?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    occurrenceDate?: DateTimeFieldUpdateOperationsInput | Date | string
    lotNumber?: NullableStringFieldUpdateOperationsInput | string | null
    site?: NullableStringFieldUpdateOperationsInput | string | null
    route?: NullableStringFieldUpdateOperationsInput | string | null
    administeredBy?: NullableStringFieldUpdateOperationsInput | string | null
    primarySource?: BoolFieldUpdateOperationsInput | boolean
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EncounterCreateInput = {
    id?: string
    status?: string
    encounterClass?: string
    type?: string | null
    reasonCode?: string | null
    reasonDisplay?: string | null
    startTime?: Date | string | null
    endTime?: Date | string | null
    providerId: string
    locationId?: string | null
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    patient: PatientCreateNestedOneWithoutEncountersInput
    conditions?: ConditionCreateNestedManyWithoutEncounterInput
    medications?: MedicationRequestCreateNestedManyWithoutEncounterInput
    observations?: ObservationCreateNestedManyWithoutEncounterInput
    documents?: ClinicalDocumentCreateNestedManyWithoutEncounterInput
  }

  export type EncounterUncheckedCreateInput = {
    id?: string
    patientId: string
    status?: string
    encounterClass?: string
    type?: string | null
    reasonCode?: string | null
    reasonDisplay?: string | null
    startTime?: Date | string | null
    endTime?: Date | string | null
    providerId: string
    locationId?: string | null
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    conditions?: ConditionUncheckedCreateNestedManyWithoutEncounterInput
    medications?: MedicationRequestUncheckedCreateNestedManyWithoutEncounterInput
    observations?: ObservationUncheckedCreateNestedManyWithoutEncounterInput
    documents?: ClinicalDocumentUncheckedCreateNestedManyWithoutEncounterInput
  }

  export type EncounterUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    encounterClass?: StringFieldUpdateOperationsInput | string
    type?: NullableStringFieldUpdateOperationsInput | string | null
    reasonCode?: NullableStringFieldUpdateOperationsInput | string | null
    reasonDisplay?: NullableStringFieldUpdateOperationsInput | string | null
    startTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    providerId?: StringFieldUpdateOperationsInput | string
    locationId?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    patient?: PatientUpdateOneRequiredWithoutEncountersNestedInput
    conditions?: ConditionUpdateManyWithoutEncounterNestedInput
    medications?: MedicationRequestUpdateManyWithoutEncounterNestedInput
    observations?: ObservationUpdateManyWithoutEncounterNestedInput
    documents?: ClinicalDocumentUpdateManyWithoutEncounterNestedInput
  }

  export type EncounterUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    encounterClass?: StringFieldUpdateOperationsInput | string
    type?: NullableStringFieldUpdateOperationsInput | string | null
    reasonCode?: NullableStringFieldUpdateOperationsInput | string | null
    reasonDisplay?: NullableStringFieldUpdateOperationsInput | string | null
    startTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    providerId?: StringFieldUpdateOperationsInput | string
    locationId?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    conditions?: ConditionUncheckedUpdateManyWithoutEncounterNestedInput
    medications?: MedicationRequestUncheckedUpdateManyWithoutEncounterNestedInput
    observations?: ObservationUncheckedUpdateManyWithoutEncounterNestedInput
    documents?: ClinicalDocumentUncheckedUpdateManyWithoutEncounterNestedInput
  }

  export type EncounterCreateManyInput = {
    id?: string
    patientId: string
    status?: string
    encounterClass?: string
    type?: string | null
    reasonCode?: string | null
    reasonDisplay?: string | null
    startTime?: Date | string | null
    endTime?: Date | string | null
    providerId: string
    locationId?: string | null
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type EncounterUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    encounterClass?: StringFieldUpdateOperationsInput | string
    type?: NullableStringFieldUpdateOperationsInput | string | null
    reasonCode?: NullableStringFieldUpdateOperationsInput | string | null
    reasonDisplay?: NullableStringFieldUpdateOperationsInput | string | null
    startTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    providerId?: StringFieldUpdateOperationsInput | string
    locationId?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EncounterUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    encounterClass?: StringFieldUpdateOperationsInput | string
    type?: NullableStringFieldUpdateOperationsInput | string | null
    reasonCode?: NullableStringFieldUpdateOperationsInput | string | null
    reasonDisplay?: NullableStringFieldUpdateOperationsInput | string | null
    startTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    providerId?: StringFieldUpdateOperationsInput | string
    locationId?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AppointmentCreateInput = {
    id?: string
    providerId: string
    status?: string
    serviceType?: string | null
    description?: string | null
    startTime: Date | string
    endTime: Date | string
    durationMinutes?: number
    locationId?: string | null
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    patient: PatientCreateNestedOneWithoutAppointmentsInput
  }

  export type AppointmentUncheckedCreateInput = {
    id?: string
    patientId: string
    providerId: string
    status?: string
    serviceType?: string | null
    description?: string | null
    startTime: Date | string
    endTime: Date | string
    durationMinutes?: number
    locationId?: string | null
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AppointmentUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    providerId?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    serviceType?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    startTime?: DateTimeFieldUpdateOperationsInput | Date | string
    endTime?: DateTimeFieldUpdateOperationsInput | Date | string
    durationMinutes?: IntFieldUpdateOperationsInput | number
    locationId?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    patient?: PatientUpdateOneRequiredWithoutAppointmentsNestedInput
  }

  export type AppointmentUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    providerId?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    serviceType?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    startTime?: DateTimeFieldUpdateOperationsInput | Date | string
    endTime?: DateTimeFieldUpdateOperationsInput | Date | string
    durationMinutes?: IntFieldUpdateOperationsInput | number
    locationId?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AppointmentCreateManyInput = {
    id?: string
    patientId: string
    providerId: string
    status?: string
    serviceType?: string | null
    description?: string | null
    startTime: Date | string
    endTime: Date | string
    durationMinutes?: number
    locationId?: string | null
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AppointmentUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    providerId?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    serviceType?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    startTime?: DateTimeFieldUpdateOperationsInput | Date | string
    endTime?: DateTimeFieldUpdateOperationsInput | Date | string
    durationMinutes?: IntFieldUpdateOperationsInput | number
    locationId?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AppointmentUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    providerId?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    serviceType?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    startTime?: DateTimeFieldUpdateOperationsInput | Date | string
    endTime?: DateTimeFieldUpdateOperationsInput | Date | string
    durationMinutes?: IntFieldUpdateOperationsInput | number
    locationId?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ClinicalDocumentCreateInput = {
    id?: string
    type: string
    title: string
    content: string
    status?: string
    authorId: string
    authorName: string
    signedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    patient: PatientCreateNestedOneWithoutDocumentsInput
    encounter?: EncounterCreateNestedOneWithoutDocumentsInput
  }

  export type ClinicalDocumentUncheckedCreateInput = {
    id?: string
    patientId: string
    encounterId?: string | null
    type: string
    title: string
    content: string
    status?: string
    authorId: string
    authorName: string
    signedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ClinicalDocumentUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    authorId?: StringFieldUpdateOperationsInput | string
    authorName?: StringFieldUpdateOperationsInput | string
    signedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    patient?: PatientUpdateOneRequiredWithoutDocumentsNestedInput
    encounter?: EncounterUpdateOneWithoutDocumentsNestedInput
  }

  export type ClinicalDocumentUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    encounterId?: NullableStringFieldUpdateOperationsInput | string | null
    type?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    authorId?: StringFieldUpdateOperationsInput | string
    authorName?: StringFieldUpdateOperationsInput | string
    signedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ClinicalDocumentCreateManyInput = {
    id?: string
    patientId: string
    encounterId?: string | null
    type: string
    title: string
    content: string
    status?: string
    authorId: string
    authorName: string
    signedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ClinicalDocumentUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    authorId?: StringFieldUpdateOperationsInput | string
    authorName?: StringFieldUpdateOperationsInput | string
    signedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ClinicalDocumentUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    encounterId?: NullableStringFieldUpdateOperationsInput | string | null
    type?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    authorId?: StringFieldUpdateOperationsInput | string
    authorName?: StringFieldUpdateOperationsInput | string
    signedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AuditLogCreateInput = {
    id?: string
    userId: string
    action: string
    resourceType: string
    resourceId?: string | null
    changes?: NullableJsonNullValueInput | InputJsonValue
    ipAddress?: string | null
    correlationId?: string | null
    createdAt?: Date | string
    patient?: PatientCreateNestedOneWithoutAuditLogsInput
  }

  export type AuditLogUncheckedCreateInput = {
    id?: string
    patientId?: string | null
    userId: string
    action: string
    resourceType: string
    resourceId?: string | null
    changes?: NullableJsonNullValueInput | InputJsonValue
    ipAddress?: string | null
    correlationId?: string | null
    createdAt?: Date | string
  }

  export type AuditLogUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    resourceType?: StringFieldUpdateOperationsInput | string
    resourceId?: NullableStringFieldUpdateOperationsInput | string | null
    changes?: NullableJsonNullValueInput | InputJsonValue
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    correlationId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    patient?: PatientUpdateOneWithoutAuditLogsNestedInput
  }

  export type AuditLogUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    patientId?: NullableStringFieldUpdateOperationsInput | string | null
    userId?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    resourceType?: StringFieldUpdateOperationsInput | string
    resourceId?: NullableStringFieldUpdateOperationsInput | string | null
    changes?: NullableJsonNullValueInput | InputJsonValue
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    correlationId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AuditLogCreateManyInput = {
    id?: string
    patientId?: string | null
    userId: string
    action: string
    resourceType: string
    resourceId?: string | null
    changes?: NullableJsonNullValueInput | InputJsonValue
    ipAddress?: string | null
    correlationId?: string | null
    createdAt?: Date | string
  }

  export type AuditLogUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    resourceType?: StringFieldUpdateOperationsInput | string
    resourceId?: NullableStringFieldUpdateOperationsInput | string | null
    changes?: NullableJsonNullValueInput | InputJsonValue
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    correlationId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AuditLogUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    patientId?: NullableStringFieldUpdateOperationsInput | string | null
    userId?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    resourceType?: StringFieldUpdateOperationsInput | string
    resourceId?: NullableStringFieldUpdateOperationsInput | string | null
    changes?: NullableJsonNullValueInput | InputJsonValue
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    correlationId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type PatientAddressNullableRelationFilter = {
    is?: PatientAddressWhereInput | null
    isNot?: PatientAddressWhereInput | null
  }

  export type EmergencyContactListRelationFilter = {
    every?: EmergencyContactWhereInput
    some?: EmergencyContactWhereInput
    none?: EmergencyContactWhereInput
  }

  export type PatientInsuranceListRelationFilter = {
    every?: PatientInsuranceWhereInput
    some?: PatientInsuranceWhereInput
    none?: PatientInsuranceWhereInput
  }

  export type ConditionListRelationFilter = {
    every?: ConditionWhereInput
    some?: ConditionWhereInput
    none?: ConditionWhereInput
  }

  export type MedicationRequestListRelationFilter = {
    every?: MedicationRequestWhereInput
    some?: MedicationRequestWhereInput
    none?: MedicationRequestWhereInput
  }

  export type AllergyIntoleranceListRelationFilter = {
    every?: AllergyIntoleranceWhereInput
    some?: AllergyIntoleranceWhereInput
    none?: AllergyIntoleranceWhereInput
  }

  export type ObservationListRelationFilter = {
    every?: ObservationWhereInput
    some?: ObservationWhereInput
    none?: ObservationWhereInput
  }

  export type ImmunisationListRelationFilter = {
    every?: ImmunisationWhereInput
    some?: ImmunisationWhereInput
    none?: ImmunisationWhereInput
  }

  export type EncounterListRelationFilter = {
    every?: EncounterWhereInput
    some?: EncounterWhereInput
    none?: EncounterWhereInput
  }

  export type AppointmentListRelationFilter = {
    every?: AppointmentWhereInput
    some?: AppointmentWhereInput
    none?: AppointmentWhereInput
  }

  export type ClinicalDocumentListRelationFilter = {
    every?: ClinicalDocumentWhereInput
    some?: ClinicalDocumentWhereInput
    none?: ClinicalDocumentWhereInput
  }

  export type AuditLogListRelationFilter = {
    every?: AuditLogWhereInput
    some?: AuditLogWhereInput
    none?: AuditLogWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type EmergencyContactOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type PatientInsuranceOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ConditionOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type MedicationRequestOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type AllergyIntoleranceOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ObservationOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ImmunisationOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type EncounterOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type AppointmentOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ClinicalDocumentOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type AuditLogOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type PatientCountOrderByAggregateInput = {
    id?: SortOrder
    mrn?: SortOrder
    firstName?: SortOrder
    lastName?: SortOrder
    preferredName?: SortOrder
    dateOfBirth?: SortOrder
    gender?: SortOrder
    genderIdentity?: SortOrder
    phone?: SortOrder
    email?: SortOrder
    photoUrl?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PatientMaxOrderByAggregateInput = {
    id?: SortOrder
    mrn?: SortOrder
    firstName?: SortOrder
    lastName?: SortOrder
    preferredName?: SortOrder
    dateOfBirth?: SortOrder
    gender?: SortOrder
    genderIdentity?: SortOrder
    phone?: SortOrder
    email?: SortOrder
    photoUrl?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PatientMinOrderByAggregateInput = {
    id?: SortOrder
    mrn?: SortOrder
    firstName?: SortOrder
    lastName?: SortOrder
    preferredName?: SortOrder
    dateOfBirth?: SortOrder
    gender?: SortOrder
    genderIdentity?: SortOrder
    phone?: SortOrder
    email?: SortOrder
    photoUrl?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type PatientRelationFilter = {
    is?: PatientWhereInput
    isNot?: PatientWhereInput
  }

  export type PatientAddressCountOrderByAggregateInput = {
    id?: SortOrder
    patientId?: SortOrder
    line1?: SortOrder
    line2?: SortOrder
    city?: SortOrder
    state?: SortOrder
    postalCode?: SortOrder
    country?: SortOrder
  }

  export type PatientAddressMaxOrderByAggregateInput = {
    id?: SortOrder
    patientId?: SortOrder
    line1?: SortOrder
    line2?: SortOrder
    city?: SortOrder
    state?: SortOrder
    postalCode?: SortOrder
    country?: SortOrder
  }

  export type PatientAddressMinOrderByAggregateInput = {
    id?: SortOrder
    patientId?: SortOrder
    line1?: SortOrder
    line2?: SortOrder
    city?: SortOrder
    state?: SortOrder
    postalCode?: SortOrder
    country?: SortOrder
  }

  export type EmergencyContactCountOrderByAggregateInput = {
    id?: SortOrder
    patientId?: SortOrder
    name?: SortOrder
    relationship?: SortOrder
    phone?: SortOrder
  }

  export type EmergencyContactMaxOrderByAggregateInput = {
    id?: SortOrder
    patientId?: SortOrder
    name?: SortOrder
    relationship?: SortOrder
    phone?: SortOrder
  }

  export type EmergencyContactMinOrderByAggregateInput = {
    id?: SortOrder
    patientId?: SortOrder
    name?: SortOrder
    relationship?: SortOrder
    phone?: SortOrder
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type PatientInsuranceCountOrderByAggregateInput = {
    id?: SortOrder
    patientId?: SortOrder
    priority?: SortOrder
    payerName?: SortOrder
    memberId?: SortOrder
    groupId?: SortOrder
    subscriberName?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
  }

  export type PatientInsuranceAvgOrderByAggregateInput = {
    priority?: SortOrder
  }

  export type PatientInsuranceMaxOrderByAggregateInput = {
    id?: SortOrder
    patientId?: SortOrder
    priority?: SortOrder
    payerName?: SortOrder
    memberId?: SortOrder
    groupId?: SortOrder
    subscriberName?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
  }

  export type PatientInsuranceMinOrderByAggregateInput = {
    id?: SortOrder
    patientId?: SortOrder
    priority?: SortOrder
    payerName?: SortOrder
    memberId?: SortOrder
    groupId?: SortOrder
    subscriberName?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
  }

  export type PatientInsuranceSumOrderByAggregateInput = {
    priority?: SortOrder
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type EncounterNullableRelationFilter = {
    is?: EncounterWhereInput | null
    isNot?: EncounterWhereInput | null
  }

  export type ConditionCountOrderByAggregateInput = {
    id?: SortOrder
    patientId?: SortOrder
    encounterId?: SortOrder
    snomedCode?: SortOrder
    icd10Code?: SortOrder
    display?: SortOrder
    clinicalStatus?: SortOrder
    verificationStatus?: SortOrder
    severity?: SortOrder
    onsetDate?: SortOrder
    resolvedDate?: SortOrder
    recordedAt?: SortOrder
    recordedBy?: SortOrder
  }

  export type ConditionMaxOrderByAggregateInput = {
    id?: SortOrder
    patientId?: SortOrder
    encounterId?: SortOrder
    snomedCode?: SortOrder
    icd10Code?: SortOrder
    display?: SortOrder
    clinicalStatus?: SortOrder
    verificationStatus?: SortOrder
    severity?: SortOrder
    onsetDate?: SortOrder
    resolvedDate?: SortOrder
    recordedAt?: SortOrder
    recordedBy?: SortOrder
  }

  export type ConditionMinOrderByAggregateInput = {
    id?: SortOrder
    patientId?: SortOrder
    encounterId?: SortOrder
    snomedCode?: SortOrder
    icd10Code?: SortOrder
    display?: SortOrder
    clinicalStatus?: SortOrder
    verificationStatus?: SortOrder
    severity?: SortOrder
    onsetDate?: SortOrder
    resolvedDate?: SortOrder
    recordedAt?: SortOrder
    recordedBy?: SortOrder
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type MedicationRequestCountOrderByAggregateInput = {
    id?: SortOrder
    patientId?: SortOrder
    encounterId?: SortOrder
    rxNormCode?: SortOrder
    medicationName?: SortOrder
    dose?: SortOrder
    frequency?: SortOrder
    route?: SortOrder
    status?: SortOrder
    prescribedBy?: SortOrder
    prescribedAt?: SortOrder
    discontinuedAt?: SortOrder
    discontinuedBy?: SortOrder
    notes?: SortOrder
  }

  export type MedicationRequestMaxOrderByAggregateInput = {
    id?: SortOrder
    patientId?: SortOrder
    encounterId?: SortOrder
    rxNormCode?: SortOrder
    medicationName?: SortOrder
    dose?: SortOrder
    frequency?: SortOrder
    route?: SortOrder
    status?: SortOrder
    prescribedBy?: SortOrder
    prescribedAt?: SortOrder
    discontinuedAt?: SortOrder
    discontinuedBy?: SortOrder
    notes?: SortOrder
  }

  export type MedicationRequestMinOrderByAggregateInput = {
    id?: SortOrder
    patientId?: SortOrder
    encounterId?: SortOrder
    rxNormCode?: SortOrder
    medicationName?: SortOrder
    dose?: SortOrder
    frequency?: SortOrder
    route?: SortOrder
    status?: SortOrder
    prescribedBy?: SortOrder
    prescribedAt?: SortOrder
    discontinuedAt?: SortOrder
    discontinuedBy?: SortOrder
    notes?: SortOrder
  }

  export type AllergyIntoleranceCountOrderByAggregateInput = {
    id?: SortOrder
    patientId?: SortOrder
    substance?: SortOrder
    substanceCode?: SortOrder
    type?: SortOrder
    criticality?: SortOrder
    clinicalStatus?: SortOrder
    reaction?: SortOrder
    reactionSeverity?: SortOrder
    onsetDate?: SortOrder
    recordedAt?: SortOrder
    recordedBy?: SortOrder
  }

  export type AllergyIntoleranceMaxOrderByAggregateInput = {
    id?: SortOrder
    patientId?: SortOrder
    substance?: SortOrder
    substanceCode?: SortOrder
    type?: SortOrder
    criticality?: SortOrder
    clinicalStatus?: SortOrder
    reaction?: SortOrder
    reactionSeverity?: SortOrder
    onsetDate?: SortOrder
    recordedAt?: SortOrder
    recordedBy?: SortOrder
  }

  export type AllergyIntoleranceMinOrderByAggregateInput = {
    id?: SortOrder
    patientId?: SortOrder
    substance?: SortOrder
    substanceCode?: SortOrder
    type?: SortOrder
    criticality?: SortOrder
    clinicalStatus?: SortOrder
    reaction?: SortOrder
    reactionSeverity?: SortOrder
    onsetDate?: SortOrder
    recordedAt?: SortOrder
    recordedBy?: SortOrder
  }

  export type FloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type ObservationCountOrderByAggregateInput = {
    id?: SortOrder
    patientId?: SortOrder
    encounterId?: SortOrder
    category?: SortOrder
    loincCode?: SortOrder
    display?: SortOrder
    valueQuantity?: SortOrder
    valueUnit?: SortOrder
    valueString?: SortOrder
    referenceRangeLow?: SortOrder
    referenceRangeHigh?: SortOrder
    isAbnormal?: SortOrder
    status?: SortOrder
    effectiveAt?: SortOrder
    recordedBy?: SortOrder
  }

  export type ObservationAvgOrderByAggregateInput = {
    valueQuantity?: SortOrder
    referenceRangeLow?: SortOrder
    referenceRangeHigh?: SortOrder
  }

  export type ObservationMaxOrderByAggregateInput = {
    id?: SortOrder
    patientId?: SortOrder
    encounterId?: SortOrder
    category?: SortOrder
    loincCode?: SortOrder
    display?: SortOrder
    valueQuantity?: SortOrder
    valueUnit?: SortOrder
    valueString?: SortOrder
    referenceRangeLow?: SortOrder
    referenceRangeHigh?: SortOrder
    isAbnormal?: SortOrder
    status?: SortOrder
    effectiveAt?: SortOrder
    recordedBy?: SortOrder
  }

  export type ObservationMinOrderByAggregateInput = {
    id?: SortOrder
    patientId?: SortOrder
    encounterId?: SortOrder
    category?: SortOrder
    loincCode?: SortOrder
    display?: SortOrder
    valueQuantity?: SortOrder
    valueUnit?: SortOrder
    valueString?: SortOrder
    referenceRangeLow?: SortOrder
    referenceRangeHigh?: SortOrder
    isAbnormal?: SortOrder
    status?: SortOrder
    effectiveAt?: SortOrder
    recordedBy?: SortOrder
  }

  export type ObservationSumOrderByAggregateInput = {
    valueQuantity?: SortOrder
    referenceRangeLow?: SortOrder
    referenceRangeHigh?: SortOrder
  }

  export type FloatNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedFloatNullableFilter<$PrismaModel>
    _min?: NestedFloatNullableFilter<$PrismaModel>
    _max?: NestedFloatNullableFilter<$PrismaModel>
  }

  export type ImmunisationCountOrderByAggregateInput = {
    id?: SortOrder
    patientId?: SortOrder
    vaccineCode?: SortOrder
    vaccineName?: SortOrder
    status?: SortOrder
    occurrenceDate?: SortOrder
    lotNumber?: SortOrder
    site?: SortOrder
    route?: SortOrder
    administeredBy?: SortOrder
    primarySource?: SortOrder
    notes?: SortOrder
    createdAt?: SortOrder
  }

  export type ImmunisationMaxOrderByAggregateInput = {
    id?: SortOrder
    patientId?: SortOrder
    vaccineCode?: SortOrder
    vaccineName?: SortOrder
    status?: SortOrder
    occurrenceDate?: SortOrder
    lotNumber?: SortOrder
    site?: SortOrder
    route?: SortOrder
    administeredBy?: SortOrder
    primarySource?: SortOrder
    notes?: SortOrder
    createdAt?: SortOrder
  }

  export type ImmunisationMinOrderByAggregateInput = {
    id?: SortOrder
    patientId?: SortOrder
    vaccineCode?: SortOrder
    vaccineName?: SortOrder
    status?: SortOrder
    occurrenceDate?: SortOrder
    lotNumber?: SortOrder
    site?: SortOrder
    route?: SortOrder
    administeredBy?: SortOrder
    primarySource?: SortOrder
    notes?: SortOrder
    createdAt?: SortOrder
  }

  export type EncounterCountOrderByAggregateInput = {
    id?: SortOrder
    patientId?: SortOrder
    status?: SortOrder
    encounterClass?: SortOrder
    type?: SortOrder
    reasonCode?: SortOrder
    reasonDisplay?: SortOrder
    startTime?: SortOrder
    endTime?: SortOrder
    providerId?: SortOrder
    locationId?: SortOrder
    notes?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type EncounterMaxOrderByAggregateInput = {
    id?: SortOrder
    patientId?: SortOrder
    status?: SortOrder
    encounterClass?: SortOrder
    type?: SortOrder
    reasonCode?: SortOrder
    reasonDisplay?: SortOrder
    startTime?: SortOrder
    endTime?: SortOrder
    providerId?: SortOrder
    locationId?: SortOrder
    notes?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type EncounterMinOrderByAggregateInput = {
    id?: SortOrder
    patientId?: SortOrder
    status?: SortOrder
    encounterClass?: SortOrder
    type?: SortOrder
    reasonCode?: SortOrder
    reasonDisplay?: SortOrder
    startTime?: SortOrder
    endTime?: SortOrder
    providerId?: SortOrder
    locationId?: SortOrder
    notes?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AppointmentCountOrderByAggregateInput = {
    id?: SortOrder
    patientId?: SortOrder
    providerId?: SortOrder
    status?: SortOrder
    serviceType?: SortOrder
    description?: SortOrder
    startTime?: SortOrder
    endTime?: SortOrder
    durationMinutes?: SortOrder
    locationId?: SortOrder
    notes?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AppointmentAvgOrderByAggregateInput = {
    durationMinutes?: SortOrder
  }

  export type AppointmentMaxOrderByAggregateInput = {
    id?: SortOrder
    patientId?: SortOrder
    providerId?: SortOrder
    status?: SortOrder
    serviceType?: SortOrder
    description?: SortOrder
    startTime?: SortOrder
    endTime?: SortOrder
    durationMinutes?: SortOrder
    locationId?: SortOrder
    notes?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AppointmentMinOrderByAggregateInput = {
    id?: SortOrder
    patientId?: SortOrder
    providerId?: SortOrder
    status?: SortOrder
    serviceType?: SortOrder
    description?: SortOrder
    startTime?: SortOrder
    endTime?: SortOrder
    durationMinutes?: SortOrder
    locationId?: SortOrder
    notes?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AppointmentSumOrderByAggregateInput = {
    durationMinutes?: SortOrder
  }

  export type ClinicalDocumentCountOrderByAggregateInput = {
    id?: SortOrder
    patientId?: SortOrder
    encounterId?: SortOrder
    type?: SortOrder
    title?: SortOrder
    content?: SortOrder
    status?: SortOrder
    authorId?: SortOrder
    authorName?: SortOrder
    signedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ClinicalDocumentMaxOrderByAggregateInput = {
    id?: SortOrder
    patientId?: SortOrder
    encounterId?: SortOrder
    type?: SortOrder
    title?: SortOrder
    content?: SortOrder
    status?: SortOrder
    authorId?: SortOrder
    authorName?: SortOrder
    signedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ClinicalDocumentMinOrderByAggregateInput = {
    id?: SortOrder
    patientId?: SortOrder
    encounterId?: SortOrder
    type?: SortOrder
    title?: SortOrder
    content?: SortOrder
    status?: SortOrder
    authorId?: SortOrder
    authorName?: SortOrder
    signedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }
  export type JsonNullableFilter<$PrismaModel = never> = 
    | PatchUndefined<
        Either<Required<JsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type PatientNullableRelationFilter = {
    is?: PatientWhereInput | null
    isNot?: PatientWhereInput | null
  }

  export type AuditLogCountOrderByAggregateInput = {
    id?: SortOrder
    patientId?: SortOrder
    userId?: SortOrder
    action?: SortOrder
    resourceType?: SortOrder
    resourceId?: SortOrder
    changes?: SortOrder
    ipAddress?: SortOrder
    correlationId?: SortOrder
    createdAt?: SortOrder
  }

  export type AuditLogMaxOrderByAggregateInput = {
    id?: SortOrder
    patientId?: SortOrder
    userId?: SortOrder
    action?: SortOrder
    resourceType?: SortOrder
    resourceId?: SortOrder
    ipAddress?: SortOrder
    correlationId?: SortOrder
    createdAt?: SortOrder
  }

  export type AuditLogMinOrderByAggregateInput = {
    id?: SortOrder
    patientId?: SortOrder
    userId?: SortOrder
    action?: SortOrder
    resourceType?: SortOrder
    resourceId?: SortOrder
    ipAddress?: SortOrder
    correlationId?: SortOrder
    createdAt?: SortOrder
  }
  export type JsonNullableWithAggregatesFilter<$PrismaModel = never> = 
    | PatchUndefined<
        Either<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedJsonNullableFilter<$PrismaModel>
    _max?: NestedJsonNullableFilter<$PrismaModel>
  }

  export type PatientAddressCreateNestedOneWithoutPatientInput = {
    create?: XOR<PatientAddressCreateWithoutPatientInput, PatientAddressUncheckedCreateWithoutPatientInput>
    connectOrCreate?: PatientAddressCreateOrConnectWithoutPatientInput
    connect?: PatientAddressWhereUniqueInput
  }

  export type EmergencyContactCreateNestedManyWithoutPatientInput = {
    create?: XOR<EmergencyContactCreateWithoutPatientInput, EmergencyContactUncheckedCreateWithoutPatientInput> | EmergencyContactCreateWithoutPatientInput[] | EmergencyContactUncheckedCreateWithoutPatientInput[]
    connectOrCreate?: EmergencyContactCreateOrConnectWithoutPatientInput | EmergencyContactCreateOrConnectWithoutPatientInput[]
    createMany?: EmergencyContactCreateManyPatientInputEnvelope
    connect?: EmergencyContactWhereUniqueInput | EmergencyContactWhereUniqueInput[]
  }

  export type PatientInsuranceCreateNestedManyWithoutPatientInput = {
    create?: XOR<PatientInsuranceCreateWithoutPatientInput, PatientInsuranceUncheckedCreateWithoutPatientInput> | PatientInsuranceCreateWithoutPatientInput[] | PatientInsuranceUncheckedCreateWithoutPatientInput[]
    connectOrCreate?: PatientInsuranceCreateOrConnectWithoutPatientInput | PatientInsuranceCreateOrConnectWithoutPatientInput[]
    createMany?: PatientInsuranceCreateManyPatientInputEnvelope
    connect?: PatientInsuranceWhereUniqueInput | PatientInsuranceWhereUniqueInput[]
  }

  export type ConditionCreateNestedManyWithoutPatientInput = {
    create?: XOR<ConditionCreateWithoutPatientInput, ConditionUncheckedCreateWithoutPatientInput> | ConditionCreateWithoutPatientInput[] | ConditionUncheckedCreateWithoutPatientInput[]
    connectOrCreate?: ConditionCreateOrConnectWithoutPatientInput | ConditionCreateOrConnectWithoutPatientInput[]
    createMany?: ConditionCreateManyPatientInputEnvelope
    connect?: ConditionWhereUniqueInput | ConditionWhereUniqueInput[]
  }

  export type MedicationRequestCreateNestedManyWithoutPatientInput = {
    create?: XOR<MedicationRequestCreateWithoutPatientInput, MedicationRequestUncheckedCreateWithoutPatientInput> | MedicationRequestCreateWithoutPatientInput[] | MedicationRequestUncheckedCreateWithoutPatientInput[]
    connectOrCreate?: MedicationRequestCreateOrConnectWithoutPatientInput | MedicationRequestCreateOrConnectWithoutPatientInput[]
    createMany?: MedicationRequestCreateManyPatientInputEnvelope
    connect?: MedicationRequestWhereUniqueInput | MedicationRequestWhereUniqueInput[]
  }

  export type AllergyIntoleranceCreateNestedManyWithoutPatientInput = {
    create?: XOR<AllergyIntoleranceCreateWithoutPatientInput, AllergyIntoleranceUncheckedCreateWithoutPatientInput> | AllergyIntoleranceCreateWithoutPatientInput[] | AllergyIntoleranceUncheckedCreateWithoutPatientInput[]
    connectOrCreate?: AllergyIntoleranceCreateOrConnectWithoutPatientInput | AllergyIntoleranceCreateOrConnectWithoutPatientInput[]
    createMany?: AllergyIntoleranceCreateManyPatientInputEnvelope
    connect?: AllergyIntoleranceWhereUniqueInput | AllergyIntoleranceWhereUniqueInput[]
  }

  export type ObservationCreateNestedManyWithoutPatientInput = {
    create?: XOR<ObservationCreateWithoutPatientInput, ObservationUncheckedCreateWithoutPatientInput> | ObservationCreateWithoutPatientInput[] | ObservationUncheckedCreateWithoutPatientInput[]
    connectOrCreate?: ObservationCreateOrConnectWithoutPatientInput | ObservationCreateOrConnectWithoutPatientInput[]
    createMany?: ObservationCreateManyPatientInputEnvelope
    connect?: ObservationWhereUniqueInput | ObservationWhereUniqueInput[]
  }

  export type ImmunisationCreateNestedManyWithoutPatientInput = {
    create?: XOR<ImmunisationCreateWithoutPatientInput, ImmunisationUncheckedCreateWithoutPatientInput> | ImmunisationCreateWithoutPatientInput[] | ImmunisationUncheckedCreateWithoutPatientInput[]
    connectOrCreate?: ImmunisationCreateOrConnectWithoutPatientInput | ImmunisationCreateOrConnectWithoutPatientInput[]
    createMany?: ImmunisationCreateManyPatientInputEnvelope
    connect?: ImmunisationWhereUniqueInput | ImmunisationWhereUniqueInput[]
  }

  export type EncounterCreateNestedManyWithoutPatientInput = {
    create?: XOR<EncounterCreateWithoutPatientInput, EncounterUncheckedCreateWithoutPatientInput> | EncounterCreateWithoutPatientInput[] | EncounterUncheckedCreateWithoutPatientInput[]
    connectOrCreate?: EncounterCreateOrConnectWithoutPatientInput | EncounterCreateOrConnectWithoutPatientInput[]
    createMany?: EncounterCreateManyPatientInputEnvelope
    connect?: EncounterWhereUniqueInput | EncounterWhereUniqueInput[]
  }

  export type AppointmentCreateNestedManyWithoutPatientInput = {
    create?: XOR<AppointmentCreateWithoutPatientInput, AppointmentUncheckedCreateWithoutPatientInput> | AppointmentCreateWithoutPatientInput[] | AppointmentUncheckedCreateWithoutPatientInput[]
    connectOrCreate?: AppointmentCreateOrConnectWithoutPatientInput | AppointmentCreateOrConnectWithoutPatientInput[]
    createMany?: AppointmentCreateManyPatientInputEnvelope
    connect?: AppointmentWhereUniqueInput | AppointmentWhereUniqueInput[]
  }

  export type ClinicalDocumentCreateNestedManyWithoutPatientInput = {
    create?: XOR<ClinicalDocumentCreateWithoutPatientInput, ClinicalDocumentUncheckedCreateWithoutPatientInput> | ClinicalDocumentCreateWithoutPatientInput[] | ClinicalDocumentUncheckedCreateWithoutPatientInput[]
    connectOrCreate?: ClinicalDocumentCreateOrConnectWithoutPatientInput | ClinicalDocumentCreateOrConnectWithoutPatientInput[]
    createMany?: ClinicalDocumentCreateManyPatientInputEnvelope
    connect?: ClinicalDocumentWhereUniqueInput | ClinicalDocumentWhereUniqueInput[]
  }

  export type AuditLogCreateNestedManyWithoutPatientInput = {
    create?: XOR<AuditLogCreateWithoutPatientInput, AuditLogUncheckedCreateWithoutPatientInput> | AuditLogCreateWithoutPatientInput[] | AuditLogUncheckedCreateWithoutPatientInput[]
    connectOrCreate?: AuditLogCreateOrConnectWithoutPatientInput | AuditLogCreateOrConnectWithoutPatientInput[]
    createMany?: AuditLogCreateManyPatientInputEnvelope
    connect?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
  }

  export type PatientAddressUncheckedCreateNestedOneWithoutPatientInput = {
    create?: XOR<PatientAddressCreateWithoutPatientInput, PatientAddressUncheckedCreateWithoutPatientInput>
    connectOrCreate?: PatientAddressCreateOrConnectWithoutPatientInput
    connect?: PatientAddressWhereUniqueInput
  }

  export type EmergencyContactUncheckedCreateNestedManyWithoutPatientInput = {
    create?: XOR<EmergencyContactCreateWithoutPatientInput, EmergencyContactUncheckedCreateWithoutPatientInput> | EmergencyContactCreateWithoutPatientInput[] | EmergencyContactUncheckedCreateWithoutPatientInput[]
    connectOrCreate?: EmergencyContactCreateOrConnectWithoutPatientInput | EmergencyContactCreateOrConnectWithoutPatientInput[]
    createMany?: EmergencyContactCreateManyPatientInputEnvelope
    connect?: EmergencyContactWhereUniqueInput | EmergencyContactWhereUniqueInput[]
  }

  export type PatientInsuranceUncheckedCreateNestedManyWithoutPatientInput = {
    create?: XOR<PatientInsuranceCreateWithoutPatientInput, PatientInsuranceUncheckedCreateWithoutPatientInput> | PatientInsuranceCreateWithoutPatientInput[] | PatientInsuranceUncheckedCreateWithoutPatientInput[]
    connectOrCreate?: PatientInsuranceCreateOrConnectWithoutPatientInput | PatientInsuranceCreateOrConnectWithoutPatientInput[]
    createMany?: PatientInsuranceCreateManyPatientInputEnvelope
    connect?: PatientInsuranceWhereUniqueInput | PatientInsuranceWhereUniqueInput[]
  }

  export type ConditionUncheckedCreateNestedManyWithoutPatientInput = {
    create?: XOR<ConditionCreateWithoutPatientInput, ConditionUncheckedCreateWithoutPatientInput> | ConditionCreateWithoutPatientInput[] | ConditionUncheckedCreateWithoutPatientInput[]
    connectOrCreate?: ConditionCreateOrConnectWithoutPatientInput | ConditionCreateOrConnectWithoutPatientInput[]
    createMany?: ConditionCreateManyPatientInputEnvelope
    connect?: ConditionWhereUniqueInput | ConditionWhereUniqueInput[]
  }

  export type MedicationRequestUncheckedCreateNestedManyWithoutPatientInput = {
    create?: XOR<MedicationRequestCreateWithoutPatientInput, MedicationRequestUncheckedCreateWithoutPatientInput> | MedicationRequestCreateWithoutPatientInput[] | MedicationRequestUncheckedCreateWithoutPatientInput[]
    connectOrCreate?: MedicationRequestCreateOrConnectWithoutPatientInput | MedicationRequestCreateOrConnectWithoutPatientInput[]
    createMany?: MedicationRequestCreateManyPatientInputEnvelope
    connect?: MedicationRequestWhereUniqueInput | MedicationRequestWhereUniqueInput[]
  }

  export type AllergyIntoleranceUncheckedCreateNestedManyWithoutPatientInput = {
    create?: XOR<AllergyIntoleranceCreateWithoutPatientInput, AllergyIntoleranceUncheckedCreateWithoutPatientInput> | AllergyIntoleranceCreateWithoutPatientInput[] | AllergyIntoleranceUncheckedCreateWithoutPatientInput[]
    connectOrCreate?: AllergyIntoleranceCreateOrConnectWithoutPatientInput | AllergyIntoleranceCreateOrConnectWithoutPatientInput[]
    createMany?: AllergyIntoleranceCreateManyPatientInputEnvelope
    connect?: AllergyIntoleranceWhereUniqueInput | AllergyIntoleranceWhereUniqueInput[]
  }

  export type ObservationUncheckedCreateNestedManyWithoutPatientInput = {
    create?: XOR<ObservationCreateWithoutPatientInput, ObservationUncheckedCreateWithoutPatientInput> | ObservationCreateWithoutPatientInput[] | ObservationUncheckedCreateWithoutPatientInput[]
    connectOrCreate?: ObservationCreateOrConnectWithoutPatientInput | ObservationCreateOrConnectWithoutPatientInput[]
    createMany?: ObservationCreateManyPatientInputEnvelope
    connect?: ObservationWhereUniqueInput | ObservationWhereUniqueInput[]
  }

  export type ImmunisationUncheckedCreateNestedManyWithoutPatientInput = {
    create?: XOR<ImmunisationCreateWithoutPatientInput, ImmunisationUncheckedCreateWithoutPatientInput> | ImmunisationCreateWithoutPatientInput[] | ImmunisationUncheckedCreateWithoutPatientInput[]
    connectOrCreate?: ImmunisationCreateOrConnectWithoutPatientInput | ImmunisationCreateOrConnectWithoutPatientInput[]
    createMany?: ImmunisationCreateManyPatientInputEnvelope
    connect?: ImmunisationWhereUniqueInput | ImmunisationWhereUniqueInput[]
  }

  export type EncounterUncheckedCreateNestedManyWithoutPatientInput = {
    create?: XOR<EncounterCreateWithoutPatientInput, EncounterUncheckedCreateWithoutPatientInput> | EncounterCreateWithoutPatientInput[] | EncounterUncheckedCreateWithoutPatientInput[]
    connectOrCreate?: EncounterCreateOrConnectWithoutPatientInput | EncounterCreateOrConnectWithoutPatientInput[]
    createMany?: EncounterCreateManyPatientInputEnvelope
    connect?: EncounterWhereUniqueInput | EncounterWhereUniqueInput[]
  }

  export type AppointmentUncheckedCreateNestedManyWithoutPatientInput = {
    create?: XOR<AppointmentCreateWithoutPatientInput, AppointmentUncheckedCreateWithoutPatientInput> | AppointmentCreateWithoutPatientInput[] | AppointmentUncheckedCreateWithoutPatientInput[]
    connectOrCreate?: AppointmentCreateOrConnectWithoutPatientInput | AppointmentCreateOrConnectWithoutPatientInput[]
    createMany?: AppointmentCreateManyPatientInputEnvelope
    connect?: AppointmentWhereUniqueInput | AppointmentWhereUniqueInput[]
  }

  export type ClinicalDocumentUncheckedCreateNestedManyWithoutPatientInput = {
    create?: XOR<ClinicalDocumentCreateWithoutPatientInput, ClinicalDocumentUncheckedCreateWithoutPatientInput> | ClinicalDocumentCreateWithoutPatientInput[] | ClinicalDocumentUncheckedCreateWithoutPatientInput[]
    connectOrCreate?: ClinicalDocumentCreateOrConnectWithoutPatientInput | ClinicalDocumentCreateOrConnectWithoutPatientInput[]
    createMany?: ClinicalDocumentCreateManyPatientInputEnvelope
    connect?: ClinicalDocumentWhereUniqueInput | ClinicalDocumentWhereUniqueInput[]
  }

  export type AuditLogUncheckedCreateNestedManyWithoutPatientInput = {
    create?: XOR<AuditLogCreateWithoutPatientInput, AuditLogUncheckedCreateWithoutPatientInput> | AuditLogCreateWithoutPatientInput[] | AuditLogUncheckedCreateWithoutPatientInput[]
    connectOrCreate?: AuditLogCreateOrConnectWithoutPatientInput | AuditLogCreateOrConnectWithoutPatientInput[]
    createMany?: AuditLogCreateManyPatientInputEnvelope
    connect?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type PatientAddressUpdateOneWithoutPatientNestedInput = {
    create?: XOR<PatientAddressCreateWithoutPatientInput, PatientAddressUncheckedCreateWithoutPatientInput>
    connectOrCreate?: PatientAddressCreateOrConnectWithoutPatientInput
    upsert?: PatientAddressUpsertWithoutPatientInput
    disconnect?: PatientAddressWhereInput | boolean
    delete?: PatientAddressWhereInput | boolean
    connect?: PatientAddressWhereUniqueInput
    update?: XOR<XOR<PatientAddressUpdateToOneWithWhereWithoutPatientInput, PatientAddressUpdateWithoutPatientInput>, PatientAddressUncheckedUpdateWithoutPatientInput>
  }

  export type EmergencyContactUpdateManyWithoutPatientNestedInput = {
    create?: XOR<EmergencyContactCreateWithoutPatientInput, EmergencyContactUncheckedCreateWithoutPatientInput> | EmergencyContactCreateWithoutPatientInput[] | EmergencyContactUncheckedCreateWithoutPatientInput[]
    connectOrCreate?: EmergencyContactCreateOrConnectWithoutPatientInput | EmergencyContactCreateOrConnectWithoutPatientInput[]
    upsert?: EmergencyContactUpsertWithWhereUniqueWithoutPatientInput | EmergencyContactUpsertWithWhereUniqueWithoutPatientInput[]
    createMany?: EmergencyContactCreateManyPatientInputEnvelope
    set?: EmergencyContactWhereUniqueInput | EmergencyContactWhereUniqueInput[]
    disconnect?: EmergencyContactWhereUniqueInput | EmergencyContactWhereUniqueInput[]
    delete?: EmergencyContactWhereUniqueInput | EmergencyContactWhereUniqueInput[]
    connect?: EmergencyContactWhereUniqueInput | EmergencyContactWhereUniqueInput[]
    update?: EmergencyContactUpdateWithWhereUniqueWithoutPatientInput | EmergencyContactUpdateWithWhereUniqueWithoutPatientInput[]
    updateMany?: EmergencyContactUpdateManyWithWhereWithoutPatientInput | EmergencyContactUpdateManyWithWhereWithoutPatientInput[]
    deleteMany?: EmergencyContactScalarWhereInput | EmergencyContactScalarWhereInput[]
  }

  export type PatientInsuranceUpdateManyWithoutPatientNestedInput = {
    create?: XOR<PatientInsuranceCreateWithoutPatientInput, PatientInsuranceUncheckedCreateWithoutPatientInput> | PatientInsuranceCreateWithoutPatientInput[] | PatientInsuranceUncheckedCreateWithoutPatientInput[]
    connectOrCreate?: PatientInsuranceCreateOrConnectWithoutPatientInput | PatientInsuranceCreateOrConnectWithoutPatientInput[]
    upsert?: PatientInsuranceUpsertWithWhereUniqueWithoutPatientInput | PatientInsuranceUpsertWithWhereUniqueWithoutPatientInput[]
    createMany?: PatientInsuranceCreateManyPatientInputEnvelope
    set?: PatientInsuranceWhereUniqueInput | PatientInsuranceWhereUniqueInput[]
    disconnect?: PatientInsuranceWhereUniqueInput | PatientInsuranceWhereUniqueInput[]
    delete?: PatientInsuranceWhereUniqueInput | PatientInsuranceWhereUniqueInput[]
    connect?: PatientInsuranceWhereUniqueInput | PatientInsuranceWhereUniqueInput[]
    update?: PatientInsuranceUpdateWithWhereUniqueWithoutPatientInput | PatientInsuranceUpdateWithWhereUniqueWithoutPatientInput[]
    updateMany?: PatientInsuranceUpdateManyWithWhereWithoutPatientInput | PatientInsuranceUpdateManyWithWhereWithoutPatientInput[]
    deleteMany?: PatientInsuranceScalarWhereInput | PatientInsuranceScalarWhereInput[]
  }

  export type ConditionUpdateManyWithoutPatientNestedInput = {
    create?: XOR<ConditionCreateWithoutPatientInput, ConditionUncheckedCreateWithoutPatientInput> | ConditionCreateWithoutPatientInput[] | ConditionUncheckedCreateWithoutPatientInput[]
    connectOrCreate?: ConditionCreateOrConnectWithoutPatientInput | ConditionCreateOrConnectWithoutPatientInput[]
    upsert?: ConditionUpsertWithWhereUniqueWithoutPatientInput | ConditionUpsertWithWhereUniqueWithoutPatientInput[]
    createMany?: ConditionCreateManyPatientInputEnvelope
    set?: ConditionWhereUniqueInput | ConditionWhereUniqueInput[]
    disconnect?: ConditionWhereUniqueInput | ConditionWhereUniqueInput[]
    delete?: ConditionWhereUniqueInput | ConditionWhereUniqueInput[]
    connect?: ConditionWhereUniqueInput | ConditionWhereUniqueInput[]
    update?: ConditionUpdateWithWhereUniqueWithoutPatientInput | ConditionUpdateWithWhereUniqueWithoutPatientInput[]
    updateMany?: ConditionUpdateManyWithWhereWithoutPatientInput | ConditionUpdateManyWithWhereWithoutPatientInput[]
    deleteMany?: ConditionScalarWhereInput | ConditionScalarWhereInput[]
  }

  export type MedicationRequestUpdateManyWithoutPatientNestedInput = {
    create?: XOR<MedicationRequestCreateWithoutPatientInput, MedicationRequestUncheckedCreateWithoutPatientInput> | MedicationRequestCreateWithoutPatientInput[] | MedicationRequestUncheckedCreateWithoutPatientInput[]
    connectOrCreate?: MedicationRequestCreateOrConnectWithoutPatientInput | MedicationRequestCreateOrConnectWithoutPatientInput[]
    upsert?: MedicationRequestUpsertWithWhereUniqueWithoutPatientInput | MedicationRequestUpsertWithWhereUniqueWithoutPatientInput[]
    createMany?: MedicationRequestCreateManyPatientInputEnvelope
    set?: MedicationRequestWhereUniqueInput | MedicationRequestWhereUniqueInput[]
    disconnect?: MedicationRequestWhereUniqueInput | MedicationRequestWhereUniqueInput[]
    delete?: MedicationRequestWhereUniqueInput | MedicationRequestWhereUniqueInput[]
    connect?: MedicationRequestWhereUniqueInput | MedicationRequestWhereUniqueInput[]
    update?: MedicationRequestUpdateWithWhereUniqueWithoutPatientInput | MedicationRequestUpdateWithWhereUniqueWithoutPatientInput[]
    updateMany?: MedicationRequestUpdateManyWithWhereWithoutPatientInput | MedicationRequestUpdateManyWithWhereWithoutPatientInput[]
    deleteMany?: MedicationRequestScalarWhereInput | MedicationRequestScalarWhereInput[]
  }

  export type AllergyIntoleranceUpdateManyWithoutPatientNestedInput = {
    create?: XOR<AllergyIntoleranceCreateWithoutPatientInput, AllergyIntoleranceUncheckedCreateWithoutPatientInput> | AllergyIntoleranceCreateWithoutPatientInput[] | AllergyIntoleranceUncheckedCreateWithoutPatientInput[]
    connectOrCreate?: AllergyIntoleranceCreateOrConnectWithoutPatientInput | AllergyIntoleranceCreateOrConnectWithoutPatientInput[]
    upsert?: AllergyIntoleranceUpsertWithWhereUniqueWithoutPatientInput | AllergyIntoleranceUpsertWithWhereUniqueWithoutPatientInput[]
    createMany?: AllergyIntoleranceCreateManyPatientInputEnvelope
    set?: AllergyIntoleranceWhereUniqueInput | AllergyIntoleranceWhereUniqueInput[]
    disconnect?: AllergyIntoleranceWhereUniqueInput | AllergyIntoleranceWhereUniqueInput[]
    delete?: AllergyIntoleranceWhereUniqueInput | AllergyIntoleranceWhereUniqueInput[]
    connect?: AllergyIntoleranceWhereUniqueInput | AllergyIntoleranceWhereUniqueInput[]
    update?: AllergyIntoleranceUpdateWithWhereUniqueWithoutPatientInput | AllergyIntoleranceUpdateWithWhereUniqueWithoutPatientInput[]
    updateMany?: AllergyIntoleranceUpdateManyWithWhereWithoutPatientInput | AllergyIntoleranceUpdateManyWithWhereWithoutPatientInput[]
    deleteMany?: AllergyIntoleranceScalarWhereInput | AllergyIntoleranceScalarWhereInput[]
  }

  export type ObservationUpdateManyWithoutPatientNestedInput = {
    create?: XOR<ObservationCreateWithoutPatientInput, ObservationUncheckedCreateWithoutPatientInput> | ObservationCreateWithoutPatientInput[] | ObservationUncheckedCreateWithoutPatientInput[]
    connectOrCreate?: ObservationCreateOrConnectWithoutPatientInput | ObservationCreateOrConnectWithoutPatientInput[]
    upsert?: ObservationUpsertWithWhereUniqueWithoutPatientInput | ObservationUpsertWithWhereUniqueWithoutPatientInput[]
    createMany?: ObservationCreateManyPatientInputEnvelope
    set?: ObservationWhereUniqueInput | ObservationWhereUniqueInput[]
    disconnect?: ObservationWhereUniqueInput | ObservationWhereUniqueInput[]
    delete?: ObservationWhereUniqueInput | ObservationWhereUniqueInput[]
    connect?: ObservationWhereUniqueInput | ObservationWhereUniqueInput[]
    update?: ObservationUpdateWithWhereUniqueWithoutPatientInput | ObservationUpdateWithWhereUniqueWithoutPatientInput[]
    updateMany?: ObservationUpdateManyWithWhereWithoutPatientInput | ObservationUpdateManyWithWhereWithoutPatientInput[]
    deleteMany?: ObservationScalarWhereInput | ObservationScalarWhereInput[]
  }

  export type ImmunisationUpdateManyWithoutPatientNestedInput = {
    create?: XOR<ImmunisationCreateWithoutPatientInput, ImmunisationUncheckedCreateWithoutPatientInput> | ImmunisationCreateWithoutPatientInput[] | ImmunisationUncheckedCreateWithoutPatientInput[]
    connectOrCreate?: ImmunisationCreateOrConnectWithoutPatientInput | ImmunisationCreateOrConnectWithoutPatientInput[]
    upsert?: ImmunisationUpsertWithWhereUniqueWithoutPatientInput | ImmunisationUpsertWithWhereUniqueWithoutPatientInput[]
    createMany?: ImmunisationCreateManyPatientInputEnvelope
    set?: ImmunisationWhereUniqueInput | ImmunisationWhereUniqueInput[]
    disconnect?: ImmunisationWhereUniqueInput | ImmunisationWhereUniqueInput[]
    delete?: ImmunisationWhereUniqueInput | ImmunisationWhereUniqueInput[]
    connect?: ImmunisationWhereUniqueInput | ImmunisationWhereUniqueInput[]
    update?: ImmunisationUpdateWithWhereUniqueWithoutPatientInput | ImmunisationUpdateWithWhereUniqueWithoutPatientInput[]
    updateMany?: ImmunisationUpdateManyWithWhereWithoutPatientInput | ImmunisationUpdateManyWithWhereWithoutPatientInput[]
    deleteMany?: ImmunisationScalarWhereInput | ImmunisationScalarWhereInput[]
  }

  export type EncounterUpdateManyWithoutPatientNestedInput = {
    create?: XOR<EncounterCreateWithoutPatientInput, EncounterUncheckedCreateWithoutPatientInput> | EncounterCreateWithoutPatientInput[] | EncounterUncheckedCreateWithoutPatientInput[]
    connectOrCreate?: EncounterCreateOrConnectWithoutPatientInput | EncounterCreateOrConnectWithoutPatientInput[]
    upsert?: EncounterUpsertWithWhereUniqueWithoutPatientInput | EncounterUpsertWithWhereUniqueWithoutPatientInput[]
    createMany?: EncounterCreateManyPatientInputEnvelope
    set?: EncounterWhereUniqueInput | EncounterWhereUniqueInput[]
    disconnect?: EncounterWhereUniqueInput | EncounterWhereUniqueInput[]
    delete?: EncounterWhereUniqueInput | EncounterWhereUniqueInput[]
    connect?: EncounterWhereUniqueInput | EncounterWhereUniqueInput[]
    update?: EncounterUpdateWithWhereUniqueWithoutPatientInput | EncounterUpdateWithWhereUniqueWithoutPatientInput[]
    updateMany?: EncounterUpdateManyWithWhereWithoutPatientInput | EncounterUpdateManyWithWhereWithoutPatientInput[]
    deleteMany?: EncounterScalarWhereInput | EncounterScalarWhereInput[]
  }

  export type AppointmentUpdateManyWithoutPatientNestedInput = {
    create?: XOR<AppointmentCreateWithoutPatientInput, AppointmentUncheckedCreateWithoutPatientInput> | AppointmentCreateWithoutPatientInput[] | AppointmentUncheckedCreateWithoutPatientInput[]
    connectOrCreate?: AppointmentCreateOrConnectWithoutPatientInput | AppointmentCreateOrConnectWithoutPatientInput[]
    upsert?: AppointmentUpsertWithWhereUniqueWithoutPatientInput | AppointmentUpsertWithWhereUniqueWithoutPatientInput[]
    createMany?: AppointmentCreateManyPatientInputEnvelope
    set?: AppointmentWhereUniqueInput | AppointmentWhereUniqueInput[]
    disconnect?: AppointmentWhereUniqueInput | AppointmentWhereUniqueInput[]
    delete?: AppointmentWhereUniqueInput | AppointmentWhereUniqueInput[]
    connect?: AppointmentWhereUniqueInput | AppointmentWhereUniqueInput[]
    update?: AppointmentUpdateWithWhereUniqueWithoutPatientInput | AppointmentUpdateWithWhereUniqueWithoutPatientInput[]
    updateMany?: AppointmentUpdateManyWithWhereWithoutPatientInput | AppointmentUpdateManyWithWhereWithoutPatientInput[]
    deleteMany?: AppointmentScalarWhereInput | AppointmentScalarWhereInput[]
  }

  export type ClinicalDocumentUpdateManyWithoutPatientNestedInput = {
    create?: XOR<ClinicalDocumentCreateWithoutPatientInput, ClinicalDocumentUncheckedCreateWithoutPatientInput> | ClinicalDocumentCreateWithoutPatientInput[] | ClinicalDocumentUncheckedCreateWithoutPatientInput[]
    connectOrCreate?: ClinicalDocumentCreateOrConnectWithoutPatientInput | ClinicalDocumentCreateOrConnectWithoutPatientInput[]
    upsert?: ClinicalDocumentUpsertWithWhereUniqueWithoutPatientInput | ClinicalDocumentUpsertWithWhereUniqueWithoutPatientInput[]
    createMany?: ClinicalDocumentCreateManyPatientInputEnvelope
    set?: ClinicalDocumentWhereUniqueInput | ClinicalDocumentWhereUniqueInput[]
    disconnect?: ClinicalDocumentWhereUniqueInput | ClinicalDocumentWhereUniqueInput[]
    delete?: ClinicalDocumentWhereUniqueInput | ClinicalDocumentWhereUniqueInput[]
    connect?: ClinicalDocumentWhereUniqueInput | ClinicalDocumentWhereUniqueInput[]
    update?: ClinicalDocumentUpdateWithWhereUniqueWithoutPatientInput | ClinicalDocumentUpdateWithWhereUniqueWithoutPatientInput[]
    updateMany?: ClinicalDocumentUpdateManyWithWhereWithoutPatientInput | ClinicalDocumentUpdateManyWithWhereWithoutPatientInput[]
    deleteMany?: ClinicalDocumentScalarWhereInput | ClinicalDocumentScalarWhereInput[]
  }

  export type AuditLogUpdateManyWithoutPatientNestedInput = {
    create?: XOR<AuditLogCreateWithoutPatientInput, AuditLogUncheckedCreateWithoutPatientInput> | AuditLogCreateWithoutPatientInput[] | AuditLogUncheckedCreateWithoutPatientInput[]
    connectOrCreate?: AuditLogCreateOrConnectWithoutPatientInput | AuditLogCreateOrConnectWithoutPatientInput[]
    upsert?: AuditLogUpsertWithWhereUniqueWithoutPatientInput | AuditLogUpsertWithWhereUniqueWithoutPatientInput[]
    createMany?: AuditLogCreateManyPatientInputEnvelope
    set?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
    disconnect?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
    delete?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
    connect?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
    update?: AuditLogUpdateWithWhereUniqueWithoutPatientInput | AuditLogUpdateWithWhereUniqueWithoutPatientInput[]
    updateMany?: AuditLogUpdateManyWithWhereWithoutPatientInput | AuditLogUpdateManyWithWhereWithoutPatientInput[]
    deleteMany?: AuditLogScalarWhereInput | AuditLogScalarWhereInput[]
  }

  export type PatientAddressUncheckedUpdateOneWithoutPatientNestedInput = {
    create?: XOR<PatientAddressCreateWithoutPatientInput, PatientAddressUncheckedCreateWithoutPatientInput>
    connectOrCreate?: PatientAddressCreateOrConnectWithoutPatientInput
    upsert?: PatientAddressUpsertWithoutPatientInput
    disconnect?: PatientAddressWhereInput | boolean
    delete?: PatientAddressWhereInput | boolean
    connect?: PatientAddressWhereUniqueInput
    update?: XOR<XOR<PatientAddressUpdateToOneWithWhereWithoutPatientInput, PatientAddressUpdateWithoutPatientInput>, PatientAddressUncheckedUpdateWithoutPatientInput>
  }

  export type EmergencyContactUncheckedUpdateManyWithoutPatientNestedInput = {
    create?: XOR<EmergencyContactCreateWithoutPatientInput, EmergencyContactUncheckedCreateWithoutPatientInput> | EmergencyContactCreateWithoutPatientInput[] | EmergencyContactUncheckedCreateWithoutPatientInput[]
    connectOrCreate?: EmergencyContactCreateOrConnectWithoutPatientInput | EmergencyContactCreateOrConnectWithoutPatientInput[]
    upsert?: EmergencyContactUpsertWithWhereUniqueWithoutPatientInput | EmergencyContactUpsertWithWhereUniqueWithoutPatientInput[]
    createMany?: EmergencyContactCreateManyPatientInputEnvelope
    set?: EmergencyContactWhereUniqueInput | EmergencyContactWhereUniqueInput[]
    disconnect?: EmergencyContactWhereUniqueInput | EmergencyContactWhereUniqueInput[]
    delete?: EmergencyContactWhereUniqueInput | EmergencyContactWhereUniqueInput[]
    connect?: EmergencyContactWhereUniqueInput | EmergencyContactWhereUniqueInput[]
    update?: EmergencyContactUpdateWithWhereUniqueWithoutPatientInput | EmergencyContactUpdateWithWhereUniqueWithoutPatientInput[]
    updateMany?: EmergencyContactUpdateManyWithWhereWithoutPatientInput | EmergencyContactUpdateManyWithWhereWithoutPatientInput[]
    deleteMany?: EmergencyContactScalarWhereInput | EmergencyContactScalarWhereInput[]
  }

  export type PatientInsuranceUncheckedUpdateManyWithoutPatientNestedInput = {
    create?: XOR<PatientInsuranceCreateWithoutPatientInput, PatientInsuranceUncheckedCreateWithoutPatientInput> | PatientInsuranceCreateWithoutPatientInput[] | PatientInsuranceUncheckedCreateWithoutPatientInput[]
    connectOrCreate?: PatientInsuranceCreateOrConnectWithoutPatientInput | PatientInsuranceCreateOrConnectWithoutPatientInput[]
    upsert?: PatientInsuranceUpsertWithWhereUniqueWithoutPatientInput | PatientInsuranceUpsertWithWhereUniqueWithoutPatientInput[]
    createMany?: PatientInsuranceCreateManyPatientInputEnvelope
    set?: PatientInsuranceWhereUniqueInput | PatientInsuranceWhereUniqueInput[]
    disconnect?: PatientInsuranceWhereUniqueInput | PatientInsuranceWhereUniqueInput[]
    delete?: PatientInsuranceWhereUniqueInput | PatientInsuranceWhereUniqueInput[]
    connect?: PatientInsuranceWhereUniqueInput | PatientInsuranceWhereUniqueInput[]
    update?: PatientInsuranceUpdateWithWhereUniqueWithoutPatientInput | PatientInsuranceUpdateWithWhereUniqueWithoutPatientInput[]
    updateMany?: PatientInsuranceUpdateManyWithWhereWithoutPatientInput | PatientInsuranceUpdateManyWithWhereWithoutPatientInput[]
    deleteMany?: PatientInsuranceScalarWhereInput | PatientInsuranceScalarWhereInput[]
  }

  export type ConditionUncheckedUpdateManyWithoutPatientNestedInput = {
    create?: XOR<ConditionCreateWithoutPatientInput, ConditionUncheckedCreateWithoutPatientInput> | ConditionCreateWithoutPatientInput[] | ConditionUncheckedCreateWithoutPatientInput[]
    connectOrCreate?: ConditionCreateOrConnectWithoutPatientInput | ConditionCreateOrConnectWithoutPatientInput[]
    upsert?: ConditionUpsertWithWhereUniqueWithoutPatientInput | ConditionUpsertWithWhereUniqueWithoutPatientInput[]
    createMany?: ConditionCreateManyPatientInputEnvelope
    set?: ConditionWhereUniqueInput | ConditionWhereUniqueInput[]
    disconnect?: ConditionWhereUniqueInput | ConditionWhereUniqueInput[]
    delete?: ConditionWhereUniqueInput | ConditionWhereUniqueInput[]
    connect?: ConditionWhereUniqueInput | ConditionWhereUniqueInput[]
    update?: ConditionUpdateWithWhereUniqueWithoutPatientInput | ConditionUpdateWithWhereUniqueWithoutPatientInput[]
    updateMany?: ConditionUpdateManyWithWhereWithoutPatientInput | ConditionUpdateManyWithWhereWithoutPatientInput[]
    deleteMany?: ConditionScalarWhereInput | ConditionScalarWhereInput[]
  }

  export type MedicationRequestUncheckedUpdateManyWithoutPatientNestedInput = {
    create?: XOR<MedicationRequestCreateWithoutPatientInput, MedicationRequestUncheckedCreateWithoutPatientInput> | MedicationRequestCreateWithoutPatientInput[] | MedicationRequestUncheckedCreateWithoutPatientInput[]
    connectOrCreate?: MedicationRequestCreateOrConnectWithoutPatientInput | MedicationRequestCreateOrConnectWithoutPatientInput[]
    upsert?: MedicationRequestUpsertWithWhereUniqueWithoutPatientInput | MedicationRequestUpsertWithWhereUniqueWithoutPatientInput[]
    createMany?: MedicationRequestCreateManyPatientInputEnvelope
    set?: MedicationRequestWhereUniqueInput | MedicationRequestWhereUniqueInput[]
    disconnect?: MedicationRequestWhereUniqueInput | MedicationRequestWhereUniqueInput[]
    delete?: MedicationRequestWhereUniqueInput | MedicationRequestWhereUniqueInput[]
    connect?: MedicationRequestWhereUniqueInput | MedicationRequestWhereUniqueInput[]
    update?: MedicationRequestUpdateWithWhereUniqueWithoutPatientInput | MedicationRequestUpdateWithWhereUniqueWithoutPatientInput[]
    updateMany?: MedicationRequestUpdateManyWithWhereWithoutPatientInput | MedicationRequestUpdateManyWithWhereWithoutPatientInput[]
    deleteMany?: MedicationRequestScalarWhereInput | MedicationRequestScalarWhereInput[]
  }

  export type AllergyIntoleranceUncheckedUpdateManyWithoutPatientNestedInput = {
    create?: XOR<AllergyIntoleranceCreateWithoutPatientInput, AllergyIntoleranceUncheckedCreateWithoutPatientInput> | AllergyIntoleranceCreateWithoutPatientInput[] | AllergyIntoleranceUncheckedCreateWithoutPatientInput[]
    connectOrCreate?: AllergyIntoleranceCreateOrConnectWithoutPatientInput | AllergyIntoleranceCreateOrConnectWithoutPatientInput[]
    upsert?: AllergyIntoleranceUpsertWithWhereUniqueWithoutPatientInput | AllergyIntoleranceUpsertWithWhereUniqueWithoutPatientInput[]
    createMany?: AllergyIntoleranceCreateManyPatientInputEnvelope
    set?: AllergyIntoleranceWhereUniqueInput | AllergyIntoleranceWhereUniqueInput[]
    disconnect?: AllergyIntoleranceWhereUniqueInput | AllergyIntoleranceWhereUniqueInput[]
    delete?: AllergyIntoleranceWhereUniqueInput | AllergyIntoleranceWhereUniqueInput[]
    connect?: AllergyIntoleranceWhereUniqueInput | AllergyIntoleranceWhereUniqueInput[]
    update?: AllergyIntoleranceUpdateWithWhereUniqueWithoutPatientInput | AllergyIntoleranceUpdateWithWhereUniqueWithoutPatientInput[]
    updateMany?: AllergyIntoleranceUpdateManyWithWhereWithoutPatientInput | AllergyIntoleranceUpdateManyWithWhereWithoutPatientInput[]
    deleteMany?: AllergyIntoleranceScalarWhereInput | AllergyIntoleranceScalarWhereInput[]
  }

  export type ObservationUncheckedUpdateManyWithoutPatientNestedInput = {
    create?: XOR<ObservationCreateWithoutPatientInput, ObservationUncheckedCreateWithoutPatientInput> | ObservationCreateWithoutPatientInput[] | ObservationUncheckedCreateWithoutPatientInput[]
    connectOrCreate?: ObservationCreateOrConnectWithoutPatientInput | ObservationCreateOrConnectWithoutPatientInput[]
    upsert?: ObservationUpsertWithWhereUniqueWithoutPatientInput | ObservationUpsertWithWhereUniqueWithoutPatientInput[]
    createMany?: ObservationCreateManyPatientInputEnvelope
    set?: ObservationWhereUniqueInput | ObservationWhereUniqueInput[]
    disconnect?: ObservationWhereUniqueInput | ObservationWhereUniqueInput[]
    delete?: ObservationWhereUniqueInput | ObservationWhereUniqueInput[]
    connect?: ObservationWhereUniqueInput | ObservationWhereUniqueInput[]
    update?: ObservationUpdateWithWhereUniqueWithoutPatientInput | ObservationUpdateWithWhereUniqueWithoutPatientInput[]
    updateMany?: ObservationUpdateManyWithWhereWithoutPatientInput | ObservationUpdateManyWithWhereWithoutPatientInput[]
    deleteMany?: ObservationScalarWhereInput | ObservationScalarWhereInput[]
  }

  export type ImmunisationUncheckedUpdateManyWithoutPatientNestedInput = {
    create?: XOR<ImmunisationCreateWithoutPatientInput, ImmunisationUncheckedCreateWithoutPatientInput> | ImmunisationCreateWithoutPatientInput[] | ImmunisationUncheckedCreateWithoutPatientInput[]
    connectOrCreate?: ImmunisationCreateOrConnectWithoutPatientInput | ImmunisationCreateOrConnectWithoutPatientInput[]
    upsert?: ImmunisationUpsertWithWhereUniqueWithoutPatientInput | ImmunisationUpsertWithWhereUniqueWithoutPatientInput[]
    createMany?: ImmunisationCreateManyPatientInputEnvelope
    set?: ImmunisationWhereUniqueInput | ImmunisationWhereUniqueInput[]
    disconnect?: ImmunisationWhereUniqueInput | ImmunisationWhereUniqueInput[]
    delete?: ImmunisationWhereUniqueInput | ImmunisationWhereUniqueInput[]
    connect?: ImmunisationWhereUniqueInput | ImmunisationWhereUniqueInput[]
    update?: ImmunisationUpdateWithWhereUniqueWithoutPatientInput | ImmunisationUpdateWithWhereUniqueWithoutPatientInput[]
    updateMany?: ImmunisationUpdateManyWithWhereWithoutPatientInput | ImmunisationUpdateManyWithWhereWithoutPatientInput[]
    deleteMany?: ImmunisationScalarWhereInput | ImmunisationScalarWhereInput[]
  }

  export type EncounterUncheckedUpdateManyWithoutPatientNestedInput = {
    create?: XOR<EncounterCreateWithoutPatientInput, EncounterUncheckedCreateWithoutPatientInput> | EncounterCreateWithoutPatientInput[] | EncounterUncheckedCreateWithoutPatientInput[]
    connectOrCreate?: EncounterCreateOrConnectWithoutPatientInput | EncounterCreateOrConnectWithoutPatientInput[]
    upsert?: EncounterUpsertWithWhereUniqueWithoutPatientInput | EncounterUpsertWithWhereUniqueWithoutPatientInput[]
    createMany?: EncounterCreateManyPatientInputEnvelope
    set?: EncounterWhereUniqueInput | EncounterWhereUniqueInput[]
    disconnect?: EncounterWhereUniqueInput | EncounterWhereUniqueInput[]
    delete?: EncounterWhereUniqueInput | EncounterWhereUniqueInput[]
    connect?: EncounterWhereUniqueInput | EncounterWhereUniqueInput[]
    update?: EncounterUpdateWithWhereUniqueWithoutPatientInput | EncounterUpdateWithWhereUniqueWithoutPatientInput[]
    updateMany?: EncounterUpdateManyWithWhereWithoutPatientInput | EncounterUpdateManyWithWhereWithoutPatientInput[]
    deleteMany?: EncounterScalarWhereInput | EncounterScalarWhereInput[]
  }

  export type AppointmentUncheckedUpdateManyWithoutPatientNestedInput = {
    create?: XOR<AppointmentCreateWithoutPatientInput, AppointmentUncheckedCreateWithoutPatientInput> | AppointmentCreateWithoutPatientInput[] | AppointmentUncheckedCreateWithoutPatientInput[]
    connectOrCreate?: AppointmentCreateOrConnectWithoutPatientInput | AppointmentCreateOrConnectWithoutPatientInput[]
    upsert?: AppointmentUpsertWithWhereUniqueWithoutPatientInput | AppointmentUpsertWithWhereUniqueWithoutPatientInput[]
    createMany?: AppointmentCreateManyPatientInputEnvelope
    set?: AppointmentWhereUniqueInput | AppointmentWhereUniqueInput[]
    disconnect?: AppointmentWhereUniqueInput | AppointmentWhereUniqueInput[]
    delete?: AppointmentWhereUniqueInput | AppointmentWhereUniqueInput[]
    connect?: AppointmentWhereUniqueInput | AppointmentWhereUniqueInput[]
    update?: AppointmentUpdateWithWhereUniqueWithoutPatientInput | AppointmentUpdateWithWhereUniqueWithoutPatientInput[]
    updateMany?: AppointmentUpdateManyWithWhereWithoutPatientInput | AppointmentUpdateManyWithWhereWithoutPatientInput[]
    deleteMany?: AppointmentScalarWhereInput | AppointmentScalarWhereInput[]
  }

  export type ClinicalDocumentUncheckedUpdateManyWithoutPatientNestedInput = {
    create?: XOR<ClinicalDocumentCreateWithoutPatientInput, ClinicalDocumentUncheckedCreateWithoutPatientInput> | ClinicalDocumentCreateWithoutPatientInput[] | ClinicalDocumentUncheckedCreateWithoutPatientInput[]
    connectOrCreate?: ClinicalDocumentCreateOrConnectWithoutPatientInput | ClinicalDocumentCreateOrConnectWithoutPatientInput[]
    upsert?: ClinicalDocumentUpsertWithWhereUniqueWithoutPatientInput | ClinicalDocumentUpsertWithWhereUniqueWithoutPatientInput[]
    createMany?: ClinicalDocumentCreateManyPatientInputEnvelope
    set?: ClinicalDocumentWhereUniqueInput | ClinicalDocumentWhereUniqueInput[]
    disconnect?: ClinicalDocumentWhereUniqueInput | ClinicalDocumentWhereUniqueInput[]
    delete?: ClinicalDocumentWhereUniqueInput | ClinicalDocumentWhereUniqueInput[]
    connect?: ClinicalDocumentWhereUniqueInput | ClinicalDocumentWhereUniqueInput[]
    update?: ClinicalDocumentUpdateWithWhereUniqueWithoutPatientInput | ClinicalDocumentUpdateWithWhereUniqueWithoutPatientInput[]
    updateMany?: ClinicalDocumentUpdateManyWithWhereWithoutPatientInput | ClinicalDocumentUpdateManyWithWhereWithoutPatientInput[]
    deleteMany?: ClinicalDocumentScalarWhereInput | ClinicalDocumentScalarWhereInput[]
  }

  export type AuditLogUncheckedUpdateManyWithoutPatientNestedInput = {
    create?: XOR<AuditLogCreateWithoutPatientInput, AuditLogUncheckedCreateWithoutPatientInput> | AuditLogCreateWithoutPatientInput[] | AuditLogUncheckedCreateWithoutPatientInput[]
    connectOrCreate?: AuditLogCreateOrConnectWithoutPatientInput | AuditLogCreateOrConnectWithoutPatientInput[]
    upsert?: AuditLogUpsertWithWhereUniqueWithoutPatientInput | AuditLogUpsertWithWhereUniqueWithoutPatientInput[]
    createMany?: AuditLogCreateManyPatientInputEnvelope
    set?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
    disconnect?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
    delete?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
    connect?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
    update?: AuditLogUpdateWithWhereUniqueWithoutPatientInput | AuditLogUpdateWithWhereUniqueWithoutPatientInput[]
    updateMany?: AuditLogUpdateManyWithWhereWithoutPatientInput | AuditLogUpdateManyWithWhereWithoutPatientInput[]
    deleteMany?: AuditLogScalarWhereInput | AuditLogScalarWhereInput[]
  }

  export type PatientCreateNestedOneWithoutAddressInput = {
    create?: XOR<PatientCreateWithoutAddressInput, PatientUncheckedCreateWithoutAddressInput>
    connectOrCreate?: PatientCreateOrConnectWithoutAddressInput
    connect?: PatientWhereUniqueInput
  }

  export type PatientUpdateOneRequiredWithoutAddressNestedInput = {
    create?: XOR<PatientCreateWithoutAddressInput, PatientUncheckedCreateWithoutAddressInput>
    connectOrCreate?: PatientCreateOrConnectWithoutAddressInput
    upsert?: PatientUpsertWithoutAddressInput
    connect?: PatientWhereUniqueInput
    update?: XOR<XOR<PatientUpdateToOneWithWhereWithoutAddressInput, PatientUpdateWithoutAddressInput>, PatientUncheckedUpdateWithoutAddressInput>
  }

  export type PatientCreateNestedOneWithoutEmergencyContactsInput = {
    create?: XOR<PatientCreateWithoutEmergencyContactsInput, PatientUncheckedCreateWithoutEmergencyContactsInput>
    connectOrCreate?: PatientCreateOrConnectWithoutEmergencyContactsInput
    connect?: PatientWhereUniqueInput
  }

  export type PatientUpdateOneRequiredWithoutEmergencyContactsNestedInput = {
    create?: XOR<PatientCreateWithoutEmergencyContactsInput, PatientUncheckedCreateWithoutEmergencyContactsInput>
    connectOrCreate?: PatientCreateOrConnectWithoutEmergencyContactsInput
    upsert?: PatientUpsertWithoutEmergencyContactsInput
    connect?: PatientWhereUniqueInput
    update?: XOR<XOR<PatientUpdateToOneWithWhereWithoutEmergencyContactsInput, PatientUpdateWithoutEmergencyContactsInput>, PatientUncheckedUpdateWithoutEmergencyContactsInput>
  }

  export type PatientCreateNestedOneWithoutInsurancesInput = {
    create?: XOR<PatientCreateWithoutInsurancesInput, PatientUncheckedCreateWithoutInsurancesInput>
    connectOrCreate?: PatientCreateOrConnectWithoutInsurancesInput
    connect?: PatientWhereUniqueInput
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type PatientUpdateOneRequiredWithoutInsurancesNestedInput = {
    create?: XOR<PatientCreateWithoutInsurancesInput, PatientUncheckedCreateWithoutInsurancesInput>
    connectOrCreate?: PatientCreateOrConnectWithoutInsurancesInput
    upsert?: PatientUpsertWithoutInsurancesInput
    connect?: PatientWhereUniqueInput
    update?: XOR<XOR<PatientUpdateToOneWithWhereWithoutInsurancesInput, PatientUpdateWithoutInsurancesInput>, PatientUncheckedUpdateWithoutInsurancesInput>
  }

  export type PatientCreateNestedOneWithoutConditionsInput = {
    create?: XOR<PatientCreateWithoutConditionsInput, PatientUncheckedCreateWithoutConditionsInput>
    connectOrCreate?: PatientCreateOrConnectWithoutConditionsInput
    connect?: PatientWhereUniqueInput
  }

  export type EncounterCreateNestedOneWithoutConditionsInput = {
    create?: XOR<EncounterCreateWithoutConditionsInput, EncounterUncheckedCreateWithoutConditionsInput>
    connectOrCreate?: EncounterCreateOrConnectWithoutConditionsInput
    connect?: EncounterWhereUniqueInput
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type PatientUpdateOneRequiredWithoutConditionsNestedInput = {
    create?: XOR<PatientCreateWithoutConditionsInput, PatientUncheckedCreateWithoutConditionsInput>
    connectOrCreate?: PatientCreateOrConnectWithoutConditionsInput
    upsert?: PatientUpsertWithoutConditionsInput
    connect?: PatientWhereUniqueInput
    update?: XOR<XOR<PatientUpdateToOneWithWhereWithoutConditionsInput, PatientUpdateWithoutConditionsInput>, PatientUncheckedUpdateWithoutConditionsInput>
  }

  export type EncounterUpdateOneWithoutConditionsNestedInput = {
    create?: XOR<EncounterCreateWithoutConditionsInput, EncounterUncheckedCreateWithoutConditionsInput>
    connectOrCreate?: EncounterCreateOrConnectWithoutConditionsInput
    upsert?: EncounterUpsertWithoutConditionsInput
    disconnect?: EncounterWhereInput | boolean
    delete?: EncounterWhereInput | boolean
    connect?: EncounterWhereUniqueInput
    update?: XOR<XOR<EncounterUpdateToOneWithWhereWithoutConditionsInput, EncounterUpdateWithoutConditionsInput>, EncounterUncheckedUpdateWithoutConditionsInput>
  }

  export type PatientCreateNestedOneWithoutMedicationsInput = {
    create?: XOR<PatientCreateWithoutMedicationsInput, PatientUncheckedCreateWithoutMedicationsInput>
    connectOrCreate?: PatientCreateOrConnectWithoutMedicationsInput
    connect?: PatientWhereUniqueInput
  }

  export type EncounterCreateNestedOneWithoutMedicationsInput = {
    create?: XOR<EncounterCreateWithoutMedicationsInput, EncounterUncheckedCreateWithoutMedicationsInput>
    connectOrCreate?: EncounterCreateOrConnectWithoutMedicationsInput
    connect?: EncounterWhereUniqueInput
  }

  export type PatientUpdateOneRequiredWithoutMedicationsNestedInput = {
    create?: XOR<PatientCreateWithoutMedicationsInput, PatientUncheckedCreateWithoutMedicationsInput>
    connectOrCreate?: PatientCreateOrConnectWithoutMedicationsInput
    upsert?: PatientUpsertWithoutMedicationsInput
    connect?: PatientWhereUniqueInput
    update?: XOR<XOR<PatientUpdateToOneWithWhereWithoutMedicationsInput, PatientUpdateWithoutMedicationsInput>, PatientUncheckedUpdateWithoutMedicationsInput>
  }

  export type EncounterUpdateOneWithoutMedicationsNestedInput = {
    create?: XOR<EncounterCreateWithoutMedicationsInput, EncounterUncheckedCreateWithoutMedicationsInput>
    connectOrCreate?: EncounterCreateOrConnectWithoutMedicationsInput
    upsert?: EncounterUpsertWithoutMedicationsInput
    disconnect?: EncounterWhereInput | boolean
    delete?: EncounterWhereInput | boolean
    connect?: EncounterWhereUniqueInput
    update?: XOR<XOR<EncounterUpdateToOneWithWhereWithoutMedicationsInput, EncounterUpdateWithoutMedicationsInput>, EncounterUncheckedUpdateWithoutMedicationsInput>
  }

  export type PatientCreateNestedOneWithoutAllergiesInput = {
    create?: XOR<PatientCreateWithoutAllergiesInput, PatientUncheckedCreateWithoutAllergiesInput>
    connectOrCreate?: PatientCreateOrConnectWithoutAllergiesInput
    connect?: PatientWhereUniqueInput
  }

  export type PatientUpdateOneRequiredWithoutAllergiesNestedInput = {
    create?: XOR<PatientCreateWithoutAllergiesInput, PatientUncheckedCreateWithoutAllergiesInput>
    connectOrCreate?: PatientCreateOrConnectWithoutAllergiesInput
    upsert?: PatientUpsertWithoutAllergiesInput
    connect?: PatientWhereUniqueInput
    update?: XOR<XOR<PatientUpdateToOneWithWhereWithoutAllergiesInput, PatientUpdateWithoutAllergiesInput>, PatientUncheckedUpdateWithoutAllergiesInput>
  }

  export type PatientCreateNestedOneWithoutObservationsInput = {
    create?: XOR<PatientCreateWithoutObservationsInput, PatientUncheckedCreateWithoutObservationsInput>
    connectOrCreate?: PatientCreateOrConnectWithoutObservationsInput
    connect?: PatientWhereUniqueInput
  }

  export type EncounterCreateNestedOneWithoutObservationsInput = {
    create?: XOR<EncounterCreateWithoutObservationsInput, EncounterUncheckedCreateWithoutObservationsInput>
    connectOrCreate?: EncounterCreateOrConnectWithoutObservationsInput
    connect?: EncounterWhereUniqueInput
  }

  export type NullableFloatFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type PatientUpdateOneRequiredWithoutObservationsNestedInput = {
    create?: XOR<PatientCreateWithoutObservationsInput, PatientUncheckedCreateWithoutObservationsInput>
    connectOrCreate?: PatientCreateOrConnectWithoutObservationsInput
    upsert?: PatientUpsertWithoutObservationsInput
    connect?: PatientWhereUniqueInput
    update?: XOR<XOR<PatientUpdateToOneWithWhereWithoutObservationsInput, PatientUpdateWithoutObservationsInput>, PatientUncheckedUpdateWithoutObservationsInput>
  }

  export type EncounterUpdateOneWithoutObservationsNestedInput = {
    create?: XOR<EncounterCreateWithoutObservationsInput, EncounterUncheckedCreateWithoutObservationsInput>
    connectOrCreate?: EncounterCreateOrConnectWithoutObservationsInput
    upsert?: EncounterUpsertWithoutObservationsInput
    disconnect?: EncounterWhereInput | boolean
    delete?: EncounterWhereInput | boolean
    connect?: EncounterWhereUniqueInput
    update?: XOR<XOR<EncounterUpdateToOneWithWhereWithoutObservationsInput, EncounterUpdateWithoutObservationsInput>, EncounterUncheckedUpdateWithoutObservationsInput>
  }

  export type PatientCreateNestedOneWithoutImmunisationsInput = {
    create?: XOR<PatientCreateWithoutImmunisationsInput, PatientUncheckedCreateWithoutImmunisationsInput>
    connectOrCreate?: PatientCreateOrConnectWithoutImmunisationsInput
    connect?: PatientWhereUniqueInput
  }

  export type PatientUpdateOneRequiredWithoutImmunisationsNestedInput = {
    create?: XOR<PatientCreateWithoutImmunisationsInput, PatientUncheckedCreateWithoutImmunisationsInput>
    connectOrCreate?: PatientCreateOrConnectWithoutImmunisationsInput
    upsert?: PatientUpsertWithoutImmunisationsInput
    connect?: PatientWhereUniqueInput
    update?: XOR<XOR<PatientUpdateToOneWithWhereWithoutImmunisationsInput, PatientUpdateWithoutImmunisationsInput>, PatientUncheckedUpdateWithoutImmunisationsInput>
  }

  export type PatientCreateNestedOneWithoutEncountersInput = {
    create?: XOR<PatientCreateWithoutEncountersInput, PatientUncheckedCreateWithoutEncountersInput>
    connectOrCreate?: PatientCreateOrConnectWithoutEncountersInput
    connect?: PatientWhereUniqueInput
  }

  export type ConditionCreateNestedManyWithoutEncounterInput = {
    create?: XOR<ConditionCreateWithoutEncounterInput, ConditionUncheckedCreateWithoutEncounterInput> | ConditionCreateWithoutEncounterInput[] | ConditionUncheckedCreateWithoutEncounterInput[]
    connectOrCreate?: ConditionCreateOrConnectWithoutEncounterInput | ConditionCreateOrConnectWithoutEncounterInput[]
    createMany?: ConditionCreateManyEncounterInputEnvelope
    connect?: ConditionWhereUniqueInput | ConditionWhereUniqueInput[]
  }

  export type MedicationRequestCreateNestedManyWithoutEncounterInput = {
    create?: XOR<MedicationRequestCreateWithoutEncounterInput, MedicationRequestUncheckedCreateWithoutEncounterInput> | MedicationRequestCreateWithoutEncounterInput[] | MedicationRequestUncheckedCreateWithoutEncounterInput[]
    connectOrCreate?: MedicationRequestCreateOrConnectWithoutEncounterInput | MedicationRequestCreateOrConnectWithoutEncounterInput[]
    createMany?: MedicationRequestCreateManyEncounterInputEnvelope
    connect?: MedicationRequestWhereUniqueInput | MedicationRequestWhereUniqueInput[]
  }

  export type ObservationCreateNestedManyWithoutEncounterInput = {
    create?: XOR<ObservationCreateWithoutEncounterInput, ObservationUncheckedCreateWithoutEncounterInput> | ObservationCreateWithoutEncounterInput[] | ObservationUncheckedCreateWithoutEncounterInput[]
    connectOrCreate?: ObservationCreateOrConnectWithoutEncounterInput | ObservationCreateOrConnectWithoutEncounterInput[]
    createMany?: ObservationCreateManyEncounterInputEnvelope
    connect?: ObservationWhereUniqueInput | ObservationWhereUniqueInput[]
  }

  export type ClinicalDocumentCreateNestedManyWithoutEncounterInput = {
    create?: XOR<ClinicalDocumentCreateWithoutEncounterInput, ClinicalDocumentUncheckedCreateWithoutEncounterInput> | ClinicalDocumentCreateWithoutEncounterInput[] | ClinicalDocumentUncheckedCreateWithoutEncounterInput[]
    connectOrCreate?: ClinicalDocumentCreateOrConnectWithoutEncounterInput | ClinicalDocumentCreateOrConnectWithoutEncounterInput[]
    createMany?: ClinicalDocumentCreateManyEncounterInputEnvelope
    connect?: ClinicalDocumentWhereUniqueInput | ClinicalDocumentWhereUniqueInput[]
  }

  export type ConditionUncheckedCreateNestedManyWithoutEncounterInput = {
    create?: XOR<ConditionCreateWithoutEncounterInput, ConditionUncheckedCreateWithoutEncounterInput> | ConditionCreateWithoutEncounterInput[] | ConditionUncheckedCreateWithoutEncounterInput[]
    connectOrCreate?: ConditionCreateOrConnectWithoutEncounterInput | ConditionCreateOrConnectWithoutEncounterInput[]
    createMany?: ConditionCreateManyEncounterInputEnvelope
    connect?: ConditionWhereUniqueInput | ConditionWhereUniqueInput[]
  }

  export type MedicationRequestUncheckedCreateNestedManyWithoutEncounterInput = {
    create?: XOR<MedicationRequestCreateWithoutEncounterInput, MedicationRequestUncheckedCreateWithoutEncounterInput> | MedicationRequestCreateWithoutEncounterInput[] | MedicationRequestUncheckedCreateWithoutEncounterInput[]
    connectOrCreate?: MedicationRequestCreateOrConnectWithoutEncounterInput | MedicationRequestCreateOrConnectWithoutEncounterInput[]
    createMany?: MedicationRequestCreateManyEncounterInputEnvelope
    connect?: MedicationRequestWhereUniqueInput | MedicationRequestWhereUniqueInput[]
  }

  export type ObservationUncheckedCreateNestedManyWithoutEncounterInput = {
    create?: XOR<ObservationCreateWithoutEncounterInput, ObservationUncheckedCreateWithoutEncounterInput> | ObservationCreateWithoutEncounterInput[] | ObservationUncheckedCreateWithoutEncounterInput[]
    connectOrCreate?: ObservationCreateOrConnectWithoutEncounterInput | ObservationCreateOrConnectWithoutEncounterInput[]
    createMany?: ObservationCreateManyEncounterInputEnvelope
    connect?: ObservationWhereUniqueInput | ObservationWhereUniqueInput[]
  }

  export type ClinicalDocumentUncheckedCreateNestedManyWithoutEncounterInput = {
    create?: XOR<ClinicalDocumentCreateWithoutEncounterInput, ClinicalDocumentUncheckedCreateWithoutEncounterInput> | ClinicalDocumentCreateWithoutEncounterInput[] | ClinicalDocumentUncheckedCreateWithoutEncounterInput[]
    connectOrCreate?: ClinicalDocumentCreateOrConnectWithoutEncounterInput | ClinicalDocumentCreateOrConnectWithoutEncounterInput[]
    createMany?: ClinicalDocumentCreateManyEncounterInputEnvelope
    connect?: ClinicalDocumentWhereUniqueInput | ClinicalDocumentWhereUniqueInput[]
  }

  export type PatientUpdateOneRequiredWithoutEncountersNestedInput = {
    create?: XOR<PatientCreateWithoutEncountersInput, PatientUncheckedCreateWithoutEncountersInput>
    connectOrCreate?: PatientCreateOrConnectWithoutEncountersInput
    upsert?: PatientUpsertWithoutEncountersInput
    connect?: PatientWhereUniqueInput
    update?: XOR<XOR<PatientUpdateToOneWithWhereWithoutEncountersInput, PatientUpdateWithoutEncountersInput>, PatientUncheckedUpdateWithoutEncountersInput>
  }

  export type ConditionUpdateManyWithoutEncounterNestedInput = {
    create?: XOR<ConditionCreateWithoutEncounterInput, ConditionUncheckedCreateWithoutEncounterInput> | ConditionCreateWithoutEncounterInput[] | ConditionUncheckedCreateWithoutEncounterInput[]
    connectOrCreate?: ConditionCreateOrConnectWithoutEncounterInput | ConditionCreateOrConnectWithoutEncounterInput[]
    upsert?: ConditionUpsertWithWhereUniqueWithoutEncounterInput | ConditionUpsertWithWhereUniqueWithoutEncounterInput[]
    createMany?: ConditionCreateManyEncounterInputEnvelope
    set?: ConditionWhereUniqueInput | ConditionWhereUniqueInput[]
    disconnect?: ConditionWhereUniqueInput | ConditionWhereUniqueInput[]
    delete?: ConditionWhereUniqueInput | ConditionWhereUniqueInput[]
    connect?: ConditionWhereUniqueInput | ConditionWhereUniqueInput[]
    update?: ConditionUpdateWithWhereUniqueWithoutEncounterInput | ConditionUpdateWithWhereUniqueWithoutEncounterInput[]
    updateMany?: ConditionUpdateManyWithWhereWithoutEncounterInput | ConditionUpdateManyWithWhereWithoutEncounterInput[]
    deleteMany?: ConditionScalarWhereInput | ConditionScalarWhereInput[]
  }

  export type MedicationRequestUpdateManyWithoutEncounterNestedInput = {
    create?: XOR<MedicationRequestCreateWithoutEncounterInput, MedicationRequestUncheckedCreateWithoutEncounterInput> | MedicationRequestCreateWithoutEncounterInput[] | MedicationRequestUncheckedCreateWithoutEncounterInput[]
    connectOrCreate?: MedicationRequestCreateOrConnectWithoutEncounterInput | MedicationRequestCreateOrConnectWithoutEncounterInput[]
    upsert?: MedicationRequestUpsertWithWhereUniqueWithoutEncounterInput | MedicationRequestUpsertWithWhereUniqueWithoutEncounterInput[]
    createMany?: MedicationRequestCreateManyEncounterInputEnvelope
    set?: MedicationRequestWhereUniqueInput | MedicationRequestWhereUniqueInput[]
    disconnect?: MedicationRequestWhereUniqueInput | MedicationRequestWhereUniqueInput[]
    delete?: MedicationRequestWhereUniqueInput | MedicationRequestWhereUniqueInput[]
    connect?: MedicationRequestWhereUniqueInput | MedicationRequestWhereUniqueInput[]
    update?: MedicationRequestUpdateWithWhereUniqueWithoutEncounterInput | MedicationRequestUpdateWithWhereUniqueWithoutEncounterInput[]
    updateMany?: MedicationRequestUpdateManyWithWhereWithoutEncounterInput | MedicationRequestUpdateManyWithWhereWithoutEncounterInput[]
    deleteMany?: MedicationRequestScalarWhereInput | MedicationRequestScalarWhereInput[]
  }

  export type ObservationUpdateManyWithoutEncounterNestedInput = {
    create?: XOR<ObservationCreateWithoutEncounterInput, ObservationUncheckedCreateWithoutEncounterInput> | ObservationCreateWithoutEncounterInput[] | ObservationUncheckedCreateWithoutEncounterInput[]
    connectOrCreate?: ObservationCreateOrConnectWithoutEncounterInput | ObservationCreateOrConnectWithoutEncounterInput[]
    upsert?: ObservationUpsertWithWhereUniqueWithoutEncounterInput | ObservationUpsertWithWhereUniqueWithoutEncounterInput[]
    createMany?: ObservationCreateManyEncounterInputEnvelope
    set?: ObservationWhereUniqueInput | ObservationWhereUniqueInput[]
    disconnect?: ObservationWhereUniqueInput | ObservationWhereUniqueInput[]
    delete?: ObservationWhereUniqueInput | ObservationWhereUniqueInput[]
    connect?: ObservationWhereUniqueInput | ObservationWhereUniqueInput[]
    update?: ObservationUpdateWithWhereUniqueWithoutEncounterInput | ObservationUpdateWithWhereUniqueWithoutEncounterInput[]
    updateMany?: ObservationUpdateManyWithWhereWithoutEncounterInput | ObservationUpdateManyWithWhereWithoutEncounterInput[]
    deleteMany?: ObservationScalarWhereInput | ObservationScalarWhereInput[]
  }

  export type ClinicalDocumentUpdateManyWithoutEncounterNestedInput = {
    create?: XOR<ClinicalDocumentCreateWithoutEncounterInput, ClinicalDocumentUncheckedCreateWithoutEncounterInput> | ClinicalDocumentCreateWithoutEncounterInput[] | ClinicalDocumentUncheckedCreateWithoutEncounterInput[]
    connectOrCreate?: ClinicalDocumentCreateOrConnectWithoutEncounterInput | ClinicalDocumentCreateOrConnectWithoutEncounterInput[]
    upsert?: ClinicalDocumentUpsertWithWhereUniqueWithoutEncounterInput | ClinicalDocumentUpsertWithWhereUniqueWithoutEncounterInput[]
    createMany?: ClinicalDocumentCreateManyEncounterInputEnvelope
    set?: ClinicalDocumentWhereUniqueInput | ClinicalDocumentWhereUniqueInput[]
    disconnect?: ClinicalDocumentWhereUniqueInput | ClinicalDocumentWhereUniqueInput[]
    delete?: ClinicalDocumentWhereUniqueInput | ClinicalDocumentWhereUniqueInput[]
    connect?: ClinicalDocumentWhereUniqueInput | ClinicalDocumentWhereUniqueInput[]
    update?: ClinicalDocumentUpdateWithWhereUniqueWithoutEncounterInput | ClinicalDocumentUpdateWithWhereUniqueWithoutEncounterInput[]
    updateMany?: ClinicalDocumentUpdateManyWithWhereWithoutEncounterInput | ClinicalDocumentUpdateManyWithWhereWithoutEncounterInput[]
    deleteMany?: ClinicalDocumentScalarWhereInput | ClinicalDocumentScalarWhereInput[]
  }

  export type ConditionUncheckedUpdateManyWithoutEncounterNestedInput = {
    create?: XOR<ConditionCreateWithoutEncounterInput, ConditionUncheckedCreateWithoutEncounterInput> | ConditionCreateWithoutEncounterInput[] | ConditionUncheckedCreateWithoutEncounterInput[]
    connectOrCreate?: ConditionCreateOrConnectWithoutEncounterInput | ConditionCreateOrConnectWithoutEncounterInput[]
    upsert?: ConditionUpsertWithWhereUniqueWithoutEncounterInput | ConditionUpsertWithWhereUniqueWithoutEncounterInput[]
    createMany?: ConditionCreateManyEncounterInputEnvelope
    set?: ConditionWhereUniqueInput | ConditionWhereUniqueInput[]
    disconnect?: ConditionWhereUniqueInput | ConditionWhereUniqueInput[]
    delete?: ConditionWhereUniqueInput | ConditionWhereUniqueInput[]
    connect?: ConditionWhereUniqueInput | ConditionWhereUniqueInput[]
    update?: ConditionUpdateWithWhereUniqueWithoutEncounterInput | ConditionUpdateWithWhereUniqueWithoutEncounterInput[]
    updateMany?: ConditionUpdateManyWithWhereWithoutEncounterInput | ConditionUpdateManyWithWhereWithoutEncounterInput[]
    deleteMany?: ConditionScalarWhereInput | ConditionScalarWhereInput[]
  }

  export type MedicationRequestUncheckedUpdateManyWithoutEncounterNestedInput = {
    create?: XOR<MedicationRequestCreateWithoutEncounterInput, MedicationRequestUncheckedCreateWithoutEncounterInput> | MedicationRequestCreateWithoutEncounterInput[] | MedicationRequestUncheckedCreateWithoutEncounterInput[]
    connectOrCreate?: MedicationRequestCreateOrConnectWithoutEncounterInput | MedicationRequestCreateOrConnectWithoutEncounterInput[]
    upsert?: MedicationRequestUpsertWithWhereUniqueWithoutEncounterInput | MedicationRequestUpsertWithWhereUniqueWithoutEncounterInput[]
    createMany?: MedicationRequestCreateManyEncounterInputEnvelope
    set?: MedicationRequestWhereUniqueInput | MedicationRequestWhereUniqueInput[]
    disconnect?: MedicationRequestWhereUniqueInput | MedicationRequestWhereUniqueInput[]
    delete?: MedicationRequestWhereUniqueInput | MedicationRequestWhereUniqueInput[]
    connect?: MedicationRequestWhereUniqueInput | MedicationRequestWhereUniqueInput[]
    update?: MedicationRequestUpdateWithWhereUniqueWithoutEncounterInput | MedicationRequestUpdateWithWhereUniqueWithoutEncounterInput[]
    updateMany?: MedicationRequestUpdateManyWithWhereWithoutEncounterInput | MedicationRequestUpdateManyWithWhereWithoutEncounterInput[]
    deleteMany?: MedicationRequestScalarWhereInput | MedicationRequestScalarWhereInput[]
  }

  export type ObservationUncheckedUpdateManyWithoutEncounterNestedInput = {
    create?: XOR<ObservationCreateWithoutEncounterInput, ObservationUncheckedCreateWithoutEncounterInput> | ObservationCreateWithoutEncounterInput[] | ObservationUncheckedCreateWithoutEncounterInput[]
    connectOrCreate?: ObservationCreateOrConnectWithoutEncounterInput | ObservationCreateOrConnectWithoutEncounterInput[]
    upsert?: ObservationUpsertWithWhereUniqueWithoutEncounterInput | ObservationUpsertWithWhereUniqueWithoutEncounterInput[]
    createMany?: ObservationCreateManyEncounterInputEnvelope
    set?: ObservationWhereUniqueInput | ObservationWhereUniqueInput[]
    disconnect?: ObservationWhereUniqueInput | ObservationWhereUniqueInput[]
    delete?: ObservationWhereUniqueInput | ObservationWhereUniqueInput[]
    connect?: ObservationWhereUniqueInput | ObservationWhereUniqueInput[]
    update?: ObservationUpdateWithWhereUniqueWithoutEncounterInput | ObservationUpdateWithWhereUniqueWithoutEncounterInput[]
    updateMany?: ObservationUpdateManyWithWhereWithoutEncounterInput | ObservationUpdateManyWithWhereWithoutEncounterInput[]
    deleteMany?: ObservationScalarWhereInput | ObservationScalarWhereInput[]
  }

  export type ClinicalDocumentUncheckedUpdateManyWithoutEncounterNestedInput = {
    create?: XOR<ClinicalDocumentCreateWithoutEncounterInput, ClinicalDocumentUncheckedCreateWithoutEncounterInput> | ClinicalDocumentCreateWithoutEncounterInput[] | ClinicalDocumentUncheckedCreateWithoutEncounterInput[]
    connectOrCreate?: ClinicalDocumentCreateOrConnectWithoutEncounterInput | ClinicalDocumentCreateOrConnectWithoutEncounterInput[]
    upsert?: ClinicalDocumentUpsertWithWhereUniqueWithoutEncounterInput | ClinicalDocumentUpsertWithWhereUniqueWithoutEncounterInput[]
    createMany?: ClinicalDocumentCreateManyEncounterInputEnvelope
    set?: ClinicalDocumentWhereUniqueInput | ClinicalDocumentWhereUniqueInput[]
    disconnect?: ClinicalDocumentWhereUniqueInput | ClinicalDocumentWhereUniqueInput[]
    delete?: ClinicalDocumentWhereUniqueInput | ClinicalDocumentWhereUniqueInput[]
    connect?: ClinicalDocumentWhereUniqueInput | ClinicalDocumentWhereUniqueInput[]
    update?: ClinicalDocumentUpdateWithWhereUniqueWithoutEncounterInput | ClinicalDocumentUpdateWithWhereUniqueWithoutEncounterInput[]
    updateMany?: ClinicalDocumentUpdateManyWithWhereWithoutEncounterInput | ClinicalDocumentUpdateManyWithWhereWithoutEncounterInput[]
    deleteMany?: ClinicalDocumentScalarWhereInput | ClinicalDocumentScalarWhereInput[]
  }

  export type PatientCreateNestedOneWithoutAppointmentsInput = {
    create?: XOR<PatientCreateWithoutAppointmentsInput, PatientUncheckedCreateWithoutAppointmentsInput>
    connectOrCreate?: PatientCreateOrConnectWithoutAppointmentsInput
    connect?: PatientWhereUniqueInput
  }

  export type PatientUpdateOneRequiredWithoutAppointmentsNestedInput = {
    create?: XOR<PatientCreateWithoutAppointmentsInput, PatientUncheckedCreateWithoutAppointmentsInput>
    connectOrCreate?: PatientCreateOrConnectWithoutAppointmentsInput
    upsert?: PatientUpsertWithoutAppointmentsInput
    connect?: PatientWhereUniqueInput
    update?: XOR<XOR<PatientUpdateToOneWithWhereWithoutAppointmentsInput, PatientUpdateWithoutAppointmentsInput>, PatientUncheckedUpdateWithoutAppointmentsInput>
  }

  export type PatientCreateNestedOneWithoutDocumentsInput = {
    create?: XOR<PatientCreateWithoutDocumentsInput, PatientUncheckedCreateWithoutDocumentsInput>
    connectOrCreate?: PatientCreateOrConnectWithoutDocumentsInput
    connect?: PatientWhereUniqueInput
  }

  export type EncounterCreateNestedOneWithoutDocumentsInput = {
    create?: XOR<EncounterCreateWithoutDocumentsInput, EncounterUncheckedCreateWithoutDocumentsInput>
    connectOrCreate?: EncounterCreateOrConnectWithoutDocumentsInput
    connect?: EncounterWhereUniqueInput
  }

  export type PatientUpdateOneRequiredWithoutDocumentsNestedInput = {
    create?: XOR<PatientCreateWithoutDocumentsInput, PatientUncheckedCreateWithoutDocumentsInput>
    connectOrCreate?: PatientCreateOrConnectWithoutDocumentsInput
    upsert?: PatientUpsertWithoutDocumentsInput
    connect?: PatientWhereUniqueInput
    update?: XOR<XOR<PatientUpdateToOneWithWhereWithoutDocumentsInput, PatientUpdateWithoutDocumentsInput>, PatientUncheckedUpdateWithoutDocumentsInput>
  }

  export type EncounterUpdateOneWithoutDocumentsNestedInput = {
    create?: XOR<EncounterCreateWithoutDocumentsInput, EncounterUncheckedCreateWithoutDocumentsInput>
    connectOrCreate?: EncounterCreateOrConnectWithoutDocumentsInput
    upsert?: EncounterUpsertWithoutDocumentsInput
    disconnect?: EncounterWhereInput | boolean
    delete?: EncounterWhereInput | boolean
    connect?: EncounterWhereUniqueInput
    update?: XOR<XOR<EncounterUpdateToOneWithWhereWithoutDocumentsInput, EncounterUpdateWithoutDocumentsInput>, EncounterUncheckedUpdateWithoutDocumentsInput>
  }

  export type PatientCreateNestedOneWithoutAuditLogsInput = {
    create?: XOR<PatientCreateWithoutAuditLogsInput, PatientUncheckedCreateWithoutAuditLogsInput>
    connectOrCreate?: PatientCreateOrConnectWithoutAuditLogsInput
    connect?: PatientWhereUniqueInput
  }

  export type PatientUpdateOneWithoutAuditLogsNestedInput = {
    create?: XOR<PatientCreateWithoutAuditLogsInput, PatientUncheckedCreateWithoutAuditLogsInput>
    connectOrCreate?: PatientCreateOrConnectWithoutAuditLogsInput
    upsert?: PatientUpsertWithoutAuditLogsInput
    disconnect?: PatientWhereInput | boolean
    delete?: PatientWhereInput | boolean
    connect?: PatientWhereUniqueInput
    update?: XOR<XOR<PatientUpdateToOneWithWhereWithoutAuditLogsInput, PatientUpdateWithoutAuditLogsInput>, PatientUncheckedUpdateWithoutAuditLogsInput>
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type NestedFloatNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedFloatNullableFilter<$PrismaModel>
    _min?: NestedFloatNullableFilter<$PrismaModel>
    _max?: NestedFloatNullableFilter<$PrismaModel>
  }
  export type NestedJsonNullableFilter<$PrismaModel = never> = 
    | PatchUndefined<
        Either<Required<NestedJsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type PatientAddressCreateWithoutPatientInput = {
    id?: string
    line1?: string | null
    line2?: string | null
    city?: string | null
    state?: string | null
    postalCode?: string | null
    country?: string
  }

  export type PatientAddressUncheckedCreateWithoutPatientInput = {
    id?: string
    line1?: string | null
    line2?: string | null
    city?: string | null
    state?: string | null
    postalCode?: string | null
    country?: string
  }

  export type PatientAddressCreateOrConnectWithoutPatientInput = {
    where: PatientAddressWhereUniqueInput
    create: XOR<PatientAddressCreateWithoutPatientInput, PatientAddressUncheckedCreateWithoutPatientInput>
  }

  export type EmergencyContactCreateWithoutPatientInput = {
    id?: string
    name: string
    relationship: string
    phone: string
  }

  export type EmergencyContactUncheckedCreateWithoutPatientInput = {
    id?: string
    name: string
    relationship: string
    phone: string
  }

  export type EmergencyContactCreateOrConnectWithoutPatientInput = {
    where: EmergencyContactWhereUniqueInput
    create: XOR<EmergencyContactCreateWithoutPatientInput, EmergencyContactUncheckedCreateWithoutPatientInput>
  }

  export type EmergencyContactCreateManyPatientInputEnvelope = {
    data: EmergencyContactCreateManyPatientInput | EmergencyContactCreateManyPatientInput[]
    skipDuplicates?: boolean
  }

  export type PatientInsuranceCreateWithoutPatientInput = {
    id?: string
    priority?: number
    payerName: string
    memberId: string
    groupId?: string | null
    subscriberName?: string | null
    isActive?: boolean
    createdAt?: Date | string
  }

  export type PatientInsuranceUncheckedCreateWithoutPatientInput = {
    id?: string
    priority?: number
    payerName: string
    memberId: string
    groupId?: string | null
    subscriberName?: string | null
    isActive?: boolean
    createdAt?: Date | string
  }

  export type PatientInsuranceCreateOrConnectWithoutPatientInput = {
    where: PatientInsuranceWhereUniqueInput
    create: XOR<PatientInsuranceCreateWithoutPatientInput, PatientInsuranceUncheckedCreateWithoutPatientInput>
  }

  export type PatientInsuranceCreateManyPatientInputEnvelope = {
    data: PatientInsuranceCreateManyPatientInput | PatientInsuranceCreateManyPatientInput[]
    skipDuplicates?: boolean
  }

  export type ConditionCreateWithoutPatientInput = {
    id?: string
    snomedCode?: string | null
    icd10Code?: string | null
    display: string
    clinicalStatus?: string
    verificationStatus?: string
    severity?: string | null
    onsetDate?: Date | string | null
    resolvedDate?: Date | string | null
    recordedAt?: Date | string
    recordedBy: string
    encounter?: EncounterCreateNestedOneWithoutConditionsInput
  }

  export type ConditionUncheckedCreateWithoutPatientInput = {
    id?: string
    encounterId?: string | null
    snomedCode?: string | null
    icd10Code?: string | null
    display: string
    clinicalStatus?: string
    verificationStatus?: string
    severity?: string | null
    onsetDate?: Date | string | null
    resolvedDate?: Date | string | null
    recordedAt?: Date | string
    recordedBy: string
  }

  export type ConditionCreateOrConnectWithoutPatientInput = {
    where: ConditionWhereUniqueInput
    create: XOR<ConditionCreateWithoutPatientInput, ConditionUncheckedCreateWithoutPatientInput>
  }

  export type ConditionCreateManyPatientInputEnvelope = {
    data: ConditionCreateManyPatientInput | ConditionCreateManyPatientInput[]
    skipDuplicates?: boolean
  }

  export type MedicationRequestCreateWithoutPatientInput = {
    id?: string
    rxNormCode?: string | null
    medicationName: string
    dose?: string | null
    frequency?: string | null
    route?: string | null
    status?: string
    prescribedBy: string
    prescribedAt?: Date | string
    discontinuedAt?: Date | string | null
    discontinuedBy?: string | null
    notes?: string | null
    encounter?: EncounterCreateNestedOneWithoutMedicationsInput
  }

  export type MedicationRequestUncheckedCreateWithoutPatientInput = {
    id?: string
    encounterId?: string | null
    rxNormCode?: string | null
    medicationName: string
    dose?: string | null
    frequency?: string | null
    route?: string | null
    status?: string
    prescribedBy: string
    prescribedAt?: Date | string
    discontinuedAt?: Date | string | null
    discontinuedBy?: string | null
    notes?: string | null
  }

  export type MedicationRequestCreateOrConnectWithoutPatientInput = {
    where: MedicationRequestWhereUniqueInput
    create: XOR<MedicationRequestCreateWithoutPatientInput, MedicationRequestUncheckedCreateWithoutPatientInput>
  }

  export type MedicationRequestCreateManyPatientInputEnvelope = {
    data: MedicationRequestCreateManyPatientInput | MedicationRequestCreateManyPatientInput[]
    skipDuplicates?: boolean
  }

  export type AllergyIntoleranceCreateWithoutPatientInput = {
    id?: string
    substance: string
    substanceCode?: string | null
    type?: string
    criticality?: string | null
    clinicalStatus?: string
    reaction?: string | null
    reactionSeverity?: string | null
    onsetDate?: Date | string | null
    recordedAt?: Date | string
    recordedBy: string
  }

  export type AllergyIntoleranceUncheckedCreateWithoutPatientInput = {
    id?: string
    substance: string
    substanceCode?: string | null
    type?: string
    criticality?: string | null
    clinicalStatus?: string
    reaction?: string | null
    reactionSeverity?: string | null
    onsetDate?: Date | string | null
    recordedAt?: Date | string
    recordedBy: string
  }

  export type AllergyIntoleranceCreateOrConnectWithoutPatientInput = {
    where: AllergyIntoleranceWhereUniqueInput
    create: XOR<AllergyIntoleranceCreateWithoutPatientInput, AllergyIntoleranceUncheckedCreateWithoutPatientInput>
  }

  export type AllergyIntoleranceCreateManyPatientInputEnvelope = {
    data: AllergyIntoleranceCreateManyPatientInput | AllergyIntoleranceCreateManyPatientInput[]
    skipDuplicates?: boolean
  }

  export type ObservationCreateWithoutPatientInput = {
    id?: string
    category: string
    loincCode?: string | null
    display: string
    valueQuantity?: number | null
    valueUnit?: string | null
    valueString?: string | null
    referenceRangeLow?: number | null
    referenceRangeHigh?: number | null
    isAbnormal?: boolean
    status?: string
    effectiveAt: Date | string
    recordedBy: string
    encounter?: EncounterCreateNestedOneWithoutObservationsInput
  }

  export type ObservationUncheckedCreateWithoutPatientInput = {
    id?: string
    encounterId?: string | null
    category: string
    loincCode?: string | null
    display: string
    valueQuantity?: number | null
    valueUnit?: string | null
    valueString?: string | null
    referenceRangeLow?: number | null
    referenceRangeHigh?: number | null
    isAbnormal?: boolean
    status?: string
    effectiveAt: Date | string
    recordedBy: string
  }

  export type ObservationCreateOrConnectWithoutPatientInput = {
    where: ObservationWhereUniqueInput
    create: XOR<ObservationCreateWithoutPatientInput, ObservationUncheckedCreateWithoutPatientInput>
  }

  export type ObservationCreateManyPatientInputEnvelope = {
    data: ObservationCreateManyPatientInput | ObservationCreateManyPatientInput[]
    skipDuplicates?: boolean
  }

  export type ImmunisationCreateWithoutPatientInput = {
    id?: string
    vaccineCode?: string | null
    vaccineName: string
    status?: string
    occurrenceDate: Date | string
    lotNumber?: string | null
    site?: string | null
    route?: string | null
    administeredBy?: string | null
    primarySource?: boolean
    notes?: string | null
    createdAt?: Date | string
  }

  export type ImmunisationUncheckedCreateWithoutPatientInput = {
    id?: string
    vaccineCode?: string | null
    vaccineName: string
    status?: string
    occurrenceDate: Date | string
    lotNumber?: string | null
    site?: string | null
    route?: string | null
    administeredBy?: string | null
    primarySource?: boolean
    notes?: string | null
    createdAt?: Date | string
  }

  export type ImmunisationCreateOrConnectWithoutPatientInput = {
    where: ImmunisationWhereUniqueInput
    create: XOR<ImmunisationCreateWithoutPatientInput, ImmunisationUncheckedCreateWithoutPatientInput>
  }

  export type ImmunisationCreateManyPatientInputEnvelope = {
    data: ImmunisationCreateManyPatientInput | ImmunisationCreateManyPatientInput[]
    skipDuplicates?: boolean
  }

  export type EncounterCreateWithoutPatientInput = {
    id?: string
    status?: string
    encounterClass?: string
    type?: string | null
    reasonCode?: string | null
    reasonDisplay?: string | null
    startTime?: Date | string | null
    endTime?: Date | string | null
    providerId: string
    locationId?: string | null
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    conditions?: ConditionCreateNestedManyWithoutEncounterInput
    medications?: MedicationRequestCreateNestedManyWithoutEncounterInput
    observations?: ObservationCreateNestedManyWithoutEncounterInput
    documents?: ClinicalDocumentCreateNestedManyWithoutEncounterInput
  }

  export type EncounterUncheckedCreateWithoutPatientInput = {
    id?: string
    status?: string
    encounterClass?: string
    type?: string | null
    reasonCode?: string | null
    reasonDisplay?: string | null
    startTime?: Date | string | null
    endTime?: Date | string | null
    providerId: string
    locationId?: string | null
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    conditions?: ConditionUncheckedCreateNestedManyWithoutEncounterInput
    medications?: MedicationRequestUncheckedCreateNestedManyWithoutEncounterInput
    observations?: ObservationUncheckedCreateNestedManyWithoutEncounterInput
    documents?: ClinicalDocumentUncheckedCreateNestedManyWithoutEncounterInput
  }

  export type EncounterCreateOrConnectWithoutPatientInput = {
    where: EncounterWhereUniqueInput
    create: XOR<EncounterCreateWithoutPatientInput, EncounterUncheckedCreateWithoutPatientInput>
  }

  export type EncounterCreateManyPatientInputEnvelope = {
    data: EncounterCreateManyPatientInput | EncounterCreateManyPatientInput[]
    skipDuplicates?: boolean
  }

  export type AppointmentCreateWithoutPatientInput = {
    id?: string
    providerId: string
    status?: string
    serviceType?: string | null
    description?: string | null
    startTime: Date | string
    endTime: Date | string
    durationMinutes?: number
    locationId?: string | null
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AppointmentUncheckedCreateWithoutPatientInput = {
    id?: string
    providerId: string
    status?: string
    serviceType?: string | null
    description?: string | null
    startTime: Date | string
    endTime: Date | string
    durationMinutes?: number
    locationId?: string | null
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AppointmentCreateOrConnectWithoutPatientInput = {
    where: AppointmentWhereUniqueInput
    create: XOR<AppointmentCreateWithoutPatientInput, AppointmentUncheckedCreateWithoutPatientInput>
  }

  export type AppointmentCreateManyPatientInputEnvelope = {
    data: AppointmentCreateManyPatientInput | AppointmentCreateManyPatientInput[]
    skipDuplicates?: boolean
  }

  export type ClinicalDocumentCreateWithoutPatientInput = {
    id?: string
    type: string
    title: string
    content: string
    status?: string
    authorId: string
    authorName: string
    signedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    encounter?: EncounterCreateNestedOneWithoutDocumentsInput
  }

  export type ClinicalDocumentUncheckedCreateWithoutPatientInput = {
    id?: string
    encounterId?: string | null
    type: string
    title: string
    content: string
    status?: string
    authorId: string
    authorName: string
    signedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ClinicalDocumentCreateOrConnectWithoutPatientInput = {
    where: ClinicalDocumentWhereUniqueInput
    create: XOR<ClinicalDocumentCreateWithoutPatientInput, ClinicalDocumentUncheckedCreateWithoutPatientInput>
  }

  export type ClinicalDocumentCreateManyPatientInputEnvelope = {
    data: ClinicalDocumentCreateManyPatientInput | ClinicalDocumentCreateManyPatientInput[]
    skipDuplicates?: boolean
  }

  export type AuditLogCreateWithoutPatientInput = {
    id?: string
    userId: string
    action: string
    resourceType: string
    resourceId?: string | null
    changes?: NullableJsonNullValueInput | InputJsonValue
    ipAddress?: string | null
    correlationId?: string | null
    createdAt?: Date | string
  }

  export type AuditLogUncheckedCreateWithoutPatientInput = {
    id?: string
    userId: string
    action: string
    resourceType: string
    resourceId?: string | null
    changes?: NullableJsonNullValueInput | InputJsonValue
    ipAddress?: string | null
    correlationId?: string | null
    createdAt?: Date | string
  }

  export type AuditLogCreateOrConnectWithoutPatientInput = {
    where: AuditLogWhereUniqueInput
    create: XOR<AuditLogCreateWithoutPatientInput, AuditLogUncheckedCreateWithoutPatientInput>
  }

  export type AuditLogCreateManyPatientInputEnvelope = {
    data: AuditLogCreateManyPatientInput | AuditLogCreateManyPatientInput[]
    skipDuplicates?: boolean
  }

  export type PatientAddressUpsertWithoutPatientInput = {
    update: XOR<PatientAddressUpdateWithoutPatientInput, PatientAddressUncheckedUpdateWithoutPatientInput>
    create: XOR<PatientAddressCreateWithoutPatientInput, PatientAddressUncheckedCreateWithoutPatientInput>
    where?: PatientAddressWhereInput
  }

  export type PatientAddressUpdateToOneWithWhereWithoutPatientInput = {
    where?: PatientAddressWhereInput
    data: XOR<PatientAddressUpdateWithoutPatientInput, PatientAddressUncheckedUpdateWithoutPatientInput>
  }

  export type PatientAddressUpdateWithoutPatientInput = {
    id?: StringFieldUpdateOperationsInput | string
    line1?: NullableStringFieldUpdateOperationsInput | string | null
    line2?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    state?: NullableStringFieldUpdateOperationsInput | string | null
    postalCode?: NullableStringFieldUpdateOperationsInput | string | null
    country?: StringFieldUpdateOperationsInput | string
  }

  export type PatientAddressUncheckedUpdateWithoutPatientInput = {
    id?: StringFieldUpdateOperationsInput | string
    line1?: NullableStringFieldUpdateOperationsInput | string | null
    line2?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    state?: NullableStringFieldUpdateOperationsInput | string | null
    postalCode?: NullableStringFieldUpdateOperationsInput | string | null
    country?: StringFieldUpdateOperationsInput | string
  }

  export type EmergencyContactUpsertWithWhereUniqueWithoutPatientInput = {
    where: EmergencyContactWhereUniqueInput
    update: XOR<EmergencyContactUpdateWithoutPatientInput, EmergencyContactUncheckedUpdateWithoutPatientInput>
    create: XOR<EmergencyContactCreateWithoutPatientInput, EmergencyContactUncheckedCreateWithoutPatientInput>
  }

  export type EmergencyContactUpdateWithWhereUniqueWithoutPatientInput = {
    where: EmergencyContactWhereUniqueInput
    data: XOR<EmergencyContactUpdateWithoutPatientInput, EmergencyContactUncheckedUpdateWithoutPatientInput>
  }

  export type EmergencyContactUpdateManyWithWhereWithoutPatientInput = {
    where: EmergencyContactScalarWhereInput
    data: XOR<EmergencyContactUpdateManyMutationInput, EmergencyContactUncheckedUpdateManyWithoutPatientInput>
  }

  export type EmergencyContactScalarWhereInput = {
    AND?: EmergencyContactScalarWhereInput | EmergencyContactScalarWhereInput[]
    OR?: EmergencyContactScalarWhereInput[]
    NOT?: EmergencyContactScalarWhereInput | EmergencyContactScalarWhereInput[]
    id?: StringFilter<"EmergencyContact"> | string
    patientId?: StringFilter<"EmergencyContact"> | string
    name?: StringFilter<"EmergencyContact"> | string
    relationship?: StringFilter<"EmergencyContact"> | string
    phone?: StringFilter<"EmergencyContact"> | string
  }

  export type PatientInsuranceUpsertWithWhereUniqueWithoutPatientInput = {
    where: PatientInsuranceWhereUniqueInput
    update: XOR<PatientInsuranceUpdateWithoutPatientInput, PatientInsuranceUncheckedUpdateWithoutPatientInput>
    create: XOR<PatientInsuranceCreateWithoutPatientInput, PatientInsuranceUncheckedCreateWithoutPatientInput>
  }

  export type PatientInsuranceUpdateWithWhereUniqueWithoutPatientInput = {
    where: PatientInsuranceWhereUniqueInput
    data: XOR<PatientInsuranceUpdateWithoutPatientInput, PatientInsuranceUncheckedUpdateWithoutPatientInput>
  }

  export type PatientInsuranceUpdateManyWithWhereWithoutPatientInput = {
    where: PatientInsuranceScalarWhereInput
    data: XOR<PatientInsuranceUpdateManyMutationInput, PatientInsuranceUncheckedUpdateManyWithoutPatientInput>
  }

  export type PatientInsuranceScalarWhereInput = {
    AND?: PatientInsuranceScalarWhereInput | PatientInsuranceScalarWhereInput[]
    OR?: PatientInsuranceScalarWhereInput[]
    NOT?: PatientInsuranceScalarWhereInput | PatientInsuranceScalarWhereInput[]
    id?: StringFilter<"PatientInsurance"> | string
    patientId?: StringFilter<"PatientInsurance"> | string
    priority?: IntFilter<"PatientInsurance"> | number
    payerName?: StringFilter<"PatientInsurance"> | string
    memberId?: StringFilter<"PatientInsurance"> | string
    groupId?: StringNullableFilter<"PatientInsurance"> | string | null
    subscriberName?: StringNullableFilter<"PatientInsurance"> | string | null
    isActive?: BoolFilter<"PatientInsurance"> | boolean
    createdAt?: DateTimeFilter<"PatientInsurance"> | Date | string
  }

  export type ConditionUpsertWithWhereUniqueWithoutPatientInput = {
    where: ConditionWhereUniqueInput
    update: XOR<ConditionUpdateWithoutPatientInput, ConditionUncheckedUpdateWithoutPatientInput>
    create: XOR<ConditionCreateWithoutPatientInput, ConditionUncheckedCreateWithoutPatientInput>
  }

  export type ConditionUpdateWithWhereUniqueWithoutPatientInput = {
    where: ConditionWhereUniqueInput
    data: XOR<ConditionUpdateWithoutPatientInput, ConditionUncheckedUpdateWithoutPatientInput>
  }

  export type ConditionUpdateManyWithWhereWithoutPatientInput = {
    where: ConditionScalarWhereInput
    data: XOR<ConditionUpdateManyMutationInput, ConditionUncheckedUpdateManyWithoutPatientInput>
  }

  export type ConditionScalarWhereInput = {
    AND?: ConditionScalarWhereInput | ConditionScalarWhereInput[]
    OR?: ConditionScalarWhereInput[]
    NOT?: ConditionScalarWhereInput | ConditionScalarWhereInput[]
    id?: StringFilter<"Condition"> | string
    patientId?: StringFilter<"Condition"> | string
    encounterId?: StringNullableFilter<"Condition"> | string | null
    snomedCode?: StringNullableFilter<"Condition"> | string | null
    icd10Code?: StringNullableFilter<"Condition"> | string | null
    display?: StringFilter<"Condition"> | string
    clinicalStatus?: StringFilter<"Condition"> | string
    verificationStatus?: StringFilter<"Condition"> | string
    severity?: StringNullableFilter<"Condition"> | string | null
    onsetDate?: DateTimeNullableFilter<"Condition"> | Date | string | null
    resolvedDate?: DateTimeNullableFilter<"Condition"> | Date | string | null
    recordedAt?: DateTimeFilter<"Condition"> | Date | string
    recordedBy?: StringFilter<"Condition"> | string
  }

  export type MedicationRequestUpsertWithWhereUniqueWithoutPatientInput = {
    where: MedicationRequestWhereUniqueInput
    update: XOR<MedicationRequestUpdateWithoutPatientInput, MedicationRequestUncheckedUpdateWithoutPatientInput>
    create: XOR<MedicationRequestCreateWithoutPatientInput, MedicationRequestUncheckedCreateWithoutPatientInput>
  }

  export type MedicationRequestUpdateWithWhereUniqueWithoutPatientInput = {
    where: MedicationRequestWhereUniqueInput
    data: XOR<MedicationRequestUpdateWithoutPatientInput, MedicationRequestUncheckedUpdateWithoutPatientInput>
  }

  export type MedicationRequestUpdateManyWithWhereWithoutPatientInput = {
    where: MedicationRequestScalarWhereInput
    data: XOR<MedicationRequestUpdateManyMutationInput, MedicationRequestUncheckedUpdateManyWithoutPatientInput>
  }

  export type MedicationRequestScalarWhereInput = {
    AND?: MedicationRequestScalarWhereInput | MedicationRequestScalarWhereInput[]
    OR?: MedicationRequestScalarWhereInput[]
    NOT?: MedicationRequestScalarWhereInput | MedicationRequestScalarWhereInput[]
    id?: StringFilter<"MedicationRequest"> | string
    patientId?: StringFilter<"MedicationRequest"> | string
    encounterId?: StringNullableFilter<"MedicationRequest"> | string | null
    rxNormCode?: StringNullableFilter<"MedicationRequest"> | string | null
    medicationName?: StringFilter<"MedicationRequest"> | string
    dose?: StringNullableFilter<"MedicationRequest"> | string | null
    frequency?: StringNullableFilter<"MedicationRequest"> | string | null
    route?: StringNullableFilter<"MedicationRequest"> | string | null
    status?: StringFilter<"MedicationRequest"> | string
    prescribedBy?: StringFilter<"MedicationRequest"> | string
    prescribedAt?: DateTimeFilter<"MedicationRequest"> | Date | string
    discontinuedAt?: DateTimeNullableFilter<"MedicationRequest"> | Date | string | null
    discontinuedBy?: StringNullableFilter<"MedicationRequest"> | string | null
    notes?: StringNullableFilter<"MedicationRequest"> | string | null
  }

  export type AllergyIntoleranceUpsertWithWhereUniqueWithoutPatientInput = {
    where: AllergyIntoleranceWhereUniqueInput
    update: XOR<AllergyIntoleranceUpdateWithoutPatientInput, AllergyIntoleranceUncheckedUpdateWithoutPatientInput>
    create: XOR<AllergyIntoleranceCreateWithoutPatientInput, AllergyIntoleranceUncheckedCreateWithoutPatientInput>
  }

  export type AllergyIntoleranceUpdateWithWhereUniqueWithoutPatientInput = {
    where: AllergyIntoleranceWhereUniqueInput
    data: XOR<AllergyIntoleranceUpdateWithoutPatientInput, AllergyIntoleranceUncheckedUpdateWithoutPatientInput>
  }

  export type AllergyIntoleranceUpdateManyWithWhereWithoutPatientInput = {
    where: AllergyIntoleranceScalarWhereInput
    data: XOR<AllergyIntoleranceUpdateManyMutationInput, AllergyIntoleranceUncheckedUpdateManyWithoutPatientInput>
  }

  export type AllergyIntoleranceScalarWhereInput = {
    AND?: AllergyIntoleranceScalarWhereInput | AllergyIntoleranceScalarWhereInput[]
    OR?: AllergyIntoleranceScalarWhereInput[]
    NOT?: AllergyIntoleranceScalarWhereInput | AllergyIntoleranceScalarWhereInput[]
    id?: StringFilter<"AllergyIntolerance"> | string
    patientId?: StringFilter<"AllergyIntolerance"> | string
    substance?: StringFilter<"AllergyIntolerance"> | string
    substanceCode?: StringNullableFilter<"AllergyIntolerance"> | string | null
    type?: StringFilter<"AllergyIntolerance"> | string
    criticality?: StringNullableFilter<"AllergyIntolerance"> | string | null
    clinicalStatus?: StringFilter<"AllergyIntolerance"> | string
    reaction?: StringNullableFilter<"AllergyIntolerance"> | string | null
    reactionSeverity?: StringNullableFilter<"AllergyIntolerance"> | string | null
    onsetDate?: DateTimeNullableFilter<"AllergyIntolerance"> | Date | string | null
    recordedAt?: DateTimeFilter<"AllergyIntolerance"> | Date | string
    recordedBy?: StringFilter<"AllergyIntolerance"> | string
  }

  export type ObservationUpsertWithWhereUniqueWithoutPatientInput = {
    where: ObservationWhereUniqueInput
    update: XOR<ObservationUpdateWithoutPatientInput, ObservationUncheckedUpdateWithoutPatientInput>
    create: XOR<ObservationCreateWithoutPatientInput, ObservationUncheckedCreateWithoutPatientInput>
  }

  export type ObservationUpdateWithWhereUniqueWithoutPatientInput = {
    where: ObservationWhereUniqueInput
    data: XOR<ObservationUpdateWithoutPatientInput, ObservationUncheckedUpdateWithoutPatientInput>
  }

  export type ObservationUpdateManyWithWhereWithoutPatientInput = {
    where: ObservationScalarWhereInput
    data: XOR<ObservationUpdateManyMutationInput, ObservationUncheckedUpdateManyWithoutPatientInput>
  }

  export type ObservationScalarWhereInput = {
    AND?: ObservationScalarWhereInput | ObservationScalarWhereInput[]
    OR?: ObservationScalarWhereInput[]
    NOT?: ObservationScalarWhereInput | ObservationScalarWhereInput[]
    id?: StringFilter<"Observation"> | string
    patientId?: StringFilter<"Observation"> | string
    encounterId?: StringNullableFilter<"Observation"> | string | null
    category?: StringFilter<"Observation"> | string
    loincCode?: StringNullableFilter<"Observation"> | string | null
    display?: StringFilter<"Observation"> | string
    valueQuantity?: FloatNullableFilter<"Observation"> | number | null
    valueUnit?: StringNullableFilter<"Observation"> | string | null
    valueString?: StringNullableFilter<"Observation"> | string | null
    referenceRangeLow?: FloatNullableFilter<"Observation"> | number | null
    referenceRangeHigh?: FloatNullableFilter<"Observation"> | number | null
    isAbnormal?: BoolFilter<"Observation"> | boolean
    status?: StringFilter<"Observation"> | string
    effectiveAt?: DateTimeFilter<"Observation"> | Date | string
    recordedBy?: StringFilter<"Observation"> | string
  }

  export type ImmunisationUpsertWithWhereUniqueWithoutPatientInput = {
    where: ImmunisationWhereUniqueInput
    update: XOR<ImmunisationUpdateWithoutPatientInput, ImmunisationUncheckedUpdateWithoutPatientInput>
    create: XOR<ImmunisationCreateWithoutPatientInput, ImmunisationUncheckedCreateWithoutPatientInput>
  }

  export type ImmunisationUpdateWithWhereUniqueWithoutPatientInput = {
    where: ImmunisationWhereUniqueInput
    data: XOR<ImmunisationUpdateWithoutPatientInput, ImmunisationUncheckedUpdateWithoutPatientInput>
  }

  export type ImmunisationUpdateManyWithWhereWithoutPatientInput = {
    where: ImmunisationScalarWhereInput
    data: XOR<ImmunisationUpdateManyMutationInput, ImmunisationUncheckedUpdateManyWithoutPatientInput>
  }

  export type ImmunisationScalarWhereInput = {
    AND?: ImmunisationScalarWhereInput | ImmunisationScalarWhereInput[]
    OR?: ImmunisationScalarWhereInput[]
    NOT?: ImmunisationScalarWhereInput | ImmunisationScalarWhereInput[]
    id?: StringFilter<"Immunisation"> | string
    patientId?: StringFilter<"Immunisation"> | string
    vaccineCode?: StringNullableFilter<"Immunisation"> | string | null
    vaccineName?: StringFilter<"Immunisation"> | string
    status?: StringFilter<"Immunisation"> | string
    occurrenceDate?: DateTimeFilter<"Immunisation"> | Date | string
    lotNumber?: StringNullableFilter<"Immunisation"> | string | null
    site?: StringNullableFilter<"Immunisation"> | string | null
    route?: StringNullableFilter<"Immunisation"> | string | null
    administeredBy?: StringNullableFilter<"Immunisation"> | string | null
    primarySource?: BoolFilter<"Immunisation"> | boolean
    notes?: StringNullableFilter<"Immunisation"> | string | null
    createdAt?: DateTimeFilter<"Immunisation"> | Date | string
  }

  export type EncounterUpsertWithWhereUniqueWithoutPatientInput = {
    where: EncounterWhereUniqueInput
    update: XOR<EncounterUpdateWithoutPatientInput, EncounterUncheckedUpdateWithoutPatientInput>
    create: XOR<EncounterCreateWithoutPatientInput, EncounterUncheckedCreateWithoutPatientInput>
  }

  export type EncounterUpdateWithWhereUniqueWithoutPatientInput = {
    where: EncounterWhereUniqueInput
    data: XOR<EncounterUpdateWithoutPatientInput, EncounterUncheckedUpdateWithoutPatientInput>
  }

  export type EncounterUpdateManyWithWhereWithoutPatientInput = {
    where: EncounterScalarWhereInput
    data: XOR<EncounterUpdateManyMutationInput, EncounterUncheckedUpdateManyWithoutPatientInput>
  }

  export type EncounterScalarWhereInput = {
    AND?: EncounterScalarWhereInput | EncounterScalarWhereInput[]
    OR?: EncounterScalarWhereInput[]
    NOT?: EncounterScalarWhereInput | EncounterScalarWhereInput[]
    id?: StringFilter<"Encounter"> | string
    patientId?: StringFilter<"Encounter"> | string
    status?: StringFilter<"Encounter"> | string
    encounterClass?: StringFilter<"Encounter"> | string
    type?: StringNullableFilter<"Encounter"> | string | null
    reasonCode?: StringNullableFilter<"Encounter"> | string | null
    reasonDisplay?: StringNullableFilter<"Encounter"> | string | null
    startTime?: DateTimeNullableFilter<"Encounter"> | Date | string | null
    endTime?: DateTimeNullableFilter<"Encounter"> | Date | string | null
    providerId?: StringFilter<"Encounter"> | string
    locationId?: StringNullableFilter<"Encounter"> | string | null
    notes?: StringNullableFilter<"Encounter"> | string | null
    createdAt?: DateTimeFilter<"Encounter"> | Date | string
    updatedAt?: DateTimeFilter<"Encounter"> | Date | string
  }

  export type AppointmentUpsertWithWhereUniqueWithoutPatientInput = {
    where: AppointmentWhereUniqueInput
    update: XOR<AppointmentUpdateWithoutPatientInput, AppointmentUncheckedUpdateWithoutPatientInput>
    create: XOR<AppointmentCreateWithoutPatientInput, AppointmentUncheckedCreateWithoutPatientInput>
  }

  export type AppointmentUpdateWithWhereUniqueWithoutPatientInput = {
    where: AppointmentWhereUniqueInput
    data: XOR<AppointmentUpdateWithoutPatientInput, AppointmentUncheckedUpdateWithoutPatientInput>
  }

  export type AppointmentUpdateManyWithWhereWithoutPatientInput = {
    where: AppointmentScalarWhereInput
    data: XOR<AppointmentUpdateManyMutationInput, AppointmentUncheckedUpdateManyWithoutPatientInput>
  }

  export type AppointmentScalarWhereInput = {
    AND?: AppointmentScalarWhereInput | AppointmentScalarWhereInput[]
    OR?: AppointmentScalarWhereInput[]
    NOT?: AppointmentScalarWhereInput | AppointmentScalarWhereInput[]
    id?: StringFilter<"Appointment"> | string
    patientId?: StringFilter<"Appointment"> | string
    providerId?: StringFilter<"Appointment"> | string
    status?: StringFilter<"Appointment"> | string
    serviceType?: StringNullableFilter<"Appointment"> | string | null
    description?: StringNullableFilter<"Appointment"> | string | null
    startTime?: DateTimeFilter<"Appointment"> | Date | string
    endTime?: DateTimeFilter<"Appointment"> | Date | string
    durationMinutes?: IntFilter<"Appointment"> | number
    locationId?: StringNullableFilter<"Appointment"> | string | null
    notes?: StringNullableFilter<"Appointment"> | string | null
    createdAt?: DateTimeFilter<"Appointment"> | Date | string
    updatedAt?: DateTimeFilter<"Appointment"> | Date | string
  }

  export type ClinicalDocumentUpsertWithWhereUniqueWithoutPatientInput = {
    where: ClinicalDocumentWhereUniqueInput
    update: XOR<ClinicalDocumentUpdateWithoutPatientInput, ClinicalDocumentUncheckedUpdateWithoutPatientInput>
    create: XOR<ClinicalDocumentCreateWithoutPatientInput, ClinicalDocumentUncheckedCreateWithoutPatientInput>
  }

  export type ClinicalDocumentUpdateWithWhereUniqueWithoutPatientInput = {
    where: ClinicalDocumentWhereUniqueInput
    data: XOR<ClinicalDocumentUpdateWithoutPatientInput, ClinicalDocumentUncheckedUpdateWithoutPatientInput>
  }

  export type ClinicalDocumentUpdateManyWithWhereWithoutPatientInput = {
    where: ClinicalDocumentScalarWhereInput
    data: XOR<ClinicalDocumentUpdateManyMutationInput, ClinicalDocumentUncheckedUpdateManyWithoutPatientInput>
  }

  export type ClinicalDocumentScalarWhereInput = {
    AND?: ClinicalDocumentScalarWhereInput | ClinicalDocumentScalarWhereInput[]
    OR?: ClinicalDocumentScalarWhereInput[]
    NOT?: ClinicalDocumentScalarWhereInput | ClinicalDocumentScalarWhereInput[]
    id?: StringFilter<"ClinicalDocument"> | string
    patientId?: StringFilter<"ClinicalDocument"> | string
    encounterId?: StringNullableFilter<"ClinicalDocument"> | string | null
    type?: StringFilter<"ClinicalDocument"> | string
    title?: StringFilter<"ClinicalDocument"> | string
    content?: StringFilter<"ClinicalDocument"> | string
    status?: StringFilter<"ClinicalDocument"> | string
    authorId?: StringFilter<"ClinicalDocument"> | string
    authorName?: StringFilter<"ClinicalDocument"> | string
    signedAt?: DateTimeNullableFilter<"ClinicalDocument"> | Date | string | null
    createdAt?: DateTimeFilter<"ClinicalDocument"> | Date | string
    updatedAt?: DateTimeFilter<"ClinicalDocument"> | Date | string
  }

  export type AuditLogUpsertWithWhereUniqueWithoutPatientInput = {
    where: AuditLogWhereUniqueInput
    update: XOR<AuditLogUpdateWithoutPatientInput, AuditLogUncheckedUpdateWithoutPatientInput>
    create: XOR<AuditLogCreateWithoutPatientInput, AuditLogUncheckedCreateWithoutPatientInput>
  }

  export type AuditLogUpdateWithWhereUniqueWithoutPatientInput = {
    where: AuditLogWhereUniqueInput
    data: XOR<AuditLogUpdateWithoutPatientInput, AuditLogUncheckedUpdateWithoutPatientInput>
  }

  export type AuditLogUpdateManyWithWhereWithoutPatientInput = {
    where: AuditLogScalarWhereInput
    data: XOR<AuditLogUpdateManyMutationInput, AuditLogUncheckedUpdateManyWithoutPatientInput>
  }

  export type AuditLogScalarWhereInput = {
    AND?: AuditLogScalarWhereInput | AuditLogScalarWhereInput[]
    OR?: AuditLogScalarWhereInput[]
    NOT?: AuditLogScalarWhereInput | AuditLogScalarWhereInput[]
    id?: StringFilter<"AuditLog"> | string
    patientId?: StringNullableFilter<"AuditLog"> | string | null
    userId?: StringFilter<"AuditLog"> | string
    action?: StringFilter<"AuditLog"> | string
    resourceType?: StringFilter<"AuditLog"> | string
    resourceId?: StringNullableFilter<"AuditLog"> | string | null
    changes?: JsonNullableFilter<"AuditLog">
    ipAddress?: StringNullableFilter<"AuditLog"> | string | null
    correlationId?: StringNullableFilter<"AuditLog"> | string | null
    createdAt?: DateTimeFilter<"AuditLog"> | Date | string
  }

  export type PatientCreateWithoutAddressInput = {
    id?: string
    mrn: string
    firstName: string
    lastName: string
    preferredName?: string | null
    dateOfBirth: Date | string
    gender: string
    genderIdentity?: string | null
    phone?: string | null
    email?: string | null
    photoUrl?: string | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    emergencyContacts?: EmergencyContactCreateNestedManyWithoutPatientInput
    insurances?: PatientInsuranceCreateNestedManyWithoutPatientInput
    conditions?: ConditionCreateNestedManyWithoutPatientInput
    medications?: MedicationRequestCreateNestedManyWithoutPatientInput
    allergies?: AllergyIntoleranceCreateNestedManyWithoutPatientInput
    observations?: ObservationCreateNestedManyWithoutPatientInput
    immunisations?: ImmunisationCreateNestedManyWithoutPatientInput
    encounters?: EncounterCreateNestedManyWithoutPatientInput
    appointments?: AppointmentCreateNestedManyWithoutPatientInput
    documents?: ClinicalDocumentCreateNestedManyWithoutPatientInput
    auditLogs?: AuditLogCreateNestedManyWithoutPatientInput
  }

  export type PatientUncheckedCreateWithoutAddressInput = {
    id?: string
    mrn: string
    firstName: string
    lastName: string
    preferredName?: string | null
    dateOfBirth: Date | string
    gender: string
    genderIdentity?: string | null
    phone?: string | null
    email?: string | null
    photoUrl?: string | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    emergencyContacts?: EmergencyContactUncheckedCreateNestedManyWithoutPatientInput
    insurances?: PatientInsuranceUncheckedCreateNestedManyWithoutPatientInput
    conditions?: ConditionUncheckedCreateNestedManyWithoutPatientInput
    medications?: MedicationRequestUncheckedCreateNestedManyWithoutPatientInput
    allergies?: AllergyIntoleranceUncheckedCreateNestedManyWithoutPatientInput
    observations?: ObservationUncheckedCreateNestedManyWithoutPatientInput
    immunisations?: ImmunisationUncheckedCreateNestedManyWithoutPatientInput
    encounters?: EncounterUncheckedCreateNestedManyWithoutPatientInput
    appointments?: AppointmentUncheckedCreateNestedManyWithoutPatientInput
    documents?: ClinicalDocumentUncheckedCreateNestedManyWithoutPatientInput
    auditLogs?: AuditLogUncheckedCreateNestedManyWithoutPatientInput
  }

  export type PatientCreateOrConnectWithoutAddressInput = {
    where: PatientWhereUniqueInput
    create: XOR<PatientCreateWithoutAddressInput, PatientUncheckedCreateWithoutAddressInput>
  }

  export type PatientUpsertWithoutAddressInput = {
    update: XOR<PatientUpdateWithoutAddressInput, PatientUncheckedUpdateWithoutAddressInput>
    create: XOR<PatientCreateWithoutAddressInput, PatientUncheckedCreateWithoutAddressInput>
    where?: PatientWhereInput
  }

  export type PatientUpdateToOneWithWhereWithoutAddressInput = {
    where?: PatientWhereInput
    data: XOR<PatientUpdateWithoutAddressInput, PatientUncheckedUpdateWithoutAddressInput>
  }

  export type PatientUpdateWithoutAddressInput = {
    id?: StringFieldUpdateOperationsInput | string
    mrn?: StringFieldUpdateOperationsInput | string
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    preferredName?: NullableStringFieldUpdateOperationsInput | string | null
    dateOfBirth?: DateTimeFieldUpdateOperationsInput | Date | string
    gender?: StringFieldUpdateOperationsInput | string
    genderIdentity?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    photoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    emergencyContacts?: EmergencyContactUpdateManyWithoutPatientNestedInput
    insurances?: PatientInsuranceUpdateManyWithoutPatientNestedInput
    conditions?: ConditionUpdateManyWithoutPatientNestedInput
    medications?: MedicationRequestUpdateManyWithoutPatientNestedInput
    allergies?: AllergyIntoleranceUpdateManyWithoutPatientNestedInput
    observations?: ObservationUpdateManyWithoutPatientNestedInput
    immunisations?: ImmunisationUpdateManyWithoutPatientNestedInput
    encounters?: EncounterUpdateManyWithoutPatientNestedInput
    appointments?: AppointmentUpdateManyWithoutPatientNestedInput
    documents?: ClinicalDocumentUpdateManyWithoutPatientNestedInput
    auditLogs?: AuditLogUpdateManyWithoutPatientNestedInput
  }

  export type PatientUncheckedUpdateWithoutAddressInput = {
    id?: StringFieldUpdateOperationsInput | string
    mrn?: StringFieldUpdateOperationsInput | string
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    preferredName?: NullableStringFieldUpdateOperationsInput | string | null
    dateOfBirth?: DateTimeFieldUpdateOperationsInput | Date | string
    gender?: StringFieldUpdateOperationsInput | string
    genderIdentity?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    photoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    emergencyContacts?: EmergencyContactUncheckedUpdateManyWithoutPatientNestedInput
    insurances?: PatientInsuranceUncheckedUpdateManyWithoutPatientNestedInput
    conditions?: ConditionUncheckedUpdateManyWithoutPatientNestedInput
    medications?: MedicationRequestUncheckedUpdateManyWithoutPatientNestedInput
    allergies?: AllergyIntoleranceUncheckedUpdateManyWithoutPatientNestedInput
    observations?: ObservationUncheckedUpdateManyWithoutPatientNestedInput
    immunisations?: ImmunisationUncheckedUpdateManyWithoutPatientNestedInput
    encounters?: EncounterUncheckedUpdateManyWithoutPatientNestedInput
    appointments?: AppointmentUncheckedUpdateManyWithoutPatientNestedInput
    documents?: ClinicalDocumentUncheckedUpdateManyWithoutPatientNestedInput
    auditLogs?: AuditLogUncheckedUpdateManyWithoutPatientNestedInput
  }

  export type PatientCreateWithoutEmergencyContactsInput = {
    id?: string
    mrn: string
    firstName: string
    lastName: string
    preferredName?: string | null
    dateOfBirth: Date | string
    gender: string
    genderIdentity?: string | null
    phone?: string | null
    email?: string | null
    photoUrl?: string | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    address?: PatientAddressCreateNestedOneWithoutPatientInput
    insurances?: PatientInsuranceCreateNestedManyWithoutPatientInput
    conditions?: ConditionCreateNestedManyWithoutPatientInput
    medications?: MedicationRequestCreateNestedManyWithoutPatientInput
    allergies?: AllergyIntoleranceCreateNestedManyWithoutPatientInput
    observations?: ObservationCreateNestedManyWithoutPatientInput
    immunisations?: ImmunisationCreateNestedManyWithoutPatientInput
    encounters?: EncounterCreateNestedManyWithoutPatientInput
    appointments?: AppointmentCreateNestedManyWithoutPatientInput
    documents?: ClinicalDocumentCreateNestedManyWithoutPatientInput
    auditLogs?: AuditLogCreateNestedManyWithoutPatientInput
  }

  export type PatientUncheckedCreateWithoutEmergencyContactsInput = {
    id?: string
    mrn: string
    firstName: string
    lastName: string
    preferredName?: string | null
    dateOfBirth: Date | string
    gender: string
    genderIdentity?: string | null
    phone?: string | null
    email?: string | null
    photoUrl?: string | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    address?: PatientAddressUncheckedCreateNestedOneWithoutPatientInput
    insurances?: PatientInsuranceUncheckedCreateNestedManyWithoutPatientInput
    conditions?: ConditionUncheckedCreateNestedManyWithoutPatientInput
    medications?: MedicationRequestUncheckedCreateNestedManyWithoutPatientInput
    allergies?: AllergyIntoleranceUncheckedCreateNestedManyWithoutPatientInput
    observations?: ObservationUncheckedCreateNestedManyWithoutPatientInput
    immunisations?: ImmunisationUncheckedCreateNestedManyWithoutPatientInput
    encounters?: EncounterUncheckedCreateNestedManyWithoutPatientInput
    appointments?: AppointmentUncheckedCreateNestedManyWithoutPatientInput
    documents?: ClinicalDocumentUncheckedCreateNestedManyWithoutPatientInput
    auditLogs?: AuditLogUncheckedCreateNestedManyWithoutPatientInput
  }

  export type PatientCreateOrConnectWithoutEmergencyContactsInput = {
    where: PatientWhereUniqueInput
    create: XOR<PatientCreateWithoutEmergencyContactsInput, PatientUncheckedCreateWithoutEmergencyContactsInput>
  }

  export type PatientUpsertWithoutEmergencyContactsInput = {
    update: XOR<PatientUpdateWithoutEmergencyContactsInput, PatientUncheckedUpdateWithoutEmergencyContactsInput>
    create: XOR<PatientCreateWithoutEmergencyContactsInput, PatientUncheckedCreateWithoutEmergencyContactsInput>
    where?: PatientWhereInput
  }

  export type PatientUpdateToOneWithWhereWithoutEmergencyContactsInput = {
    where?: PatientWhereInput
    data: XOR<PatientUpdateWithoutEmergencyContactsInput, PatientUncheckedUpdateWithoutEmergencyContactsInput>
  }

  export type PatientUpdateWithoutEmergencyContactsInput = {
    id?: StringFieldUpdateOperationsInput | string
    mrn?: StringFieldUpdateOperationsInput | string
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    preferredName?: NullableStringFieldUpdateOperationsInput | string | null
    dateOfBirth?: DateTimeFieldUpdateOperationsInput | Date | string
    gender?: StringFieldUpdateOperationsInput | string
    genderIdentity?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    photoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    address?: PatientAddressUpdateOneWithoutPatientNestedInput
    insurances?: PatientInsuranceUpdateManyWithoutPatientNestedInput
    conditions?: ConditionUpdateManyWithoutPatientNestedInput
    medications?: MedicationRequestUpdateManyWithoutPatientNestedInput
    allergies?: AllergyIntoleranceUpdateManyWithoutPatientNestedInput
    observations?: ObservationUpdateManyWithoutPatientNestedInput
    immunisations?: ImmunisationUpdateManyWithoutPatientNestedInput
    encounters?: EncounterUpdateManyWithoutPatientNestedInput
    appointments?: AppointmentUpdateManyWithoutPatientNestedInput
    documents?: ClinicalDocumentUpdateManyWithoutPatientNestedInput
    auditLogs?: AuditLogUpdateManyWithoutPatientNestedInput
  }

  export type PatientUncheckedUpdateWithoutEmergencyContactsInput = {
    id?: StringFieldUpdateOperationsInput | string
    mrn?: StringFieldUpdateOperationsInput | string
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    preferredName?: NullableStringFieldUpdateOperationsInput | string | null
    dateOfBirth?: DateTimeFieldUpdateOperationsInput | Date | string
    gender?: StringFieldUpdateOperationsInput | string
    genderIdentity?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    photoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    address?: PatientAddressUncheckedUpdateOneWithoutPatientNestedInput
    insurances?: PatientInsuranceUncheckedUpdateManyWithoutPatientNestedInput
    conditions?: ConditionUncheckedUpdateManyWithoutPatientNestedInput
    medications?: MedicationRequestUncheckedUpdateManyWithoutPatientNestedInput
    allergies?: AllergyIntoleranceUncheckedUpdateManyWithoutPatientNestedInput
    observations?: ObservationUncheckedUpdateManyWithoutPatientNestedInput
    immunisations?: ImmunisationUncheckedUpdateManyWithoutPatientNestedInput
    encounters?: EncounterUncheckedUpdateManyWithoutPatientNestedInput
    appointments?: AppointmentUncheckedUpdateManyWithoutPatientNestedInput
    documents?: ClinicalDocumentUncheckedUpdateManyWithoutPatientNestedInput
    auditLogs?: AuditLogUncheckedUpdateManyWithoutPatientNestedInput
  }

  export type PatientCreateWithoutInsurancesInput = {
    id?: string
    mrn: string
    firstName: string
    lastName: string
    preferredName?: string | null
    dateOfBirth: Date | string
    gender: string
    genderIdentity?: string | null
    phone?: string | null
    email?: string | null
    photoUrl?: string | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    address?: PatientAddressCreateNestedOneWithoutPatientInput
    emergencyContacts?: EmergencyContactCreateNestedManyWithoutPatientInput
    conditions?: ConditionCreateNestedManyWithoutPatientInput
    medications?: MedicationRequestCreateNestedManyWithoutPatientInput
    allergies?: AllergyIntoleranceCreateNestedManyWithoutPatientInput
    observations?: ObservationCreateNestedManyWithoutPatientInput
    immunisations?: ImmunisationCreateNestedManyWithoutPatientInput
    encounters?: EncounterCreateNestedManyWithoutPatientInput
    appointments?: AppointmentCreateNestedManyWithoutPatientInput
    documents?: ClinicalDocumentCreateNestedManyWithoutPatientInput
    auditLogs?: AuditLogCreateNestedManyWithoutPatientInput
  }

  export type PatientUncheckedCreateWithoutInsurancesInput = {
    id?: string
    mrn: string
    firstName: string
    lastName: string
    preferredName?: string | null
    dateOfBirth: Date | string
    gender: string
    genderIdentity?: string | null
    phone?: string | null
    email?: string | null
    photoUrl?: string | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    address?: PatientAddressUncheckedCreateNestedOneWithoutPatientInput
    emergencyContacts?: EmergencyContactUncheckedCreateNestedManyWithoutPatientInput
    conditions?: ConditionUncheckedCreateNestedManyWithoutPatientInput
    medications?: MedicationRequestUncheckedCreateNestedManyWithoutPatientInput
    allergies?: AllergyIntoleranceUncheckedCreateNestedManyWithoutPatientInput
    observations?: ObservationUncheckedCreateNestedManyWithoutPatientInput
    immunisations?: ImmunisationUncheckedCreateNestedManyWithoutPatientInput
    encounters?: EncounterUncheckedCreateNestedManyWithoutPatientInput
    appointments?: AppointmentUncheckedCreateNestedManyWithoutPatientInput
    documents?: ClinicalDocumentUncheckedCreateNestedManyWithoutPatientInput
    auditLogs?: AuditLogUncheckedCreateNestedManyWithoutPatientInput
  }

  export type PatientCreateOrConnectWithoutInsurancesInput = {
    where: PatientWhereUniqueInput
    create: XOR<PatientCreateWithoutInsurancesInput, PatientUncheckedCreateWithoutInsurancesInput>
  }

  export type PatientUpsertWithoutInsurancesInput = {
    update: XOR<PatientUpdateWithoutInsurancesInput, PatientUncheckedUpdateWithoutInsurancesInput>
    create: XOR<PatientCreateWithoutInsurancesInput, PatientUncheckedCreateWithoutInsurancesInput>
    where?: PatientWhereInput
  }

  export type PatientUpdateToOneWithWhereWithoutInsurancesInput = {
    where?: PatientWhereInput
    data: XOR<PatientUpdateWithoutInsurancesInput, PatientUncheckedUpdateWithoutInsurancesInput>
  }

  export type PatientUpdateWithoutInsurancesInput = {
    id?: StringFieldUpdateOperationsInput | string
    mrn?: StringFieldUpdateOperationsInput | string
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    preferredName?: NullableStringFieldUpdateOperationsInput | string | null
    dateOfBirth?: DateTimeFieldUpdateOperationsInput | Date | string
    gender?: StringFieldUpdateOperationsInput | string
    genderIdentity?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    photoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    address?: PatientAddressUpdateOneWithoutPatientNestedInput
    emergencyContacts?: EmergencyContactUpdateManyWithoutPatientNestedInput
    conditions?: ConditionUpdateManyWithoutPatientNestedInput
    medications?: MedicationRequestUpdateManyWithoutPatientNestedInput
    allergies?: AllergyIntoleranceUpdateManyWithoutPatientNestedInput
    observations?: ObservationUpdateManyWithoutPatientNestedInput
    immunisations?: ImmunisationUpdateManyWithoutPatientNestedInput
    encounters?: EncounterUpdateManyWithoutPatientNestedInput
    appointments?: AppointmentUpdateManyWithoutPatientNestedInput
    documents?: ClinicalDocumentUpdateManyWithoutPatientNestedInput
    auditLogs?: AuditLogUpdateManyWithoutPatientNestedInput
  }

  export type PatientUncheckedUpdateWithoutInsurancesInput = {
    id?: StringFieldUpdateOperationsInput | string
    mrn?: StringFieldUpdateOperationsInput | string
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    preferredName?: NullableStringFieldUpdateOperationsInput | string | null
    dateOfBirth?: DateTimeFieldUpdateOperationsInput | Date | string
    gender?: StringFieldUpdateOperationsInput | string
    genderIdentity?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    photoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    address?: PatientAddressUncheckedUpdateOneWithoutPatientNestedInput
    emergencyContacts?: EmergencyContactUncheckedUpdateManyWithoutPatientNestedInput
    conditions?: ConditionUncheckedUpdateManyWithoutPatientNestedInput
    medications?: MedicationRequestUncheckedUpdateManyWithoutPatientNestedInput
    allergies?: AllergyIntoleranceUncheckedUpdateManyWithoutPatientNestedInput
    observations?: ObservationUncheckedUpdateManyWithoutPatientNestedInput
    immunisations?: ImmunisationUncheckedUpdateManyWithoutPatientNestedInput
    encounters?: EncounterUncheckedUpdateManyWithoutPatientNestedInput
    appointments?: AppointmentUncheckedUpdateManyWithoutPatientNestedInput
    documents?: ClinicalDocumentUncheckedUpdateManyWithoutPatientNestedInput
    auditLogs?: AuditLogUncheckedUpdateManyWithoutPatientNestedInput
  }

  export type PatientCreateWithoutConditionsInput = {
    id?: string
    mrn: string
    firstName: string
    lastName: string
    preferredName?: string | null
    dateOfBirth: Date | string
    gender: string
    genderIdentity?: string | null
    phone?: string | null
    email?: string | null
    photoUrl?: string | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    address?: PatientAddressCreateNestedOneWithoutPatientInput
    emergencyContacts?: EmergencyContactCreateNestedManyWithoutPatientInput
    insurances?: PatientInsuranceCreateNestedManyWithoutPatientInput
    medications?: MedicationRequestCreateNestedManyWithoutPatientInput
    allergies?: AllergyIntoleranceCreateNestedManyWithoutPatientInput
    observations?: ObservationCreateNestedManyWithoutPatientInput
    immunisations?: ImmunisationCreateNestedManyWithoutPatientInput
    encounters?: EncounterCreateNestedManyWithoutPatientInput
    appointments?: AppointmentCreateNestedManyWithoutPatientInput
    documents?: ClinicalDocumentCreateNestedManyWithoutPatientInput
    auditLogs?: AuditLogCreateNestedManyWithoutPatientInput
  }

  export type PatientUncheckedCreateWithoutConditionsInput = {
    id?: string
    mrn: string
    firstName: string
    lastName: string
    preferredName?: string | null
    dateOfBirth: Date | string
    gender: string
    genderIdentity?: string | null
    phone?: string | null
    email?: string | null
    photoUrl?: string | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    address?: PatientAddressUncheckedCreateNestedOneWithoutPatientInput
    emergencyContacts?: EmergencyContactUncheckedCreateNestedManyWithoutPatientInput
    insurances?: PatientInsuranceUncheckedCreateNestedManyWithoutPatientInput
    medications?: MedicationRequestUncheckedCreateNestedManyWithoutPatientInput
    allergies?: AllergyIntoleranceUncheckedCreateNestedManyWithoutPatientInput
    observations?: ObservationUncheckedCreateNestedManyWithoutPatientInput
    immunisations?: ImmunisationUncheckedCreateNestedManyWithoutPatientInput
    encounters?: EncounterUncheckedCreateNestedManyWithoutPatientInput
    appointments?: AppointmentUncheckedCreateNestedManyWithoutPatientInput
    documents?: ClinicalDocumentUncheckedCreateNestedManyWithoutPatientInput
    auditLogs?: AuditLogUncheckedCreateNestedManyWithoutPatientInput
  }

  export type PatientCreateOrConnectWithoutConditionsInput = {
    where: PatientWhereUniqueInput
    create: XOR<PatientCreateWithoutConditionsInput, PatientUncheckedCreateWithoutConditionsInput>
  }

  export type EncounterCreateWithoutConditionsInput = {
    id?: string
    status?: string
    encounterClass?: string
    type?: string | null
    reasonCode?: string | null
    reasonDisplay?: string | null
    startTime?: Date | string | null
    endTime?: Date | string | null
    providerId: string
    locationId?: string | null
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    patient: PatientCreateNestedOneWithoutEncountersInput
    medications?: MedicationRequestCreateNestedManyWithoutEncounterInput
    observations?: ObservationCreateNestedManyWithoutEncounterInput
    documents?: ClinicalDocumentCreateNestedManyWithoutEncounterInput
  }

  export type EncounterUncheckedCreateWithoutConditionsInput = {
    id?: string
    patientId: string
    status?: string
    encounterClass?: string
    type?: string | null
    reasonCode?: string | null
    reasonDisplay?: string | null
    startTime?: Date | string | null
    endTime?: Date | string | null
    providerId: string
    locationId?: string | null
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    medications?: MedicationRequestUncheckedCreateNestedManyWithoutEncounterInput
    observations?: ObservationUncheckedCreateNestedManyWithoutEncounterInput
    documents?: ClinicalDocumentUncheckedCreateNestedManyWithoutEncounterInput
  }

  export type EncounterCreateOrConnectWithoutConditionsInput = {
    where: EncounterWhereUniqueInput
    create: XOR<EncounterCreateWithoutConditionsInput, EncounterUncheckedCreateWithoutConditionsInput>
  }

  export type PatientUpsertWithoutConditionsInput = {
    update: XOR<PatientUpdateWithoutConditionsInput, PatientUncheckedUpdateWithoutConditionsInput>
    create: XOR<PatientCreateWithoutConditionsInput, PatientUncheckedCreateWithoutConditionsInput>
    where?: PatientWhereInput
  }

  export type PatientUpdateToOneWithWhereWithoutConditionsInput = {
    where?: PatientWhereInput
    data: XOR<PatientUpdateWithoutConditionsInput, PatientUncheckedUpdateWithoutConditionsInput>
  }

  export type PatientUpdateWithoutConditionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    mrn?: StringFieldUpdateOperationsInput | string
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    preferredName?: NullableStringFieldUpdateOperationsInput | string | null
    dateOfBirth?: DateTimeFieldUpdateOperationsInput | Date | string
    gender?: StringFieldUpdateOperationsInput | string
    genderIdentity?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    photoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    address?: PatientAddressUpdateOneWithoutPatientNestedInput
    emergencyContacts?: EmergencyContactUpdateManyWithoutPatientNestedInput
    insurances?: PatientInsuranceUpdateManyWithoutPatientNestedInput
    medications?: MedicationRequestUpdateManyWithoutPatientNestedInput
    allergies?: AllergyIntoleranceUpdateManyWithoutPatientNestedInput
    observations?: ObservationUpdateManyWithoutPatientNestedInput
    immunisations?: ImmunisationUpdateManyWithoutPatientNestedInput
    encounters?: EncounterUpdateManyWithoutPatientNestedInput
    appointments?: AppointmentUpdateManyWithoutPatientNestedInput
    documents?: ClinicalDocumentUpdateManyWithoutPatientNestedInput
    auditLogs?: AuditLogUpdateManyWithoutPatientNestedInput
  }

  export type PatientUncheckedUpdateWithoutConditionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    mrn?: StringFieldUpdateOperationsInput | string
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    preferredName?: NullableStringFieldUpdateOperationsInput | string | null
    dateOfBirth?: DateTimeFieldUpdateOperationsInput | Date | string
    gender?: StringFieldUpdateOperationsInput | string
    genderIdentity?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    photoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    address?: PatientAddressUncheckedUpdateOneWithoutPatientNestedInput
    emergencyContacts?: EmergencyContactUncheckedUpdateManyWithoutPatientNestedInput
    insurances?: PatientInsuranceUncheckedUpdateManyWithoutPatientNestedInput
    medications?: MedicationRequestUncheckedUpdateManyWithoutPatientNestedInput
    allergies?: AllergyIntoleranceUncheckedUpdateManyWithoutPatientNestedInput
    observations?: ObservationUncheckedUpdateManyWithoutPatientNestedInput
    immunisations?: ImmunisationUncheckedUpdateManyWithoutPatientNestedInput
    encounters?: EncounterUncheckedUpdateManyWithoutPatientNestedInput
    appointments?: AppointmentUncheckedUpdateManyWithoutPatientNestedInput
    documents?: ClinicalDocumentUncheckedUpdateManyWithoutPatientNestedInput
    auditLogs?: AuditLogUncheckedUpdateManyWithoutPatientNestedInput
  }

  export type EncounterUpsertWithoutConditionsInput = {
    update: XOR<EncounterUpdateWithoutConditionsInput, EncounterUncheckedUpdateWithoutConditionsInput>
    create: XOR<EncounterCreateWithoutConditionsInput, EncounterUncheckedCreateWithoutConditionsInput>
    where?: EncounterWhereInput
  }

  export type EncounterUpdateToOneWithWhereWithoutConditionsInput = {
    where?: EncounterWhereInput
    data: XOR<EncounterUpdateWithoutConditionsInput, EncounterUncheckedUpdateWithoutConditionsInput>
  }

  export type EncounterUpdateWithoutConditionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    encounterClass?: StringFieldUpdateOperationsInput | string
    type?: NullableStringFieldUpdateOperationsInput | string | null
    reasonCode?: NullableStringFieldUpdateOperationsInput | string | null
    reasonDisplay?: NullableStringFieldUpdateOperationsInput | string | null
    startTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    providerId?: StringFieldUpdateOperationsInput | string
    locationId?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    patient?: PatientUpdateOneRequiredWithoutEncountersNestedInput
    medications?: MedicationRequestUpdateManyWithoutEncounterNestedInput
    observations?: ObservationUpdateManyWithoutEncounterNestedInput
    documents?: ClinicalDocumentUpdateManyWithoutEncounterNestedInput
  }

  export type EncounterUncheckedUpdateWithoutConditionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    encounterClass?: StringFieldUpdateOperationsInput | string
    type?: NullableStringFieldUpdateOperationsInput | string | null
    reasonCode?: NullableStringFieldUpdateOperationsInput | string | null
    reasonDisplay?: NullableStringFieldUpdateOperationsInput | string | null
    startTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    providerId?: StringFieldUpdateOperationsInput | string
    locationId?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    medications?: MedicationRequestUncheckedUpdateManyWithoutEncounterNestedInput
    observations?: ObservationUncheckedUpdateManyWithoutEncounterNestedInput
    documents?: ClinicalDocumentUncheckedUpdateManyWithoutEncounterNestedInput
  }

  export type PatientCreateWithoutMedicationsInput = {
    id?: string
    mrn: string
    firstName: string
    lastName: string
    preferredName?: string | null
    dateOfBirth: Date | string
    gender: string
    genderIdentity?: string | null
    phone?: string | null
    email?: string | null
    photoUrl?: string | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    address?: PatientAddressCreateNestedOneWithoutPatientInput
    emergencyContacts?: EmergencyContactCreateNestedManyWithoutPatientInput
    insurances?: PatientInsuranceCreateNestedManyWithoutPatientInput
    conditions?: ConditionCreateNestedManyWithoutPatientInput
    allergies?: AllergyIntoleranceCreateNestedManyWithoutPatientInput
    observations?: ObservationCreateNestedManyWithoutPatientInput
    immunisations?: ImmunisationCreateNestedManyWithoutPatientInput
    encounters?: EncounterCreateNestedManyWithoutPatientInput
    appointments?: AppointmentCreateNestedManyWithoutPatientInput
    documents?: ClinicalDocumentCreateNestedManyWithoutPatientInput
    auditLogs?: AuditLogCreateNestedManyWithoutPatientInput
  }

  export type PatientUncheckedCreateWithoutMedicationsInput = {
    id?: string
    mrn: string
    firstName: string
    lastName: string
    preferredName?: string | null
    dateOfBirth: Date | string
    gender: string
    genderIdentity?: string | null
    phone?: string | null
    email?: string | null
    photoUrl?: string | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    address?: PatientAddressUncheckedCreateNestedOneWithoutPatientInput
    emergencyContacts?: EmergencyContactUncheckedCreateNestedManyWithoutPatientInput
    insurances?: PatientInsuranceUncheckedCreateNestedManyWithoutPatientInput
    conditions?: ConditionUncheckedCreateNestedManyWithoutPatientInput
    allergies?: AllergyIntoleranceUncheckedCreateNestedManyWithoutPatientInput
    observations?: ObservationUncheckedCreateNestedManyWithoutPatientInput
    immunisations?: ImmunisationUncheckedCreateNestedManyWithoutPatientInput
    encounters?: EncounterUncheckedCreateNestedManyWithoutPatientInput
    appointments?: AppointmentUncheckedCreateNestedManyWithoutPatientInput
    documents?: ClinicalDocumentUncheckedCreateNestedManyWithoutPatientInput
    auditLogs?: AuditLogUncheckedCreateNestedManyWithoutPatientInput
  }

  export type PatientCreateOrConnectWithoutMedicationsInput = {
    where: PatientWhereUniqueInput
    create: XOR<PatientCreateWithoutMedicationsInput, PatientUncheckedCreateWithoutMedicationsInput>
  }

  export type EncounterCreateWithoutMedicationsInput = {
    id?: string
    status?: string
    encounterClass?: string
    type?: string | null
    reasonCode?: string | null
    reasonDisplay?: string | null
    startTime?: Date | string | null
    endTime?: Date | string | null
    providerId: string
    locationId?: string | null
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    patient: PatientCreateNestedOneWithoutEncountersInput
    conditions?: ConditionCreateNestedManyWithoutEncounterInput
    observations?: ObservationCreateNestedManyWithoutEncounterInput
    documents?: ClinicalDocumentCreateNestedManyWithoutEncounterInput
  }

  export type EncounterUncheckedCreateWithoutMedicationsInput = {
    id?: string
    patientId: string
    status?: string
    encounterClass?: string
    type?: string | null
    reasonCode?: string | null
    reasonDisplay?: string | null
    startTime?: Date | string | null
    endTime?: Date | string | null
    providerId: string
    locationId?: string | null
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    conditions?: ConditionUncheckedCreateNestedManyWithoutEncounterInput
    observations?: ObservationUncheckedCreateNestedManyWithoutEncounterInput
    documents?: ClinicalDocumentUncheckedCreateNestedManyWithoutEncounterInput
  }

  export type EncounterCreateOrConnectWithoutMedicationsInput = {
    where: EncounterWhereUniqueInput
    create: XOR<EncounterCreateWithoutMedicationsInput, EncounterUncheckedCreateWithoutMedicationsInput>
  }

  export type PatientUpsertWithoutMedicationsInput = {
    update: XOR<PatientUpdateWithoutMedicationsInput, PatientUncheckedUpdateWithoutMedicationsInput>
    create: XOR<PatientCreateWithoutMedicationsInput, PatientUncheckedCreateWithoutMedicationsInput>
    where?: PatientWhereInput
  }

  export type PatientUpdateToOneWithWhereWithoutMedicationsInput = {
    where?: PatientWhereInput
    data: XOR<PatientUpdateWithoutMedicationsInput, PatientUncheckedUpdateWithoutMedicationsInput>
  }

  export type PatientUpdateWithoutMedicationsInput = {
    id?: StringFieldUpdateOperationsInput | string
    mrn?: StringFieldUpdateOperationsInput | string
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    preferredName?: NullableStringFieldUpdateOperationsInput | string | null
    dateOfBirth?: DateTimeFieldUpdateOperationsInput | Date | string
    gender?: StringFieldUpdateOperationsInput | string
    genderIdentity?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    photoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    address?: PatientAddressUpdateOneWithoutPatientNestedInput
    emergencyContacts?: EmergencyContactUpdateManyWithoutPatientNestedInput
    insurances?: PatientInsuranceUpdateManyWithoutPatientNestedInput
    conditions?: ConditionUpdateManyWithoutPatientNestedInput
    allergies?: AllergyIntoleranceUpdateManyWithoutPatientNestedInput
    observations?: ObservationUpdateManyWithoutPatientNestedInput
    immunisations?: ImmunisationUpdateManyWithoutPatientNestedInput
    encounters?: EncounterUpdateManyWithoutPatientNestedInput
    appointments?: AppointmentUpdateManyWithoutPatientNestedInput
    documents?: ClinicalDocumentUpdateManyWithoutPatientNestedInput
    auditLogs?: AuditLogUpdateManyWithoutPatientNestedInput
  }

  export type PatientUncheckedUpdateWithoutMedicationsInput = {
    id?: StringFieldUpdateOperationsInput | string
    mrn?: StringFieldUpdateOperationsInput | string
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    preferredName?: NullableStringFieldUpdateOperationsInput | string | null
    dateOfBirth?: DateTimeFieldUpdateOperationsInput | Date | string
    gender?: StringFieldUpdateOperationsInput | string
    genderIdentity?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    photoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    address?: PatientAddressUncheckedUpdateOneWithoutPatientNestedInput
    emergencyContacts?: EmergencyContactUncheckedUpdateManyWithoutPatientNestedInput
    insurances?: PatientInsuranceUncheckedUpdateManyWithoutPatientNestedInput
    conditions?: ConditionUncheckedUpdateManyWithoutPatientNestedInput
    allergies?: AllergyIntoleranceUncheckedUpdateManyWithoutPatientNestedInput
    observations?: ObservationUncheckedUpdateManyWithoutPatientNestedInput
    immunisations?: ImmunisationUncheckedUpdateManyWithoutPatientNestedInput
    encounters?: EncounterUncheckedUpdateManyWithoutPatientNestedInput
    appointments?: AppointmentUncheckedUpdateManyWithoutPatientNestedInput
    documents?: ClinicalDocumentUncheckedUpdateManyWithoutPatientNestedInput
    auditLogs?: AuditLogUncheckedUpdateManyWithoutPatientNestedInput
  }

  export type EncounterUpsertWithoutMedicationsInput = {
    update: XOR<EncounterUpdateWithoutMedicationsInput, EncounterUncheckedUpdateWithoutMedicationsInput>
    create: XOR<EncounterCreateWithoutMedicationsInput, EncounterUncheckedCreateWithoutMedicationsInput>
    where?: EncounterWhereInput
  }

  export type EncounterUpdateToOneWithWhereWithoutMedicationsInput = {
    where?: EncounterWhereInput
    data: XOR<EncounterUpdateWithoutMedicationsInput, EncounterUncheckedUpdateWithoutMedicationsInput>
  }

  export type EncounterUpdateWithoutMedicationsInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    encounterClass?: StringFieldUpdateOperationsInput | string
    type?: NullableStringFieldUpdateOperationsInput | string | null
    reasonCode?: NullableStringFieldUpdateOperationsInput | string | null
    reasonDisplay?: NullableStringFieldUpdateOperationsInput | string | null
    startTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    providerId?: StringFieldUpdateOperationsInput | string
    locationId?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    patient?: PatientUpdateOneRequiredWithoutEncountersNestedInput
    conditions?: ConditionUpdateManyWithoutEncounterNestedInput
    observations?: ObservationUpdateManyWithoutEncounterNestedInput
    documents?: ClinicalDocumentUpdateManyWithoutEncounterNestedInput
  }

  export type EncounterUncheckedUpdateWithoutMedicationsInput = {
    id?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    encounterClass?: StringFieldUpdateOperationsInput | string
    type?: NullableStringFieldUpdateOperationsInput | string | null
    reasonCode?: NullableStringFieldUpdateOperationsInput | string | null
    reasonDisplay?: NullableStringFieldUpdateOperationsInput | string | null
    startTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    providerId?: StringFieldUpdateOperationsInput | string
    locationId?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    conditions?: ConditionUncheckedUpdateManyWithoutEncounterNestedInput
    observations?: ObservationUncheckedUpdateManyWithoutEncounterNestedInput
    documents?: ClinicalDocumentUncheckedUpdateManyWithoutEncounterNestedInput
  }

  export type PatientCreateWithoutAllergiesInput = {
    id?: string
    mrn: string
    firstName: string
    lastName: string
    preferredName?: string | null
    dateOfBirth: Date | string
    gender: string
    genderIdentity?: string | null
    phone?: string | null
    email?: string | null
    photoUrl?: string | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    address?: PatientAddressCreateNestedOneWithoutPatientInput
    emergencyContacts?: EmergencyContactCreateNestedManyWithoutPatientInput
    insurances?: PatientInsuranceCreateNestedManyWithoutPatientInput
    conditions?: ConditionCreateNestedManyWithoutPatientInput
    medications?: MedicationRequestCreateNestedManyWithoutPatientInput
    observations?: ObservationCreateNestedManyWithoutPatientInput
    immunisations?: ImmunisationCreateNestedManyWithoutPatientInput
    encounters?: EncounterCreateNestedManyWithoutPatientInput
    appointments?: AppointmentCreateNestedManyWithoutPatientInput
    documents?: ClinicalDocumentCreateNestedManyWithoutPatientInput
    auditLogs?: AuditLogCreateNestedManyWithoutPatientInput
  }

  export type PatientUncheckedCreateWithoutAllergiesInput = {
    id?: string
    mrn: string
    firstName: string
    lastName: string
    preferredName?: string | null
    dateOfBirth: Date | string
    gender: string
    genderIdentity?: string | null
    phone?: string | null
    email?: string | null
    photoUrl?: string | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    address?: PatientAddressUncheckedCreateNestedOneWithoutPatientInput
    emergencyContacts?: EmergencyContactUncheckedCreateNestedManyWithoutPatientInput
    insurances?: PatientInsuranceUncheckedCreateNestedManyWithoutPatientInput
    conditions?: ConditionUncheckedCreateNestedManyWithoutPatientInput
    medications?: MedicationRequestUncheckedCreateNestedManyWithoutPatientInput
    observations?: ObservationUncheckedCreateNestedManyWithoutPatientInput
    immunisations?: ImmunisationUncheckedCreateNestedManyWithoutPatientInput
    encounters?: EncounterUncheckedCreateNestedManyWithoutPatientInput
    appointments?: AppointmentUncheckedCreateNestedManyWithoutPatientInput
    documents?: ClinicalDocumentUncheckedCreateNestedManyWithoutPatientInput
    auditLogs?: AuditLogUncheckedCreateNestedManyWithoutPatientInput
  }

  export type PatientCreateOrConnectWithoutAllergiesInput = {
    where: PatientWhereUniqueInput
    create: XOR<PatientCreateWithoutAllergiesInput, PatientUncheckedCreateWithoutAllergiesInput>
  }

  export type PatientUpsertWithoutAllergiesInput = {
    update: XOR<PatientUpdateWithoutAllergiesInput, PatientUncheckedUpdateWithoutAllergiesInput>
    create: XOR<PatientCreateWithoutAllergiesInput, PatientUncheckedCreateWithoutAllergiesInput>
    where?: PatientWhereInput
  }

  export type PatientUpdateToOneWithWhereWithoutAllergiesInput = {
    where?: PatientWhereInput
    data: XOR<PatientUpdateWithoutAllergiesInput, PatientUncheckedUpdateWithoutAllergiesInput>
  }

  export type PatientUpdateWithoutAllergiesInput = {
    id?: StringFieldUpdateOperationsInput | string
    mrn?: StringFieldUpdateOperationsInput | string
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    preferredName?: NullableStringFieldUpdateOperationsInput | string | null
    dateOfBirth?: DateTimeFieldUpdateOperationsInput | Date | string
    gender?: StringFieldUpdateOperationsInput | string
    genderIdentity?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    photoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    address?: PatientAddressUpdateOneWithoutPatientNestedInput
    emergencyContacts?: EmergencyContactUpdateManyWithoutPatientNestedInput
    insurances?: PatientInsuranceUpdateManyWithoutPatientNestedInput
    conditions?: ConditionUpdateManyWithoutPatientNestedInput
    medications?: MedicationRequestUpdateManyWithoutPatientNestedInput
    observations?: ObservationUpdateManyWithoutPatientNestedInput
    immunisations?: ImmunisationUpdateManyWithoutPatientNestedInput
    encounters?: EncounterUpdateManyWithoutPatientNestedInput
    appointments?: AppointmentUpdateManyWithoutPatientNestedInput
    documents?: ClinicalDocumentUpdateManyWithoutPatientNestedInput
    auditLogs?: AuditLogUpdateManyWithoutPatientNestedInput
  }

  export type PatientUncheckedUpdateWithoutAllergiesInput = {
    id?: StringFieldUpdateOperationsInput | string
    mrn?: StringFieldUpdateOperationsInput | string
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    preferredName?: NullableStringFieldUpdateOperationsInput | string | null
    dateOfBirth?: DateTimeFieldUpdateOperationsInput | Date | string
    gender?: StringFieldUpdateOperationsInput | string
    genderIdentity?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    photoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    address?: PatientAddressUncheckedUpdateOneWithoutPatientNestedInput
    emergencyContacts?: EmergencyContactUncheckedUpdateManyWithoutPatientNestedInput
    insurances?: PatientInsuranceUncheckedUpdateManyWithoutPatientNestedInput
    conditions?: ConditionUncheckedUpdateManyWithoutPatientNestedInput
    medications?: MedicationRequestUncheckedUpdateManyWithoutPatientNestedInput
    observations?: ObservationUncheckedUpdateManyWithoutPatientNestedInput
    immunisations?: ImmunisationUncheckedUpdateManyWithoutPatientNestedInput
    encounters?: EncounterUncheckedUpdateManyWithoutPatientNestedInput
    appointments?: AppointmentUncheckedUpdateManyWithoutPatientNestedInput
    documents?: ClinicalDocumentUncheckedUpdateManyWithoutPatientNestedInput
    auditLogs?: AuditLogUncheckedUpdateManyWithoutPatientNestedInput
  }

  export type PatientCreateWithoutObservationsInput = {
    id?: string
    mrn: string
    firstName: string
    lastName: string
    preferredName?: string | null
    dateOfBirth: Date | string
    gender: string
    genderIdentity?: string | null
    phone?: string | null
    email?: string | null
    photoUrl?: string | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    address?: PatientAddressCreateNestedOneWithoutPatientInput
    emergencyContacts?: EmergencyContactCreateNestedManyWithoutPatientInput
    insurances?: PatientInsuranceCreateNestedManyWithoutPatientInput
    conditions?: ConditionCreateNestedManyWithoutPatientInput
    medications?: MedicationRequestCreateNestedManyWithoutPatientInput
    allergies?: AllergyIntoleranceCreateNestedManyWithoutPatientInput
    immunisations?: ImmunisationCreateNestedManyWithoutPatientInput
    encounters?: EncounterCreateNestedManyWithoutPatientInput
    appointments?: AppointmentCreateNestedManyWithoutPatientInput
    documents?: ClinicalDocumentCreateNestedManyWithoutPatientInput
    auditLogs?: AuditLogCreateNestedManyWithoutPatientInput
  }

  export type PatientUncheckedCreateWithoutObservationsInput = {
    id?: string
    mrn: string
    firstName: string
    lastName: string
    preferredName?: string | null
    dateOfBirth: Date | string
    gender: string
    genderIdentity?: string | null
    phone?: string | null
    email?: string | null
    photoUrl?: string | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    address?: PatientAddressUncheckedCreateNestedOneWithoutPatientInput
    emergencyContacts?: EmergencyContactUncheckedCreateNestedManyWithoutPatientInput
    insurances?: PatientInsuranceUncheckedCreateNestedManyWithoutPatientInput
    conditions?: ConditionUncheckedCreateNestedManyWithoutPatientInput
    medications?: MedicationRequestUncheckedCreateNestedManyWithoutPatientInput
    allergies?: AllergyIntoleranceUncheckedCreateNestedManyWithoutPatientInput
    immunisations?: ImmunisationUncheckedCreateNestedManyWithoutPatientInput
    encounters?: EncounterUncheckedCreateNestedManyWithoutPatientInput
    appointments?: AppointmentUncheckedCreateNestedManyWithoutPatientInput
    documents?: ClinicalDocumentUncheckedCreateNestedManyWithoutPatientInput
    auditLogs?: AuditLogUncheckedCreateNestedManyWithoutPatientInput
  }

  export type PatientCreateOrConnectWithoutObservationsInput = {
    where: PatientWhereUniqueInput
    create: XOR<PatientCreateWithoutObservationsInput, PatientUncheckedCreateWithoutObservationsInput>
  }

  export type EncounterCreateWithoutObservationsInput = {
    id?: string
    status?: string
    encounterClass?: string
    type?: string | null
    reasonCode?: string | null
    reasonDisplay?: string | null
    startTime?: Date | string | null
    endTime?: Date | string | null
    providerId: string
    locationId?: string | null
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    patient: PatientCreateNestedOneWithoutEncountersInput
    conditions?: ConditionCreateNestedManyWithoutEncounterInput
    medications?: MedicationRequestCreateNestedManyWithoutEncounterInput
    documents?: ClinicalDocumentCreateNestedManyWithoutEncounterInput
  }

  export type EncounterUncheckedCreateWithoutObservationsInput = {
    id?: string
    patientId: string
    status?: string
    encounterClass?: string
    type?: string | null
    reasonCode?: string | null
    reasonDisplay?: string | null
    startTime?: Date | string | null
    endTime?: Date | string | null
    providerId: string
    locationId?: string | null
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    conditions?: ConditionUncheckedCreateNestedManyWithoutEncounterInput
    medications?: MedicationRequestUncheckedCreateNestedManyWithoutEncounterInput
    documents?: ClinicalDocumentUncheckedCreateNestedManyWithoutEncounterInput
  }

  export type EncounterCreateOrConnectWithoutObservationsInput = {
    where: EncounterWhereUniqueInput
    create: XOR<EncounterCreateWithoutObservationsInput, EncounterUncheckedCreateWithoutObservationsInput>
  }

  export type PatientUpsertWithoutObservationsInput = {
    update: XOR<PatientUpdateWithoutObservationsInput, PatientUncheckedUpdateWithoutObservationsInput>
    create: XOR<PatientCreateWithoutObservationsInput, PatientUncheckedCreateWithoutObservationsInput>
    where?: PatientWhereInput
  }

  export type PatientUpdateToOneWithWhereWithoutObservationsInput = {
    where?: PatientWhereInput
    data: XOR<PatientUpdateWithoutObservationsInput, PatientUncheckedUpdateWithoutObservationsInput>
  }

  export type PatientUpdateWithoutObservationsInput = {
    id?: StringFieldUpdateOperationsInput | string
    mrn?: StringFieldUpdateOperationsInput | string
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    preferredName?: NullableStringFieldUpdateOperationsInput | string | null
    dateOfBirth?: DateTimeFieldUpdateOperationsInput | Date | string
    gender?: StringFieldUpdateOperationsInput | string
    genderIdentity?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    photoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    address?: PatientAddressUpdateOneWithoutPatientNestedInput
    emergencyContacts?: EmergencyContactUpdateManyWithoutPatientNestedInput
    insurances?: PatientInsuranceUpdateManyWithoutPatientNestedInput
    conditions?: ConditionUpdateManyWithoutPatientNestedInput
    medications?: MedicationRequestUpdateManyWithoutPatientNestedInput
    allergies?: AllergyIntoleranceUpdateManyWithoutPatientNestedInput
    immunisations?: ImmunisationUpdateManyWithoutPatientNestedInput
    encounters?: EncounterUpdateManyWithoutPatientNestedInput
    appointments?: AppointmentUpdateManyWithoutPatientNestedInput
    documents?: ClinicalDocumentUpdateManyWithoutPatientNestedInput
    auditLogs?: AuditLogUpdateManyWithoutPatientNestedInput
  }

  export type PatientUncheckedUpdateWithoutObservationsInput = {
    id?: StringFieldUpdateOperationsInput | string
    mrn?: StringFieldUpdateOperationsInput | string
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    preferredName?: NullableStringFieldUpdateOperationsInput | string | null
    dateOfBirth?: DateTimeFieldUpdateOperationsInput | Date | string
    gender?: StringFieldUpdateOperationsInput | string
    genderIdentity?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    photoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    address?: PatientAddressUncheckedUpdateOneWithoutPatientNestedInput
    emergencyContacts?: EmergencyContactUncheckedUpdateManyWithoutPatientNestedInput
    insurances?: PatientInsuranceUncheckedUpdateManyWithoutPatientNestedInput
    conditions?: ConditionUncheckedUpdateManyWithoutPatientNestedInput
    medications?: MedicationRequestUncheckedUpdateManyWithoutPatientNestedInput
    allergies?: AllergyIntoleranceUncheckedUpdateManyWithoutPatientNestedInput
    immunisations?: ImmunisationUncheckedUpdateManyWithoutPatientNestedInput
    encounters?: EncounterUncheckedUpdateManyWithoutPatientNestedInput
    appointments?: AppointmentUncheckedUpdateManyWithoutPatientNestedInput
    documents?: ClinicalDocumentUncheckedUpdateManyWithoutPatientNestedInput
    auditLogs?: AuditLogUncheckedUpdateManyWithoutPatientNestedInput
  }

  export type EncounterUpsertWithoutObservationsInput = {
    update: XOR<EncounterUpdateWithoutObservationsInput, EncounterUncheckedUpdateWithoutObservationsInput>
    create: XOR<EncounterCreateWithoutObservationsInput, EncounterUncheckedCreateWithoutObservationsInput>
    where?: EncounterWhereInput
  }

  export type EncounterUpdateToOneWithWhereWithoutObservationsInput = {
    where?: EncounterWhereInput
    data: XOR<EncounterUpdateWithoutObservationsInput, EncounterUncheckedUpdateWithoutObservationsInput>
  }

  export type EncounterUpdateWithoutObservationsInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    encounterClass?: StringFieldUpdateOperationsInput | string
    type?: NullableStringFieldUpdateOperationsInput | string | null
    reasonCode?: NullableStringFieldUpdateOperationsInput | string | null
    reasonDisplay?: NullableStringFieldUpdateOperationsInput | string | null
    startTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    providerId?: StringFieldUpdateOperationsInput | string
    locationId?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    patient?: PatientUpdateOneRequiredWithoutEncountersNestedInput
    conditions?: ConditionUpdateManyWithoutEncounterNestedInput
    medications?: MedicationRequestUpdateManyWithoutEncounterNestedInput
    documents?: ClinicalDocumentUpdateManyWithoutEncounterNestedInput
  }

  export type EncounterUncheckedUpdateWithoutObservationsInput = {
    id?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    encounterClass?: StringFieldUpdateOperationsInput | string
    type?: NullableStringFieldUpdateOperationsInput | string | null
    reasonCode?: NullableStringFieldUpdateOperationsInput | string | null
    reasonDisplay?: NullableStringFieldUpdateOperationsInput | string | null
    startTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    providerId?: StringFieldUpdateOperationsInput | string
    locationId?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    conditions?: ConditionUncheckedUpdateManyWithoutEncounterNestedInput
    medications?: MedicationRequestUncheckedUpdateManyWithoutEncounterNestedInput
    documents?: ClinicalDocumentUncheckedUpdateManyWithoutEncounterNestedInput
  }

  export type PatientCreateWithoutImmunisationsInput = {
    id?: string
    mrn: string
    firstName: string
    lastName: string
    preferredName?: string | null
    dateOfBirth: Date | string
    gender: string
    genderIdentity?: string | null
    phone?: string | null
    email?: string | null
    photoUrl?: string | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    address?: PatientAddressCreateNestedOneWithoutPatientInput
    emergencyContacts?: EmergencyContactCreateNestedManyWithoutPatientInput
    insurances?: PatientInsuranceCreateNestedManyWithoutPatientInput
    conditions?: ConditionCreateNestedManyWithoutPatientInput
    medications?: MedicationRequestCreateNestedManyWithoutPatientInput
    allergies?: AllergyIntoleranceCreateNestedManyWithoutPatientInput
    observations?: ObservationCreateNestedManyWithoutPatientInput
    encounters?: EncounterCreateNestedManyWithoutPatientInput
    appointments?: AppointmentCreateNestedManyWithoutPatientInput
    documents?: ClinicalDocumentCreateNestedManyWithoutPatientInput
    auditLogs?: AuditLogCreateNestedManyWithoutPatientInput
  }

  export type PatientUncheckedCreateWithoutImmunisationsInput = {
    id?: string
    mrn: string
    firstName: string
    lastName: string
    preferredName?: string | null
    dateOfBirth: Date | string
    gender: string
    genderIdentity?: string | null
    phone?: string | null
    email?: string | null
    photoUrl?: string | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    address?: PatientAddressUncheckedCreateNestedOneWithoutPatientInput
    emergencyContacts?: EmergencyContactUncheckedCreateNestedManyWithoutPatientInput
    insurances?: PatientInsuranceUncheckedCreateNestedManyWithoutPatientInput
    conditions?: ConditionUncheckedCreateNestedManyWithoutPatientInput
    medications?: MedicationRequestUncheckedCreateNestedManyWithoutPatientInput
    allergies?: AllergyIntoleranceUncheckedCreateNestedManyWithoutPatientInput
    observations?: ObservationUncheckedCreateNestedManyWithoutPatientInput
    encounters?: EncounterUncheckedCreateNestedManyWithoutPatientInput
    appointments?: AppointmentUncheckedCreateNestedManyWithoutPatientInput
    documents?: ClinicalDocumentUncheckedCreateNestedManyWithoutPatientInput
    auditLogs?: AuditLogUncheckedCreateNestedManyWithoutPatientInput
  }

  export type PatientCreateOrConnectWithoutImmunisationsInput = {
    where: PatientWhereUniqueInput
    create: XOR<PatientCreateWithoutImmunisationsInput, PatientUncheckedCreateWithoutImmunisationsInput>
  }

  export type PatientUpsertWithoutImmunisationsInput = {
    update: XOR<PatientUpdateWithoutImmunisationsInput, PatientUncheckedUpdateWithoutImmunisationsInput>
    create: XOR<PatientCreateWithoutImmunisationsInput, PatientUncheckedCreateWithoutImmunisationsInput>
    where?: PatientWhereInput
  }

  export type PatientUpdateToOneWithWhereWithoutImmunisationsInput = {
    where?: PatientWhereInput
    data: XOR<PatientUpdateWithoutImmunisationsInput, PatientUncheckedUpdateWithoutImmunisationsInput>
  }

  export type PatientUpdateWithoutImmunisationsInput = {
    id?: StringFieldUpdateOperationsInput | string
    mrn?: StringFieldUpdateOperationsInput | string
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    preferredName?: NullableStringFieldUpdateOperationsInput | string | null
    dateOfBirth?: DateTimeFieldUpdateOperationsInput | Date | string
    gender?: StringFieldUpdateOperationsInput | string
    genderIdentity?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    photoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    address?: PatientAddressUpdateOneWithoutPatientNestedInput
    emergencyContacts?: EmergencyContactUpdateManyWithoutPatientNestedInput
    insurances?: PatientInsuranceUpdateManyWithoutPatientNestedInput
    conditions?: ConditionUpdateManyWithoutPatientNestedInput
    medications?: MedicationRequestUpdateManyWithoutPatientNestedInput
    allergies?: AllergyIntoleranceUpdateManyWithoutPatientNestedInput
    observations?: ObservationUpdateManyWithoutPatientNestedInput
    encounters?: EncounterUpdateManyWithoutPatientNestedInput
    appointments?: AppointmentUpdateManyWithoutPatientNestedInput
    documents?: ClinicalDocumentUpdateManyWithoutPatientNestedInput
    auditLogs?: AuditLogUpdateManyWithoutPatientNestedInput
  }

  export type PatientUncheckedUpdateWithoutImmunisationsInput = {
    id?: StringFieldUpdateOperationsInput | string
    mrn?: StringFieldUpdateOperationsInput | string
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    preferredName?: NullableStringFieldUpdateOperationsInput | string | null
    dateOfBirth?: DateTimeFieldUpdateOperationsInput | Date | string
    gender?: StringFieldUpdateOperationsInput | string
    genderIdentity?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    photoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    address?: PatientAddressUncheckedUpdateOneWithoutPatientNestedInput
    emergencyContacts?: EmergencyContactUncheckedUpdateManyWithoutPatientNestedInput
    insurances?: PatientInsuranceUncheckedUpdateManyWithoutPatientNestedInput
    conditions?: ConditionUncheckedUpdateManyWithoutPatientNestedInput
    medications?: MedicationRequestUncheckedUpdateManyWithoutPatientNestedInput
    allergies?: AllergyIntoleranceUncheckedUpdateManyWithoutPatientNestedInput
    observations?: ObservationUncheckedUpdateManyWithoutPatientNestedInput
    encounters?: EncounterUncheckedUpdateManyWithoutPatientNestedInput
    appointments?: AppointmentUncheckedUpdateManyWithoutPatientNestedInput
    documents?: ClinicalDocumentUncheckedUpdateManyWithoutPatientNestedInput
    auditLogs?: AuditLogUncheckedUpdateManyWithoutPatientNestedInput
  }

  export type PatientCreateWithoutEncountersInput = {
    id?: string
    mrn: string
    firstName: string
    lastName: string
    preferredName?: string | null
    dateOfBirth: Date | string
    gender: string
    genderIdentity?: string | null
    phone?: string | null
    email?: string | null
    photoUrl?: string | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    address?: PatientAddressCreateNestedOneWithoutPatientInput
    emergencyContacts?: EmergencyContactCreateNestedManyWithoutPatientInput
    insurances?: PatientInsuranceCreateNestedManyWithoutPatientInput
    conditions?: ConditionCreateNestedManyWithoutPatientInput
    medications?: MedicationRequestCreateNestedManyWithoutPatientInput
    allergies?: AllergyIntoleranceCreateNestedManyWithoutPatientInput
    observations?: ObservationCreateNestedManyWithoutPatientInput
    immunisations?: ImmunisationCreateNestedManyWithoutPatientInput
    appointments?: AppointmentCreateNestedManyWithoutPatientInput
    documents?: ClinicalDocumentCreateNestedManyWithoutPatientInput
    auditLogs?: AuditLogCreateNestedManyWithoutPatientInput
  }

  export type PatientUncheckedCreateWithoutEncountersInput = {
    id?: string
    mrn: string
    firstName: string
    lastName: string
    preferredName?: string | null
    dateOfBirth: Date | string
    gender: string
    genderIdentity?: string | null
    phone?: string | null
    email?: string | null
    photoUrl?: string | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    address?: PatientAddressUncheckedCreateNestedOneWithoutPatientInput
    emergencyContacts?: EmergencyContactUncheckedCreateNestedManyWithoutPatientInput
    insurances?: PatientInsuranceUncheckedCreateNestedManyWithoutPatientInput
    conditions?: ConditionUncheckedCreateNestedManyWithoutPatientInput
    medications?: MedicationRequestUncheckedCreateNestedManyWithoutPatientInput
    allergies?: AllergyIntoleranceUncheckedCreateNestedManyWithoutPatientInput
    observations?: ObservationUncheckedCreateNestedManyWithoutPatientInput
    immunisations?: ImmunisationUncheckedCreateNestedManyWithoutPatientInput
    appointments?: AppointmentUncheckedCreateNestedManyWithoutPatientInput
    documents?: ClinicalDocumentUncheckedCreateNestedManyWithoutPatientInput
    auditLogs?: AuditLogUncheckedCreateNestedManyWithoutPatientInput
  }

  export type PatientCreateOrConnectWithoutEncountersInput = {
    where: PatientWhereUniqueInput
    create: XOR<PatientCreateWithoutEncountersInput, PatientUncheckedCreateWithoutEncountersInput>
  }

  export type ConditionCreateWithoutEncounterInput = {
    id?: string
    snomedCode?: string | null
    icd10Code?: string | null
    display: string
    clinicalStatus?: string
    verificationStatus?: string
    severity?: string | null
    onsetDate?: Date | string | null
    resolvedDate?: Date | string | null
    recordedAt?: Date | string
    recordedBy: string
    patient: PatientCreateNestedOneWithoutConditionsInput
  }

  export type ConditionUncheckedCreateWithoutEncounterInput = {
    id?: string
    patientId: string
    snomedCode?: string | null
    icd10Code?: string | null
    display: string
    clinicalStatus?: string
    verificationStatus?: string
    severity?: string | null
    onsetDate?: Date | string | null
    resolvedDate?: Date | string | null
    recordedAt?: Date | string
    recordedBy: string
  }

  export type ConditionCreateOrConnectWithoutEncounterInput = {
    where: ConditionWhereUniqueInput
    create: XOR<ConditionCreateWithoutEncounterInput, ConditionUncheckedCreateWithoutEncounterInput>
  }

  export type ConditionCreateManyEncounterInputEnvelope = {
    data: ConditionCreateManyEncounterInput | ConditionCreateManyEncounterInput[]
    skipDuplicates?: boolean
  }

  export type MedicationRequestCreateWithoutEncounterInput = {
    id?: string
    rxNormCode?: string | null
    medicationName: string
    dose?: string | null
    frequency?: string | null
    route?: string | null
    status?: string
    prescribedBy: string
    prescribedAt?: Date | string
    discontinuedAt?: Date | string | null
    discontinuedBy?: string | null
    notes?: string | null
    patient: PatientCreateNestedOneWithoutMedicationsInput
  }

  export type MedicationRequestUncheckedCreateWithoutEncounterInput = {
    id?: string
    patientId: string
    rxNormCode?: string | null
    medicationName: string
    dose?: string | null
    frequency?: string | null
    route?: string | null
    status?: string
    prescribedBy: string
    prescribedAt?: Date | string
    discontinuedAt?: Date | string | null
    discontinuedBy?: string | null
    notes?: string | null
  }

  export type MedicationRequestCreateOrConnectWithoutEncounterInput = {
    where: MedicationRequestWhereUniqueInput
    create: XOR<MedicationRequestCreateWithoutEncounterInput, MedicationRequestUncheckedCreateWithoutEncounterInput>
  }

  export type MedicationRequestCreateManyEncounterInputEnvelope = {
    data: MedicationRequestCreateManyEncounterInput | MedicationRequestCreateManyEncounterInput[]
    skipDuplicates?: boolean
  }

  export type ObservationCreateWithoutEncounterInput = {
    id?: string
    category: string
    loincCode?: string | null
    display: string
    valueQuantity?: number | null
    valueUnit?: string | null
    valueString?: string | null
    referenceRangeLow?: number | null
    referenceRangeHigh?: number | null
    isAbnormal?: boolean
    status?: string
    effectiveAt: Date | string
    recordedBy: string
    patient: PatientCreateNestedOneWithoutObservationsInput
  }

  export type ObservationUncheckedCreateWithoutEncounterInput = {
    id?: string
    patientId: string
    category: string
    loincCode?: string | null
    display: string
    valueQuantity?: number | null
    valueUnit?: string | null
    valueString?: string | null
    referenceRangeLow?: number | null
    referenceRangeHigh?: number | null
    isAbnormal?: boolean
    status?: string
    effectiveAt: Date | string
    recordedBy: string
  }

  export type ObservationCreateOrConnectWithoutEncounterInput = {
    where: ObservationWhereUniqueInput
    create: XOR<ObservationCreateWithoutEncounterInput, ObservationUncheckedCreateWithoutEncounterInput>
  }

  export type ObservationCreateManyEncounterInputEnvelope = {
    data: ObservationCreateManyEncounterInput | ObservationCreateManyEncounterInput[]
    skipDuplicates?: boolean
  }

  export type ClinicalDocumentCreateWithoutEncounterInput = {
    id?: string
    type: string
    title: string
    content: string
    status?: string
    authorId: string
    authorName: string
    signedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    patient: PatientCreateNestedOneWithoutDocumentsInput
  }

  export type ClinicalDocumentUncheckedCreateWithoutEncounterInput = {
    id?: string
    patientId: string
    type: string
    title: string
    content: string
    status?: string
    authorId: string
    authorName: string
    signedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ClinicalDocumentCreateOrConnectWithoutEncounterInput = {
    where: ClinicalDocumentWhereUniqueInput
    create: XOR<ClinicalDocumentCreateWithoutEncounterInput, ClinicalDocumentUncheckedCreateWithoutEncounterInput>
  }

  export type ClinicalDocumentCreateManyEncounterInputEnvelope = {
    data: ClinicalDocumentCreateManyEncounterInput | ClinicalDocumentCreateManyEncounterInput[]
    skipDuplicates?: boolean
  }

  export type PatientUpsertWithoutEncountersInput = {
    update: XOR<PatientUpdateWithoutEncountersInput, PatientUncheckedUpdateWithoutEncountersInput>
    create: XOR<PatientCreateWithoutEncountersInput, PatientUncheckedCreateWithoutEncountersInput>
    where?: PatientWhereInput
  }

  export type PatientUpdateToOneWithWhereWithoutEncountersInput = {
    where?: PatientWhereInput
    data: XOR<PatientUpdateWithoutEncountersInput, PatientUncheckedUpdateWithoutEncountersInput>
  }

  export type PatientUpdateWithoutEncountersInput = {
    id?: StringFieldUpdateOperationsInput | string
    mrn?: StringFieldUpdateOperationsInput | string
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    preferredName?: NullableStringFieldUpdateOperationsInput | string | null
    dateOfBirth?: DateTimeFieldUpdateOperationsInput | Date | string
    gender?: StringFieldUpdateOperationsInput | string
    genderIdentity?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    photoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    address?: PatientAddressUpdateOneWithoutPatientNestedInput
    emergencyContacts?: EmergencyContactUpdateManyWithoutPatientNestedInput
    insurances?: PatientInsuranceUpdateManyWithoutPatientNestedInput
    conditions?: ConditionUpdateManyWithoutPatientNestedInput
    medications?: MedicationRequestUpdateManyWithoutPatientNestedInput
    allergies?: AllergyIntoleranceUpdateManyWithoutPatientNestedInput
    observations?: ObservationUpdateManyWithoutPatientNestedInput
    immunisations?: ImmunisationUpdateManyWithoutPatientNestedInput
    appointments?: AppointmentUpdateManyWithoutPatientNestedInput
    documents?: ClinicalDocumentUpdateManyWithoutPatientNestedInput
    auditLogs?: AuditLogUpdateManyWithoutPatientNestedInput
  }

  export type PatientUncheckedUpdateWithoutEncountersInput = {
    id?: StringFieldUpdateOperationsInput | string
    mrn?: StringFieldUpdateOperationsInput | string
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    preferredName?: NullableStringFieldUpdateOperationsInput | string | null
    dateOfBirth?: DateTimeFieldUpdateOperationsInput | Date | string
    gender?: StringFieldUpdateOperationsInput | string
    genderIdentity?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    photoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    address?: PatientAddressUncheckedUpdateOneWithoutPatientNestedInput
    emergencyContacts?: EmergencyContactUncheckedUpdateManyWithoutPatientNestedInput
    insurances?: PatientInsuranceUncheckedUpdateManyWithoutPatientNestedInput
    conditions?: ConditionUncheckedUpdateManyWithoutPatientNestedInput
    medications?: MedicationRequestUncheckedUpdateManyWithoutPatientNestedInput
    allergies?: AllergyIntoleranceUncheckedUpdateManyWithoutPatientNestedInput
    observations?: ObservationUncheckedUpdateManyWithoutPatientNestedInput
    immunisations?: ImmunisationUncheckedUpdateManyWithoutPatientNestedInput
    appointments?: AppointmentUncheckedUpdateManyWithoutPatientNestedInput
    documents?: ClinicalDocumentUncheckedUpdateManyWithoutPatientNestedInput
    auditLogs?: AuditLogUncheckedUpdateManyWithoutPatientNestedInput
  }

  export type ConditionUpsertWithWhereUniqueWithoutEncounterInput = {
    where: ConditionWhereUniqueInput
    update: XOR<ConditionUpdateWithoutEncounterInput, ConditionUncheckedUpdateWithoutEncounterInput>
    create: XOR<ConditionCreateWithoutEncounterInput, ConditionUncheckedCreateWithoutEncounterInput>
  }

  export type ConditionUpdateWithWhereUniqueWithoutEncounterInput = {
    where: ConditionWhereUniqueInput
    data: XOR<ConditionUpdateWithoutEncounterInput, ConditionUncheckedUpdateWithoutEncounterInput>
  }

  export type ConditionUpdateManyWithWhereWithoutEncounterInput = {
    where: ConditionScalarWhereInput
    data: XOR<ConditionUpdateManyMutationInput, ConditionUncheckedUpdateManyWithoutEncounterInput>
  }

  export type MedicationRequestUpsertWithWhereUniqueWithoutEncounterInput = {
    where: MedicationRequestWhereUniqueInput
    update: XOR<MedicationRequestUpdateWithoutEncounterInput, MedicationRequestUncheckedUpdateWithoutEncounterInput>
    create: XOR<MedicationRequestCreateWithoutEncounterInput, MedicationRequestUncheckedCreateWithoutEncounterInput>
  }

  export type MedicationRequestUpdateWithWhereUniqueWithoutEncounterInput = {
    where: MedicationRequestWhereUniqueInput
    data: XOR<MedicationRequestUpdateWithoutEncounterInput, MedicationRequestUncheckedUpdateWithoutEncounterInput>
  }

  export type MedicationRequestUpdateManyWithWhereWithoutEncounterInput = {
    where: MedicationRequestScalarWhereInput
    data: XOR<MedicationRequestUpdateManyMutationInput, MedicationRequestUncheckedUpdateManyWithoutEncounterInput>
  }

  export type ObservationUpsertWithWhereUniqueWithoutEncounterInput = {
    where: ObservationWhereUniqueInput
    update: XOR<ObservationUpdateWithoutEncounterInput, ObservationUncheckedUpdateWithoutEncounterInput>
    create: XOR<ObservationCreateWithoutEncounterInput, ObservationUncheckedCreateWithoutEncounterInput>
  }

  export type ObservationUpdateWithWhereUniqueWithoutEncounterInput = {
    where: ObservationWhereUniqueInput
    data: XOR<ObservationUpdateWithoutEncounterInput, ObservationUncheckedUpdateWithoutEncounterInput>
  }

  export type ObservationUpdateManyWithWhereWithoutEncounterInput = {
    where: ObservationScalarWhereInput
    data: XOR<ObservationUpdateManyMutationInput, ObservationUncheckedUpdateManyWithoutEncounterInput>
  }

  export type ClinicalDocumentUpsertWithWhereUniqueWithoutEncounterInput = {
    where: ClinicalDocumentWhereUniqueInput
    update: XOR<ClinicalDocumentUpdateWithoutEncounterInput, ClinicalDocumentUncheckedUpdateWithoutEncounterInput>
    create: XOR<ClinicalDocumentCreateWithoutEncounterInput, ClinicalDocumentUncheckedCreateWithoutEncounterInput>
  }

  export type ClinicalDocumentUpdateWithWhereUniqueWithoutEncounterInput = {
    where: ClinicalDocumentWhereUniqueInput
    data: XOR<ClinicalDocumentUpdateWithoutEncounterInput, ClinicalDocumentUncheckedUpdateWithoutEncounterInput>
  }

  export type ClinicalDocumentUpdateManyWithWhereWithoutEncounterInput = {
    where: ClinicalDocumentScalarWhereInput
    data: XOR<ClinicalDocumentUpdateManyMutationInput, ClinicalDocumentUncheckedUpdateManyWithoutEncounterInput>
  }

  export type PatientCreateWithoutAppointmentsInput = {
    id?: string
    mrn: string
    firstName: string
    lastName: string
    preferredName?: string | null
    dateOfBirth: Date | string
    gender: string
    genderIdentity?: string | null
    phone?: string | null
    email?: string | null
    photoUrl?: string | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    address?: PatientAddressCreateNestedOneWithoutPatientInput
    emergencyContacts?: EmergencyContactCreateNestedManyWithoutPatientInput
    insurances?: PatientInsuranceCreateNestedManyWithoutPatientInput
    conditions?: ConditionCreateNestedManyWithoutPatientInput
    medications?: MedicationRequestCreateNestedManyWithoutPatientInput
    allergies?: AllergyIntoleranceCreateNestedManyWithoutPatientInput
    observations?: ObservationCreateNestedManyWithoutPatientInput
    immunisations?: ImmunisationCreateNestedManyWithoutPatientInput
    encounters?: EncounterCreateNestedManyWithoutPatientInput
    documents?: ClinicalDocumentCreateNestedManyWithoutPatientInput
    auditLogs?: AuditLogCreateNestedManyWithoutPatientInput
  }

  export type PatientUncheckedCreateWithoutAppointmentsInput = {
    id?: string
    mrn: string
    firstName: string
    lastName: string
    preferredName?: string | null
    dateOfBirth: Date | string
    gender: string
    genderIdentity?: string | null
    phone?: string | null
    email?: string | null
    photoUrl?: string | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    address?: PatientAddressUncheckedCreateNestedOneWithoutPatientInput
    emergencyContacts?: EmergencyContactUncheckedCreateNestedManyWithoutPatientInput
    insurances?: PatientInsuranceUncheckedCreateNestedManyWithoutPatientInput
    conditions?: ConditionUncheckedCreateNestedManyWithoutPatientInput
    medications?: MedicationRequestUncheckedCreateNestedManyWithoutPatientInput
    allergies?: AllergyIntoleranceUncheckedCreateNestedManyWithoutPatientInput
    observations?: ObservationUncheckedCreateNestedManyWithoutPatientInput
    immunisations?: ImmunisationUncheckedCreateNestedManyWithoutPatientInput
    encounters?: EncounterUncheckedCreateNestedManyWithoutPatientInput
    documents?: ClinicalDocumentUncheckedCreateNestedManyWithoutPatientInput
    auditLogs?: AuditLogUncheckedCreateNestedManyWithoutPatientInput
  }

  export type PatientCreateOrConnectWithoutAppointmentsInput = {
    where: PatientWhereUniqueInput
    create: XOR<PatientCreateWithoutAppointmentsInput, PatientUncheckedCreateWithoutAppointmentsInput>
  }

  export type PatientUpsertWithoutAppointmentsInput = {
    update: XOR<PatientUpdateWithoutAppointmentsInput, PatientUncheckedUpdateWithoutAppointmentsInput>
    create: XOR<PatientCreateWithoutAppointmentsInput, PatientUncheckedCreateWithoutAppointmentsInput>
    where?: PatientWhereInput
  }

  export type PatientUpdateToOneWithWhereWithoutAppointmentsInput = {
    where?: PatientWhereInput
    data: XOR<PatientUpdateWithoutAppointmentsInput, PatientUncheckedUpdateWithoutAppointmentsInput>
  }

  export type PatientUpdateWithoutAppointmentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    mrn?: StringFieldUpdateOperationsInput | string
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    preferredName?: NullableStringFieldUpdateOperationsInput | string | null
    dateOfBirth?: DateTimeFieldUpdateOperationsInput | Date | string
    gender?: StringFieldUpdateOperationsInput | string
    genderIdentity?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    photoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    address?: PatientAddressUpdateOneWithoutPatientNestedInput
    emergencyContacts?: EmergencyContactUpdateManyWithoutPatientNestedInput
    insurances?: PatientInsuranceUpdateManyWithoutPatientNestedInput
    conditions?: ConditionUpdateManyWithoutPatientNestedInput
    medications?: MedicationRequestUpdateManyWithoutPatientNestedInput
    allergies?: AllergyIntoleranceUpdateManyWithoutPatientNestedInput
    observations?: ObservationUpdateManyWithoutPatientNestedInput
    immunisations?: ImmunisationUpdateManyWithoutPatientNestedInput
    encounters?: EncounterUpdateManyWithoutPatientNestedInput
    documents?: ClinicalDocumentUpdateManyWithoutPatientNestedInput
    auditLogs?: AuditLogUpdateManyWithoutPatientNestedInput
  }

  export type PatientUncheckedUpdateWithoutAppointmentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    mrn?: StringFieldUpdateOperationsInput | string
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    preferredName?: NullableStringFieldUpdateOperationsInput | string | null
    dateOfBirth?: DateTimeFieldUpdateOperationsInput | Date | string
    gender?: StringFieldUpdateOperationsInput | string
    genderIdentity?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    photoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    address?: PatientAddressUncheckedUpdateOneWithoutPatientNestedInput
    emergencyContacts?: EmergencyContactUncheckedUpdateManyWithoutPatientNestedInput
    insurances?: PatientInsuranceUncheckedUpdateManyWithoutPatientNestedInput
    conditions?: ConditionUncheckedUpdateManyWithoutPatientNestedInput
    medications?: MedicationRequestUncheckedUpdateManyWithoutPatientNestedInput
    allergies?: AllergyIntoleranceUncheckedUpdateManyWithoutPatientNestedInput
    observations?: ObservationUncheckedUpdateManyWithoutPatientNestedInput
    immunisations?: ImmunisationUncheckedUpdateManyWithoutPatientNestedInput
    encounters?: EncounterUncheckedUpdateManyWithoutPatientNestedInput
    documents?: ClinicalDocumentUncheckedUpdateManyWithoutPatientNestedInput
    auditLogs?: AuditLogUncheckedUpdateManyWithoutPatientNestedInput
  }

  export type PatientCreateWithoutDocumentsInput = {
    id?: string
    mrn: string
    firstName: string
    lastName: string
    preferredName?: string | null
    dateOfBirth: Date | string
    gender: string
    genderIdentity?: string | null
    phone?: string | null
    email?: string | null
    photoUrl?: string | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    address?: PatientAddressCreateNestedOneWithoutPatientInput
    emergencyContacts?: EmergencyContactCreateNestedManyWithoutPatientInput
    insurances?: PatientInsuranceCreateNestedManyWithoutPatientInput
    conditions?: ConditionCreateNestedManyWithoutPatientInput
    medications?: MedicationRequestCreateNestedManyWithoutPatientInput
    allergies?: AllergyIntoleranceCreateNestedManyWithoutPatientInput
    observations?: ObservationCreateNestedManyWithoutPatientInput
    immunisations?: ImmunisationCreateNestedManyWithoutPatientInput
    encounters?: EncounterCreateNestedManyWithoutPatientInput
    appointments?: AppointmentCreateNestedManyWithoutPatientInput
    auditLogs?: AuditLogCreateNestedManyWithoutPatientInput
  }

  export type PatientUncheckedCreateWithoutDocumentsInput = {
    id?: string
    mrn: string
    firstName: string
    lastName: string
    preferredName?: string | null
    dateOfBirth: Date | string
    gender: string
    genderIdentity?: string | null
    phone?: string | null
    email?: string | null
    photoUrl?: string | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    address?: PatientAddressUncheckedCreateNestedOneWithoutPatientInput
    emergencyContacts?: EmergencyContactUncheckedCreateNestedManyWithoutPatientInput
    insurances?: PatientInsuranceUncheckedCreateNestedManyWithoutPatientInput
    conditions?: ConditionUncheckedCreateNestedManyWithoutPatientInput
    medications?: MedicationRequestUncheckedCreateNestedManyWithoutPatientInput
    allergies?: AllergyIntoleranceUncheckedCreateNestedManyWithoutPatientInput
    observations?: ObservationUncheckedCreateNestedManyWithoutPatientInput
    immunisations?: ImmunisationUncheckedCreateNestedManyWithoutPatientInput
    encounters?: EncounterUncheckedCreateNestedManyWithoutPatientInput
    appointments?: AppointmentUncheckedCreateNestedManyWithoutPatientInput
    auditLogs?: AuditLogUncheckedCreateNestedManyWithoutPatientInput
  }

  export type PatientCreateOrConnectWithoutDocumentsInput = {
    where: PatientWhereUniqueInput
    create: XOR<PatientCreateWithoutDocumentsInput, PatientUncheckedCreateWithoutDocumentsInput>
  }

  export type EncounterCreateWithoutDocumentsInput = {
    id?: string
    status?: string
    encounterClass?: string
    type?: string | null
    reasonCode?: string | null
    reasonDisplay?: string | null
    startTime?: Date | string | null
    endTime?: Date | string | null
    providerId: string
    locationId?: string | null
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    patient: PatientCreateNestedOneWithoutEncountersInput
    conditions?: ConditionCreateNestedManyWithoutEncounterInput
    medications?: MedicationRequestCreateNestedManyWithoutEncounterInput
    observations?: ObservationCreateNestedManyWithoutEncounterInput
  }

  export type EncounterUncheckedCreateWithoutDocumentsInput = {
    id?: string
    patientId: string
    status?: string
    encounterClass?: string
    type?: string | null
    reasonCode?: string | null
    reasonDisplay?: string | null
    startTime?: Date | string | null
    endTime?: Date | string | null
    providerId: string
    locationId?: string | null
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    conditions?: ConditionUncheckedCreateNestedManyWithoutEncounterInput
    medications?: MedicationRequestUncheckedCreateNestedManyWithoutEncounterInput
    observations?: ObservationUncheckedCreateNestedManyWithoutEncounterInput
  }

  export type EncounterCreateOrConnectWithoutDocumentsInput = {
    where: EncounterWhereUniqueInput
    create: XOR<EncounterCreateWithoutDocumentsInput, EncounterUncheckedCreateWithoutDocumentsInput>
  }

  export type PatientUpsertWithoutDocumentsInput = {
    update: XOR<PatientUpdateWithoutDocumentsInput, PatientUncheckedUpdateWithoutDocumentsInput>
    create: XOR<PatientCreateWithoutDocumentsInput, PatientUncheckedCreateWithoutDocumentsInput>
    where?: PatientWhereInput
  }

  export type PatientUpdateToOneWithWhereWithoutDocumentsInput = {
    where?: PatientWhereInput
    data: XOR<PatientUpdateWithoutDocumentsInput, PatientUncheckedUpdateWithoutDocumentsInput>
  }

  export type PatientUpdateWithoutDocumentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    mrn?: StringFieldUpdateOperationsInput | string
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    preferredName?: NullableStringFieldUpdateOperationsInput | string | null
    dateOfBirth?: DateTimeFieldUpdateOperationsInput | Date | string
    gender?: StringFieldUpdateOperationsInput | string
    genderIdentity?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    photoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    address?: PatientAddressUpdateOneWithoutPatientNestedInput
    emergencyContacts?: EmergencyContactUpdateManyWithoutPatientNestedInput
    insurances?: PatientInsuranceUpdateManyWithoutPatientNestedInput
    conditions?: ConditionUpdateManyWithoutPatientNestedInput
    medications?: MedicationRequestUpdateManyWithoutPatientNestedInput
    allergies?: AllergyIntoleranceUpdateManyWithoutPatientNestedInput
    observations?: ObservationUpdateManyWithoutPatientNestedInput
    immunisations?: ImmunisationUpdateManyWithoutPatientNestedInput
    encounters?: EncounterUpdateManyWithoutPatientNestedInput
    appointments?: AppointmentUpdateManyWithoutPatientNestedInput
    auditLogs?: AuditLogUpdateManyWithoutPatientNestedInput
  }

  export type PatientUncheckedUpdateWithoutDocumentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    mrn?: StringFieldUpdateOperationsInput | string
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    preferredName?: NullableStringFieldUpdateOperationsInput | string | null
    dateOfBirth?: DateTimeFieldUpdateOperationsInput | Date | string
    gender?: StringFieldUpdateOperationsInput | string
    genderIdentity?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    photoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    address?: PatientAddressUncheckedUpdateOneWithoutPatientNestedInput
    emergencyContacts?: EmergencyContactUncheckedUpdateManyWithoutPatientNestedInput
    insurances?: PatientInsuranceUncheckedUpdateManyWithoutPatientNestedInput
    conditions?: ConditionUncheckedUpdateManyWithoutPatientNestedInput
    medications?: MedicationRequestUncheckedUpdateManyWithoutPatientNestedInput
    allergies?: AllergyIntoleranceUncheckedUpdateManyWithoutPatientNestedInput
    observations?: ObservationUncheckedUpdateManyWithoutPatientNestedInput
    immunisations?: ImmunisationUncheckedUpdateManyWithoutPatientNestedInput
    encounters?: EncounterUncheckedUpdateManyWithoutPatientNestedInput
    appointments?: AppointmentUncheckedUpdateManyWithoutPatientNestedInput
    auditLogs?: AuditLogUncheckedUpdateManyWithoutPatientNestedInput
  }

  export type EncounterUpsertWithoutDocumentsInput = {
    update: XOR<EncounterUpdateWithoutDocumentsInput, EncounterUncheckedUpdateWithoutDocumentsInput>
    create: XOR<EncounterCreateWithoutDocumentsInput, EncounterUncheckedCreateWithoutDocumentsInput>
    where?: EncounterWhereInput
  }

  export type EncounterUpdateToOneWithWhereWithoutDocumentsInput = {
    where?: EncounterWhereInput
    data: XOR<EncounterUpdateWithoutDocumentsInput, EncounterUncheckedUpdateWithoutDocumentsInput>
  }

  export type EncounterUpdateWithoutDocumentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    encounterClass?: StringFieldUpdateOperationsInput | string
    type?: NullableStringFieldUpdateOperationsInput | string | null
    reasonCode?: NullableStringFieldUpdateOperationsInput | string | null
    reasonDisplay?: NullableStringFieldUpdateOperationsInput | string | null
    startTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    providerId?: StringFieldUpdateOperationsInput | string
    locationId?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    patient?: PatientUpdateOneRequiredWithoutEncountersNestedInput
    conditions?: ConditionUpdateManyWithoutEncounterNestedInput
    medications?: MedicationRequestUpdateManyWithoutEncounterNestedInput
    observations?: ObservationUpdateManyWithoutEncounterNestedInput
  }

  export type EncounterUncheckedUpdateWithoutDocumentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    encounterClass?: StringFieldUpdateOperationsInput | string
    type?: NullableStringFieldUpdateOperationsInput | string | null
    reasonCode?: NullableStringFieldUpdateOperationsInput | string | null
    reasonDisplay?: NullableStringFieldUpdateOperationsInput | string | null
    startTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    providerId?: StringFieldUpdateOperationsInput | string
    locationId?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    conditions?: ConditionUncheckedUpdateManyWithoutEncounterNestedInput
    medications?: MedicationRequestUncheckedUpdateManyWithoutEncounterNestedInput
    observations?: ObservationUncheckedUpdateManyWithoutEncounterNestedInput
  }

  export type PatientCreateWithoutAuditLogsInput = {
    id?: string
    mrn: string
    firstName: string
    lastName: string
    preferredName?: string | null
    dateOfBirth: Date | string
    gender: string
    genderIdentity?: string | null
    phone?: string | null
    email?: string | null
    photoUrl?: string | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    address?: PatientAddressCreateNestedOneWithoutPatientInput
    emergencyContacts?: EmergencyContactCreateNestedManyWithoutPatientInput
    insurances?: PatientInsuranceCreateNestedManyWithoutPatientInput
    conditions?: ConditionCreateNestedManyWithoutPatientInput
    medications?: MedicationRequestCreateNestedManyWithoutPatientInput
    allergies?: AllergyIntoleranceCreateNestedManyWithoutPatientInput
    observations?: ObservationCreateNestedManyWithoutPatientInput
    immunisations?: ImmunisationCreateNestedManyWithoutPatientInput
    encounters?: EncounterCreateNestedManyWithoutPatientInput
    appointments?: AppointmentCreateNestedManyWithoutPatientInput
    documents?: ClinicalDocumentCreateNestedManyWithoutPatientInput
  }

  export type PatientUncheckedCreateWithoutAuditLogsInput = {
    id?: string
    mrn: string
    firstName: string
    lastName: string
    preferredName?: string | null
    dateOfBirth: Date | string
    gender: string
    genderIdentity?: string | null
    phone?: string | null
    email?: string | null
    photoUrl?: string | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    address?: PatientAddressUncheckedCreateNestedOneWithoutPatientInput
    emergencyContacts?: EmergencyContactUncheckedCreateNestedManyWithoutPatientInput
    insurances?: PatientInsuranceUncheckedCreateNestedManyWithoutPatientInput
    conditions?: ConditionUncheckedCreateNestedManyWithoutPatientInput
    medications?: MedicationRequestUncheckedCreateNestedManyWithoutPatientInput
    allergies?: AllergyIntoleranceUncheckedCreateNestedManyWithoutPatientInput
    observations?: ObservationUncheckedCreateNestedManyWithoutPatientInput
    immunisations?: ImmunisationUncheckedCreateNestedManyWithoutPatientInput
    encounters?: EncounterUncheckedCreateNestedManyWithoutPatientInput
    appointments?: AppointmentUncheckedCreateNestedManyWithoutPatientInput
    documents?: ClinicalDocumentUncheckedCreateNestedManyWithoutPatientInput
  }

  export type PatientCreateOrConnectWithoutAuditLogsInput = {
    where: PatientWhereUniqueInput
    create: XOR<PatientCreateWithoutAuditLogsInput, PatientUncheckedCreateWithoutAuditLogsInput>
  }

  export type PatientUpsertWithoutAuditLogsInput = {
    update: XOR<PatientUpdateWithoutAuditLogsInput, PatientUncheckedUpdateWithoutAuditLogsInput>
    create: XOR<PatientCreateWithoutAuditLogsInput, PatientUncheckedCreateWithoutAuditLogsInput>
    where?: PatientWhereInput
  }

  export type PatientUpdateToOneWithWhereWithoutAuditLogsInput = {
    where?: PatientWhereInput
    data: XOR<PatientUpdateWithoutAuditLogsInput, PatientUncheckedUpdateWithoutAuditLogsInput>
  }

  export type PatientUpdateWithoutAuditLogsInput = {
    id?: StringFieldUpdateOperationsInput | string
    mrn?: StringFieldUpdateOperationsInput | string
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    preferredName?: NullableStringFieldUpdateOperationsInput | string | null
    dateOfBirth?: DateTimeFieldUpdateOperationsInput | Date | string
    gender?: StringFieldUpdateOperationsInput | string
    genderIdentity?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    photoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    address?: PatientAddressUpdateOneWithoutPatientNestedInput
    emergencyContacts?: EmergencyContactUpdateManyWithoutPatientNestedInput
    insurances?: PatientInsuranceUpdateManyWithoutPatientNestedInput
    conditions?: ConditionUpdateManyWithoutPatientNestedInput
    medications?: MedicationRequestUpdateManyWithoutPatientNestedInput
    allergies?: AllergyIntoleranceUpdateManyWithoutPatientNestedInput
    observations?: ObservationUpdateManyWithoutPatientNestedInput
    immunisations?: ImmunisationUpdateManyWithoutPatientNestedInput
    encounters?: EncounterUpdateManyWithoutPatientNestedInput
    appointments?: AppointmentUpdateManyWithoutPatientNestedInput
    documents?: ClinicalDocumentUpdateManyWithoutPatientNestedInput
  }

  export type PatientUncheckedUpdateWithoutAuditLogsInput = {
    id?: StringFieldUpdateOperationsInput | string
    mrn?: StringFieldUpdateOperationsInput | string
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    preferredName?: NullableStringFieldUpdateOperationsInput | string | null
    dateOfBirth?: DateTimeFieldUpdateOperationsInput | Date | string
    gender?: StringFieldUpdateOperationsInput | string
    genderIdentity?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    photoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    address?: PatientAddressUncheckedUpdateOneWithoutPatientNestedInput
    emergencyContacts?: EmergencyContactUncheckedUpdateManyWithoutPatientNestedInput
    insurances?: PatientInsuranceUncheckedUpdateManyWithoutPatientNestedInput
    conditions?: ConditionUncheckedUpdateManyWithoutPatientNestedInput
    medications?: MedicationRequestUncheckedUpdateManyWithoutPatientNestedInput
    allergies?: AllergyIntoleranceUncheckedUpdateManyWithoutPatientNestedInput
    observations?: ObservationUncheckedUpdateManyWithoutPatientNestedInput
    immunisations?: ImmunisationUncheckedUpdateManyWithoutPatientNestedInput
    encounters?: EncounterUncheckedUpdateManyWithoutPatientNestedInput
    appointments?: AppointmentUncheckedUpdateManyWithoutPatientNestedInput
    documents?: ClinicalDocumentUncheckedUpdateManyWithoutPatientNestedInput
  }

  export type EmergencyContactCreateManyPatientInput = {
    id?: string
    name: string
    relationship: string
    phone: string
  }

  export type PatientInsuranceCreateManyPatientInput = {
    id?: string
    priority?: number
    payerName: string
    memberId: string
    groupId?: string | null
    subscriberName?: string | null
    isActive?: boolean
    createdAt?: Date | string
  }

  export type ConditionCreateManyPatientInput = {
    id?: string
    encounterId?: string | null
    snomedCode?: string | null
    icd10Code?: string | null
    display: string
    clinicalStatus?: string
    verificationStatus?: string
    severity?: string | null
    onsetDate?: Date | string | null
    resolvedDate?: Date | string | null
    recordedAt?: Date | string
    recordedBy: string
  }

  export type MedicationRequestCreateManyPatientInput = {
    id?: string
    encounterId?: string | null
    rxNormCode?: string | null
    medicationName: string
    dose?: string | null
    frequency?: string | null
    route?: string | null
    status?: string
    prescribedBy: string
    prescribedAt?: Date | string
    discontinuedAt?: Date | string | null
    discontinuedBy?: string | null
    notes?: string | null
  }

  export type AllergyIntoleranceCreateManyPatientInput = {
    id?: string
    substance: string
    substanceCode?: string | null
    type?: string
    criticality?: string | null
    clinicalStatus?: string
    reaction?: string | null
    reactionSeverity?: string | null
    onsetDate?: Date | string | null
    recordedAt?: Date | string
    recordedBy: string
  }

  export type ObservationCreateManyPatientInput = {
    id?: string
    encounterId?: string | null
    category: string
    loincCode?: string | null
    display: string
    valueQuantity?: number | null
    valueUnit?: string | null
    valueString?: string | null
    referenceRangeLow?: number | null
    referenceRangeHigh?: number | null
    isAbnormal?: boolean
    status?: string
    effectiveAt: Date | string
    recordedBy: string
  }

  export type ImmunisationCreateManyPatientInput = {
    id?: string
    vaccineCode?: string | null
    vaccineName: string
    status?: string
    occurrenceDate: Date | string
    lotNumber?: string | null
    site?: string | null
    route?: string | null
    administeredBy?: string | null
    primarySource?: boolean
    notes?: string | null
    createdAt?: Date | string
  }

  export type EncounterCreateManyPatientInput = {
    id?: string
    status?: string
    encounterClass?: string
    type?: string | null
    reasonCode?: string | null
    reasonDisplay?: string | null
    startTime?: Date | string | null
    endTime?: Date | string | null
    providerId: string
    locationId?: string | null
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AppointmentCreateManyPatientInput = {
    id?: string
    providerId: string
    status?: string
    serviceType?: string | null
    description?: string | null
    startTime: Date | string
    endTime: Date | string
    durationMinutes?: number
    locationId?: string | null
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ClinicalDocumentCreateManyPatientInput = {
    id?: string
    encounterId?: string | null
    type: string
    title: string
    content: string
    status?: string
    authorId: string
    authorName: string
    signedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AuditLogCreateManyPatientInput = {
    id?: string
    userId: string
    action: string
    resourceType: string
    resourceId?: string | null
    changes?: NullableJsonNullValueInput | InputJsonValue
    ipAddress?: string | null
    correlationId?: string | null
    createdAt?: Date | string
  }

  export type EmergencyContactUpdateWithoutPatientInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    relationship?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
  }

  export type EmergencyContactUncheckedUpdateWithoutPatientInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    relationship?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
  }

  export type EmergencyContactUncheckedUpdateManyWithoutPatientInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    relationship?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
  }

  export type PatientInsuranceUpdateWithoutPatientInput = {
    id?: StringFieldUpdateOperationsInput | string
    priority?: IntFieldUpdateOperationsInput | number
    payerName?: StringFieldUpdateOperationsInput | string
    memberId?: StringFieldUpdateOperationsInput | string
    groupId?: NullableStringFieldUpdateOperationsInput | string | null
    subscriberName?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PatientInsuranceUncheckedUpdateWithoutPatientInput = {
    id?: StringFieldUpdateOperationsInput | string
    priority?: IntFieldUpdateOperationsInput | number
    payerName?: StringFieldUpdateOperationsInput | string
    memberId?: StringFieldUpdateOperationsInput | string
    groupId?: NullableStringFieldUpdateOperationsInput | string | null
    subscriberName?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PatientInsuranceUncheckedUpdateManyWithoutPatientInput = {
    id?: StringFieldUpdateOperationsInput | string
    priority?: IntFieldUpdateOperationsInput | number
    payerName?: StringFieldUpdateOperationsInput | string
    memberId?: StringFieldUpdateOperationsInput | string
    groupId?: NullableStringFieldUpdateOperationsInput | string | null
    subscriberName?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ConditionUpdateWithoutPatientInput = {
    id?: StringFieldUpdateOperationsInput | string
    snomedCode?: NullableStringFieldUpdateOperationsInput | string | null
    icd10Code?: NullableStringFieldUpdateOperationsInput | string | null
    display?: StringFieldUpdateOperationsInput | string
    clinicalStatus?: StringFieldUpdateOperationsInput | string
    verificationStatus?: StringFieldUpdateOperationsInput | string
    severity?: NullableStringFieldUpdateOperationsInput | string | null
    onsetDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    resolvedDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    recordedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    recordedBy?: StringFieldUpdateOperationsInput | string
    encounter?: EncounterUpdateOneWithoutConditionsNestedInput
  }

  export type ConditionUncheckedUpdateWithoutPatientInput = {
    id?: StringFieldUpdateOperationsInput | string
    encounterId?: NullableStringFieldUpdateOperationsInput | string | null
    snomedCode?: NullableStringFieldUpdateOperationsInput | string | null
    icd10Code?: NullableStringFieldUpdateOperationsInput | string | null
    display?: StringFieldUpdateOperationsInput | string
    clinicalStatus?: StringFieldUpdateOperationsInput | string
    verificationStatus?: StringFieldUpdateOperationsInput | string
    severity?: NullableStringFieldUpdateOperationsInput | string | null
    onsetDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    resolvedDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    recordedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    recordedBy?: StringFieldUpdateOperationsInput | string
  }

  export type ConditionUncheckedUpdateManyWithoutPatientInput = {
    id?: StringFieldUpdateOperationsInput | string
    encounterId?: NullableStringFieldUpdateOperationsInput | string | null
    snomedCode?: NullableStringFieldUpdateOperationsInput | string | null
    icd10Code?: NullableStringFieldUpdateOperationsInput | string | null
    display?: StringFieldUpdateOperationsInput | string
    clinicalStatus?: StringFieldUpdateOperationsInput | string
    verificationStatus?: StringFieldUpdateOperationsInput | string
    severity?: NullableStringFieldUpdateOperationsInput | string | null
    onsetDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    resolvedDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    recordedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    recordedBy?: StringFieldUpdateOperationsInput | string
  }

  export type MedicationRequestUpdateWithoutPatientInput = {
    id?: StringFieldUpdateOperationsInput | string
    rxNormCode?: NullableStringFieldUpdateOperationsInput | string | null
    medicationName?: StringFieldUpdateOperationsInput | string
    dose?: NullableStringFieldUpdateOperationsInput | string | null
    frequency?: NullableStringFieldUpdateOperationsInput | string | null
    route?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    prescribedBy?: StringFieldUpdateOperationsInput | string
    prescribedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    discontinuedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    discontinuedBy?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    encounter?: EncounterUpdateOneWithoutMedicationsNestedInput
  }

  export type MedicationRequestUncheckedUpdateWithoutPatientInput = {
    id?: StringFieldUpdateOperationsInput | string
    encounterId?: NullableStringFieldUpdateOperationsInput | string | null
    rxNormCode?: NullableStringFieldUpdateOperationsInput | string | null
    medicationName?: StringFieldUpdateOperationsInput | string
    dose?: NullableStringFieldUpdateOperationsInput | string | null
    frequency?: NullableStringFieldUpdateOperationsInput | string | null
    route?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    prescribedBy?: StringFieldUpdateOperationsInput | string
    prescribedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    discontinuedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    discontinuedBy?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type MedicationRequestUncheckedUpdateManyWithoutPatientInput = {
    id?: StringFieldUpdateOperationsInput | string
    encounterId?: NullableStringFieldUpdateOperationsInput | string | null
    rxNormCode?: NullableStringFieldUpdateOperationsInput | string | null
    medicationName?: StringFieldUpdateOperationsInput | string
    dose?: NullableStringFieldUpdateOperationsInput | string | null
    frequency?: NullableStringFieldUpdateOperationsInput | string | null
    route?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    prescribedBy?: StringFieldUpdateOperationsInput | string
    prescribedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    discontinuedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    discontinuedBy?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type AllergyIntoleranceUpdateWithoutPatientInput = {
    id?: StringFieldUpdateOperationsInput | string
    substance?: StringFieldUpdateOperationsInput | string
    substanceCode?: NullableStringFieldUpdateOperationsInput | string | null
    type?: StringFieldUpdateOperationsInput | string
    criticality?: NullableStringFieldUpdateOperationsInput | string | null
    clinicalStatus?: StringFieldUpdateOperationsInput | string
    reaction?: NullableStringFieldUpdateOperationsInput | string | null
    reactionSeverity?: NullableStringFieldUpdateOperationsInput | string | null
    onsetDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    recordedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    recordedBy?: StringFieldUpdateOperationsInput | string
  }

  export type AllergyIntoleranceUncheckedUpdateWithoutPatientInput = {
    id?: StringFieldUpdateOperationsInput | string
    substance?: StringFieldUpdateOperationsInput | string
    substanceCode?: NullableStringFieldUpdateOperationsInput | string | null
    type?: StringFieldUpdateOperationsInput | string
    criticality?: NullableStringFieldUpdateOperationsInput | string | null
    clinicalStatus?: StringFieldUpdateOperationsInput | string
    reaction?: NullableStringFieldUpdateOperationsInput | string | null
    reactionSeverity?: NullableStringFieldUpdateOperationsInput | string | null
    onsetDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    recordedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    recordedBy?: StringFieldUpdateOperationsInput | string
  }

  export type AllergyIntoleranceUncheckedUpdateManyWithoutPatientInput = {
    id?: StringFieldUpdateOperationsInput | string
    substance?: StringFieldUpdateOperationsInput | string
    substanceCode?: NullableStringFieldUpdateOperationsInput | string | null
    type?: StringFieldUpdateOperationsInput | string
    criticality?: NullableStringFieldUpdateOperationsInput | string | null
    clinicalStatus?: StringFieldUpdateOperationsInput | string
    reaction?: NullableStringFieldUpdateOperationsInput | string | null
    reactionSeverity?: NullableStringFieldUpdateOperationsInput | string | null
    onsetDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    recordedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    recordedBy?: StringFieldUpdateOperationsInput | string
  }

  export type ObservationUpdateWithoutPatientInput = {
    id?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    loincCode?: NullableStringFieldUpdateOperationsInput | string | null
    display?: StringFieldUpdateOperationsInput | string
    valueQuantity?: NullableFloatFieldUpdateOperationsInput | number | null
    valueUnit?: NullableStringFieldUpdateOperationsInput | string | null
    valueString?: NullableStringFieldUpdateOperationsInput | string | null
    referenceRangeLow?: NullableFloatFieldUpdateOperationsInput | number | null
    referenceRangeHigh?: NullableFloatFieldUpdateOperationsInput | number | null
    isAbnormal?: BoolFieldUpdateOperationsInput | boolean
    status?: StringFieldUpdateOperationsInput | string
    effectiveAt?: DateTimeFieldUpdateOperationsInput | Date | string
    recordedBy?: StringFieldUpdateOperationsInput | string
    encounter?: EncounterUpdateOneWithoutObservationsNestedInput
  }

  export type ObservationUncheckedUpdateWithoutPatientInput = {
    id?: StringFieldUpdateOperationsInput | string
    encounterId?: NullableStringFieldUpdateOperationsInput | string | null
    category?: StringFieldUpdateOperationsInput | string
    loincCode?: NullableStringFieldUpdateOperationsInput | string | null
    display?: StringFieldUpdateOperationsInput | string
    valueQuantity?: NullableFloatFieldUpdateOperationsInput | number | null
    valueUnit?: NullableStringFieldUpdateOperationsInput | string | null
    valueString?: NullableStringFieldUpdateOperationsInput | string | null
    referenceRangeLow?: NullableFloatFieldUpdateOperationsInput | number | null
    referenceRangeHigh?: NullableFloatFieldUpdateOperationsInput | number | null
    isAbnormal?: BoolFieldUpdateOperationsInput | boolean
    status?: StringFieldUpdateOperationsInput | string
    effectiveAt?: DateTimeFieldUpdateOperationsInput | Date | string
    recordedBy?: StringFieldUpdateOperationsInput | string
  }

  export type ObservationUncheckedUpdateManyWithoutPatientInput = {
    id?: StringFieldUpdateOperationsInput | string
    encounterId?: NullableStringFieldUpdateOperationsInput | string | null
    category?: StringFieldUpdateOperationsInput | string
    loincCode?: NullableStringFieldUpdateOperationsInput | string | null
    display?: StringFieldUpdateOperationsInput | string
    valueQuantity?: NullableFloatFieldUpdateOperationsInput | number | null
    valueUnit?: NullableStringFieldUpdateOperationsInput | string | null
    valueString?: NullableStringFieldUpdateOperationsInput | string | null
    referenceRangeLow?: NullableFloatFieldUpdateOperationsInput | number | null
    referenceRangeHigh?: NullableFloatFieldUpdateOperationsInput | number | null
    isAbnormal?: BoolFieldUpdateOperationsInput | boolean
    status?: StringFieldUpdateOperationsInput | string
    effectiveAt?: DateTimeFieldUpdateOperationsInput | Date | string
    recordedBy?: StringFieldUpdateOperationsInput | string
  }

  export type ImmunisationUpdateWithoutPatientInput = {
    id?: StringFieldUpdateOperationsInput | string
    vaccineCode?: NullableStringFieldUpdateOperationsInput | string | null
    vaccineName?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    occurrenceDate?: DateTimeFieldUpdateOperationsInput | Date | string
    lotNumber?: NullableStringFieldUpdateOperationsInput | string | null
    site?: NullableStringFieldUpdateOperationsInput | string | null
    route?: NullableStringFieldUpdateOperationsInput | string | null
    administeredBy?: NullableStringFieldUpdateOperationsInput | string | null
    primarySource?: BoolFieldUpdateOperationsInput | boolean
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ImmunisationUncheckedUpdateWithoutPatientInput = {
    id?: StringFieldUpdateOperationsInput | string
    vaccineCode?: NullableStringFieldUpdateOperationsInput | string | null
    vaccineName?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    occurrenceDate?: DateTimeFieldUpdateOperationsInput | Date | string
    lotNumber?: NullableStringFieldUpdateOperationsInput | string | null
    site?: NullableStringFieldUpdateOperationsInput | string | null
    route?: NullableStringFieldUpdateOperationsInput | string | null
    administeredBy?: NullableStringFieldUpdateOperationsInput | string | null
    primarySource?: BoolFieldUpdateOperationsInput | boolean
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ImmunisationUncheckedUpdateManyWithoutPatientInput = {
    id?: StringFieldUpdateOperationsInput | string
    vaccineCode?: NullableStringFieldUpdateOperationsInput | string | null
    vaccineName?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    occurrenceDate?: DateTimeFieldUpdateOperationsInput | Date | string
    lotNumber?: NullableStringFieldUpdateOperationsInput | string | null
    site?: NullableStringFieldUpdateOperationsInput | string | null
    route?: NullableStringFieldUpdateOperationsInput | string | null
    administeredBy?: NullableStringFieldUpdateOperationsInput | string | null
    primarySource?: BoolFieldUpdateOperationsInput | boolean
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EncounterUpdateWithoutPatientInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    encounterClass?: StringFieldUpdateOperationsInput | string
    type?: NullableStringFieldUpdateOperationsInput | string | null
    reasonCode?: NullableStringFieldUpdateOperationsInput | string | null
    reasonDisplay?: NullableStringFieldUpdateOperationsInput | string | null
    startTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    providerId?: StringFieldUpdateOperationsInput | string
    locationId?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    conditions?: ConditionUpdateManyWithoutEncounterNestedInput
    medications?: MedicationRequestUpdateManyWithoutEncounterNestedInput
    observations?: ObservationUpdateManyWithoutEncounterNestedInput
    documents?: ClinicalDocumentUpdateManyWithoutEncounterNestedInput
  }

  export type EncounterUncheckedUpdateWithoutPatientInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    encounterClass?: StringFieldUpdateOperationsInput | string
    type?: NullableStringFieldUpdateOperationsInput | string | null
    reasonCode?: NullableStringFieldUpdateOperationsInput | string | null
    reasonDisplay?: NullableStringFieldUpdateOperationsInput | string | null
    startTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    providerId?: StringFieldUpdateOperationsInput | string
    locationId?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    conditions?: ConditionUncheckedUpdateManyWithoutEncounterNestedInput
    medications?: MedicationRequestUncheckedUpdateManyWithoutEncounterNestedInput
    observations?: ObservationUncheckedUpdateManyWithoutEncounterNestedInput
    documents?: ClinicalDocumentUncheckedUpdateManyWithoutEncounterNestedInput
  }

  export type EncounterUncheckedUpdateManyWithoutPatientInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    encounterClass?: StringFieldUpdateOperationsInput | string
    type?: NullableStringFieldUpdateOperationsInput | string | null
    reasonCode?: NullableStringFieldUpdateOperationsInput | string | null
    reasonDisplay?: NullableStringFieldUpdateOperationsInput | string | null
    startTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    providerId?: StringFieldUpdateOperationsInput | string
    locationId?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AppointmentUpdateWithoutPatientInput = {
    id?: StringFieldUpdateOperationsInput | string
    providerId?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    serviceType?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    startTime?: DateTimeFieldUpdateOperationsInput | Date | string
    endTime?: DateTimeFieldUpdateOperationsInput | Date | string
    durationMinutes?: IntFieldUpdateOperationsInput | number
    locationId?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AppointmentUncheckedUpdateWithoutPatientInput = {
    id?: StringFieldUpdateOperationsInput | string
    providerId?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    serviceType?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    startTime?: DateTimeFieldUpdateOperationsInput | Date | string
    endTime?: DateTimeFieldUpdateOperationsInput | Date | string
    durationMinutes?: IntFieldUpdateOperationsInput | number
    locationId?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AppointmentUncheckedUpdateManyWithoutPatientInput = {
    id?: StringFieldUpdateOperationsInput | string
    providerId?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    serviceType?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    startTime?: DateTimeFieldUpdateOperationsInput | Date | string
    endTime?: DateTimeFieldUpdateOperationsInput | Date | string
    durationMinutes?: IntFieldUpdateOperationsInput | number
    locationId?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ClinicalDocumentUpdateWithoutPatientInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    authorId?: StringFieldUpdateOperationsInput | string
    authorName?: StringFieldUpdateOperationsInput | string
    signedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    encounter?: EncounterUpdateOneWithoutDocumentsNestedInput
  }

  export type ClinicalDocumentUncheckedUpdateWithoutPatientInput = {
    id?: StringFieldUpdateOperationsInput | string
    encounterId?: NullableStringFieldUpdateOperationsInput | string | null
    type?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    authorId?: StringFieldUpdateOperationsInput | string
    authorName?: StringFieldUpdateOperationsInput | string
    signedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ClinicalDocumentUncheckedUpdateManyWithoutPatientInput = {
    id?: StringFieldUpdateOperationsInput | string
    encounterId?: NullableStringFieldUpdateOperationsInput | string | null
    type?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    authorId?: StringFieldUpdateOperationsInput | string
    authorName?: StringFieldUpdateOperationsInput | string
    signedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AuditLogUpdateWithoutPatientInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    resourceType?: StringFieldUpdateOperationsInput | string
    resourceId?: NullableStringFieldUpdateOperationsInput | string | null
    changes?: NullableJsonNullValueInput | InputJsonValue
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    correlationId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AuditLogUncheckedUpdateWithoutPatientInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    resourceType?: StringFieldUpdateOperationsInput | string
    resourceId?: NullableStringFieldUpdateOperationsInput | string | null
    changes?: NullableJsonNullValueInput | InputJsonValue
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    correlationId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AuditLogUncheckedUpdateManyWithoutPatientInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    resourceType?: StringFieldUpdateOperationsInput | string
    resourceId?: NullableStringFieldUpdateOperationsInput | string | null
    changes?: NullableJsonNullValueInput | InputJsonValue
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    correlationId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ConditionCreateManyEncounterInput = {
    id?: string
    patientId: string
    snomedCode?: string | null
    icd10Code?: string | null
    display: string
    clinicalStatus?: string
    verificationStatus?: string
    severity?: string | null
    onsetDate?: Date | string | null
    resolvedDate?: Date | string | null
    recordedAt?: Date | string
    recordedBy: string
  }

  export type MedicationRequestCreateManyEncounterInput = {
    id?: string
    patientId: string
    rxNormCode?: string | null
    medicationName: string
    dose?: string | null
    frequency?: string | null
    route?: string | null
    status?: string
    prescribedBy: string
    prescribedAt?: Date | string
    discontinuedAt?: Date | string | null
    discontinuedBy?: string | null
    notes?: string | null
  }

  export type ObservationCreateManyEncounterInput = {
    id?: string
    patientId: string
    category: string
    loincCode?: string | null
    display: string
    valueQuantity?: number | null
    valueUnit?: string | null
    valueString?: string | null
    referenceRangeLow?: number | null
    referenceRangeHigh?: number | null
    isAbnormal?: boolean
    status?: string
    effectiveAt: Date | string
    recordedBy: string
  }

  export type ClinicalDocumentCreateManyEncounterInput = {
    id?: string
    patientId: string
    type: string
    title: string
    content: string
    status?: string
    authorId: string
    authorName: string
    signedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ConditionUpdateWithoutEncounterInput = {
    id?: StringFieldUpdateOperationsInput | string
    snomedCode?: NullableStringFieldUpdateOperationsInput | string | null
    icd10Code?: NullableStringFieldUpdateOperationsInput | string | null
    display?: StringFieldUpdateOperationsInput | string
    clinicalStatus?: StringFieldUpdateOperationsInput | string
    verificationStatus?: StringFieldUpdateOperationsInput | string
    severity?: NullableStringFieldUpdateOperationsInput | string | null
    onsetDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    resolvedDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    recordedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    recordedBy?: StringFieldUpdateOperationsInput | string
    patient?: PatientUpdateOneRequiredWithoutConditionsNestedInput
  }

  export type ConditionUncheckedUpdateWithoutEncounterInput = {
    id?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    snomedCode?: NullableStringFieldUpdateOperationsInput | string | null
    icd10Code?: NullableStringFieldUpdateOperationsInput | string | null
    display?: StringFieldUpdateOperationsInput | string
    clinicalStatus?: StringFieldUpdateOperationsInput | string
    verificationStatus?: StringFieldUpdateOperationsInput | string
    severity?: NullableStringFieldUpdateOperationsInput | string | null
    onsetDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    resolvedDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    recordedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    recordedBy?: StringFieldUpdateOperationsInput | string
  }

  export type ConditionUncheckedUpdateManyWithoutEncounterInput = {
    id?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    snomedCode?: NullableStringFieldUpdateOperationsInput | string | null
    icd10Code?: NullableStringFieldUpdateOperationsInput | string | null
    display?: StringFieldUpdateOperationsInput | string
    clinicalStatus?: StringFieldUpdateOperationsInput | string
    verificationStatus?: StringFieldUpdateOperationsInput | string
    severity?: NullableStringFieldUpdateOperationsInput | string | null
    onsetDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    resolvedDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    recordedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    recordedBy?: StringFieldUpdateOperationsInput | string
  }

  export type MedicationRequestUpdateWithoutEncounterInput = {
    id?: StringFieldUpdateOperationsInput | string
    rxNormCode?: NullableStringFieldUpdateOperationsInput | string | null
    medicationName?: StringFieldUpdateOperationsInput | string
    dose?: NullableStringFieldUpdateOperationsInput | string | null
    frequency?: NullableStringFieldUpdateOperationsInput | string | null
    route?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    prescribedBy?: StringFieldUpdateOperationsInput | string
    prescribedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    discontinuedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    discontinuedBy?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    patient?: PatientUpdateOneRequiredWithoutMedicationsNestedInput
  }

  export type MedicationRequestUncheckedUpdateWithoutEncounterInput = {
    id?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    rxNormCode?: NullableStringFieldUpdateOperationsInput | string | null
    medicationName?: StringFieldUpdateOperationsInput | string
    dose?: NullableStringFieldUpdateOperationsInput | string | null
    frequency?: NullableStringFieldUpdateOperationsInput | string | null
    route?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    prescribedBy?: StringFieldUpdateOperationsInput | string
    prescribedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    discontinuedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    discontinuedBy?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type MedicationRequestUncheckedUpdateManyWithoutEncounterInput = {
    id?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    rxNormCode?: NullableStringFieldUpdateOperationsInput | string | null
    medicationName?: StringFieldUpdateOperationsInput | string
    dose?: NullableStringFieldUpdateOperationsInput | string | null
    frequency?: NullableStringFieldUpdateOperationsInput | string | null
    route?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    prescribedBy?: StringFieldUpdateOperationsInput | string
    prescribedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    discontinuedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    discontinuedBy?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type ObservationUpdateWithoutEncounterInput = {
    id?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    loincCode?: NullableStringFieldUpdateOperationsInput | string | null
    display?: StringFieldUpdateOperationsInput | string
    valueQuantity?: NullableFloatFieldUpdateOperationsInput | number | null
    valueUnit?: NullableStringFieldUpdateOperationsInput | string | null
    valueString?: NullableStringFieldUpdateOperationsInput | string | null
    referenceRangeLow?: NullableFloatFieldUpdateOperationsInput | number | null
    referenceRangeHigh?: NullableFloatFieldUpdateOperationsInput | number | null
    isAbnormal?: BoolFieldUpdateOperationsInput | boolean
    status?: StringFieldUpdateOperationsInput | string
    effectiveAt?: DateTimeFieldUpdateOperationsInput | Date | string
    recordedBy?: StringFieldUpdateOperationsInput | string
    patient?: PatientUpdateOneRequiredWithoutObservationsNestedInput
  }

  export type ObservationUncheckedUpdateWithoutEncounterInput = {
    id?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    loincCode?: NullableStringFieldUpdateOperationsInput | string | null
    display?: StringFieldUpdateOperationsInput | string
    valueQuantity?: NullableFloatFieldUpdateOperationsInput | number | null
    valueUnit?: NullableStringFieldUpdateOperationsInput | string | null
    valueString?: NullableStringFieldUpdateOperationsInput | string | null
    referenceRangeLow?: NullableFloatFieldUpdateOperationsInput | number | null
    referenceRangeHigh?: NullableFloatFieldUpdateOperationsInput | number | null
    isAbnormal?: BoolFieldUpdateOperationsInput | boolean
    status?: StringFieldUpdateOperationsInput | string
    effectiveAt?: DateTimeFieldUpdateOperationsInput | Date | string
    recordedBy?: StringFieldUpdateOperationsInput | string
  }

  export type ObservationUncheckedUpdateManyWithoutEncounterInput = {
    id?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    loincCode?: NullableStringFieldUpdateOperationsInput | string | null
    display?: StringFieldUpdateOperationsInput | string
    valueQuantity?: NullableFloatFieldUpdateOperationsInput | number | null
    valueUnit?: NullableStringFieldUpdateOperationsInput | string | null
    valueString?: NullableStringFieldUpdateOperationsInput | string | null
    referenceRangeLow?: NullableFloatFieldUpdateOperationsInput | number | null
    referenceRangeHigh?: NullableFloatFieldUpdateOperationsInput | number | null
    isAbnormal?: BoolFieldUpdateOperationsInput | boolean
    status?: StringFieldUpdateOperationsInput | string
    effectiveAt?: DateTimeFieldUpdateOperationsInput | Date | string
    recordedBy?: StringFieldUpdateOperationsInput | string
  }

  export type ClinicalDocumentUpdateWithoutEncounterInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    authorId?: StringFieldUpdateOperationsInput | string
    authorName?: StringFieldUpdateOperationsInput | string
    signedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    patient?: PatientUpdateOneRequiredWithoutDocumentsNestedInput
  }

  export type ClinicalDocumentUncheckedUpdateWithoutEncounterInput = {
    id?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    authorId?: StringFieldUpdateOperationsInput | string
    authorName?: StringFieldUpdateOperationsInput | string
    signedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ClinicalDocumentUncheckedUpdateManyWithoutEncounterInput = {
    id?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    authorId?: StringFieldUpdateOperationsInput | string
    authorName?: StringFieldUpdateOperationsInput | string
    signedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Aliases for legacy arg types
   */
    /**
     * @deprecated Use PatientCountOutputTypeDefaultArgs instead
     */
    export type PatientCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = PatientCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use EncounterCountOutputTypeDefaultArgs instead
     */
    export type EncounterCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = EncounterCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use PatientDefaultArgs instead
     */
    export type PatientArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = PatientDefaultArgs<ExtArgs>
    /**
     * @deprecated Use PatientAddressDefaultArgs instead
     */
    export type PatientAddressArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = PatientAddressDefaultArgs<ExtArgs>
    /**
     * @deprecated Use EmergencyContactDefaultArgs instead
     */
    export type EmergencyContactArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = EmergencyContactDefaultArgs<ExtArgs>
    /**
     * @deprecated Use PatientInsuranceDefaultArgs instead
     */
    export type PatientInsuranceArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = PatientInsuranceDefaultArgs<ExtArgs>
    /**
     * @deprecated Use ConditionDefaultArgs instead
     */
    export type ConditionArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = ConditionDefaultArgs<ExtArgs>
    /**
     * @deprecated Use MedicationRequestDefaultArgs instead
     */
    export type MedicationRequestArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = MedicationRequestDefaultArgs<ExtArgs>
    /**
     * @deprecated Use AllergyIntoleranceDefaultArgs instead
     */
    export type AllergyIntoleranceArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = AllergyIntoleranceDefaultArgs<ExtArgs>
    /**
     * @deprecated Use ObservationDefaultArgs instead
     */
    export type ObservationArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = ObservationDefaultArgs<ExtArgs>
    /**
     * @deprecated Use ImmunisationDefaultArgs instead
     */
    export type ImmunisationArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = ImmunisationDefaultArgs<ExtArgs>
    /**
     * @deprecated Use EncounterDefaultArgs instead
     */
    export type EncounterArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = EncounterDefaultArgs<ExtArgs>
    /**
     * @deprecated Use AppointmentDefaultArgs instead
     */
    export type AppointmentArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = AppointmentDefaultArgs<ExtArgs>
    /**
     * @deprecated Use ClinicalDocumentDefaultArgs instead
     */
    export type ClinicalDocumentArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = ClinicalDocumentDefaultArgs<ExtArgs>
    /**
     * @deprecated Use AuditLogDefaultArgs instead
     */
    export type AuditLogArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = AuditLogDefaultArgs<ExtArgs>

  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}