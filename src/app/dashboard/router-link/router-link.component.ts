import { Component, OnInit, Input } from '@angular/core';
import { ViewCell } from 'ng2-smart-table';

@Component({
  template: `<a [routerLink]="['view', someId]">{{ linkText }}</a>`,
})
export class RouterLinkComponent implements ViewCell, OnInit {

  public linkText: string;
  public someId: string;

  @Input()
  public value: string;

  @Input()
  rowData: any;

  ngOnInit() {
    this.linkText = this.value;
    this.someId = this.value;
  }

}

@Component({
  template: `<a [routerLink]="['view', someId]">{{ linkText }}</a>`,
})
export class RouterLinkFullNameComponent implements ViewCell, OnInit {

  public linkText: string;
  public someId: string;

  @Input()
  public value: string;

  @Input()
  rowData: any;

  ngOnInit() {
    this.linkText = `${this.rowData.FirstName} ${this.rowData.LastName}`;
    this.someId = this.rowData.StudentID;
  }

}
