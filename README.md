# @tradle/errors

error matching and rethrowing utils. Similar to https://github.com/hapijs/bounce

API is pretty self-explanatory, but see the example below. All three functions, `ignore`, `rethrow` and `matches` accept the same arguments: an error, and criteria (either an Error subclass or a set of properties to match).

`ignore`: ignores an error  
`rethrow`: rethrows an error   
`matches`: returns true if an error matches the provided criteria

```js
const createErrorType = require('error-ex')
const Errors = require('@tradle/errors')
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
```
