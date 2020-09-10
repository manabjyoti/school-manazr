import { Component, OnInit, Input } from '@angular/core';
import { StudentService } from 'src/app/services/student.service';
import { ApiResponse } from 'src/app/models/models';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-student-attendance-capsule',
  templateUrl: './student-attendance-capsule.component.html',
  styleUrls: ['./student-attendance-capsule.component.scss']
})
export class StudentAttendanceCapsuleComponent implements OnInit {
  attendanceDates: any;
  attendancePercentage: any;
  resdates = 0;
  attendanceClass = 'bg-success';
  @Input() studentId: any;

  constructor(private studentService: StudentService, private authService: AuthService) {
  }

  ngOnInit(): void {
    this.getAttendanceDates();
  }

  calculatePercentage(){
    // console.log(this.attendanceDates.length);
    const presentDays = this.attendanceDates.length - this.resdates;
    const totalDays = this.attendanceDates.length;
    const percentage = ((presentDays / totalDays) * 100).toFixed(2);
    this.attendanceClass = percentage >= this.authService.myuser.minAttendance ? 'bg-success' : 'bg-danger';
    return percentage;
  }

  getAttendanceDates(){
    this.studentService.getAttendanceDates(this.studentId).subscribe(
      (res: ApiResponse) => {
        if (res.status === 0){
          return;
        }
        this.attendanceDates = res.data;
        this.attendanceDates.map((val: any) => {
          if (val.StudentIds.split(',').includes(this.studentId)){
            // console.log(val.Date);
            this.resdates++;
          }
        });
        this.attendancePercentage = this.calculatePercentage();
        // this.generateCalendar();
      },
      (err) => {
        console.log(err);
      }
    );
  }

}
