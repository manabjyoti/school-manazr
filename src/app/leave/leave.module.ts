import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LeaveRoutingModule } from './leave-routing.module';
import { LeaveTypeComponent } from './leave-type/leave-type.component';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ApplyLeaveComponent } from './apply-leave/apply-leave.component';
import { MatTabsModule } from '@angular/material/tabs';
import { SatDatepickerModule, SatNativeDateModule } from 'saturn-datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { ListLeaveComponent } from './list-leave/list-leave.component';
import { ApproveLeaveComponent } from './approve-leave/approve-leave.component';

@NgModule({
  declarations: [LeaveTypeComponent, ApplyLeaveComponent, ListLeaveComponent, ApproveLeaveComponent],
  imports: [
    CommonModule,
    LeaveRoutingModule,
    Ng2SmartTableModule,
    ReactiveFormsModule,
    FormsModule,
    MatTabsModule,
    SatDatepickerModule,
    SatNativeDateModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatInputModule
  ],
  exports: [LeaveTypeComponent]
})
export class LeaveModule { }
