import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RoutineComponent } from './routine/routine.component';
import { StaffRoutineComponent } from './staff-routine/staff-routine.component';


const routes: Routes = [
  {path: '', component: RoutineComponent},
  {path: 'staff-routine', component: StaffRoutineComponent},
  {path: ':gradeId', component: RoutineComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RoutineRoutingModule { }
