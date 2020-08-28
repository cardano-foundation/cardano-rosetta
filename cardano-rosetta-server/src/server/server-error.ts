/**
 * Custom error class to implement our custom Server error
 */
export default class Server extends Error {
  message: string;

  constructor(message: string) {
    super(message);
    this.message = message;
  }
}
