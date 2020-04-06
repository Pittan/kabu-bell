import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
import { SettingComponent } from './setting/setting.component'
import { LicenseComponent } from './license/license.component'

const routes: Routes = [
  {
    path: '',
    component: SettingComponent
  },
  {
    path: 'license',
    component: LicenseComponent
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingRoutingModule { }
