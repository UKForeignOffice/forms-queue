import { ErrorCode, ERRORS, ErrorTypes } from "./errors";

type ApplicationErrorOptions = {
  isOperational: boolean;
  exposeToClient: boolean;
};

const defaultOptions: ApplicationErrorOptions = {
  isOperational: true,
  exposeToClient: true,
};

export class ApplicationError extends Error {
  /**
   * HTTP status code to send the response as. You may use {@link `Axios#HttpStatusCode`}, or the raw value
   */
  httpStatusCode: number;

  /**
   * Notarial-API error code to help identify the error and resolve it
   */
  code: ErrorCode;

  isOperational: boolean = true;

  /**
   * determines whether the error message will be included in the response to the client
   */
  exposeToClient: boolean = true;

  constructor(name: ErrorTypes, code: ErrorCode, httpStatusCode: number, message?: string, options?: Partial<ApplicationErrorOptions>) {
    super(message);
    this.name = name;
    this.httpStatusCode = httpStatusCode;
    this.code = code;
    this.message = message ?? ERRORS[name][code];
    const { isOperational, exposeToClient } = { ...defaultOptions, ...options };
    this.isOperational = isOperational;
    this.exposeToClient = exposeToClient;
  }
}
