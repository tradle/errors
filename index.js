const {
  pick,
  isEqual
} = require('lodash')

const createError = require('error-ex')
const { AssertionError } = require('assert')
const aliases = {
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
  developer: 'system'
}

const isSystemError = err => aliases.system.some(ctor => {
  return err instanceof ctor
})

const matches = (err, type) => {
  if (!(err && type)) {
    throw new Error('expected error and match parameters')
  }

  // resolve aliases
  // (great infinite loop potential here)
  const aliased = aliases[type]
  if (aliased) return matches(err, aliased)

  if (Array.isArray(type)) {
    return type.some(subType => matches(err, subType))
  }

  if (typeof type === 'function') {
    return err instanceof type
  }

  for (let key in type) {
    let expected = type[key]
    let actual = err[key]
    if (expected instanceof RegExp) {
      if (!expected.test(actual)) {
        return false
      }
    } else if (!isEqual(expected, actual)) {
      return false
    }
  }

  return true
}

const ignore = (err, type) => {
  if (!matches(err, type)) {
    throw err
  }
}

const rethrow = (err, type) => {
  if (matches(err, type)) {
    throw err
  }
}

const _HttpError = createError('HttpError')
const HttpError = (status, message) => {
  const err = new _HttpError(message)
  err.status = status
  return err
}

const exportError = (err) => pick(err, ['message', 'stack', 'name', 'type'])

const errors = {
  HttpError,
  export: err => {
    const json = exportError(err)
    if (err instanceof HttpError) {
      json.status = err.status
    }

    return json
  },
  isDeveloperError: err => matches(err, 'developer'),
  ignore,
  rethrow,
  matches,
  aliases
}

module.exports = errors
