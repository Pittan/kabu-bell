import { Component, ElementRef, Inject, OnInit, PLATFORM_ID, ViewChild } from '@angular/core'
import { MarketDayData, StorageKeys, StorageService } from '../../../shared/storage.service'
import { isPlatformBrowser } from '@angular/common'
import { faQuestion } from '@fortawesome/free-solid-svg-icons'
import { faCoins } from '@fortawesome/free-solid-svg-icons/faCoins'
import { flatten, last } from 'lodash-es'
import { mark } from '@angular/compiler-cli/src/ngtsc/perf/src/clock'

@Component({
  selector: 'app-dashboard-top',
  templateUrl: './dashboard-top.component.html',
  styleUrls: ['./dashboard-top.component.sass']
})
export class DashboardTopComponent implements OnInit {

  constructor (
    @Inject(PLATFORM_ID) private platformId: Object,
    private storage: StorageService
  ) {
  }

  faQuestion = faQuestion
  faCoins = faCoins

  isBrowser = false

  @ViewChild('graphArea') graphElement: ElementRef<HTMLElement>

  noData = true
  loading = true

  islandName = ''

  data: number[]

  basePrice = 0
  referencePrice = 0

  isAnnouncementShown = false

  amountOfTurnips: number
  sellingPrice: number
  buyingPrice: number
  profit: number

  weekdays = [
    { day: '月', am: 0, pm: 0 },
    { day: '火', am: 0, pm: 0 },
    { day: '水', am: 0, pm: 0 },
    { day: '木', am: 0, pm: 0 },
    { day: '金', am: 0, pm: 0 },
    { day: '土', am: 0, pm: 0 },
  ]

  ngOnInit () {
    this.isBrowser = isPlatformBrowser(this.platformId)
    this.islandName = this.storage.getData(StorageKeys.ISLAND_NAME)
    const marketWeekData = this.storage.getData(StorageKeys.MARKET_WEEK_DATA)
    if (isPlatformBrowser(this.platformId)) {
      if (!this.storage.getData(StorageKeys.SHOWN_ADD_TO_HOME_SCREEN_ANNOUNCEMENT)) {
        this.isAnnouncementShown = true
      }
    }

    this.noData = !marketWeekData
    if (this.noData) {
      this.loading = false
      return
    }

    this.basePrice = marketWeekData.priceWhenPurchased
    this.referencePrice = marketWeekData.priceForReference
    this.weekdays = marketWeekData.weekData.map(day => {
      return { day: day.weekday, am: day.amPrice, pm: day.pmPrice }
    })
    if (marketWeekData.amountOfTurnips && marketWeekData.priceWhenPurchased) {
      this.amountOfTurnips = marketWeekData.amountOfTurnips
      this.sellingPrice = this.calculate(marketWeekData.amountOfTurnips, marketWeekData.weekData)
      this.buyingPrice = marketWeekData.priceWhenPurchased * marketWeekData.amountOfTurnips
      this.profit = this.sellingPrice - this.buyingPrice
    }
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

  private calculate (amountOfTurnips: number, weekData: MarketDayData[]): number {
    const numbers = flatten(weekData.map(w => [w.amPrice, w.pmPrice])).filter(v => v)
    const latestPrice = last(numbers)
    return latestPrice * amountOfTurnips
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
