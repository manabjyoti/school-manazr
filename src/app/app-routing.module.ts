import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../app/_helper/auth.guard';

const DashboardModule = () => import('./dashboard/dashboard.module').then(x => x.DashboardModule);
const ReportsModule = () => import('./reports/reports.module').then(x => x.ReportsModule);
const AuthModule = () => import('./auth/auth.module').then(x => x.AuthModule);

const routes: Routes = [
  { path: '', loadChildren: AuthModule},
  { path: 'dashboard', loadChildren: DashboardModule, canActivate: [AuthGuard] },
  { path: 'reports', loadChildren: ReportsModule, canActivate: [AuthGuard] },
];

@NgModule({
  // imports: [RouterModule.forRoot(routes)],
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
