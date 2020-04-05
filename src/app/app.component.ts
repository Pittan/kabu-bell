import { Component, OnInit } from '@angular/core'
import { faChartLine } from '@fortawesome/free-solid-svg-icons/faChartLine'
import { faEdit } from '@fortawesome/free-solid-svg-icons/faEdit'
import { faCog } from '@fortawesome/free-solid-svg-icons/faCog'
import { GoogleAnalyticsService } from '../shared/google-analytics.service'
import { NavigationEnd, Router } from '@angular/router'
import { filter } from 'rxjs/operators'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent implements OnInit {

  faChartLine = faChartLine
  faEdit = faEdit
  faCog = faCog

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
  }

}
