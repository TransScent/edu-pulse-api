
import { exists } from '../utils/util';
const logger = require('../logger/logger');
const util = require('../utils/util');
export function InternalError(err, prop) {
    this.statusCode = 500;
    if (err && err.message) {
      this.message = err.message;
      this.stack = err.stack;
    } else {
      this.message = err || 'Internal server error';
      this.stack = (new Error()).stack;
    }
    this.property = prop;
}

InternalError.prototype = Object.create(Error.prototype);
InternalError.prototype.constructor = InternalError;

export function NotFoundError(err, prop) {
    this.statusCode = 404;
    if (err && err.message) {
      this.message = err.message;
      this.stack = err.stack;
    } else {
      this.message = err || 'Not found';
      this.stack = (new Error()).stack;
    }
    this.property = prop;
  }
  
  NotFoundError.prototype = Object.create(Error.prototype);
  NotFoundError.prototype.constructor = InternalError;

  export function ForbiddenError(err, prop) {
    this.statusCode = 403;
    if (err && err.message) {
      this.message = err.message;
      this.stack = err.stack;
    } else {
      this.message = err || 'Forbidden';
      this.stack = (new Error()).stack;
    }
    this.property = prop;
  }
  ForbiddenError.prototype = Object.create(Error.prototype);
  ForbiddenError.prototype.constructor = InternalError;
  export function BadRequestError(err, prop) {
    this.statusCode = 400;
    if (err && err.message) {
      this.message = err.message;
      this.stack = err.stack;
    } else {
      this.message = err || 'Bad request';
      this.stack = (new Error()).stack;
    }
    this.property = prop;
  }
  
  BadRequestError.prototype = Object.create(Error.prototype);
  BadRequestError.prototype.constructor = InternalError;
  export function UnauthorizedError(err, prop) {
    this.statusCode = 401;
    if (err && err.message) {
      this.message = err.message;
      this.stack = err.stack;
    } else {
      this.message = err || 'Unauthorized';
      this.stack = (new Error()).stack;
    }
    this.property = prop;
  }
  UnauthorizedError.prototype = Object.create(Error.prototype);
  UnauthorizedError.prototype.constructor = InternalError;
// Error handler, returns a function that sends the appropriate responses for the above errors
// statusFn is an optional function that will be passed the error and should return a status code.
export function sendError(res, reqOriginalUrl, requesterInfo, statusFn = null) {
    return (error) => {
      const newError = {};
      const status = util.exists(statusFn) ? statusFn(error) : 500;
      const validStatus = [400, 401, 403, 404, 409, 413, 418, 500].includes(status) ? status : 500;
      newError.source = util.exists(reqOriginalUrl) ? reqOriginalUrl : null;
      newError.statusCode = util.exists(error.statusCode) ? error.statusCode : validStatus;
      newError.details = util.exists(error.message) ? error.message : null;
      newError.stack = util.exists(error.stack) ? error.stack : null;
      logger.error(newError);
      if (!newError.statusCode) {
        res.status(500).json({ code: 500, message: error.message });
      } else {
        res.status(newError.statusCode).json({ code: newError.statusCode, message: error.message, property: error.property });
      }
      return null;
    };
  }
  export function handlerError(done) {
    return (err) => {
      logger.error(err.stack);
      done(err);
    };
  }
  export function noAccessHandler(req, res) {
    sendError(res)(new ForbiddenError('Forbidden. You do not have access to this resource'));
  }