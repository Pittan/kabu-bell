import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core'
import { faChartLine } from '@fortawesome/free-solid-svg-icons/faChartLine'
import { faEdit } from '@fortawesome/free-solid-svg-icons/faEdit'
import { faCog } from '@fortawesome/free-solid-svg-icons/faCog'
import { GoogleAnalyticsService } from '../shared/google-analytics.service'
import { NavigationEnd, Router } from '@angular/router'
import { filter } from 'rxjs/operators'
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons/faChevronLeft'
import { MatSnackBar } from '@angular/material/snack-bar'
import { CheckForUpdateService } from '../shared/check-for-update.service'
import { Subscription } from 'rxjs'
import { isPlatformBrowser } from '@angular/common'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent implements OnInit {

  faChartLine = faChartLine
  faEdit = faEdit
  faCog = faCog
  faChevronLeft = faChevronLeft

  history = []

  private subscription = new Subscription()

  constructor (
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router,
    private googleAnalyticsService: GoogleAnalyticsService,
    private snack: MatSnackBar,
    private update: CheckForUpdateService
  ) {}

  ngOnInit () {
    // googleAnalytics tracking
    this.router.events
    .pipe(
      filter(event => event instanceof NavigationEnd)
    )
    .subscribe((params: any) => {
      this.googleAnalyticsService.sendPageView(params.url)
    })
    this.loadRouting()

    if (isPlatformBrowser(this.platformId)) {
      this.subscription.add(
        this.update.updates.available.subscribe(() => {
          this.snack.open('アップデートがあります', '更新する').afterDismissed().subscribe(() => {
            this.update.updates.activateUpdate().then(() => document.location.reload())
          })
        })
      )
    }
  }

  public loadRouting (): void {
    this.router.events
    .pipe(filter(event => event instanceof NavigationEnd))
    .subscribe(({ urlAfterRedirects }: NavigationEnd) => {
      const routeLevel = urlAfterRedirects.replace(/[^\/]/g, '').length
      if (routeLevel === 1) {
        this.history = [urlAfterRedirects]
      }
      if (routeLevel > this.history.length) {
        this.history = [...this.history, urlAfterRedirects]
      }
    })
  }

  getPreviousUrl (): string {
    return this.history[this.history.length - 2] || '/'
  }

}
