import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatAutocompleteModule} from '@angular/material/autocomplete';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatInputModule} from '@angular/material/input';
import {MatTableModule} from '@angular/material/table';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { DragDropModule } from '@angular/cdk/drag-drop';


import { RoutineRoutingModule } from './routine-routing.module';
import { RoutineComponent } from './routine/routine.component';
import { SharedModule } from '../shared/shared.module';
import { StaffRoutineComponent } from './staff-routine/staff-routine.component';


@NgModule({
  declarations: [RoutineComponent, StaffRoutineComponent],
  imports: [
    CommonModule,
    RoutineRoutingModule,
    MatAutocompleteModule,
    ReactiveFormsModule, FormsModule,
    MatInputModule,
    MatTableModule,
    OwlDateTimeModule, OwlNativeDateTimeModule,
    DragDropModule,
    SharedModule
  ],
  exports: [RoutineComponent, StaffRoutineComponent],
})
export class RoutineModule { }
