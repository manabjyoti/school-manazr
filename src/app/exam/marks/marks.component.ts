import { Component, OnInit, AfterContentInit, AfterViewInit, OnDestroy, ViewChild } from '@angular/core';
import { GradeService } from 'src/app/services/grade.service';
import { ExamService } from 'src/app/services/exam.service';
import { LocalDataSource, ServerDataSource } from 'ng2-smart-table';
import { SubjectService } from 'src/app/services/subject.service';
import { ResultService } from 'src/app/services/result.service';
import { ProgressBarService } from 'src/app/shared/services/progress-bar.service';
import { AlertService } from 'ngx-alerts';
import { AuthService } from 'src/app/shared/services/auth.service';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import { MarksDialogComponent } from './marks-dialog/marks-dialog.component';
import { MatDialog } from '@angular/material/dialog';
// import {ValidatorService, TableDataSource} from 'angular4-material-table';
@Component({
  selector: 'app-marks',
  templateUrl: './marks.component.html',
  styleUrls: ['./marks.component.scss']
})
export class MarksComponent implements OnInit {
  gradeList: any;
  studentArray: any;
  settings: any;
  mySettings: any;
  source: LocalDataSource;
  isSubjectAssign = true;
  // source: ServerDataSource;
  subjectListData: any;
  selectedgradeid: any;
  initColumns: any[];
  displayedColumns: any[];
  groupColumns: any[];
  dataSource = new MatTableDataSource();
  center = 'center';

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  groupTitles: any;
  finalData: any;
  constructor(private gradeService: GradeService,
              private examService: ExamService, private subjectService: SubjectService,
              private resultService: ResultService,
              public progressbar: ProgressBarService,
              public alertService: AlertService,
              private authService: AuthService,
              public dialog: MatDialog) {}

  ngOnInit(): void {

    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.makeGradeList();
  }

  // ngOnDestroy(): void{
  //   $('ng2-smart-table-title a').map((i,v)=>{$(v).html($(v).html().replace('|','<br/>'))});
  // }

  getTableSource(gradeid: any){
    this.resultService.list(gradeid).subscribe( (res: any) => {
      if (res.status === 0){
        this.studentArray = [];
        return;
      }else{
        this.getExamList('', gradeid);
        this.selectedgradeid = gradeid;
        this.studentArray = res.data;
        this.source = new LocalDataSource(this.studentArray);
        // this.dataSource = new TableDataSource<any>(this.studentArray);
        this.dataSource = new MatTableDataSource<any>(this.studentArray);
        console.log(this.studentArray);
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
    this.initColumns = [{colId: 'StudentID', colTitle: 'Student Id'}];
    this.displayedColumns = this.initColumns.map(col => col.colId);

    this.examService.list().subscribe( (res: any) => {
      // console.log(res);
      // this.mySettings = {};
      // this.mySettings = this.settings;
      this.finalData = gradeid === undefined || gradeid === '' ?
      res.data : subscribeid === undefined || subscribeid === '' ?
      res.data.filter(p => p.GradeId === gradeid) : res.data.filter(p => p.GradeId === gradeid && p.SubjectId === subscribeid);
      // console.log(this.finalData);
      // const finalData = res.data;
      // this.mySettings.columns = {
      //   StudentID : {
      //     title : 'Student Name'
      //   }
      // };

      this.finalData.map((row) => {
        this.initColumns.push({colId: row.ExamId, colTitle: row.Name, groupTitle: row.SubjectGroup,
          colOptional: row.Optional, colSubjectId: row.SubjectId});
        this.displayedColumns = this.initColumns.map(col => col.colId);
        this.groupTitles = this.initColumns.map(col => col.groupTitle);
        this.groupColumns = [...new Set(this.groupTitles)];
        // const columnName = row.ExamId;
        // const title = row.Name + ' | ' + row.SubjectGroup;
        // const myclass = 'rotate';
        // this.mySettings.columns[columnName] = { title, class: myclass };
      });
      this.displayedColumns.push('actionsColumn');
      console.log(this.displayedColumns);
      // this.settings = Object.assign({}, this.mySettings);
      const counts = {};
      this.groupTitles.forEach((el) => {
        counts[el] = counts[el] + 1 || 1;
      });
      this.groupTitles = counts;
    });
  }

  checkOptionalSubjects(ele, subjectId, val){
    if (ele){
      return ele.split(',').includes(subjectId) ? val : '<span class="badge badge-warning">Not Opted</span>';
    }else{
      return '<span class="badge badge-warning">Not Opted</span>';
    }
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
    const filter = this.authService.myuser.usertype === 'admin' ?
                  'GradeId="' + gradeid + '"' :
                  'GradeId="' + gradeid + '" AND StaffId="' + this.authService.myuser.userId + '"';
    this.subjectService.listSubjectsByFilter(filter)
    .subscribe( (res: any) => {
      if (res.status === 0 ){
        this.subjectListData = false;
        this.isSubjectAssign = false;
        return;
      }
      this.subjectListData = res.data.map((row) => {
        return { value : row.SubjectId, title : row.SubjectGroup };
      });
    });
  }

  onFormAction( data ){
    this.progressbar.startLoading();
    const resultObserver = {
      next: x => {
        this.progressbar.completeLoading();
        if (this.resultService.message.status === 1){
          // e.confirm.resolve(e.newData);
          this.getTableSource(this.selectedgradeid);
          this.progressbar.setSuccess();
          this.alertService.success(this.resultService.message.message);
          // this.getList();
        }else{
          // e.confirm.reject();
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
    this.resultService.add(data).subscribe(resultObserver);
  }

  openDialog(action, obj) {
    obj.action = action;
    obj.GradeId = this.selectedgradeid;
    console.log(obj);
    const dialogRef = this.dialog.open(MarksDialogComponent, {
      width: '60%',
      data: obj
    });

    dialogRef.afterClosed().subscribe(result => {
      // if (result.event === 'Add'){
      //   this.editItem(result.data);
      // }else if (result.event === 'Update'){
      //   this.editItem(result.data);
      // }else if (result.event === 'Delete'){
      //   this.editItem(result.data);
      // }
      if (result && result.event === 'Update'){
        // console.log(result.data);
        this.editItem(result.data);
      }
    });
  }
  editItem(row) {
    // console.log(row);
    this.onFormAction(row);
  }

}
