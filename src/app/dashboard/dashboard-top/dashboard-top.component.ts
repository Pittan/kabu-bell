import { Component, ElementRef, Inject, OnInit, PLATFORM_ID, ViewChild } from '@angular/core'
import { MarketDayData, StorageKeys, StorageService } from '../../../shared/storage.service'
import { isPlatformBrowser } from '@angular/common'
import { faQuestion } from '@fortawesome/free-solid-svg-icons'
import { faCoins } from '@fortawesome/free-solid-svg-icons/faCoins'
import { flatten, last } from 'lodash-es'
import { faSave } from '@fortawesome/free-solid-svg-icons/faSave'
import { MatSnackBar } from '@angular/material/snack-bar'
import { MatDialog } from '@angular/material/dialog'
import { DownloadDialogComponent } from '../download-dialog/download-dialog.component'

export function normalizeCommonJSImport<T> (
  importPromise: Promise<T>,
): Promise<T> {
  // CommonJS's `module.exports` is wrapped as `default` in ESModule.
  return importPromise.then((m: any) => (m.default || m) as T)
}

@Component({
  selector: 'app-dashboard-top',
  templateUrl: './dashboard-top.component.html',
  styleUrls: ['./dashboard-top.component.sass']
})
export class DashboardTopComponent implements OnInit {

  constructor (
    @Inject(PLATFORM_ID) private platformId: Object,
    private snack: MatSnackBar,
    private storage: StorageService,
    private dialog: MatDialog
  ) {
  }

  faQuestion = faQuestion
  faCoins = faCoins
  faSave = faSave

  isBrowser = false

  @ViewChild('graphArea') graphElement: ElementRef<HTMLElement>

  isIOS = false
  isStandAlone = false

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

    if (isPlatformBrowser(this.platformId)) {
      this.isIOS = !!navigator.platform && /iPad|iPhone|iPod/.test(navigator.userAgent)
      if (this.isIOS) {
        this.isStandAlone = (navigator as any).standalone
      }
    }
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

  async share () {
    if (isPlatformBrowser(this.platformId)) {
      const element: HTMLCanvasElement = document.querySelector('canvas.graph')

      if (this.isIOS && !this.isStandAlone) {
        this.dialog.open(DownloadDialogComponent, {
          data: element.toDataURL()
        })
        return
      }
      const canvasToImage = await normalizeCommonJSImport(
        import(/* webpackChunkName: "canvas2image" */ 'canvas-to-image')
      )
      canvasToImage(element, {
        name: 'kabu-bell-chart',
        type: 'png',
        quality: 1
      })
      if (!this.isIOS) {
        this.snack.open('保存しました', undefined, {
          duration: 3000
        })
      }
    }
  }
}
