import { Component, ElementRef, OnInit, ViewChild } from '@angular/core'
import { StorageKeys, StorageService } from '../../../shared/storage.service'

@Component({
  selector: 'app-dashboard-top',
  templateUrl: './dashboard-top.component.html',
  styleUrls: ['./dashboard-top.component.sass']
})
export class DashboardTopComponent implements OnInit {

  constructor (
    private storage: StorageService
  ) {
  }

  @ViewChild('graphArea') graphElement: ElementRef<HTMLElement>

  noData = true
  loading = true

  islandName = ''

  data: number[]

  basePrice = 100

  isAnnouncementShown = false

  weekdays = [
    { day: '月', am: 0, pm: 0 },
    { day: '火', am: 0, pm: 0 },
    { day: '水', am: 0, pm: 0 },
    { day: '木', am: 0, pm: 0 },
    { day: '金', am: 0, pm: 0 },
    { day: '土', am: 0, pm: 0 },
  ]

  ngOnInit () {
    this.islandName = this.storage.getData(StorageKeys.ISLAND_NAME)
    const marketWeekData = this.storage.getData(StorageKeys.MARKET_WEEK_DATA)
    if (!this.storage.getData(StorageKeys.SHOWN_ADD_TO_HOME_SCREEN_ANNOUNCEMENT)) {
      this.isAnnouncementShown = true
    }

    this.noData = !marketWeekData
    if (this.noData) {
      this.loading = false
      return
    }

    this.basePrice = marketWeekData.priceWhenPurchased
    this.weekdays = marketWeekData.weekData.map(day => {
      return { day: day.weekday, am: day.amPrice, pm: day.pmPrice }
    })
    this.loading = false
    this.update()
  }

  update () {
    const arr = []
    this.weekdays.forEach(v => {
      Object.keys(v).forEach(key => {
        if (key.match(/(am|pm)/)) arr.push(v[key] || 0)
      })
    })
    this.data = arr
  }

  closeAnnouncement () {
    this.isAnnouncementShown = false
    this.storage.setData(StorageKeys.SHOWN_ADD_TO_HOME_SCREEN_ANNOUNCEMENT, true)
  }

  // share () {
  //   htmlToImage.toPng(this.graphElement.nativeElement)
  //   .then(function (dataUrl) {
  //     download(dataUrl, 'kabu-bell.png')
  //   })
  //   .catch(function (error) {
  //     console.error('oops, something went wrong!', error)
  //   })
  // }

}
