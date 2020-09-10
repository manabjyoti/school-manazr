import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { ProgressBarService } from 'src/app/shared/services/progress-bar.service';
import { AlertService } from 'ngx-alerts';
import { LeaveService } from 'src/app/services/leave.service';
import { CheckboxComponent, CheckboxEditComponent } from 'src/app/shared/common/checkbox/checkbox.component';

@Component({
  selector: 'app-leave-type',
  templateUrl: './leave-type.component.html',
  styleUrls: ['./leave-type.component.scss']
})
export class LeaveTypeComponent implements OnInit {
  leaveTypeArray: any;
  source: LocalDataSource;
  settings = {
    columns: {
      Name: {
        title: 'Type Name',
        filter: true
      },
      DayCount: {
        title: 'Day Count',
        filter: true,
      },
      Type: {
        title: 'Paid Leave',
        type: 'custom',
        filter: false,
        width: '10px',
        renderComponent: CheckboxComponent,
        editor: {
          type: 'custom',
          component: CheckboxEditComponent,
        }
      },
    },
    actions: { position: 'right'},
    add: {
      confirmCreate: true,
      addButtonContent: '<span class="p-2 tempting-azure-gradient text-white"><i class="mdi mdi-plus-circle" title="Add"></i> Add New</span>',
      createButtonContent: '<i class="mdi mdi-18px mdi-check-circle-outline p-2 mr-2 text-success" title="Create"></i>',
      cancelButtonContent: '<i class="mdi mdi-18px mdi-close-circle-outline p-2 text-warning" title="Cancel"></i>',
    },
    edit: {
      confirmSave: true,
      editButtonContent: '<i class="mdi mdi-18px mdi-lead-pencil p-2 mr-2 text-info" title="Edit"></i>',
      saveButtonContent: '<i class="mdi mdi-18px mdi-content-save p-2 mr-2 text-success" title="Save"></i>',
      cancelButtonContent: '<i class="mdi mdi-18px mdi-close-circle-outline p-2 text-warning" title="Cancel"></i>',
    },
    delete: {
      deleteButtonContent: '<i class="mdi mdi-delete-forever mdi-18px p-2 mr-2 text-danger"  title="Delete"></i>',
      confirmDelete: true,
    },
    attr: {
      class: 'table table-bordered'
    }
  };
  constructor(public progressbar: ProgressBarService,
              public alertService: AlertService, private leaveService: LeaveService) { }

  ngOnInit(): void {
    this.getList();
  }

  getList(){
      this.leaveService.listLeaveType().subscribe( (res: any) => {
        this.leaveTypeArray = res;
        this.source = new LocalDataSource(res.data);
      });
  }

  onFormAction( e ){
    console.log(this.leaveService.message);
    this.progressbar.startLoading();
    const feeObserver = {
      next: x => {
        this.progressbar.completeLoading();
        if (this.leaveService.message.status === 1){
          e.confirm.resolve(e.newData);
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
    console.log(e.newData);
    if (e.data === undefined){
      this.leaveService.addLeaveType(e.newData).subscribe(feeObserver);
    }else{
      this.leaveService.editLeaveType(e.newData).subscribe(feeObserver);
    }
  }


}
