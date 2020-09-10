import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExamRoutingModule } from './exam-routing.module';
import { CreateExamComponent } from './create-exam/create-exam.component';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ResultComponent } from './result/result.component';
import { MarksComponent } from './marks/marks.component';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatTableModule} from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
import { MarksDialogComponent } from './marks/marks-dialog/marks-dialog.component';
import {MatInputModule} from '@angular/material/input';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [CreateExamComponent, ResultComponent, MarksComponent, MarksDialogComponent],
  imports: [
    CommonModule,
    ExamRoutingModule,
    Ng2SmartTableModule,
    FormsModule,
    ReactiveFormsModule,
    MatTableModule, MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    SharedModule
  ],
  exports: [CreateExamComponent, ResultComponent, MatFormFieldModule, MatInputModule]
})
export class ExamModule { }
