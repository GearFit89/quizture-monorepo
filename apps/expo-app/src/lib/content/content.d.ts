import { Content } from './types'

declare module '*.json' {
  const value: Content
  export default value
}
