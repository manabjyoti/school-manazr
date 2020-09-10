import { Component, OnInit } from '@angular/core';
import { ProgressBarService } from 'src/app/shared/services/progress-bar.service';
import { AlertService } from 'ngx-alerts';
import { LocalDataSource } from 'ng2-smart-table';
import { ClassService } from 'src/app/services/class.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from 'src/app/shared/common/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-class',
  templateUrl: './class.component.html',
  styleUrls: ['./class.component.scss']
})
export class ClassComponent implements OnInit {

  source: LocalDataSource;
  classArray: any = '';
  settings = {
    columns: {
      ClassId: {
        title: 'ID',
        filter: false,
        editable: false,
        addable: false,
      },
      Name: {
        title: 'Class Name',
      },
      Students: {
        title: 'Student Count',
        valuePrepareFunction: ( cell, row ) => {
          const studentCount = cell === null ? 0 : cell.split(',').length;
          return studentCount;
        },
        filter: false,
        editable: false,
        addable: false,
      }
    },
    rowClassFunction: (row) => {
      if (row.data.Students === null){
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

  constructor(public progressbar: ProgressBarService, public alertService: AlertService, 
              private classService: ClassService, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.getList();
  }

  getList(){
    this.classService.listClass().subscribe( (res: any) => {
      this.classArray = res.data;
      this.source = new LocalDataSource(this.classArray);
    });
  }

  onFormAction( e ){
    this.progressbar.startLoading();
    const classObserver = {
      next: x => {
        this.progressbar.completeLoading();
        if (this.classService.message.status === 1){
          e.confirm.resolve(e.newData);
          this.source.refresh();
          this.progressbar.setSuccess();
          this.alertService.success(this.classService.message.message);
        }else{
          e.confirm.reject();
          this.progressbar.setError();
          this.alertService.warning(this.classService.message.message);
        }
      },
      error: err => {
        console.error(err);
        this.progressbar.completeLoading();
        this.progressbar.setError();
        this.alertService.danger('Something Wrong');
      },
    };
    if (e.data === undefined){
      this.classService.addGrade(e.newData).subscribe(classObserver);
    }else{
      this.classService.editGrade(e.newData).subscribe(classObserver);
    }
  }

  openDialog(e) {
    e.data.id = e.data.ID;
    console.log(e.data);
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {data : e.data});
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.classService.deleteClass(result).subscribe(
          (res: any) => {
            e.confirm.resolve();
            this.alertService.success(res.message);
          }
        );
      }
    });
  }


}
