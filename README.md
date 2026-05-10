<div align="center">
  <h1>@jarrodek/debug</h1>
  <p>A minimal, evergreen browser-compatible drop-in replacement for Node.js's <code>util.debuglog</code> and the classic <code>debug</code> package.</p>
</div>

---

## 🌟 Features

- **Drop-in Replacement**: Fully API-compatible with Node.js `util.debuglog`.
- **Modern & Lightweight**: Built as an ESM module, tailored for modern web environments.
- **Native DevTools Integration**: Seamlessly leverages browser DevTools formatting (`%o`, `%O`, `%d`, `%s`) for interactive object exploration.
- **Robust Stringification**: Safely handles `%j` with circular reference protection.
- **Namespacing & Wildcards**: Full support for glob-style `*` wildcards and negation patterns (e.g., `app:*,-app:verbose`).
- **Dynamic Styling**: Automatically hashes namespaces to a diverse CSS color palette for easy visual grepping.

## 📦 Installation

```bash
npm install @jarrodek/debug
```

## 🚀 Usage

Import the `debuglog` factory and create a logger instance bound to a specific namespace:

```typescript
import { debuglog } from '@jarrodek/debug';

const log = debuglog('my-module');

// Basic logging
log('Module initialized successfully.');

// Formatting
log('Received payload from %s: %O', 'auth-service', { id: 123, status: 'active' });
```

## ⚙️ Configuration

Just like the Node.js module, you can control which loggers are active and whether colors are rendered. In a web environment, this is managed via `localStorage` or `sessionStorage` (with `sessionStorage` taking precedence).

### Enabling Namespaces

Set the `DEBUG` or `NODE_DEBUG` key to a comma-separated list of namespaces.

```javascript
// Enable a specific module
localStorage.setItem('DEBUG', 'my-module');

// Enable all modules under 'app:', but exclude 'app:verbose'
localStorage.setItem('DEBUG', 'app:*,-app:verbose');

// Enable everything
localStorage.setItem('DEBUG', '*');
```

### Controlling Colors

By default, colored output is **enabled**. If you need to disable it (e.g., for plain text log scraping), set `DEBUG_COLORS` to `false` or `0`.

```javascript
localStorage.setItem('DEBUG_COLORS', '0');
```

## 🛠 Formatters

The library uses `printf`-style formatting, delegating to the native browser `console.debug` engine to preserve object interactivity wherever possible.

| Format | Description |
|--------|-------------|
| `%O` | Pretty-print an Object (rendered natively by browser DevTools). |
| `%o` | Pretty-print an Object (rendered natively by browser DevTools). |
| `%s` | String format. |
| `%d` | Number format (both integer and float). |
| `%j` | JSON format. Safely stringifies and replaces circular references with `"[Circular]"`. |
| `%%` | Escapes a single percent sign ('%'). Does not consume an argument. |

## 📄 License

Apache-2.0 © Pawel Uchida-Psztyc
