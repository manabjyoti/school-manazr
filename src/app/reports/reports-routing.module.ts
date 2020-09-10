import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReportsLayoutComponent } from './reports-layout/reports-layout.component';
import { HomeComponent } from '../dashboard/home/home.component';
import { StaffReportsComponent } from './staff-reports/staff-reports.component';


const routes: Routes = [
  { path: '', component: ReportsLayoutComponent,
    children: [
      { path: '', component: HomeComponent },
      { path: 'staff', component: StaffReportsComponent }
    ]
  }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportsRoutingModule { }
