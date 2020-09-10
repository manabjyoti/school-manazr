import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { GradeService } from 'src/app/services/grade.service';
import { FormGroup, FormBuilder, NgModel } from '@angular/forms';
import { StudentService } from 'src/app/services/student.service';
import { SatDatepickerInputEvent, SatDatepickerRangeValue } from 'saturn-datepicker';
import { AttendanceService } from 'src/app/services/attendance.service';
import { ProgressBarService } from 'src/app/shared/services/progress-bar.service';
import { AlertService } from 'ngx-alerts';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { Color, Label } from 'ng2-charts';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-attendence',
  templateUrl: './attendence.component.html',
  styleUrls: ['./attendence.component.scss']
})
export class AttendenceComponent implements OnInit {
  gradeList: any;
  isGradeAssign = true;
  showDatepicker = false;
  form: FormGroup;
  loading = false;
  submitted = false;
  studentArray = [];
  selectedDate: any;
  selectedGrade: any;
  absentArray = [];
  data: any;
  constructor(private formBuilder: FormBuilder, private gradeService: GradeService,
              private studentService: StudentService, private attendanceService: AttendanceService,
              public progressbar: ProgressBarService, public alertService: AlertService,
              private authService: AuthService) { }

  ngOnInit(): void {
    this.makeGradeList();
    this.form = this.formBuilder.group({
      gradeid: [''],
      leavedate: []
    });
  }

  calendarFilter = (d: Date): boolean => {
    const day = d.getDay();
    return this.authService.myuser.saturday === 1 ? day !== 0 : day !== 0 && day !== 6;
  }

  makeGradeList(){
    this.gradeService.listGrade().subscribe( (res: any) => {
      this.gradeList = res.data.map((row) => {
        return { value : row.GradeId, title : row.Name };
      });
    });
  }

  onGradeSelect(gradeId: string){
    this.getViewGradeData(gradeId);
    this.showDatepicker = true;
    this.selectedGrade = gradeId;
  }

  onDateChange(e: SatDatepickerInputEvent<Date>){
    this.selectedDate = e.value as SatDatepickerRangeValue<Date>;
    this.attendanceService.getAttendance(this.selectedGrade, this.selectedDate).subscribe((res: any) => {
      // console.log(res.data[0].StudentIds.split(','));
      if (res.status === 0){
        this.absentArray = [];
      }else{
        this.absentArray = res.data[0].StudentIds.split(',');
      }
    });
  }

  getViewGradeData(gradeId){
    this.studentService.listStudentByGrade(gradeId).subscribe( (res: any) => {
      if (res.status === 1){
        res.data.sort( ( a, b ) => {
          a = a.FirstName.toLowerCase();
          b = b.FirstName.toLowerCase();
          return a < b ? -1 : a > b ? 1 : 0;
        });
        this.studentArray = res.data;
      }
    });
  }

  onSubmit() {
    this.submitted = true;
    this.loading = true;
    this.progressbar.startLoading();
    const attendanceObserver = {
      next: x => {
        this.progressbar.completeLoading();
        this.loading = false;
        if (this.attendanceService.message.status === 1){
          this.progressbar.setSuccess();
          this.alertService.success(this.attendanceService.message.message);
          this.submitted = false;
        }else{
          this.progressbar.setError();
          this.alertService.warning(this.attendanceService.message.message);
        }
      },
      error: err => {
        console.error('Observer got an error: ' + err);
        this.progressbar.completeLoading();
        this.progressbar.setError();
        this.alertService.danger('Something Wrong' + err);
      },
    };
   // this.createLeave(this.form);
    this.data = {GradeId: this.selectedGrade, StudentIds : this.absentArray.toString(), Date : this.selectedDate};
    console.log(this.data);
    this.attendanceService.addUpdateAttendance(this.data).subscribe(attendanceObserver);
  }

  attendanceClick(e, StudentId){
    if (e.target.classList.contains('mat-button-base')){
      this.arrayAction(e.target, StudentId);
      e.target.classList.toggle('bg-success');
      e.target.classList.toggle('bg-danger');
    } else {
      const ele = e.target.closest('.mat-button-base');
      this.arrayAction(ele, StudentId);
      ele.classList.toggle('bg-success');
      ele.classList.toggle('bg-danger');
    }

    // console.log(this.absentArray);
  }

  arrayAction(ele, StudentId) {
    if (ele.classList.contains('bg-success')){
      this.absentArray.push(StudentId);
    }else if (ele.classList.contains('bg-danger')){
      const index = this.absentArray.indexOf(StudentId, 0);
      if (index > -1) {
        this.absentArray.splice(index, 1);
      }
      // this.absentArray.filter(obj => obj !== StudentId);
    }
   }
}


@Component({
  selector: 'app-attendance-line-chart',
  template: `<div class="chart-wrapper">
  <canvas baseChart
      [datasets]="lineChartData"
      [labels]="lineChartLabels"
      [options]="lineChartOptions"
      [colors]="lineChartColors"
      [legend]="lineChartLegend"
      [chartType]="lineChartType"
      [plugins]="lineChartPlugins">
  </canvas>
</div>`,
  styleUrls: ['./attendence.component.scss']
})

export class AttendanceLineChartComponent implements OnChanges{
  lineChartData: ChartDataSets[] = [
    { data: [], label: 'Absentees Curve' },
  ];

  lineChartLabels: Label[] = [];

  lineChartOptions = {
    responsive: true,
    scales: {
      yAxes: [{
          ticks: {
              min: 0,
              stepSize: 1
          }
      }]
    }
  };

  lineChartColors: Color[] = [
    {
      borderColor: 'black',
      backgroundColor: 'rgba(255,255,0,0.28)',
    },
  ];

  lineChartLegend = true;
  lineChartPlugins = [];
  lineChartType = 'line';

  @Input() GradeId: any;

  constructor(private attendanceService: AttendanceService) { }

  ngOnChanges() {
    this.lineChartLabels = [];
    this.lineChartData[0].data = [];
    this.attendanceService.getAllAttendance(this.GradeId).subscribe((res: any) => {
      console.log(res);
      if (res.status === 1){
        res.data.map(e => {
          this.lineChartLabels.push(e.date);
          this.lineChartData[0].data.push(e.Absentees);
        });
      }

    });
  }

}
