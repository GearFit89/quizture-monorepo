import { createMMKV, MMKV } from 'react-native-mmkv'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Platform } from 'react-native'

//  Storage Driver Interface
export interface IStorageDriver {
  type: 'async' | 'MMKV' | 'web';
  get(key: string): string | undefined;
  set(key: string, value: string): void;
  del(key: string): void;
  clear(): void;
  getJSON<T>(key: string): T | undefined;
  setJSON<T>(key: string, value: T): void
  asyncGet?: (key: string)=> Promise<string | null>
}

// Helper base class to reuse JSON serialization logic
abstract class BaseStorageDriver implements IStorageDriver {
  abstract get (key: string): string | undefined
  abstract set (key: string, value: string): void
  abstract del (key: string): void
  abstract clear (): void
  abstract type: 'async' | 'MMKV' | 'web'

  getJSON<T>(key: string): T | undefined {
    const raw = this.get(key)
    if (!raw) return undefined
    try {
      return JSON.parse(raw) as T
    } catch (error) {
      console.error(`[Storage] Error parsing JSON for key "${key}":`, error)
      return undefined
    }
  }

  setJSON<T>(key: string, value: T): void {
    try {
      this.set(key, JSON.stringify(value))
    } catch (error) {
      console.error(`[Storage] Error stringifying JSON for key "${key}":`, error)
    }
  }
}

//  Implementation: MMKV Storage (Synchronous, Native Native)
export class MMKVStorageDriver extends BaseStorageDriver {
  private instance: MMKV
  public type: 'MMKV'

  constructor (instance?: MMKV) {
    super()
    this.type = 'MMKV'
    this.instance = instance ?? createMMKV()
  }

  get (key: string): string | undefined {
    return this.instance.getString(key)
  }

  set (key: string, value: string): void {
    this.instance.set(key, value)
  }

  del (key: string): void {
    this.instance.remove(key)
  }

  clear (): void {
    this.instance.clearAll()
  }
}

//  Implementation: Web LocalStorage (Synchronous, Web)
export class WebLocalStorageDriver extends BaseStorageDriver {
  type: 'web'

  constructor () {
    super()
    this.type = 'web'
  }

  get (key: string): string | undefined {
    return localStorage.getItem(key) ?? undefined
  }

  set (key: string, value: string): void {
    localStorage.setItem(key, value)
  }

  del (key: string): void {
    localStorage.removeItem(key)
  }

  clear (): void {
    localStorage.clear()
  }
}

//  Implementation: AsyncStorage (Asynchronous Native Fallback)
export class AsyncStorageDriver extends BaseStorageDriver {
  type: 'async'

  constructor () {
    super()
    this.type = 'async'
  }

  get (_key: string): string | undefined {
    console.warn(
      '[Storage] Direct synchronous "get" is not supported on AsyncStorage. Use async methods directly if relying on AsyncStorage.'
    )
    return undefined
  }

  set (key: string, value: string): void {
    AsyncStorage.setItem(key, value).catch((err) =>
      console.error(`[Storage] AsyncStorage set error for "${key}":`, err)
    )
  }

  del (key: string): void {
    AsyncStorage.removeItem(key).catch((err) =>
      console.error(`[Storage] AsyncStorage del error for "${key}":`, err)
    )
  }

  clear (): void {
    AsyncStorage.clear().catch((err) =>
      console.error('[Storage] AsyncStorage clear error:', err)
    )
  }
}

//  Driver Factory / Auto-Selection
function createStorageDriver (): IStorageDriver {
  if (Platform.OS === 'web') {
    return new WebLocalStorageDriver()
  }

  try {
    return new MMKVStorageDriver()
  } catch (error) {
    console.warn('[Storage] MMKV failed to initialize, falling back to AsyncStorage:', error)
    return new AsyncStorageDriver()
  }
}
const storage: IStorageDriver = createStorageDriver()

async function asyncGet (key: string): Promise<string | null> {
  return await AsyncStorage.getItem(key)
}

export { storage, asyncGet }
