import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule)
  },
  {
    path: 'edit',
    loadChildren: () => import('./edit/edit.module').then(m => m.EditModule)
  },
  {
    path: 'settings',
    loadChildren: () => import('./setting/setting.module').then(m => m.SettingModule)
  },
  {
    path: '**',
    redirectTo: ''
  }
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
