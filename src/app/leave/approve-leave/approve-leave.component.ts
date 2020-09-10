import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { RouterLinkComponent } from 'src/app/dashboard/router-link/router-link.component';
import { LeaveService } from 'src/app/services/leave.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { ProgressBarService } from 'src/app/shared/services/progress-bar.service';
import { AlertService } from 'ngx-alerts';

@Component({
  selector: 'app-approve-leave',
  templateUrl: './approve-leave.component.html',
  styleUrls: ['./approve-leave.component.scss']
})
export class ApproveLeaveComponent implements OnInit {

  settings = {
    columns: {
      ID: {
        title: 'ID',
        filter: false,
        editable: false,
        type: 'custom',
        renderComponent: RouterLinkComponent
      },
      StaffName: {
        title: 'Staff Name',
        editable: false,
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
        width: '120px',
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
    },
    actions: {position: 'right', add: false, delete: false},
    edit: {
      confirmSave: true,
      editButtonContent: '<i class="mdi mdi-18px mdi-lead-pencil p-2 mr-2 text-info" title="Edit"></i>',
      saveButtonContent: '<i class="mdi mdi-18px mdi-content-save p-2 mr-2 text-success" title="Save"></i>',
      cancelButtonContent: '<i class="mdi mdi-18px mdi-close-circle-outline p-2 text-warning" title="Cancel"></i>',
    },
    attr: {
      class: 'table table-bordered text-capitalize'
    }
  };

  source: LocalDataSource;


  constructor(private leaveService: LeaveService, private authService: AuthService,
              private progressbar: ProgressBarService, private alertService: AlertService) { }

  ngOnInit(): void {
    this.getList();
  }

  getList(){
    this.leaveService.listLeaveApproveDetails(this.authService.myuser.userId).subscribe( (res: any) => {
      // this.staffArray = res.data;
      // console.log(res.data);
      this.source = new LocalDataSource(res.data);
    });
  }

  onFormAction( e ){
    this.progressbar.startLoading();
    const leaveObserver = {
      next: x => {
        this.progressbar.completeLoading();
        if (this.leaveService.message.status === 1){
          e.confirm.resolve(e.newData);
          this.getList();
          this.progressbar.setSuccess();
          this.alertService.success(this.leaveService.message.message);
        }else{
          e.confirm.reject();
          this.progressbar.setError();
          this.alertService.warning(this.leaveService.message.message);
        }
      },
      error: err => {
        console.error(err);
        this.progressbar.completeLoading();
        this.progressbar.setError();
        this.alertService.danger('Something Wrong');
      },
    };
    this.leaveService.updateLeaveStatus(e.newData).subscribe(leaveObserver);
  }

}
