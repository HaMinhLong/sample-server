import errorCode from '../utils/errorCode';
import BasicError from './error';

/**
 * Validation Error. Thrown when the sequelize validation has failed. The error contains an `errors` property,
 * which is an array with 1 or more ValidationErrorItems, one for each validation that failed.
 *
 * @param {string} message Error message
 * @param {Array} [errors] Array of ValidationErrorItem objects describing the validation errors
 *
 * @property errors {ValidationErrorItems[]}
 */
class ValidationError extends BasicError {
  /**
   * 
   * @param {Object} param
   */
  constructor({ message, errors, statusCode }) {
    super(message);
    this.name = 'ValidationError';
    this.message = 'Validation Error';
    /**
     *
     * @type {ValidationErrorItem[]}
     */
    this.errors = errors || [];
    this.statusCode = statusCode || 500;
    // Use provided error message if available...
    if (message) {
      this.message = message;

      // ... otherwise create a concatenated message out of existing errors.
    } else if (this.errors.length > 0 && this.errors[0].message) {
 
      this.message = `${this.message}: ${this.errors.map(err => `${err.message}`).join(',\n')}`;
    }
    Error.captureStackTrace(this, this.constructor);
  }

  /**
   * Gets all validation error items for the path / field specified.
   *
   * @param {string} path The path to be checked for error items.
   * @returns {Array<ValidationErrorItem>} Validation error items for the specified path.
   */
  get(path) {
    return this.errors.reduce((reduced, error) => {
      if (error.path === path) {
        reduced.push(error);
      }

      return reduced;
    }, []);
  }
}

/**
 * Validation Error Item
 * Instances of this class are included in the `ValidationError.errors` property.
 */
export class ValidationErrorItem {
  /**
   * Creates new validation error item.
   *
   * @param {Object} param An error message.
   */
  constructor({ message, type, statusCode }) {
    /**
     * An error message
     *
     * @type {string} message
     */
    this.message = message || '';

    /**
     * The type/origin of the validation error
     *
     * @type {string}
     */
    this.type = type || null;

    /**
    * The statusCode of the validation error
    *
    * @type {integer}
    */
    this.statusCode = statusCode || 500;

    if (type !== null && errorCode[type]) {
      // eslint-disable-next-line prefer-destructuring
      this.code = errorCode[type].code;
      // eslint-disable-next-line prefer-destructuring
      this.message = errorCode[type].messages[0];
    }

    // This doesn't need captureStackTrace because it's not a subclass of Error
  }
}

// module.exports = ValidationError;
// module.exports.ValidationErrorItem = ValidationErrorItem;

export default ValidationError;
