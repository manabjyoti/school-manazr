import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsComponent } from './settings/settings.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SatDatepickerModule, SatNativeDateModule } from 'saturn-datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { SharedModule } from 'src/app/shared/shared.module';
import {MatRadioModule} from '@angular/material/radio';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { NgxBarcodeModule } from 'ngx-barcode';
import {MatCheckboxModule} from '@angular/material/checkbox';
@NgModule({
  declarations: [SettingsComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SatDatepickerModule,
    SatNativeDateModule,
    MatFormFieldModule,
    MatInputModule,
    SharedModule,
    MatRadioModule,
    Ng2SmartTableModule,
    // NgxBarcodeModule,
    MatCheckboxModule,
  ],
  exports: [SettingsComponent],
})
export class GlobalModule { }
