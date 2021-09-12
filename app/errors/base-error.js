import errorCode from '../utils/errorCode';
import BasicError from './error';
/**
 * Sequelize provides a host of custom error classes, to allow you to do easier debugging. All of these errors are exposed on the sequelize object and the sequelize constructor.
 * All sequelize errors inherit from the base JS error object.
 *
 * This means that errors can be accessed using `Sequelize.ValidationError`
 * The Base Error all Sequelize Errors inherit from.
 */
class BaseError extends BasicError {
  /**
   * Contructor Base Error.
   *
   * @param {Object} param
   */
  constructor({ type, statusCode, error, message, name }) {
    super(message, name);
    this.name = 'BaseApiError';
    if (name) {
      this.name = `${this.name} => ${name}Error`
    }
    this.type = type || null;
    const customError = type ? errorCode[type] : null;

    this.code = customError && customError.code;
    this.statusCode = statusCode || 500;
    this.error = error || null;

    this.stack = error ? error.stack : null;
    if (message) {
      this.message = message;
    } else {
      this.message = customError ? `${customError.messages[0]}` : '';
    }
    if (error) {
      this.messageError = `${error.message}`;
    }
    this.errors = [{
      code: this.code,
      message: `${error ? this.messageError : this.message}`,
      type,
      stack: this.stack
    }];

    Error.captureStackTrace(this, this.constructor);
  }
}

export default BaseError;
