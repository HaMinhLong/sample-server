/**
 * Sequelize provides a host of custom error classes, to allow you to do easier debugging. All of these errors are exposed on the sequelize object and the sequelize constructor.
 * All sequelize errors inherit from the base JS error object.
 *
 * This means that errors can be accessed using `Sequelize.ValidationError`
 * The Base Error all Sequelize Errors inherit from.
 */
class BasicError extends Error {
  /**
   * Contructor Basic Error.
   * 
   * @param {String} message 
   */
  constructor(message) {
    super(message);
    this.isApiError = true;
    this.name = 'BasicApiError';
    Error.captureStackTrace(this, this.constructor);
  }
}

// module.exports = BasicError;
export default BasicError;
