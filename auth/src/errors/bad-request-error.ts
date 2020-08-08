import { CustomError } from './custom-error';

export class BadRequestError extends CustomError {
  statusCode = 400;

  constructor(public message: string, public field: string | null = null) {
    super(message);
    // Only because we are extending a built in class
    Object.setPrototypeOf(this, BadRequestError.prototype);
  }

  serializeErrors() {
    if (this.field) {
      return [{ message: this.message, field: this.field }];
    } else {
      return [{ message: this.message }];
    }
  }
}
