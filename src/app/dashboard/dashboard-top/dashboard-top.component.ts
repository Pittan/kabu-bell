import { Component, ElementRef, OnInit, ViewChild } from '@angular/core'
import { StorageKeys, StorageService } from '../../../shared/storage.service'

@Component({
  selector: 'app-dashboard-top',
  templateUrl: './dashboard-top.component.html',
  styleUrls: ['./dashboard-top.component.sass']
})
export class DashboardTopComponent implements OnInit {
  // data = [58, 120, 88, 88, 88, 92, 57, 105, 88, 92, 59, 122];

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

  weekdays = [
    { day: '月', am: 0, pm: 0 },
    { day: '火', am: 0, pm: 0 },
    { day: '水', am: 0, pm: 0 },
    { day: '木', am: 0, pm: 0 },
    { day: '金', am: 0, pm: 0 },
    { day: '土', am: 0, pm: 0 },
  ]

  ngOnInit () {
    this.storage.setData(StorageKeys.MARKET_WEEK_DATA, {
      priceWhenPurchased: 100,
      weekData: [
        { weekday: 'MON', amPrice: 100, pmPrice: 99 },
        { weekday: 'TUE', amPrice: 95, pmPrice: 92 },
        { weekday: 'WED', amPrice: 90, pmPrice: 66 },
        { weekday: 'THU', amPrice: 34, pmPrice: 13 },
        { weekday: 'FRI', amPrice: 123, pmPrice: 230 },
        { weekday: 'SAT', amPrice: 99, pmPrice: 67 }
      ]
    })
    this.storage.setData(StorageKeys.ISLAND_NAME, 'えれふぁん')
    this.islandName = this.storage.getData(StorageKeys.ISLAND_NAME)
    const marketWeekData = this.storage.getData(StorageKeys.MARKET_WEEK_DATA)
    this.noData = !marketWeekData
    if (this.noData) return
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
