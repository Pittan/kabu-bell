import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SettingRoutingModule } from './setting-routing.module';
import { SettingComponent } from './setting/setting.component';
import { LicenseComponent } from './license/license.component';
import { HttpClientModule } from '@angular/common/http'
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'


@NgModule({
  declarations: [SettingComponent, LicenseComponent],
  imports: [
    CommonModule,
    SettingRoutingModule,
    HttpClientModule,
    FontAwesomeModule
  ]
})
export class SettingModule { }
