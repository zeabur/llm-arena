import '@testing-library/jest-dom'

// Polyfill TextEncoder/TextDecoder for libraries that expect Web APIs in Node test env
import { TextEncoder, TextDecoder } from 'util'
// @ts-ignore
global.TextEncoder = TextEncoder
// @ts-ignore
global.TextDecoder = TextDecoder

// Polyfill Web Streams API used by Next route handlers
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const web = require('stream/web')
  // @ts-ignore
  global.TransformStream = web.TransformStream
  // @ts-ignore
  global.ReadableStream = web.ReadableStream
} catch {}