import { Component, OnInit } from '@angular/core';
import { StudentService } from 'src/app/services/student.service';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-student-count',
  templateUrl: './student-count.component.html',
  styleUrls: ['./student-count.component.scss']
})
export class StudentCountComponent implements OnInit {
  studentCount = 0;
  constructor(private studentService: StudentService, public authService: AuthService) { }

  ngOnInit(): void {
    const user = this.authService.myuser;
    this.studentService.getStudentCount().subscribe(
      (res: any) => {
        this.studentCount = res.data[0].StudentCount;

        //  for setting up header
        user.studentCount = this.studentCount === 0 ? false : true;
        this.authService.setItem('user', JSON.stringify(user));
      },
      (err) => {
        console.log(err);
      }
    );
  }

}
