import { Component, OnInit } from '@angular/core'
import { faChartLine } from '@fortawesome/free-solid-svg-icons/faChartLine'
import { faEdit } from '@fortawesome/free-solid-svg-icons/faEdit'
import { faCog } from '@fortawesome/free-solid-svg-icons/faCog'
import { GoogleAnalyticsService } from '../shared/google-analytics.service'
import { NavigationEnd, Router } from '@angular/router'
import { filter } from 'rxjs/operators'
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons/faChevronLeft'

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

  private history = []

  constructor (
    private router: Router,
    private googleAnalyticsService: GoogleAnalyticsService
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
