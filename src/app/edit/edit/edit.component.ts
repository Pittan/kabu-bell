import { Component, OnInit } from '@angular/core'
import { MarketDayData, MarketWeekData, StorageKeys, StorageService, WEEKDAY } from '../../../shared/storage.service'

const DEFAULT_WEEK_DATA: MarketDayData[] = [
  { weekday: 'MON', amPrice: 0, pmPrice: 0 },
  { weekday: 'TUE', amPrice: 0, pmPrice: 0 },
  { weekday: 'WED', amPrice: 0, pmPrice: 0 },
  { weekday: 'THU', amPrice: 0, pmPrice: 0 },
  { weekday: 'FRI', amPrice: 0, pmPrice: 0 },
  { weekday: 'SAT', amPrice: 0, pmPrice: 0 },
]

const DEFAULT_DATA: MarketWeekData = {
  priceWhenPurchased: 0,
  weekData: DEFAULT_WEEK_DATA
}

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.sass']
})
export class EditComponent implements OnInit {

  islandName = ''

  basePrice = 0

  weekdays: MarketDayData[] = []

  constructor (
    private storage: StorageService
  ) {
  }

  ngOnInit () {
    this.islandName = this.storage.getData(StorageKeys.ISLAND_NAME) || ''
    console.log(this.islandName)
    const marketWeekData = this.storage.getData(StorageKeys.MARKET_WEEK_DATA) || DEFAULT_DATA
    this.basePrice = marketWeekData.priceWhenPurchased
    this.weekdays = marketWeekData.weekData
  }

  update () {
    this.storage.setData(StorageKeys.MARKET_WEEK_DATA, {
      priceWhenPurchased: this.basePrice,
      weekData: [ ...this.weekdays ]
    })
    this.storage.setData(StorageKeys.ISLAND_NAME, this.islandName)
  }

}
