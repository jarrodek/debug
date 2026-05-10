export function parseNamespaces(namespaces: string) {
  const names: RegExp[] = []
  const skips: RegExp[] = []

  const split = namespaces.split(/[\s,]+/).filter(Boolean)

  for (const part of split) {
    const isSkip = part.startsWith('-')
    const ns = isSkip ? part.slice(1) : part

    // Convert namespace to a regular expression
    const regexStr = '^' + ns.replace(/\*/g, '.*?') + '$'
    const regex = new RegExp(regexStr)

    if (isSkip) {
      skips.push(regex)
    } else {
      names.push(regex)
    }
  }

  return { names, skips }
}

export function matchNamespace(namespace: string, { names, skips }: { names: RegExp[]; skips: RegExp[] }): boolean {
  for (const skip of skips) {
    if (skip.test(namespace)) {
      return false
    }
  }

  for (const name of names) {
    if (name.test(namespace)) {
      return true
    }
  }

  return false
}
