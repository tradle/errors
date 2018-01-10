const createErrorType = require('error-ex')
const Errors = require('./')
const MyCustomError = createErrorType('MyCustomError')

try {
  throw new MyCustomError('blah')
} catch(err) {
  // ignored by props match
  Errors.ignore(err, { message: 'blah' })
  // ignored by Error prototype chain
  Errors.ignore(err, MyCustomError)
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
