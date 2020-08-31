interface Details {
  message: string;
}

/**
 * Custom error class to implement Rosetta Error Schema
 */
export default class ApiError extends Error implements Components.Schemas.Error {
  code: number;
  retriable: boolean;
  details?: Details;

  constructor(code: number, message: string, retriable: boolean, details?: string) {
    super(message);

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, ApiError.prototype);

    this.code = code;
    this.message = message;
    this.retriable = retriable;
    if (details) {
      this.details = { message: details };
    }
  }
}
