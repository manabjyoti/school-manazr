import { Component, OnInit } from '@angular/core';
import { GradeService } from 'src/app/services/grade.service';
import { ExamService } from 'src/app/services/exam.service';
import { LocalDataSource, ServerDataSource } from 'ng2-smart-table';
import { SubjectService } from 'src/app/services/subject.service';
import { ResultService } from 'src/app/services/result.service';
import { ProgressBarService } from 'src/app/shared/services/progress-bar.service';
import { AlertService } from 'ngx-alerts';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.scss']
})
export class ResultComponent implements OnInit {
  gradeList: any;
  studentArray: any;
  settings: any;
  mySettings: any;
  source: LocalDataSource;
  // source: ServerDataSource;
  subjectListData: any;
  selectedgradeid: any;
  constructor(private gradeService: GradeService,
              private authService: AuthService, private subjectService: SubjectService,
              private resultService: ResultService,
              public progressbar: ProgressBarService,
              public alertService: AlertService,
              private subjectervice: SubjectService) {}

  ngOnInit(): void {
    this.makeGradeList();
    this.settings = {
      actions: false,
      attr: {
        class: 'table table-bordered table-striped'
      }
    };

    // this.getTableSource();
  }

  getTableSource(gradeid: any){
    this.resultService.resultlist(gradeid).subscribe( (res: any) => {
      this.authService.checkError(res);
      if (res.status === 0){
        this.studentArray = [];
        return;
      }else{
        this.getExamList('', gradeid);
        this.selectedgradeid = gradeid;
        this.studentArray = res.data;
        this.source = new LocalDataSource(this.studentArray);
        console.log(this.source);
        return;
      }
    });
  }

  makeGradeList(){
    this.gradeService.listGrade().subscribe( (res: any) => {
      this.gradeList = res.data.map((row) => {
        return { value : row.GradeId, title : row.Name };
      });
    });
  }

  getExamList(subscribeid?, gradeid?){
    this.subjectervice.list().subscribe( (res: any) => {
      this.mySettings = {};
      this.mySettings = this.settings;
      const finalData = gradeid === undefined || gradeid === '' ?
      res.data : subscribeid === undefined || subscribeid === '' ?
      res.data.filter(p => p.GradeId === gradeid) : res.data.filter(p => p.GradeId === gradeid && p.SubjectId === subscribeid);

      this.mySettings.columns = {
        StudentID : {
          title : 'Student Name',
          valuePrepareFunction: ( cell, row ) => {
            return `${row.FirstName} ${row.LastName}`;
          },
        }
      };
      finalData.map((row) => {
        const columnName = row.SubjectId;
        const title = row.Name;
        this.mySettings.columns[columnName] = { title, valuePrepareFunction: ( cell ) => {
          return cell / 100;
        }, };
      });

      const subjectArr = [];
      finalData.map((maprow, index: number) => {
        subjectArr.push(maprow.SubjectId);
      });
      this.mySettings.columns.FirstName = { title: 'Total',
        valuePrepareFunction: ( cell, row: any ) => {
          let totalMarks = 0;
          subjectArr.forEach(e => {
            totalMarks = totalMarks + parseFloat(eval('row.' + e ));
          });
          return (totalMarks / 100).toFixed(2);
          // return `${parseFloat( eval('row.' + subjectArr[0])) + parseFloat( eval('row.' + subjectArr[2]))}`;
        }// `${parseFloat(row.SUB_0001) + parseFloat(row.SUB_0003)}`
      };

      this.mySettings.columns.LastName = { title: 'Percentage', type: 'html',
        valuePrepareFunction: ( cell, row: any ) => {
          let totalMarks = 0;
          let infoFlag = '';
          subjectArr.forEach(e => {
            infoFlag = parseFloat(eval('row.' + e )) === 0 ? '<i class="mdi mdi-information-outline ml-2 text-info" placement="top" ngbTooltip="Tooltip on top"></i>' : '';
            totalMarks = totalMarks + parseFloat(eval('row.' + e )) / finalData.length;
          });
          return (totalMarks / 100).toFixed(2) + '%' + infoFlag;
        }
      };

      // });
      this.settings = Object.assign({}, this.mySettings);
    });
  }

  getMarks(studentid, examid){
    const results = localStorage.getItem('results');
    const i = JSON.parse(results).find(p => p.StudentID === studentid && p.ExamId === examid);
    if (i !== undefined){
      return i.Marks;
    }
    return;
  }

  OnSubjectSelect(value: string){
    this.getExamList(value, this.selectedgradeid);
  }

  onGradeSelect(value: string){
    this.makeSubjectList(value);
    this.getTableSource(value);
  }

  makeSubjectList(gradeid){

    this.subjectService.listSubjectsByFilter('GradeId="' + gradeid + '"').subscribe( (res: any) => {
      if (res.status === 0 ){
        this.subjectListData = false;
        return;
      }
      this.subjectListData = res.data.map((row) => {
        return { value : row.SubjectId, title : row.Name };
      });
    });
  }

  onFormAction( e ){
    this.progressbar.startLoading();
    const resultObserver = {
      next: x => {
        this.progressbar.completeLoading();
        if (this.resultService.message.status === 1){
          e.confirm.resolve(e.newData);
          this.progressbar.setSuccess();
          this.alertService.success(this.resultService.message.message);
          // this.getList();
        }else{
          e.confirm.reject();
          this.progressbar.setError();
          this.alertService.warning(this.resultService.message.message);
        }
      },
      error: err => {
        console.error(err);
        this.progressbar.completeLoading();
        this.progressbar.setError();
        this.alertService.danger('Something Wrong');
      },
    };
    this.resultService.add(e.newData).subscribe(resultObserver);
  }

}
