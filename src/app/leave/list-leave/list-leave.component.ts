import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { RouterLinkComponent } from 'src/app/dashboard/router-link/router-link.component';
import { LeaveService } from 'src/app/services/leave.service';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-list-leave',
  templateUrl: './list-leave.component.html',
  styleUrls: ['./list-leave.component.scss']
})
export class ListLeaveComponent implements OnInit {
  settings = {
    columns: {
      ID: {
        title: 'ID',
        filter: false,
        editable: false,
        type: 'custom',
        renderComponent: RouterLinkComponent
      },
      Name: {
        title: 'Leave Type',
        editable: false,
      },
      LeaveStartDate: {
        title: 'Leave Start',
        filter: false,
        editable: false,
      },
      LeaveEndDate: {
        title: 'Leave End',
        filter: false,
        editable: false,
      },
      NoDays: {
        title: 'No Of Days',
        filter: false,
        editable: false,
      },
      LeaveStatus: {
        title: 'Status',
        filter: false,
        type: 'html',
        valuePrepareFunction: ( cell, row ) => {
          switch (cell){
            case 0: {
              return `<span class="badge badge-info">Pending</span>`;
            }
            case 1: {
              return `<span class="badge badge-success">Approved</span>`;
            }
            case 2: {
              return `<span class="badge badge-danger">Denied</span>`;
            }
            case 3: {
              return `<span class="badge badge-warning">Withdrawn</span>`;
            }
            default: {
              return `<span class="badge">UNKNOWN</span>`;
            }
          }
        },
        editor: {
          type: 'list',
          config: {
            list: [
              {value: 0, title: 'Pending'},
              {value: 1, title: 'Approved'},
              {value: 2, title: 'Denied'},
              {value: 3, title: 'Withdrawn'}
            ]
          }
        }
      },
      Message: {
        title: 'Message',
        editable: false,
      },
      StaffName: {
        title: 'Approver',
        editable: false,
      }
    },
    actions: false,
    attr: {
      class: 'table table-bordered text-capitalize'
    }
  };

  source: LocalDataSource;


  constructor(private leaveService: LeaveService, private authService: AuthService) { }

  ngOnInit(): void {
    this.getList();
  }

  getList(){
    this.leaveService.listLeaveDetails(this.authService.myuser.userId).subscribe( (res: any) => {
      //this.staffArray = res.data;
      console.log(res.data);
      this.source = new LocalDataSource(res.data);
    });
  }

}
