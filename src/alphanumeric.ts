import { customAlphabet } from 'nanoid'

/**
 * Alphanumeric random string generator
 */
export const alphanumericId = customAlphabet(
  '1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
  5,
)
