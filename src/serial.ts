import { studioApp } from './studio-app'

export function serializeApp() {
  return studioApp.pages.map((page) => page.serialize())
}
