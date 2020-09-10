import { Component, OnInit, ViewChild, ElementRef, Input, ViewEncapsulation } from '@angular/core';
import { StudentService } from 'src/app/services/student.service';
// declare var $: any;
import * as moment from 'moment';
import { AuthService } from 'src/app/shared/services/auth.service';
import { ApiResponse } from 'src/app/models/models';

@Component({
  selector: 'app-student-attendance',
  templateUrl: './student-attendance.component.html',
})
export class StudentAttendanceComponent implements OnInit {
  // @Input() isWidget = false;
  @Input() studentId: any;
  resdates = [];
  presentdates = [];
  attendanceDates: any;
  attendancePercentage: any;
  startAt = [];
  // attendance = new Date('2020/10/14');
  event: any;
  loading = true;

  @ViewChild('attendanceCalendar') attendanceCalendar: ElementRef;
  constructor(private studentService: StudentService, private authService: AuthService) { }

  ngOnInit(): void {
    this.getAttendanceDates();
    for (let i = 0; i < this.authService.myuser.monthCount; i++){
      const startDate: any = moment(this.authService.myuser.sessionStart).add(i, 'M');
      this.startAt.push(startDate);
    }
  }

  isSelected = (event: any) => {
    // console.log(this.presentdates);
    const date =
      event.getFullYear() +
      '-' +
      ('00' + (event.getMonth() + 1)).slice(-2) +
      '-' +
      ('00' + event.getDate()).slice(-2);
    if (this.resdates.find(x => x === date) ){
      return 'bg-danger rounded-circle'; // absent
    } else if (this.presentdates.find(y => y === date) ){
      return 'bg-success rounded-circle'; // present
    }
    // return this.resdates.find(x => x === date) ? 'selected' : null;
  }


  getDate(date){
    return new Date(date);
  }

  // calculatePercentage(){
  //   // console.log(this.attendanceDates.length);
  //   const presentDays = this.attendanceDates.length - this.resdates.length;
  //   const totalDays = this.attendanceDates.length;
  //   return ((presentDays / totalDays) * 100).toFixed(2) ;
  // }

  calendarFilter = (d: Date): boolean => {
    // console.log(this.authService.myuser.saturday);
    const day = d.getDay();
    return this.authService.myuser.saturday === 1 ? day !== 0 : day !== 0 && day !== 6;
    // return day !== 0 && day !== 6;
  }

  getAttendanceDates(){
    this.studentService.getAttendanceDates(this.studentId).subscribe(
      (res: ApiResponse) => {
        // console.log(res);
        this.loading = !res;
        if (res.status === 0){
          return;
        }
        this.attendanceDates = res.data;
        this.attendanceDates.map((val: any) => {
          if (val.StudentIds.split(',').includes(this.studentId)){
            // console.log(val.Date);
            this.resdates.push(val.Date);
          } else {
            this.presentdates.push(val.Date);
          }
        });
        // this.attendancePercentage = this.calculatePercentage();
        // this.generateCalendar();
      },
      (err) => {
        console.log(err);
      }
    );
  }

}
