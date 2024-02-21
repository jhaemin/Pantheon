import { StudioApp } from './studio-app'

export function serializeApp(app: StudioApp) {
  return app.pages.map((page) => page.serialize())
}
