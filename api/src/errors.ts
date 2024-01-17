/**
 * These errors are for use in {@link ApplicationError}.
 * {@link ERRORS} can be imported and used anywhere.
 */

/**
 * To add a new category of error (new {@link ErrorTypes})
 * 1. Add a type to {@link ErrorTypes}
 * 2. Create a new type, named <YourNewType>ErrorCode
 * 3. Add error codes as a union, in snake case and capitalised, e.g. "SOME_ERROR_CODE"
 * 4. Add <YourNewType>ErrorCode to the {@link ErrorCodes union}
 * 5. Create a new const, named <YOUR_NEW_TYPE>, with the type {@link ErrorRecord}, e.g. `ErrorRecord<YourNewTypeErrorCode>`
 * 6. Add a new property and value to `ErrorRecords`, the key will be the ErrorType, and the value will be the const created in (5)
 * 7. Do the same for the const {@link ERRORS}
 */

/**
 * Category of the error - this is likely to match the service it came from
 */
export type ErrorTypes = "REFERENCE" | "GENERIC";

/**
 * Error code for the matching ErrorType.
 */

type GenericErrorCode = "UNKNOWN" | "RATE_LIMIT_EXCEEDED";
type ReferenceErrorCode = "CLIENT" | "CREATE_FAILED" | "VALIDATION";
/**
 * Union of all the different ErrorCode.
 */
export type ErrorCode = ReferenceErrorCode | GenericErrorCode;

/**
 * {@ErrorRecord} uses `Record`, which means every key passed into the generic, must be implemented
 * for example, if there is a new ErrorCode for WebhookErrorCode, then the const WEBHOOK needs to implement
 * the new error code as a property.
 */
type ErrorRecord<T extends ErrorCode> = Record<T, string>;

const DATABASE: ErrorRecord<ReferenceErrorCode> = {
  CLIENT: "ORM Client error",
  CREATE_FAILED: "Adding jobId with reference failed",
  VALIDATION: "Invalid payload",
};

const GENERIC: ErrorRecord<GenericErrorCode> = {
  UNKNOWN: "Unknown error",
  RATE_LIMIT_EXCEEDED: "Rate limit exceeded",
};

type ErrorRecords = {
  GENERIC: typeof GENERIC;
  DATABASE: typeof DATABASE;
};
export const ERRORS: ErrorRecords = {
  DATABASE,
  GENERIC,
};
