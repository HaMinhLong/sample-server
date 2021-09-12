
/* exports.BasicError = require('./error');
exports.BaseError = require('./base-error');

exports.ValidationError = require('./validation-error');

exports.ValidationErrorItem = exports.ValidationError.ValidationErrorItem; */

import BasicError1 from './error';
import BaseError1 from './base-error';
import ValidationError1, * as ValidationErrorItem1 from './validation-error';

export const BasicError = BasicError1;
export const BaseError = BaseError1;
export const ValidationError = ValidationError1;
export const ValidationErrorItem = ValidationErrorItem1.ValidationErrorItem;

/* export {
  BasicError,
  BaseError,
  ValidationError
} */
