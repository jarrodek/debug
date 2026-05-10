import { assert } from '@esm-bundle/chai'
import { Logger } from '../src/logger.js'
import { debuglog } from '../src/index.js'

describe('logger', () => {
  let originalConsoleDebug: typeof console.debug
  let debugCalls: unknown[][] = []

  before(() => {
    // eslint-disable-next-line no-console
    originalConsoleDebug = console.debug
    // eslint-disable-next-line no-console
    console.debug = (...args: unknown[]) => {
      debugCalls.push(args)
    }
  })

  after(() => {
    // eslint-disable-next-line no-console
    console.debug = originalConsoleDebug
  })

  beforeEach(() => {
    debugCalls = []
  })

  it('debuglog returns a valid function that delegates to logger.log', () => {
    const log = debuglog('test')
    assert.equal(typeof log, 'function')
    assert.equal(log.namespace, 'test')
    assert.equal(typeof log.enabled, 'boolean')

    // It delegates to logger.log. By default (with empty localStorage) it's disabled,
    // so it should not result in any debugCalls, but the function should execute without throwing.
    log('testing delegate')
    assert.equal(debugCalls.length, 0)
  })

  it('formats output with namespace when enabled', () => {
    const logger = new Logger('my-module')
    logger.enabled = true // force enable

    logger.log('hello world')

    assert.equal(debugCalls.length, 1)
    const args = debugCalls[0]

    // It might output with %c for colors depending on the test env.
    // If colors are disabled, it outputs: "my-module hello world"
    // If enabled: "%cmy-module %chello world", "color: ...", "color: inherit;"
    if (args.length === 3 && typeof args[0] === 'string' && args[0].startsWith('%c')) {
      assert.match(args[0], /%cmy-module %chello world/)
    } else {
      assert.equal(args[0], 'my-module hello world')
    }
  })

  it('prepends namespace to objects', () => {
    const logger = new Logger('my-module')
    logger.enabled = true // force enable

    const obj = { a: 1 }
    logger.log(obj)

    assert.equal(debugCalls.length, 1)
    const args = debugCalls[0]

    assert.equal(args[0], 'my-module')
    assert.equal(args[1], obj)
  })

  it('does not log if disabled', () => {
    const logger = new Logger('my-module')
    logger.enabled = false

    logger.log('hello world')
    assert.equal(debugCalls.length, 0)
  })
})
