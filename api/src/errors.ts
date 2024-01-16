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
export type ErrorTypes = "WEBHOOK" | "FILE" | "SES" | "NOTIFY" | "GENERIC";

/**
 * Error code for the matching ErrorType.
 */
type WebhookErrorCode = "EMPTY_PAYLOAD" | "EMPTY_TEMPLATE_DATA";
type FileErrorCode = "EMPTY_RES" | "API_ERROR" | "NOT_FOUND";
type SESErrorCode =
  | "NO_TEMPLATE"
  | "TEMPLATE_NOT_FOUND"
  | "TEMPLATE_PART_MISSING"
  | "TEMPLATE_VAR_MISSING"
  | "EMPTY_RES"
  | "BAD_REQUEST"
  | "API_ERROR"
  | "UNKNOWN";
type NotifyErrorCode = "NO_API_KEY" | "MISSING_TEMPLATE" | "UNKNOWN";

type GenericErrorCode = "UNKNOWN" | "RATE_LIMIT_EXCEEDED";

/**
 * Union of all the different ErrorCode.
 */
export type ErrorCode = WebhookErrorCode | FileErrorCode | SESErrorCode | NotifyErrorCode | GenericErrorCode;

/**
 * {@ErrorRecord} uses `Record`, which means every key passed into the generic, must be implemented
 * for example, if there is a new ErrorCode for WebhookErrorCode, then the const WEBHOOK needs to implement
 * the new error code as a property.
 */
type ErrorRecord<T extends ErrorCode> = Record<T, string>;

const WEBHOOK: ErrorRecord<WebhookErrorCode> = {
  EMPTY_PAYLOAD: "Malformed form data: No questions property found",
  EMPTY_TEMPLATE_DATA: "No template data was returned",
};

const FILE: ErrorRecord<FileErrorCode> = {
  EMPTY_RES: "The file server did not return a response",
  API_ERROR: "There was an error returning this file",
  NOT_FOUND: "The requested file could not be found",
};

const SES: ErrorRecord<SESErrorCode> = {
  NO_TEMPLATE: "no template id was set for the specified form",
  TEMPLATE_NOT_FOUND: "no template with the specified id could be found",
  TEMPLATE_PART_MISSING: "the template subject line or body were missing",
  TEMPLATE_VAR_MISSING: "a required variable was missing from the template data",
  EMPTY_RES: "The email service did not return a response",
  BAD_REQUEST: "The email data being sent was malformed",
  API_ERROR: "The email service returned an error",
  UNKNOWN: "There was an unknown error sending the email",
};

const NOTIFY: ErrorRecord<NotifyErrorCode> = {
  NO_API_KEY: "No Notify API key has been set",
  MISSING_TEMPLATE: "A notify template id has not been set",
  UNKNOWN: "There waa an unknown error sending the email",
};

const GENERIC: ErrorRecord<GenericErrorCode> = {
  UNKNOWN: "Unknown error",
  RATE_LIMIT_EXCEEDED: "Rate limit exceeded",
};

type ErrorRecords = {
  WEBHOOK: typeof WEBHOOK;
  FILE: typeof FILE;
  SES: typeof SES;
  NOTIFY: typeof NOTIFY;
  GENERIC: typeof GENERIC;
};
export const ERRORS: ErrorRecords = {
  WEBHOOK,
  FILE,
  SES,
  NOTIFY,
  GENERIC,
};
