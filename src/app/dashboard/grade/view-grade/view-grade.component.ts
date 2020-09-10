import { Component, OnInit } from '@angular/core';
import { StudentService } from 'src/app/services/student.service';
import { ActivatedRoute } from '@angular/router';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import { GradeService } from 'src/app/services/grade.service';
import { MatCheckboxChange } from '@angular/material/checkbox';

@Component({
  selector: 'app-view-grade',
  templateUrl: './view-grade.component.html',
  styleUrls: ['./view-grade.component.scss']
})
export class ViewGradeComponent implements OnInit {
  studentArray: any[];
  gradeId: string;
  grade: string;
  gradeList: any;
  studentTranferArray: any;
  rollSet = true;
  unsetRoll = 0;
  selectedArr = [];
  constructor(private studentService: StudentService, private route: ActivatedRoute, private gradeService: GradeService) { }

  ngOnInit(): void {
    this.gradeId = this.route.snapshot.params.gid;
    this.getViewGradeData();
    this.getGradeById(this.gradeId);
    this.makeGradeList();
  }

  getViewGradeData(){
    this.studentService.listStudentByGrade(this.gradeId).subscribe( (res: any) => {
      if (res.status === 1){
        Object.keys(res.data).some((k) => {
          if (res.data[k].RollNo === 0){
            this.unsetRoll++;
            this.rollSet = false;
          }
        });
        res.data.sort( ( a, b ) => {
          a = a.FirstName.toLowerCase();
          b = b.FirstName.toLowerCase();
          return a < b ? -1 : a > b ? 1 : 0;
        });
        this.studentArray = res.data;
      } else {
        this.studentArray = [];
      }

    });
  }

  assignRollNumber(){
    for ( let i = 0; i < this.studentArray.length; i++){
      this.studentArray[i].RollNo = i + 1; // setting up roll number starting from 1
    }
    // console.log(this.studentArray);
    this.studentService.bulkAddUpdateStudent(this.studentArray).subscribe((res: any) => {
      if (res.status === 1){
        this.getViewGradeData();
        this.rollSet = true;
        this.selectedArr = [];
      } else {
        console.log(res.message);
      }
    });
  }

  getGradeById(id){
    this.gradeService.listGradeById(id).subscribe( (res: any) => {
      this.grade = res.data[0].Name;
    });
  }

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
                        event.container.data,
                        event.previousIndex,
                        event.currentIndex);
    }
  }

  makeGradeList(){
    this.gradeService.listGrade().subscribe( (res: any) => {
      this.gradeList = res.data.map((row) => {
        if (row.GradeId !== this.gradeId){
          return { value : row.GradeId, title : row.Name };
        }
      });
    });
  }

  onTransferGradeSelect(value: string){
    this.studentService.listStudentByGrade(value).subscribe( (res: any) => {
      if (res.status === 0){
        this.studentTranferArray = [];
      }else{
        this.studentTranferArray = res.data;
      }
    });
  }

  toggle(item, event: MatCheckboxChange) {
     if (event.checked) {
      this.selectedArr.push(item);
    } else {
      const index = this.selectedArr.indexOf(item);
      if (index >= 0) {
        this.selectedArr.splice(index, 1);
      }
    }
   // console.log(item + "<>", event.checked);
  }

  exists(item) {
    return this.selectedArr.indexOf(item) > -1;
  }

  isIndeterminate() {
    return (this.selectedArr && this.selectedArr.length > 0 && !this.isChecked());
  }

  isChecked() {
    return this.selectedArr.length === this.studentArray.length;
  }



  toggleAll(event: MatCheckboxChange) {

    if ( event.checked ) {
       this.studentArray.forEach(row => {
          // console.log('checked row', row);
          this.selectedArr.push(row);
          });
    } else {
      // console.log('checked false');
       this.selectedArr.length = 0 ;
    }
  }

}
