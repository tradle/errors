import { AssertionError } from "assert";
import pick = require("lodash/pick");
import isEqual = require("lodash/isEqual");


const aliases = Object.freeze({
  system: [
    // JavaScript
    EvalError,
    RangeError,
    ReferenceError,
    SyntaxError,
    TypeError,
    URIError,

    // Node
    AssertionError
  ],
  developer: "system"
});

export const isSystemError = err => aliases.system.some(ctor => err instanceof ctor);

export const isDeveloperError = isSystemError;

export function matches (err: any, type: any): boolean {
  if (!(err && type)) {
    throw new Error("expected error and match parameters");
  }

  // resolve aliases
  // (great infinite loop potential here)
  const aliased = aliases[type];
  if (aliased) return matches(err, aliased);

  if (Array.isArray(type)) {
    return type.some(subType => matches(err, subType));
  }

  if (typeof type === "function") {
    return err instanceof type;
  }

  for (let key in type) {
    let expected = type[key];
    let actual = err[key];
    if (expected instanceof RegExp) {
      if (!expected.test(actual)) {
        return false;
      }
    } else if (!isEqual(expected, actual)) {
      return false;
    }
  }

  return true;
};

export const ignore = (err, type) => {
  if (!matches(err, type)) {
    throw err;
  }
};

export const rethrow = (err, type) => {
  if (matches(err, type)) {
    throw err;
  }
};

export class HttpError extends Error {
  public status: number;
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

export class NotFound extends Error {
  public name = "NotFound";
}

export class UserError extends Error {
  public name = "UserError";
}

export class InvalidOption extends Error {
  public name = "InvalidOption";
}

export class InvalidInput extends Error {
  public name = "InvalidInput";
}

export class NotImplemented extends Error {
  public name = "NotImplemented";
}

export const createError = (name: string) =>
  class extends Error {
    public name = name;
  };

export const createUserError = (name: string) =>
  class extends UserError {
    public name = name;
  };

export const error = (err: Error) =>
  pick(err, ["message", "stack", "name", "type", "status"])

export default {
  HttpError,
  NotFound,
  UserError,
  InvalidOption,
  InvalidInput,
  NotImplemented,
  error,
  isDeveloperError,
  isSystemError,
  ignore,
  rethrow,
  matches,
  aliases,
  createError,
  createUserError
};
