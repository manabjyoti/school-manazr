import { Component, OnInit, Input } from '@angular/core';
import { ViewCell, DefaultEditor } from 'ng2-smart-table';

@Component({
  selector: 'app-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.scss']
})
export class CheckboxComponent implements OnInit {
  checked = false;
  disabled = true;
  @Input()
  public value: number;
  constructor() { }
  ngOnInit(): void {
    this.checked = this.value === 1 ? true : false;
  }

  onChange(e) {}

}

@Component({
  selector: 'app-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.scss']
})
export class CheckboxEditComponent extends DefaultEditor implements OnInit{
  checked = false;
  disabled = false;
  @Input() value: number;

  constructor() {
    super();
   }

  ngOnInit(): void {
    this.checked = this.cell.newValue === 1 ? true : false;
  }

  onChange(e) {
    const val = e.checked ? 1 : 0;
    this.cell.newValue = val;
  }

}


