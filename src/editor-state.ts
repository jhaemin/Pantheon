import { atom, map } from 'nanostores'

export class EditorState {
  static $drawerOpen = atom(false)
  static $treeFoldedNodes = map<Record<string, boolean>>({})
  static $hiddenNodes = map<Record<string, boolean>>({})
  static $lockedNodes = map<Record<string, boolean>>({})
}
