import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { FeeService } from 'src/app/services/fee.service';
import { ProgressBarService } from 'src/app/shared/services/progress-bar.service';
import { AlertService } from 'ngx-alerts';
import { ClassService } from 'src/app/services/class.service';
import { ConfirmDialogComponent } from 'src/app/shared/common/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-fee-master',
  templateUrl: './fee-master.component.html',
  styleUrls: ['./fee-master.component.scss']
})
export class FeeMasterComponent implements OnInit {
  settings = {
    columns: {
      FeeTypeId: {
        title: 'Fee Type',
        filter: true,
        type: 'html',
        valuePrepareFunction: ( cell, row ) => {
          if (row.FeeTypeName === null) {
            return `<span class="alert alert-warning p-1">Fee Type Deleted</span>`;
          }
          return `${row.FeeTypeName}`;
        },
        editor: {
          type: 'list',
          config: {
            list: ''
          }
        }
      },
      ClassId: {
        title: 'Class',
        valuePrepareFunction: ( cell, row ) => {
          return `${row.Class}`;
        },
        editor: {
          type: 'list',
          config: {
            list: ''
          }
        }
      },
      Amount: {
        title: 'Amount',
        type: 'html',
        valuePrepareFunction: ( cell: string ) => `<i class="mdi mdi-currency-inr"></i>${parseInt(cell).toFixed(2)}`,
      },
      Discount: {
        title: 'Discount',
        type: 'html',
        valuePrepareFunction: ( cell: string ) => {
          return `<i class="mdi mdi-currency-inr"></i>${parseInt(cell).toFixed(2)}`;
        },
      },
      Tax: {
        title: 'Tax',
        valuePrepareFunction: ( cell, row ) => {
          return `${cell} %`;
        },
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
  feeMasterArray: any;
  feeTypeListData = true;
  feeTypeList: any;
  mySettings: any;
  classList: any;
  classListData = true;

  constructor(private feeService: FeeService, public progressbar: ProgressBarService,
              public alertService: AlertService, private classService: ClassService,
              public dialog: MatDialog) { }

  ngOnInit(): void {
    this.getList();
    this.makeEditorList();
  }

  getList(){
      this.feeService.listFeeMaster().subscribe( (res: any) => {
        this.feeMasterArray = res;
        this.source = new LocalDataSource(res.data);
      });
  }

  makeEditorList(){
    this.feeService.listFeeType().subscribe( (res: any) => {
      if (res.status === 0 ){
        this.feeTypeListData = false;
        return;
      }
      this.feeTypeList = res.data.map((r) => {
        return { value : r.id, title : r.name };
      });
      // console.log(this.feeTypeList);

      this.mySettings = this.settings;
      this.mySettings.columns.FeeTypeId.editor.config.list = this.feeTypeList;

      // for class list
      this.classService.listClass().subscribe( (response: any) => {
        if (response.status === 0 ){
          this.classListData = false;
          return;
        }
        this.classList = response.data.map((c) => {
          return { value : c.ClassId, title : c.Name };
        });
        this.mySettings.columns.ClassId.editor.config.list = this.classList;
        this.settings = Object.assign({}, this.mySettings);
      });
    });
  }

  onFormAction( e ){
    this.progressbar.startLoading();
    const feeObserver = {
      next: x => {
        this.progressbar.completeLoading();
        if (this.feeService.message.status === 1){
          this.getList();
          // this.source.refresh();
          e.confirm.resolve(e.newData);
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
    console.log(e.newData);
    this.feeService.addUpdateFeeMaster(e.newData).subscribe(feeObserver);
  }

  openDialog(e) {
    e.data.id = e.data.ID;
    // console.log(e.data);
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {data : e.data});
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.feeService.deleteFeeMaster(result).subscribe(
          (res: any) => {
            e.confirm.resolve();
            this.alertService.success(res.message);
          }
        );
      }
    });
  }

}
