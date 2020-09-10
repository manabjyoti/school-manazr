import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { ExamService } from 'src/app/services/exam.service';
import { ProgressBarService } from 'src/app/shared/services/progress-bar.service';
import { AlertService } from 'ngx-alerts';
import { DatepickerComponent, SmartTableDatepickerRenderComponent } from 'src/app/shared/common/datepicker/datepicker.component';
import { SubjectService } from 'src/app/services/subject.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { listLazyRoutes } from '@angular/compiler/src/aot/lazy_routes';
@Component({
  selector: 'app-create-exam',
  templateUrl: './create-exam.component.html',
  styleUrls: ['./create-exam.component.scss']
})
export class CreateExamComponent implements OnInit {

  source: LocalDataSource;
  resArray: any = '';
  gradeList: any;
  settings: any;
  mySettings: any;
  subjectListData = true;
  constructor(private examService: ExamService, private progressbar: ProgressBarService,
              private alertService: AlertService,
              private subjectService: SubjectService,
              private authService: AuthService) { }

  ngOnInit(): void {
    this.getList();
    this.makeSubjectList();
    this.settings = {
      columns: {
        Name: {
          title: 'Exam Name',
          filter: true
        },
        SubjectId: {
          title: 'Subject',
          filter: false,
          type: 'html',
          valuePrepareFunction: ( cell, row ) => {
            return `${row.SubjectName}`;
          },
          editor: {
            type: 'list',
            config: {
              list: ''
            }
          }
        },
        TotalMarks: {
          title: 'Total Marks',
          filter: true
        },
        Weightage: {
          title: 'Weightage',
          filter: true
        },
        Date: {
          title: 'Exam Date',
          type: 'custom',
          renderComponent: SmartTableDatepickerRenderComponent,
          width: '200px',
          filter: false,
          sortDirection: 'desc',
          editor: {
            type: 'custom',
            component: DatepickerComponent,
          }
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
        deleteButtonContent: '<i class="mdi mdi-delete-forever mdi-18px p-2 mr-2 text-danger" title="Delete"></i>',
        confirmDelete: true,
      },
      attr: {
        class: 'table table-bordered'
      }
    };
  }

  getList(){
    this.examService.list().subscribe( (res: any) => {
      this.resArray = res.data;
      this.source = new LocalDataSource(this.resArray);
    });
  }
  onFormAction( e ){
    // console.log(this.examService.message);
    this.progressbar.startLoading();
    const subjectObserver = {
      next: x => {
        this.progressbar.completeLoading();
        if (this.examService.message.status === 1){
          e.confirm.resolve(e.newData);
          this.progressbar.setSuccess();
          this.alertService.success(this.examService.message.message);
          this.getList();
        }else{
          e.confirm.reject();
          this.progressbar.setError();
          this.alertService.warning(this.examService.message.message);
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
      this.examService.add(e.newData).subscribe(subjectObserver);
    }else if (e.newData !== ''){
      this.examService.edit(e.newData).subscribe(subjectObserver);
    }else{
      console.log('No Change');
    }
  }

  // getSubjects(){
  //   this.subjectService.listSubjectsByFilter('GradeId = "G_016"').subscribe( (res: any) => {
  //     console.log(res);
  //   });
  // }

  makeSubjectList(){
    const funcName = this.authService.myuser.usertype === 'admin' ? this.subjectService.list() : this.subjectService.listSubjectsByFilter('GradeId="G_016"');

    funcName.subscribe( (res: any) => {
        console.log(res);
        if (res.status === 0 ){
          this.subjectListData = false;
          return;
        }
        this.subjectListData = res.data.map((row) => {
          return { value : row.SubjectId, title : row.Name };
        });
        this.mySettings = this.settings;
        this.mySettings.columns.SubjectId.editor.config.list = this.subjectListData;
        this.settings = Object.assign({}, this.mySettings);
      });
    }


}
