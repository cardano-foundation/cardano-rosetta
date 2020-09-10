/**
 * Custom error class to implement our custom Server error
 */
export default class ServerError extends Error {
  message: string;

  constructor(message: string) {
    super(message);
    this.message = message;
  }
}
