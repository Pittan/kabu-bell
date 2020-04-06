import { Inject, Injectable, PLATFORM_ID } from '@angular/core'
import { environment } from '../environments/environment'
import { isPlatformBrowser } from '@angular/common'

declare let gtag: any

@Injectable({
  providedIn: 'root'
})
export class GoogleAnalyticsService {

  constructor (
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  private isGAAvailable (): boolean {
    if (isPlatformBrowser(this.platformId)) return typeof gtag !== undefined
    return false
  }

  sendPageView (url: string): void {
    if (!this.isGAAvailable()) {
      return
    }
    if (!url.startsWith('/')) {
      url = `/${url}`
    }
    if (environment.production) {
      gtag('config', environment.analytics.id, {
        page_path: url
      })
    }
  }

  sendEvent (eventName: string, eventCategory: string, eventAction: string, eventLabel: any): void {
    if (!this.isGAAvailable()) {
      return
    }
    if (environment.production) {
      gtag('event', eventName, {
        event_category: eventCategory,
        event_action: eventAction,
        event_label: eventLabel
      })
    }
  }
}
