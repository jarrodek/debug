export function safeStringify(obj: unknown): string {
  const cache = new Set<unknown>()
  return JSON.stringify(obj, (_key, value) => {
    if (typeof value === 'object' && value !== null) {
      if (cache.has(value)) {
        return '[Circular]'
      }
      cache.add(value)
    }
    return value
  })
}

export function preprocessArgs(args: unknown[]): unknown[] {
  if (args.length === 0 || typeof args[0] !== 'string') {
    return args
  }

  const newArgs = [...args]
  let formatStr = newArgs[0] as string
  let argIndex = 1

  // Regular expression to match format specifiers
  // Matches %s, %d, %i, %f, %o, %O, %c, %j, %%
  // We only care about modifying %j and updating the format string accordingly
  // However, we need to track all specifiers to know which argument corresponds to %j

  formatStr = formatStr.replace(/%[sdifoOcj%]/g, (match) => {
    if (match === '%%') {
      return match
    }

    if (argIndex >= newArgs.length) {
      return match
    }

    if (match === '%j') {
      newArgs[argIndex] = safeStringify(newArgs[argIndex])
      argIndex++
      return '%s'
    }

    argIndex++
    return match
  })

  newArgs[0] = formatStr
  return newArgs
}
