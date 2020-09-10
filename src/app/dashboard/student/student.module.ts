import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StudentAttendanceComponent } from './student-attendance/student-attendance.component';
// import { StudentCardComponent } from '../widgets/student-card/student-card.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { StudentDocsComponent } from './student-docs/student-docs.component';
import { AddStudentExcelComponent } from './add-student-excel/add-student-excel.component';
import { Ng2SmartTableModule } from 'ng2-smart-table';

@NgModule({
  declarations: [StudentAttendanceComponent, StudentDocsComponent, AddStudentExcelComponent],
  imports: [
    CommonModule,
    RouterModule,
    SharedModule,
    MatDatepickerModule,
    Ng2SmartTableModule
  ],
  exports: [StudentAttendanceComponent, StudentDocsComponent, AddStudentExcelComponent]
})
export class StudentModule { }
