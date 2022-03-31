export default class PermissionError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 403;
  }
}
