import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FeeRoutingModule } from './fee-routing.module';
import { FeeTypeComponent } from './fee-type/fee-type.component';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { FeeComponent, DialogComponent } from './fee/fee.component';
import { MatAutocompleteModule} from '@angular/material/autocomplete';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatInputModule} from '@angular/material/input';
import {MatDialogModule} from '@angular/material/dialog';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material/core';
import { FeeMasterComponent } from './fee-master/fee-master.component';
import { StudentModule } from '../dashboard/student/student.module';
import { OptionalFeeManageComponent } from './optional-fee-manage/optional-fee-manage.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [FeeTypeComponent, FeeComponent, DialogComponent, FeeMasterComponent, OptionalFeeManageComponent],
  imports: [
    CommonModule,
    FeeRoutingModule,
    Ng2SmartTableModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    FormsModule,
    MatInputModule,
    MatDialogModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCheckboxModule,
    StudentModule,
    SharedModule
  ],
  exports: [FeeTypeComponent, FeeComponent, DialogComponent, FeeMasterComponent, OptionalFeeManageComponent]
})
export class FeeModule { }
