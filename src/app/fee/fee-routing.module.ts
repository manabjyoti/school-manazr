import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FeeTypeComponent } from './fee-type/fee-type.component';
import { FeeComponent } from './fee/fee.component';
import { FeeMasterComponent } from './fee-master/fee-master.component';


const routes: Routes = [
  {path: '', component: FeeComponent},
  {path: 'fee-type', component: FeeTypeComponent},
  {path: 'fee-master', component: FeeMasterComponent},
  {path: ':gradeId', component: FeeComponent},
  {path: ':gradeId/:studentId', component: FeeComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FeeRoutingModule { }
