type Alphabet =
  | 'a'
  | 'b'
  | 'c'
  | 'd'
  | 'e'
  | 'f'
  | 'g'
  | 'h'
  | 'i'
  | 'j'
  | 'k'
  | 'l'
  | 'm'
  | 'n'
  | 'o'
  | 'p'
  | 'q'
  | 'r'
  | 's'
  | 't'
  | 'u'
  | 'v'
  | 'w'
  | 'x'
  | 'y'
  | 'z'

export type MetaKey = 'shift' | 'ctrl' | 'alt' | 'cmd'

export type Shortcut =
  | `${MetaKey}+${Alphabet}`
  | `${MetaKey}+${MetaKey}+${Alphabet}`
  | `${MetaKey}+${MetaKey}+${MetaKey}+${Alphabet}`
  | `${MetaKey}+${MetaKey}+${MetaKey}+${MetaKey}+${Alphabet}`
