/* eslint-env mocha */

const chaiSamSam = require('..')
const chai = require('chai')
const expect = chai.expect

const deepObj = {
  a: {
    b: {
      c: 'foo'
    },
    d: 'bar'
  },
  e: 'baz'
}

// Node 4.x & 5.x: "re.exec is not a function"
// Node 12.x: "undefined is not a function"
// Node 10.x: "Object #<Object> has no method 'exec'"
const mismatchedMatchRegex = /(?:(?:re\.exec|undefined) is not a function|Object #<Object> has no method 'exec')/

describe('chai-samsam', function () {
  before(function () {
    chai.use(chaiSamSam)
  })

  describe('when used as a chai plugin', function () {
    describe('when used as a drop in replacement for chai-deep-match', function () {
      it('should be manually pluggable into lodash', function () {
        // Act

        // Assert
        expect('awesome stringification').to.match(/some string/)
        expect('awesome stringification').to.deep.match(/some string/)
        expect(function () { expect(deepObj).to.match(deepObj) }).to.throw(TypeError, mismatchedMatchRegex)
        expect(function () { expect(deepObj).to.match({ e: 'baz' }) }).to.throw(TypeError, mismatchedMatchRegex)
        expect(function () { expect(deepObj).to.deep.match(deepObj) }).to.not.throw(TypeError, mismatchedMatchRegex)
        expect(function () { expect(deepObj).to.deep.match({ e: 'baz' }) }).to.not.throw(TypeError, mismatchedMatchRegex)
      })

      it('should not interfere with the non-deep `match` assertion', function () {
        expect('awesome stringification').to.match(/some string/)
        expect(function () { expect(deepObj).to.match(deepObj) }).to.throw(TypeError, mismatchedMatchRegex)
        expect(function () { expect(deepObj).to.match({ e: 'baz' }) }).to.throw(TypeError, mismatchedMatchRegex)
      })

      it('should not interfere with the former deep `match` assertion behavior (which ignores "deep") if the second argument is a RegExp', function () {
        expect('awesome stringification').to.deep.match(/some string/)
      })

      it('should deeply match `null` to `null`', function () {
        expect(null).to.deep.match(null)
      })

      it('should deeply match equivalent objects', function () {
        expect(deepObj).to.deep.match(deepObj)
      })

      it('should deeply match equivalent subsets of objects', function () {
        expect(deepObj).to.deep.match({ e: 'baz' })
      })

      it('should accept a custom "message" argument', function () {
        expect(deepObj).to.deep.match({ e: 'baz' }, 'My custom message')
        expect(function () { expect(deepObj).to.deep.match({ bad: 'nomatch' }, 'My custom error') }).to.throw(Error, /My custom error/)
      })
    })

    it('should partially match array entries', function () {
      expect([{ test: 'foo', test2: 'bar' }]).to.deep.match([{ test2: 'bar' }])
    })

    it('should partially match deep into objects and arrays', function () {
      expect([{
        firstName: 'John',
        lastName: 'Doe',
        jobs: [{ bartender: true, barista: true }]
      }]).to.deep.match([
        { jobs: [{ barista: true }] }
      ])
    })
  })
})
