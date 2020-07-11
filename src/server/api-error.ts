/**
 * Custom error class to implement Rosetta Error Schema
 */
class ApiError extends Error implements Components.Schemas.Error {
  code: number;
  message: string;
  retriable: boolean;
  details?: string;

  constructor(code: number, message: string, retriable: boolean, details?: string) {
    super(message);

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, ApiError.prototype);

    this.code = code;
    this.message = message;
    this.retriable = retriable;
    this.details = details;
  }
}

export default ApiError;
