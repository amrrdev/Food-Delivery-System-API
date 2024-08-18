export default class AppError extends Error {
  statusCode: number;
  statusMessage;
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.statusMessage = String(statusCode).startsWith("4") ? "fail" : "error";
    Error.captureStackTrace(this, this.constructor);
  }
}
