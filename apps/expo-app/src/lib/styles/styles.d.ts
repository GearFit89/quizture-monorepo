import { StyleContent } from './types'

declare module '*.json' {
  const value: StyleContent
  export default value
}
