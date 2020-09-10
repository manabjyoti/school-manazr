import { Component, OnInit } from '@angular/core';
import { ProgressBarService } from 'src/app/shared/services/progress-bar.service';
import { AlertService } from 'ngx-alerts';
import { SubjectService } from 'src/app/services/subject.service';
import { LocalDataSource } from 'ng2-smart-table';
import { GradeService } from 'src/app/services/grade.service';
import { ConfirmDialogComponent } from 'src/app/shared/common/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { CheckboxComponent, CheckboxEditComponent } from 'src/app/shared/common/checkbox/checkbox.component';

@Component({
  selector: 'app-subject-list',
  templateUrl: './subject-list.component.html',
  styleUrls: ['./subject-list.component.scss']
})
export class SubjectListComponent implements OnInit {
  source: LocalDataSource;
  resArray: any = '';
  gradeList: any;
  settings: any;
  mySettings: any;
  gradeListData = true;
  constructor(public progressbar: ProgressBarService,
              public alertService: AlertService,
              private subjectService: SubjectService,
              private gradeService: GradeService,
              public dialog: MatDialog) {}

  ngOnInit(): void {
    this.getList();
    this.makeGradeList();
    this.settings = {
      columns: {
        Name: {
          title: 'Subject Name',
          filter: true
        },
        Abbreviation: {
          title: 'Abbreviation',
          filter: true
        },
        SubjectGroup: {
          title: 'Group',
          filter: true
        },
        SubjectType: {
          title: 'Type',
          filter: false,
          type: 'html',
          valuePrepareFunction: ( cell, row ) => {
            return `<div class="mdi mdi-18px text-center ${cell === 'theory' ? 'mdi-book-open text-primary' : cell === 'practical' ? 'mdi-flask text-warning' : 'mdi-flower text-info'}" title="${cell.toUpperCase()}"></div>`;
          },
          editor: {
            type: 'list',
            config: {
              list: [{ value : 'theory', title : 'Theory'}, { value : 'practical', title : 'Practical' }]
            }
          }
        },
        GradeId: {
          title: 'Grade',
          filter: true,
          type: 'html',
          valuePrepareFunction: ( cell, row ) => {
              return `${row.GradeName}`;
          },
          editor: {
            type: 'list',
            config: {
              list: ''
            }
          }
        },
        Optional: {
          title: 'Optional',
          type: 'custom',
          filter: false,
          width: '10px',
          renderComponent: CheckboxComponent,
          editor: {
            type: 'custom',
            component: CheckboxEditComponent,
          }
        },
        StaffId: {
          title: 'Assignee',
          filter: true,
          editable: false,
          addable: false,
          type: 'html',
          valuePrepareFunction: ( cell, row ) => {
              return row.FirstName === null ? `<span class="text-warning">Not Assigned</span>` : `${row.FirstName} ${row.LastName}`;
          },
        }
      },
      rowClassFunction: (row) => {
        if (row.data.FirstName === null){
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
  }

  getList(){
    this.subjectService.list().subscribe( (res: any) => {
      this.resArray = res.data;
      this.source = new LocalDataSource(this.resArray);
    });
  }

  makeGradeList(){
    this.gradeService.listGrade().subscribe( (res: any) => {
      if (res.status === 0 ){
        this.gradeListData = false;
        return;
      }
      this.gradeList = res.data.map((row) => {
        return { value : row.GradeId, title : row.Name };
      });
      this.mySettings = this.settings;
      this.mySettings.columns.GradeId.editor.config.list = this.gradeList;
      this.settings = Object.assign({}, this.mySettings);
    });
  }

  makeTeacherList(){
    this.gradeService.listGrade().subscribe( (res: any) => {
      if (res.status === 0 ){
        this.gradeListData = false;
        return;
      }
      this.gradeList = res.data.map((row) => {
        return { value : row.GradeId, title : row.Name };
      });
      this.mySettings = this.settings;
      this.mySettings.columns.GradeId.editor.config.list = this.gradeList;
      this.settings = Object.assign({}, this.mySettings);
    });
  }

  onFormAction( e ){
    console.log(this.subjectService.message);
    this.progressbar.startLoading();
    const subjectObserver = {
      next: x => {
        this.progressbar.completeLoading();
        if (this.subjectService.message.status === 1){
          e.confirm.resolve(e.newData);
          this.getList();
          this.progressbar.setSuccess();
          this.alertService.success(this.subjectService.message.message);
        }else{
          e.confirm.reject();
          this.progressbar.setError();
          this.alertService.warning(this.subjectService.message.message);
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
      this.subjectService.add(e.newData).subscribe(subjectObserver);
    }else{
      this.subjectService.edit(e.newData).subscribe(subjectObserver);
    }
  }

  openDialog(e) {
    e.data.id = e.data.ID;
    console.log(e.data);
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {data : e.data});
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.subjectService.delete(result).subscribe(
          (res: any) => {
            e.confirm.resolve();
            this.alertService.success(res.message);
          }
        );
      }
    });
  }

}
