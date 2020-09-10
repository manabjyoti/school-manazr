import { Component, OnInit, ViewChild } from '@angular/core';
import { LeaveService } from 'src/app/services/leave.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-leave-details',
  templateUrl: './leave-details.component.html',
  styleUrls: ['./leave-details.component.scss']
})
export class LeaveDetailsComponent implements OnInit {
  displayedColumns: string[] = ['FullName', 'NoDays', 'LeaveStartDate', 'LeaveEndDate'];
  dataSource = new MatTableDataSource();
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(private leaveService: LeaveService) { }

  ngOnInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.leaveService.getLeaveForWidget().subscribe(
      (res: any) => {
        this.dataSource = res.data;
      },
      (err) => {
        console.log(err);
      }
    );
  }

}
