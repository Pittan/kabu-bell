import { Component, OnInit } from '@angular/core'
import { Observable } from 'rxjs'
import { HttpClient } from '@angular/common/http'
import { share } from 'rxjs/operators'
import { Location } from '@angular/common'

@Component({
  selector: 'app-license',
  templateUrl: './license.component.html',
  styleUrls: ['./license.component.sass']
})
export class LicenseComponent implements OnInit {

  public license$: Observable<string>

  constructor (
    private http: HttpClient,
    private location: Location
  ) {
  }

  /**
   * 初期化イベントハンドラ
   */
  ngOnInit () {
    const path = this.location.prepareExternalUrl('3rdpartylicenses.txt')
    const url = `${window.location.protocol}//${window.location.host}${path}`
    this.license$ = this.http.get(url, { responseType: 'text' }
    ).pipe(share())
  }

}
