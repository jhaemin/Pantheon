import { MapStore } from 'nanostores'

export type ExtractMapStoreGeneric<T> = T extends MapStore<infer V> ? V : never
