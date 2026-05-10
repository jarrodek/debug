import { assert } from '@esm-bundle/chai'
import { preprocessArgs, safeStringify } from '../src/formatters.js'

describe('formatters', () => {
  describe('safeStringify', () => {
    it('stringifies simple objects', () => {
      assert.equal(safeStringify({ foo: 'bar' }), '{"foo":"bar"}')
    })

    it('handles circular references', () => {
      const obj: { foo: string; self?: unknown } = { foo: 'bar' }
      obj.self = obj
      assert.equal(safeStringify(obj), '{"foo":"bar","self":"[Circular]"}')
    })
  })

  describe('preprocessArgs', () => {
    it('returns unmodified args if first arg is not string', () => {
      const obj = { foo: 'bar' }
      assert.deepEqual(preprocessArgs([obj]), [obj])
      assert.deepEqual(preprocessArgs([123, 'foo']), [123, 'foo'])
    })

    it('does not modify arguments without %j', () => {
      assert.deepEqual(preprocessArgs(['foo %s', 'bar']), ['foo %s', 'bar'])
      assert.deepEqual(preprocessArgs(['%d', 123]), ['%d', 123])
      assert.deepEqual(preprocessArgs(['%%']), ['%%'])
    })

    it('leaves formatters unmodified if there are not enough arguments', () => {
      // %j shouldn't be replaced if there is no corresponding argument
      const args = preprocessArgs(['%s %d %j', 'foo'])
      assert.deepEqual(args, ['%s %d %j', 'foo'])
    })

    it('replaces %j with %s and stringifies the argument', () => {
      const args = preprocessArgs(['foo %j bar', { a: 1 }]) as string[]
      assert.equal(args[0], 'foo %s bar')
      assert.equal(args[1], '{"a":1}')
    })

    it('handles circular references in %j', () => {
      const obj: { self?: unknown } = {}
      obj.self = obj
      const args = preprocessArgs(['%j', obj]) as string[]
      assert.equal(args[0], '%s')
      assert.equal(args[1], '{"self":"[Circular]"}')
    })

    it('handles multiple formatters', () => {
      const args = preprocessArgs(['%s %j %d %j', 'str', { a: 1 }, 123, { b: 2 }])
      assert.equal(args[0], '%s %s %d %s')
      assert.equal(args[1], 'str')
      assert.equal(args[2], '{"a":1}')
      assert.equal(args[3], 123)
      assert.equal(args[4], '{"b":2}')
    })

    it('handles %% correctly when counting arguments', () => {
      const args = preprocessArgs(['%% %j', { a: 1 }]) as string[]
      // The `%%` should just be passed through, it doesn't consume an argument index for our replacements
      assert.equal(args[0], '%% %s')
      assert.equal(args[1], '{"a":1}')
    })
  })
})
