import { Component, OnInit, Input } from '@angular/core';
import { DefaultEditor, ViewCell } from 'ng2-smart-table';
import * as moment from 'moment';
@Component({
  selector: 'app-datepicker',
  templateUrl: './datepicker.component.html',
  styleUrls: ['./datepicker.component.css']
})
export class DatepickerComponent extends DefaultEditor implements OnInit {

  @Input() placeholder = 'Choose a Date/Time';

  @Input() min: Date; // Defaults to now(rounded down to the nearest 15 minute mark)

  @Input() max: Date; // Defaults to 1 month after the min

  stringValue;
  inputModel: Date;

  constructor() {
    super();
  }

  ngOnInit() {
    if (!this.min) {
      this.min = new Date();
      this.min.setMinutes(Math.floor(this.min.getMinutes() / 15) * 15 );
    }

    if (!this.max) {
      this.max = new Date(this.min);
      this.max.setFullYear(this.min.getFullYear() + 1);
    }

    if (this.cell.newValue) {
      const cellValue = new Date(this.cell.newValue);
      if (cellValue.getTime() >= this.min.getTime() && cellValue.getTime() <= this.max.getTime()) {
        this.inputModel = cellValue;
        // this.cell.newValue = this.inputModel.toISOString();
        this.cell.newValue = moment(this.inputModel).format('YYYY-MM-DDTHH:mm:ss');
      }
    }

    if (!this.inputModel) {
      this.inputModel = this.min;
      // this.cell.newValue = this.inputModel.toISOString();
      this.cell.newValue = moment(this.inputModel).format('YYYY-MM-DDTHH:mm:ss');
    }
  }

  onChange() {
    if (this.inputModel) {
      // this.cell.newValue = this.inputModel.toISOString();
      this.cell.newValue = moment(this.inputModel).format('YYYY-MM-DDTHH:mm:ss');
    }
  }
}

@Component({
  template: `{{value | date:'mediumDate'}} `,
})
export class SmartTableDatepickerRenderComponent implements ViewCell, OnInit {
  @Input() value: string;
  @Input() rowData: any;

  constructor() { }

  ngOnInit() { }

}
