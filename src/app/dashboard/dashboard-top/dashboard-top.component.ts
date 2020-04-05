import { Component, ElementRef, OnInit, ViewChild } from '@angular/core'
import { MarketDayData, StorageKeys, StorageService } from '../../../shared/storage.service'

const DEFAULT_WEEK_DATA: MarketDayData[] = [
  { weekday: 'MON', amPrice: 0, pmPrice: 0 },
  { weekday: 'TUE', amPrice: 0, pmPrice: 0 },
  { weekday: 'WED', amPrice: 0, pmPrice: 0 },
  { weekday: 'THU', amPrice: 0, pmPrice: 0 },
  { weekday: 'FRI', amPrice: 0, pmPrice: 0 },
  { weekday: 'SAT', amPrice: 0, pmPrice: 0 },
]

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
