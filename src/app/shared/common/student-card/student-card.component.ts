import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { StudentService } from 'src/app/services/student.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-student-card',
  templateUrl: './student-card.component.html',
  styleUrls: ['./student-card.component.scss']
})
export class StudentCardComponent implements OnChanges {

  @Input() studentId: any;
  @Input() print = false;
  student: any;
  paidStatus = false;
  photo: string;

  constructor( private studentService: StudentService) { }

  ngOnChanges(): void {
    this.studentService.listStudentById(this.studentId).subscribe((res: any) => {
      this.student = res.data[0];
      this.photo = environment.uploadFilesURL + (this.student.Photo !== null ? this.student.Photo : this.student.Sex + '.png');
      // console.log(this.student);
      this.studentService.getFeeStatus(this.studentId, this.student.ClassId).subscribe(
        (response: any) => {
          this.paidStatus = +response.data[0].FeeCount === +response.data[1].FeeCount;
          // console.log(+response.data[0].FeeCount);
          // console.log(+response.data[0].FeeCount === +response.data[1].FeeCount);
        }
      );
    });
  }

}
