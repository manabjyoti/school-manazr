import { Component, OnInit, Optional, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {filter} from 'rxjs/operators';
import { FilterDefault } from 'ng2-smart-table/lib/components/filter/filter-default';
import { ExamService } from 'src/app/services/exam.service';
@Component({
  selector: 'app-marks-dialog',
  templateUrl: './marks-dialog.component.html',
  styleUrls: ['./marks-dialog.component.scss']
})
export class MarksDialogComponent{

  action: string;
  localData: any;
  filterData: any;
  filtered = [];
  examDetails: any;
  loading = true;
  exams: any;

  constructor(
    private examService: ExamService,
    public dialogRef: MatDialogRef<MarksDialogComponent>,
    // @Optional() is used to prevent error if no data is passed
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any) {
      // this.getExamDetails();
      // console.log(this.exams);
      // // this.filtered = data.filter((country) => country.startsWith('EX_'));
      // for (const key of Object.keys(data)) {
      //   if ( key.startsWith('EX_')){
      //     this.filtered.push(key);
      //   }
      // }

      this.localData = {...data};
      this.getExamsByGrade();
      // console.log(this.localData);
      // data = this.filtered.reduce((result, key) => ({ ...result, [key]: data[key] }), {});
      // this.filterData = {...data};
      // console.log(this.filterData);
      this.action = this.localData.action;
      // console.log(this.filtered);
      // console.log(this.examDetails);
  }

  doAction(){
    // this.filterData.StudentID = this.localData.StudentID;
    this.dialogRef.close({event: this.action, data: this.localData});
  }

  closeDialog(){
    this.dialogRef.close({event: 'Cancel'});
  }

  // getExamDetails(){
  //   this.examService.getExamDetails().subscribe(
  //     (res: any) => {
  //       console.log(res.data);
  //       this.examDetails = res.data;
  //     }
  //   );
  // }
  // && this.localData.OptionalSubjects.split(',').includes(i.SubjectId)

  getExamsByGrade(){
    this.examService.getExamsByGrade(this.localData.GradeId).subscribe(
      (res: any) => {
        console.log(res.data);
        const groups = new Set(res.data.map(item => item.SubjectGroup));
        this.exams = [];
        groups.forEach(g =>
          this.exams.push({
            header: g,
            values: res.data.filter(i => i.SubjectGroup === g &&
              (i.Optional === 0 || this.localData.OptionalSubjects.split(',').includes(i.SubjectId))
            )
          }
        ));
        console.log(this.exams);
        // this.exams = res.data;
      }
    );
  }

}
