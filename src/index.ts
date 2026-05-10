import { Logger } from './logger.js'

export interface Debugger {
  (...args: unknown[]): void
  enabled: boolean
  namespace: string
}

/**
 * Create a debugger with the given `namespace`.
 */
export function debuglog(namespace: string): Debugger {
  const logger = new Logger(namespace)

  const fn = function (...args: unknown[]) {
    logger.log(...args)
  } as Debugger

  fn.enabled = logger.enabled
  fn.namespace = namespace

  return fn
}
