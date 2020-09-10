import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LeaveTypeComponent } from './leave-type/leave-type.component';
import { ApplyLeaveComponent } from './apply-leave/apply-leave.component';
import { ApproveLeaveComponent } from './approve-leave/approve-leave.component';


const routes: Routes = [
  {path: '', component: ApplyLeaveComponent},
  {path: 'view/:id', component: ApplyLeaveComponent},
  {path: 'leave-type', component: LeaveTypeComponent},
  {path: 'approve-leave', component: ApproveLeaveComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LeaveRoutingModule { }
