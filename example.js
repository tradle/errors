const createErrorType = require('error-ex')
const Errors = require('./')
const MyCustomError = createErrorType('MyCustomError')

try {
  throw new MyCustomError('blah')
} catch(err) {
  // ignored by comparing properties
  Errors.ignore(err, { message: 'blah' })
  // ignored by Error prototype chain
  Errors.ignore(err, MyCustomError)
  // ignore if any of these matches
  Errors.ignore(err, [
    MyCustomError,
    { message: 'floop' }
  ])

  // ignore by 'developer' alias
  // aliased to match TypeError, ReferenceError, EvalError etc.
  Errors.rethrow(err, 'developer')
}

try {
  blah
} catch(err) {
  // will ignore ReferenceError
  Errors.ignore(err, 'developer')
}

try {
  blah
} catch(err) {
  // will rethrow ReferenceError: blah is not defined
  Errors.rethrow(err, 'developer')
}
