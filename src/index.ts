import pick from "lodash/pick";
import isEqual from "lodash/isEqual";
import { AssertionError } from "assert";
// import inherits from 'inherits'

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

const isSystemError = err => aliases.system.some(ctor => err instanceof ctor);
const isDeveloperError = isSystemError;

const matches = (err, type) => {
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

const ignore = (err, type) => {
  if (!matches(err, type)) {
    throw err;
  }
};

const rethrow = (err, type) => {
  if (matches(err, type)) {
    throw err;
  }
};

class HttpError extends Error {
  public status: number;
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

class NotFound extends Error {
  public name = "NotFound";
}

class UserError extends Error {
  public name = "UserError";
}

class InvalidOption extends Error {
  public name = "InvalidOption";
}

class InvalidInput extends Error {
  public name = "InvalidInput";
}

class NotImplemented extends Error {
  public name = "NotImplemented";
}

const createError = (name: string) =>
  class extends Error {
    public name = name;
  };

const createUserError = (name: string) =>
  class extends UserError {
    public name = name;
  };

const exportError = (err: Error) =>
  pick(err, ["message", "stack", "name", "type", "status"]);

export {
  HttpError,
  NotFound,
  UserError,
  InvalidOption,
  InvalidInput,
  NotImplemented,
  exportError as export,
  isDeveloperError,
  isSystemError,
  ignore,
  rethrow,
  matches,
  aliases,
  createError,
  createUserError
};
