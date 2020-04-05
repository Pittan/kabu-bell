import { Inject, Injectable, PLATFORM_ID } from '@angular/core'
import { isPlatformBrowser } from '@angular/common'

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
  NSO_FRIEND_CODE = 'NSO_FRIEND_CODE',
  SHOWN_ADD_TO_HOME_SCREEN_ANNOUNCEMENT = 'SHOWED_ADD_TO_HOME_SCREEN_ANNOUNCEMENT'
}

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor (
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  setData (key: StorageKeys.MARKET_WEEK_DATA, data: MarketWeekData): void
  setData (key: StorageKeys.DODO_KEY | StorageKeys.ISLAND_NAME | StorageKeys.NSO_FRIEND_CODE, data: string): void
  setData (key: StorageKeys.SHOWN_ADD_TO_HOME_SCREEN_ANNOUNCEMENT, data: boolean): void
  setData (key: StorageKeys, data: any): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(key, JSON.stringify(data))
    }
  }

  getData (key: StorageKeys.MARKET_WEEK_DATA): MarketWeekData | null
  getData (key: StorageKeys.DODO_KEY | StorageKeys.ISLAND_NAME | StorageKeys.NSO_FRIEND_CODE): string | null
  getData (key: StorageKeys.SHOWN_ADD_TO_HOME_SCREEN_ANNOUNCEMENT): boolean | null
  getData (key: StorageKeys) {
    if (isPlatformBrowser(this.platformId)) {
      return JSON.parse(localStorage.getItem(key))
    }
    return undefined
  }

  removeData (key: StorageKeys) {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.removeItem(key)
    }
  }
}
