export function getStorageValue(key: string): string | null {
  try {
    const value = window.sessionStorage.getItem(key)
    if (value !== null) {
      return value
    }
  } catch {
    // ignore
  }

  try {
    const value = window.localStorage.getItem(key)
    if (value !== null) {
      return value
    }
  } catch {
    // ignore
  }

  return null
}

export function getDebugVariable(): string {
  return getStorageValue('DEBUG') || getStorageValue('NODE_DEBUG') || ''
}

export function areColorsEnabled(): boolean {
  const colors = getStorageValue('DEBUG_COLORS')
  if (colors !== null) {
    return colors !== 'false' && colors !== '0'
  }
  // default to true in browsers usually, but maybe we should rely on whether colors are supported.
  // We'll default to true for modern browsers.
  return true
}
