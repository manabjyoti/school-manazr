import { Component, OnInit } from '@angular/core';
import { ProgressBarService } from 'src/app/shared/services/progress-bar.service';
import { AlertService } from 'ngx-alerts';
import { LocalDataSource } from 'ng2-smart-table';
import { FeeService } from 'src/app/services/fee.service';
import { CheckboxComponent, CheckboxEditComponent } from 'src/app/shared/common/checkbox/checkbox.component';
import { ConfirmDialogComponent } from 'src/app/shared/common/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-fee-type',
  templateUrl: './fee-type.component.html',
  styleUrls: ['./fee-type.component.scss']
})
export class FeeTypeComponent implements OnInit {
  occurenceArray = [
    { value : 1, title : '1 time per session'},
    { value : 2, title : '2 times per session'},
    { value : 4, title : '4 times per session'},
    { value : 6, title : '6 times per session'},
    { value : 12, title : '12 times per session'}
  ];
  statusArray = [
    { value : 0, title : 'Active'},
    { value : 1, title : 'Inactive'},
  ];
  payTypeArray = [
    { value : 0, title : 'Post Paid'},
    { value : 1, title : 'Pre Paid'},
  ];
  feeTypeArray: any = '';
  settings = {
    columns: {
      name: {
        title: 'Type Name',
        filter: true
      },
      Occurrence: {
        title: 'Occurrence per Session',
        filter: true,
        type: 'html',
        valuePrepareFunction: ( cell, row ) => {
          let r = '';
          this.occurenceArray.filter(obj => {
            if (obj.value === cell) {
              r = obj.title;
            }
          });
          return r;
        },
        editor: {
          type: 'list',
          config: {
            list: this.occurenceArray
          }
        }
      },
      Compulsory: {
        title: 'Compulsory',
        type: 'custom',
        filter: false,
        width: '10px',
        renderComponent: CheckboxComponent,
        editor: {
          type: 'custom',
          component: CheckboxEditComponent,
        }
      },
      PayType: {
        title: 'Pay Type',
        type: 'html',
        valuePrepareFunction: ( cell, row ) => {
          let r = '';
          this.payTypeArray.filter(obj => {
            if (obj.value === cell) {
              r = obj.title;
            }
          });
          return `${r}`;
        },
        editor: {
          type: 'list',
          config: {
            list: this.payTypeArray
          }
        }
      },
      Status: {
        title: 'Status',
        type: 'html',
        valuePrepareFunction: ( cell, row ) => {
          let r = '';
          this.statusArray.filter(obj => {
            if (obj.value === cell) {
              r = obj.title;
            }
          });
          return `<span class="mdi mdi-circle ${cell === 0 ? 'text-success' : 'text-danger'}"></span> ${r}`;
        },
        editor: {
          type: 'list',
          config: {
            list: this.statusArray
          }
        }
      },
    },
    rowClassFunction: (row) => {
      if (row.data.PaidCount === 0){
          return '';
      } else {
          return 'hide-delete';
      }
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

  source: LocalDataSource;
  constructor(public progressbar: ProgressBarService,
              public alertService: AlertService, private feeService: FeeService, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.getList();
  }

  getList(){
      this.feeService.listFeeType().subscribe( (res: any) => {
        this.feeTypeArray = res;
        this.source = new LocalDataSource(res.data);
      });
  }

  onFormAction( e ){
    this.progressbar.startLoading();
    const feeObserver = {
      next: x => {
        this.progressbar.completeLoading();
        if (this.feeService.message.status === 1){
          e.confirm.resolve(e.newData);
          this.getList();
          this.progressbar.setSuccess();
          this.alertService.success(this.feeService.message.message);
        }else{
          e.confirm.reject();
          this.progressbar.setError();
          this.alertService.warning(this.feeService.message.message);
        }
      },
      error: err => {
        console.error(err);
        this.progressbar.completeLoading();
        this.progressbar.setError();
        this.alertService.danger('Something Wrong');
      },
    };
    // console.log(e.newData);
    if (e.data === undefined){
      this.feeService.addFeeType(e.newData).subscribe(feeObserver);
    }else{
      this.feeService.editFeeType(e.newData).subscribe(feeObserver);
    }
  }

  openDialog(e) {
    console.log(e.data);
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {data : e.data});
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.feeService.deleteFeeType(result).subscribe(
          (res: any) => {
            e.confirm.resolve();
            this.alertService.success(res.message);
          }
        );
      }
    });
  }


}
