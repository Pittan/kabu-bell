import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
import { DashboardTopComponent } from './dashboard/dashboard-top/dashboard-top.component'


const routes: Routes = [
  {
    path: '',
    component: DashboardTopComponent,
    pathMatch: 'full'
  }
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
