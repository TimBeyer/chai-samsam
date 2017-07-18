const samsam = require('samsam')

module.exports = function (chai, util) {
  const Assertion = chai.Assertion

  Assertion.overwriteMethod('match', function (_super) {
    function assertDeepMatch (val, msg) {
      const actual = this._obj
      const expected = val

      const isDeep = !!util.flag(this, 'deep')

      if (isDeep) {
        if (msg) {
          util.flag(this, 'message', msg)
        }

        const matchResult = samsam.match(actual, expected)

        this.assert(
          matchResult,
          'expected #{this} to deeply match #{exp}',
          'expected #{this} to deeply not match #{exp}',
          expected,
          actual,
          true
        )
      } else {
        _super.apply(this, arguments)
      }
    }

    return assertDeepMatch
  })
}
