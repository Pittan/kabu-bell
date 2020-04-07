import { Component, OnInit } from '@angular/core'
import { MarketDayData, MarketWeekData, StorageKeys, StorageService, WEEKDAY } from '../../../shared/storage.service'

const DEFAULT_WEEK_DATA: MarketDayData[] = [
  { weekday: 'MON', amPrice: undefined, pmPrice: undefined },
  { weekday: 'TUE', amPrice: undefined, pmPrice: undefined },
  { weekday: 'WED', amPrice: undefined, pmPrice: undefined },
  { weekday: 'THU', amPrice: undefined, pmPrice: undefined },
  { weekday: 'FRI', amPrice: undefined, pmPrice: undefined },
  { weekday: 'SAT', amPrice: undefined, pmPrice: undefined },
]

const DEFAULT_DATA: MarketWeekData = {
  priceWhenPurchased: undefined,
  priceForReference: undefined,
  amountOfTurnips: undefined,
  weekData: DEFAULT_WEEK_DATA
}

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.sass']
})
export class EditComponent implements OnInit {

  islandName = ''

  basePrice: number

  amountOfTurnips: number

  priceForReference: number

  weekdays: MarketDayData[] = []

  constructor (
    private storage: StorageService
  ) {
  }

  ngOnInit () {
    this.islandName = this.storage.getData(StorageKeys.ISLAND_NAME) || ''
    const marketWeekData = this.storage.getData(StorageKeys.MARKET_WEEK_DATA) || DEFAULT_DATA
    this.basePrice = marketWeekData.priceWhenPurchased
    this.weekdays = marketWeekData.weekData
    this.amountOfTurnips = marketWeekData.amountOfTurnips
    this.priceForReference = marketWeekData.priceForReference
  }

  update () {
    this.storage.setData(StorageKeys.MARKET_WEEK_DATA, {
      priceWhenPurchased: this.basePrice,
      priceForReference: this.priceForReference,
      amountOfTurnips: this.amountOfTurnips,
      weekData: [ ...this.weekdays ]
    })
    this.storage.setData(StorageKeys.ISLAND_NAME, this.islandName)
  }

}
