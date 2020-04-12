import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardTopComponent } from './dashboard-top/dashboard-top.component';
import { SharedModule } from '../../shared/shared.module'
import { FormsModule } from '@angular/forms'
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'
import { MatSnackBarModule } from '@angular/material/snack-bar'
import { MatDialogModule } from '@angular/material/dialog';
import { DownloadDialogComponent } from './download-dialog/download-dialog.component'


@NgModule({
  declarations: [DashboardTopComponent, DownloadDialogComponent],
  imports: [
    CommonModule,
    FormsModule,
    DashboardRoutingModule,
    SharedModule,
    FontAwesomeModule,
    MatSnackBarModule,
    MatDialogModule
  ]
})
export class DashboardModule { }
