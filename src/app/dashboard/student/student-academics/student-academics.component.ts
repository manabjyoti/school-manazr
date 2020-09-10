import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { StudentService } from 'src/app/services/student.service';
import { LocalDataSource } from 'ng2-smart-table';
import {MatAccordion} from '@angular/material/expansion';
import * as moment from 'moment';
import { SubjectService } from 'src/app/services/subject.service';
import { ApiResponse } from 'src/app/models/models';
import {includes, remove, camelCase, mapKeys} from 'lodash';
import { ProgressBarService } from 'src/app/shared/services/progress-bar.service';
import { AlertService } from 'ngx-alerts';


@Component({
  selector: 'app-student-academics',
  templateUrl: './student-academics.component.html',
  styleUrls: ['./student-academics.component.scss']
})
export class StudentAcademicsComponent implements OnInit {

  @Input() gradeId: any;
  @Input() studentId: any;
  filtered: any;
  tableData: any;
  student: any;
  studentFlag = false;
  optionalSubjects: any[];
  constructor( private studentService: StudentService, private subjectService: SubjectService,
               public progressbar: ProgressBarService, public alertService: AlertService) { }
  @ViewChild(MatAccordion) accordion: MatAccordion;
  settings = {
    columns: {
      ExamName: {
        title: 'Exam Name',
        filter: false,
        sort: false
      },
      Date: {
        title: 'Exam Date',
        filter: false,
        sort: false,
        valuePrepareFunction: ( cell, row ) => {
          return `${moment(row.Date).format('YYYY-MM-DD')}`;
        },
      },
      TotalMarks: {
        title: 'Exam Total',
        filter: false,
        sort: false
      },
      Weightage: {
        title: 'Weightage',
        filter: false,
        sort: false
      },
      Marks: {
        title: 'Marks',
        filter: false,
        sort: false
      },
    },
    actions: false,
    attr: {
      class: 'table table-bordered no-filter-table'
    }
  };

  source: LocalDataSource;

  ngOnInit(): void {
    this.getAcademics();
    this.getSubjects();
    this.getStudent();
  }

  getStudent(){
    this.studentService.listStudentById(this.studentId).subscribe(
      (res: ApiResponse) => {
        this.student = res.data;
        this.studentFlag = true;
      }
    );
  }

  checkInclude(val: number){
    if (this.student[0].OptionalSubjects !== null){
      return includes(this.student[0].OptionalSubjects.split(','), val.toString());
    }
    return false;
  }

  getAcademics(){
    this.studentService.getAcademics(this.studentId).subscribe((res: any) => {
      if (res.status === 0){
        return;
      }
      const keys = ['SubjectName'];
      // filter data to remove duplicates
      this.filtered = res.data.filter(
          (s => o =>
              (k => !s.has(k) && s.add(k))
              (keys.map(k => o[k]).join('|'))
          )
          (new Set())
      );
      this.source = res.data;
      this.tableData = res.data;
      // console.log(this.filtered);
      // console.log(this.tableData);

      this.filtered.map((data: any) => {
        this.tableData.map((val: any) => {
          if (val.SubjectName === data.SubjectName){
            data.Total = (data.Total || 0) + (parseFloat(val.Marks) * parseFloat(val.Weightage) / 100);
            data.WeightageCheck = (data.WeightageCheck || 0) + parseFloat(val.Weightage);
          }
        });
      });
      // console.log(this.filtered);
      // console.log(this.tableData);
      // this.generateCalendar();
    });
  }

  getSubjects(){
    this.subjectService.listSubjectsByFilter('Optional=1 AND GradeId="' + this.gradeId + '"').subscribe(
      (res: ApiResponse) => {
        this.optionalSubjects = res.data;
        console.log(res.data);
      }
    );
  }

  saveOptionalSubjects(subjectId){
    this.progressbar.startLoading();
    const studentObserver = {
      next: x => {
        this.progressbar.completeLoading();
        // this.loading = false;
        if (this.studentService.message.status === 1){
          this.progressbar.setSuccess();
          this.studentFlag = false;
          this.getStudent();
          this.alertService.success(this.studentService.message.message);
        }else{
          this.progressbar.setError();
          this.alertService.warning(this.studentService.message.message);
        }
      },
      error: err => {
        console.error('Observer got an error: ' + err);
        this.progressbar.completeLoading();
        this.progressbar.setError();
        this.alertService.danger('Something Wrong' + err);
      },
    };

    const optArr = this.student[0].OptionalSubjects === null ? [] : this.student[0].OptionalSubjects.split(',');
    console.log(optArr);
    // checking add or remove
    this.checkInclude(subjectId) ? remove(optArr, n => n === subjectId.toString()) : optArr.push(subjectId.toString());
    console.log(optArr);
    // return;



    // const optSub = this.student[0].OptionalSubjects;
    // this.student[0].OptionalSubjects = optSub ? optSub + ',' + subjectId : subjectId;
    this.student[0].OptionalSubjects = optArr.join(',');
    const model = mapKeys(this.student[0], (v, k) => camelCase(k));

    this.studentService.editStudent(model, this.studentId).subscribe(studentObserver);
  }

}
