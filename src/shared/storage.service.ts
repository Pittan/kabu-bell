import { Injectable } from '@angular/core'

export type WEEKDAY = 'MON' | 'TUE' | 'WED' | 'THU' | 'FRI' | 'SAT' | 'SUN'

export interface MarketDayData {
  weekday: WEEKDAY
  amPrice?: number
  pmPrice?: number
}

export interface MarketWeekData {
  priceWhenPurchased: number
  weekData: MarketDayData[]
}

export enum StorageKeys {
  MARKET_WEEK_DATA = 'MARKET_WEEK_DATA',
  ISLAND_NAME = 'ISLAND_NAME',
  DODO_KEY = 'DODO_KEY',
  NSO_FRIEND_CODE = 'NSO_FRIEND_CODE'
}

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor () { }

  setData (key: StorageKeys.MARKET_WEEK_DATA, data: MarketWeekData): void
  setData (key: StorageKeys.DODO_KEY | StorageKeys.ISLAND_NAME | StorageKeys.NSO_FRIEND_CODE, data: string): void
  setData (key: StorageKeys, data: any): void {
    localStorage.setItem(key, JSON.stringify(data))
  }

  getData (key: StorageKeys.MARKET_WEEK_DATA): MarketWeekData
  getData (key: StorageKeys.DODO_KEY | StorageKeys.ISLAND_NAME | StorageKeys.NSO_FRIEND_CODE): string
  getData (key: StorageKeys) {
    return JSON.parse(localStorage.getItem(key))
  }
}
