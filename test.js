const test = require('tape')
const Errors = require('./')

test('errors', function (t) {
  ;[
    {
      error: new TypeError('bad type'),
      matches: [
        { type: 'system', result: true },
        { type: { message: 'bad type' }, result: true },
        { type: { message: /bad type/ }, result: true },
        { type: {}, result: true }
      ]
    },
    {
      error: (() => {
        const err = new Error('resource not found')
        err.code = 'MyWhateverException'
        err.name = 'somename'
        return err
      })(),
      matches: [
        {
          type: 'system',
          result: false
        },
        {
          type: {
            code: 'MyWhateverException'
          },
          result: true
        },
        {
          type: {
            code: 'MyWhateverException',
            name: 'someothername'
          },
          result: false
        },
        { type: {}, result: true }
      ]
    },
  ].forEach(({ error, matches }) => {
    matches.forEach(({ type, result }) => {
      t.equal(Errors.matches(error, type), result)
    })
  })

  t.end()
})
