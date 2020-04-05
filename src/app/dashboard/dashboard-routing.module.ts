import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
import { DashboardTopComponent } from './dashboard-top/dashboard-top.component'

const routes: Routes = [
  {
    path: '',
    component: DashboardTopComponent
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
