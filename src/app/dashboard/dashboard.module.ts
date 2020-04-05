import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardTopComponent } from './dashboard-top/dashboard-top.component';
import { SharedModule } from '../../shared/shared.module'
import { FormsModule } from '@angular/forms'


@NgModule({
  declarations: [DashboardTopComponent],
  imports: [
    CommonModule,
    FormsModule,
    DashboardRoutingModule,
    SharedModule
  ]
})
export class DashboardModule { }
