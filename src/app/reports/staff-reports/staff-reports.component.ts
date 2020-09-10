import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { StaffService } from 'src/app/services/staff.service';
import { ApiResponse } from 'src/app/models/models';
import { DatePipe } from '@angular/common';
import { NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';
import { startCase } from 'lodash';


@Component({
  selector: 'app-staff-reports',
  templateUrl: './staff-reports.component.html',
  styleUrls: ['./staff-reports.component.scss'],
  providers: [DatePipe, NgbDropdownConfig]
})
export class StaffReportsComponent {
  dataSource = new MatTableDataSource();
  displayedColumns: string[];
  initColumns: any[];

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(private staffService: StaffService, private datePipe: DatePipe, config: NgbDropdownConfig) {
    config.placement = 'bottom-left';
    this.initColumns = [
      { colName: 'usertype', colDesc: 'User Type', colWidth: '70px'},
      { colName: 'StaffId', colDesc: 'Staff Id', colWidth: '90px'},
      { colName: 'FirstName', colDesc: 'Staff Name', colWidth: '150px'},
      { colName: 'DateOfBirth', colDesc: 'Date Of Birth', colWidth: '100px'},
      { colName: 'Sex', colDesc: 'Sex', colWidth: '30px'},
      { colName: 'MobilePhone', colDesc: 'Mobile', colWidth: '100px'},
      { colName: 'Address', colDesc: 'Address', colWidth: '100px'},
      { colName: 'FatherFirstName', colDesc: 'Father\'s Name', colWidth: '100px'},
      { colName: 'MotherFirstName', colDesc: 'Mother\'s Name', colWidth: '100px'},
      { colName: 'DateOfHiring', colDesc: 'Date Of Hiring', colWidth: '100px'},
      { colName: 'YearsOfExperience', colDesc: 'Experience', colWidth: '30px'},
      { colName: 'ReportsTo', colDesc: 'Reports To', colWidth: '100px'},
      // 'FatherFirstName', 'MotherFirstName', 'FatherContact', 'DateOfHiring', 'YearsOfExperience', 'ReportsTo', 'Status'
    ];
    this.displayedColumns = this.initColumns.map(col => col.colName);
    this.staffService.listStaff().subscribe(
      (res: ApiResponse) => {
        this.dataSource = new MatTableDataSource<any>(res.data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
    );
  }

  cellFormatter(type, data){
    // console.log(data);
    switch (type) {
      case 'usertype': {
         return `<span class="badge badge-primary" style="color: ${data.color}"> ${startCase(data.usertype)} </span>`;
      }
      case 'FirstName': {
        return startCase(data.FirstName + ' ' + data.LastName);
      }
      case 'DateOfBirth': {
        return data.DateOfBirth ? this.datePipe.transform(data.DateOfBirth, 'mediumDate') : 'NA';
      }
      case 'FatherFirstName': {
        return startCase(data.FatherFirstName + ' ' + data.FatherLastName) + '<br/>' + data.FatherContact;
      }
      case 'MotherFirstName': {
        return startCase(data.MotherFirstName + ' ' + data.MotherLastName) + '<br/>' + data.MotherContact;
      }
      case 'Sex': {
         return data.Sex === 'male' ? '<span class="text-primary">M</span>' : data.Sex === 'female' ? '<span class="text-info">F</span>' : 'NA';
      }
      default: {
        return data[type];
        break;
      }
   }
  }

  public doFilter = (value: string) => {
    this.dataSource.filter = value.trim().toLocaleLowerCase();
  }

  onColumnToggle(e) {
    console.log(e);
  }

}
