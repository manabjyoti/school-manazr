import { Component, OnInit, Input } from '@angular/core';
import { StudentService } from 'src/app/services/student.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { ApiResponse } from 'src/app/models/models';

@Component({
  selector: 'app-student-docs',
  templateUrl: './student-docs.component.html',
  styleUrls: ['./student-docs.component.scss']
})
export class StudentDocsComponent implements OnInit {
  @Input() studentId: any;
  icardSettings = {
    width: '2.63in',
    height: '3.88in',
    padding: '20px',
    align: 'center',
    studentid: true,
    photo: true,
    fullname: true,
    classname: true,
    rollnumber: true,
    address: true,
  };
  data: any;

  constructor(private studentService: StudentService, private authService: AuthService) { }

  ngOnInit(): void {
    this.getStudent();
  }

  getStudent(){
    this.studentService.listStudentById(this.studentId).subscribe(
      (res: ApiResponse) => {
        this.data = res.data;
      }
    );
  }

}
