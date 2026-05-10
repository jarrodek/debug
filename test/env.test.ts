import { assert } from '@esm-bundle/chai'
import { getDebugVariable, areColorsEnabled } from '../src/env.js'

describe('env', () => {
  beforeEach(() => {
    window.localStorage.clear()
    window.sessionStorage.clear()
  })

  it('reads DEBUG from localStorage', () => {
    window.localStorage.setItem('DEBUG', 'foo')
    assert.equal(getDebugVariable(), 'foo')
  })

  it('reads NODE_DEBUG from localStorage', () => {
    window.localStorage.setItem('NODE_DEBUG', 'bar')
    assert.equal(getDebugVariable(), 'bar')
  })

  it('falls back to localStorage if sessionStorage is empty', () => {
    window.localStorage.setItem('DEBUG', 'baz')
    assert.equal(getDebugVariable(), 'baz')
  })

  it('prioritizes sessionStorage over localStorage', () => {
    window.localStorage.setItem('DEBUG', 'foo')
    window.sessionStorage.setItem('DEBUG', 'baz')
    assert.equal(getDebugVariable(), 'baz')
  })

  it('reads DEBUG_COLORS', () => {
    assert.isTrue(areColorsEnabled()) // default
    window.localStorage.setItem('DEBUG_COLORS', 'false')
    assert.isFalse(areColorsEnabled())
    window.localStorage.setItem('DEBUG_COLORS', '0')
    assert.isFalse(areColorsEnabled())
    window.localStorage.setItem('DEBUG_COLORS', 'true')
    assert.isTrue(areColorsEnabled())
  })
})
