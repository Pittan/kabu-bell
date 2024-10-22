import { Component, OnDestroy, OnInit } from '@angular/core'
import { CheckForUpdateService } from '../../../shared/check-for-update.service'
import { Subscription } from 'rxjs'
import { StorageKeys, StorageService } from '../../../shared/storage.service'
import { faChevronRight } from '@fortawesome/free-solid-svg-icons/faChevronRight'

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.sass']
})
export class SettingComponent implements OnInit, OnDestroy {

  private subscription = new Subscription()

  faChevronRight = faChevronRight

  updateAvailable = false

  constructor (
    private update: CheckForUpdateService,
    private storage: StorageService
  ) { }

  ngOnInit (): void {
    this.subscription.add(
      this.update.updates.available.subscribe(() => {
        this.updateAvailable = true
      })
    )
  }

  ngOnDestroy () {
    this.subscription.unsubscribe()
  }

  reset () {
    if (!window.confirm('本当にリセットしますか？')) return
    this.storage.removeData(StorageKeys.MARKET_WEEK_DATA)
  }

  updateNow () {
    if (!this.updateAvailable) {
      document.location.reload()
    } else {
      this.update.updates.activateUpdate().then(() => document.location.reload())
    }
  }

}
