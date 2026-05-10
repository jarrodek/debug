import { getDebugVariable, areColorsEnabled } from './env.js'
import { parseNamespaces, matchNamespace } from './matcher.js'
import { preprocessArgs } from './formatters.js'

// Cache the parsed environment variables so it only runs once per load,
// which is standard for the debug library, though we could expose a method to re-evaluate.
const parsedNamespaces = parseNamespaces(getDebugVariable())
const colorsEnabled = areColorsEnabled()

function selectColor(namespace: string) {
  let hash = 0
  for (let i = 0; i < namespace.length; i++) {
    hash = (hash << 5) - hash + namespace.charCodeAt(i)
    hash |= 0 // Convert to 32bit integer
  }
  const colors = [
    '#0000CC',
    '#0000FF',
    '#0033CC',
    '#0033FF',
    '#0066CC',
    '#0066FF',
    '#0099CC',
    '#0099FF',
    '#00CC00',
    '#00CC33',
    '#00CC66',
    '#00CC99',
    '#00CCCC',
    '#00CCFF',
    '#3300CC',
    '#3300FF',
    '#3333CC',
    '#3333FF',
    '#3366CC',
    '#3366FF',
    '#3399CC',
    '#3399FF',
    '#33CC00',
    '#33CC33',
    '#33CC66',
    '#33CC99',
    '#33CCCC',
    '#33CCFF',
    '#6600CC',
    '#6600FF',
    '#6633CC',
    '#6633FF',
    '#66CC00',
    '#66CC33',
    '#9900CC',
    '#9900FF',
    '#9933CC',
    '#9933FF',
    '#99CC00',
    '#99CC33',
    '#CC0000',
    '#CC0033',
    '#CC0066',
    '#CC0099',
    '#CC00CC',
    '#CC00FF',
    '#CC3300',
    '#CC3333',
    '#CC3366',
    '#CC3399',
    '#CC33CC',
    '#CC33FF',
    '#CC6600',
    '#CC6633',
    '#CC9900',
    '#CC9933',
    '#CCCC00',
    '#CCCC33',
    '#FF0000',
    '#FF0033',
    '#FF0066',
    '#FF0099',
    '#FF00CC',
    '#FF00FF',
    '#FF3300',
    '#FF3333',
    '#FF3366',
    '#FF3399',
    '#FF33CC',
    '#FF33FF',
    '#FF6600',
    '#FF6633',
    '#FF9900',
    '#FF9933',
    '#FFCC00',
    '#FFCC33',
  ]
  return colors[Math.abs(hash) % colors.length]
}

export class Logger {
  public enabled: boolean
  private color: string

  constructor(private readonly namespace: string) {
    this.enabled = matchNamespace(namespace, parsedNamespaces)
    this.color = selectColor(namespace)
  }

  log(...args: unknown[]) {
    if (!this.enabled) return

    const processedArgs = preprocessArgs(args)

    if (colorsEnabled && processedArgs.length > 0 && typeof processedArgs[0] === 'string') {
      processedArgs[0] = `%c${this.namespace} %c${processedArgs[0]}`
      processedArgs.splice(1, 0, `color: ${this.color}; font-weight: bold;`, 'color: inherit;')
    } else if (processedArgs.length > 0 && typeof processedArgs[0] === 'string') {
      processedArgs[0] = `${this.namespace} ${processedArgs[0]}`
    } else {
      processedArgs.unshift(this.namespace)
    }

    // eslint-disable-next-line no-console
    console.debug(...processedArgs)
  }
}
