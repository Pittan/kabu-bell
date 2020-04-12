import { ApplicationRef, Inject, Injectable, PLATFORM_ID } from '@angular/core'
import { SwUpdate } from '@angular/service-worker'
import { concat, interval } from 'rxjs'
import { first } from 'rxjs/operators'
import { environment } from '../environments/environment'
import { isPlatformBrowser } from '@angular/common'

@Injectable({
  providedIn: 'root'
})
export class CheckForUpdateService {
  constructor (
    @Inject(PLATFORM_ID) private platformId: Object,
    public appRef: ApplicationRef,
    public updates: SwUpdate
  ) {
    if (!environment.production) return
    if (!isPlatformBrowser(this.platformId)) return
    // Allow the app to stabilize first, before starting polling for updates with `interval()`.
    const appIsStable$ = appRef.isStable.pipe(first(isStable => isStable === true))
    const everySixHours$ = interval(6 * 60 * 60 * 1000)
    const everySixHoursOnceAppIsStable$ = concat(appIsStable$, everySixHours$)
    everySixHoursOnceAppIsStable$.subscribe(() => updates.checkForUpdate())
  }
}
