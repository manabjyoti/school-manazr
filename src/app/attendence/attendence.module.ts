import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AttendenceRoutingModule } from './attendence-routing.module';
import { AttendenceComponent, AttendanceLineChartComponent } from './attendence/attendence.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SatDatepickerModule, SatNativeDateModule } from 'saturn-datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import { ChartsModule } from 'ng2-charts';


@NgModule({
  declarations: [AttendenceComponent, AttendanceLineChartComponent],
  imports: [
    CommonModule,
    AttendenceRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    SatDatepickerModule,
    SatNativeDateModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatInputModule,
    MatButtonModule,
    ChartsModule
  ],
  exports: [AttendenceComponent, AttendanceLineChartComponent]
})
export class AttendenceModule { }
