import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { MatTableFilterModule } from 'mat-table-filter';

import { ReportsRoutingModule } from './reports-routing.module';
import { ReportsLayoutComponent } from './reports-layout/reports-layout.component';
import { StaffReportsComponent } from './staff-reports/staff-reports.component';
import { MatTableModule } from '@angular/material/table';
import { MatTableExporterModule } from 'mat-table-exporter';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { MatSortModule } from '@angular/material/sort';
import { TableVirtualScrollModule } from 'ng-table-virtual-scroll';

@NgModule({
  declarations: [ReportsLayoutComponent, StaffReportsComponent],
  imports: [
    CommonModule,
    ReportsRoutingModule,
    SharedModule,
    MatTableModule,
    MatTableExporterModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule, MatSelectModule, MatFormFieldModule, MatCheckboxModule, MatInputModule,
    FormsModule,
    MatTableFilterModule,
    NgbDropdownModule,
    TableVirtualScrollModule
  ]
})
export class ReportsModule { }
