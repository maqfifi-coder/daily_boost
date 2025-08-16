// Minimal service worker registration using Workbox Window (optional)
import { Workbox } from 'workbox-window'

export function registerSW() {
  if ('serviceWorker' in navigator) {
    const wb = new Workbox('/sw.js')
    wb.addEventListener('activated', (event) => {
      console.log('SW activated', event.isUpdate ? 'update' : 'fresh')
    })
    wb.register()
  }
}
