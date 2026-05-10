import { assert } from '@esm-bundle/chai'
import { parseNamespaces, matchNamespace } from '../src/matcher.js'

describe('matcher', () => {
  it('parses empty string', () => {
    const parsed = parseNamespaces('')
    assert.equal(parsed.names.length, 0)
    assert.equal(parsed.skips.length, 0)
  })

  it('parses basic namespaces', () => {
    const parsed = parseNamespaces('foo,bar')
    assert.equal(parsed.names.length, 2)
    assert.equal(parsed.skips.length, 0)
  })

  it('parses wildcards', () => {
    const parsed = parseNamespaces('foo:*')
    assert.equal(parsed.names.length, 1)
    assert.equal(parsed.skips.length, 0)
  })

  it('parses negations', () => {
    const parsed = parseNamespaces('foo,-bar')
    assert.equal(parsed.names.length, 1)
    assert.equal(parsed.skips.length, 1)
  })

  it('matches exact namespaces', () => {
    const parsed = parseNamespaces('foo')
    assert.isTrue(matchNamespace('foo', parsed))
    assert.isFalse(matchNamespace('bar', parsed))
  })

  it('matches wildcards', () => {
    const parsed = parseNamespaces('foo:*')
    assert.isTrue(matchNamespace('foo:bar', parsed))
    assert.isTrue(matchNamespace('foo:baz', parsed))
    assert.isFalse(matchNamespace('qux:bar', parsed))
  })

  it('matches everything with *', () => {
    const parsed = parseNamespaces('*')
    assert.isTrue(matchNamespace('foo', parsed))
    assert.isTrue(matchNamespace('bar:baz', parsed))
  })

  it('handles negations correctly', () => {
    const parsed = parseNamespaces('*,-foo:*')
    assert.isTrue(matchNamespace('bar', parsed))
    assert.isFalse(matchNamespace('foo:bar', parsed))
  })
})
