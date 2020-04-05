import { Component, OnInit } from '@angular/core'
import { faChartLine } from '@fortawesome/free-solid-svg-icons/faChartLine'
import { faEdit } from '@fortawesome/free-solid-svg-icons/faEdit'
import { faCog } from '@fortawesome/free-solid-svg-icons/faCog'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent {

  faChartLine = faChartLine
  faEdit = faEdit
  faCog = faCog

}
