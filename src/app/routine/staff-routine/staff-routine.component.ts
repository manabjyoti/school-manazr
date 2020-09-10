import { Component, OnInit, Input } from '@angular/core';
import { StaffService } from 'src/app/services/staff.service';
import { SubjectService } from 'src/app/services/subject.service';
import { RoutineService } from 'src/app/services/routine.service';
import { ApiResponse } from 'src/app/models/models';

@Component({
  selector: 'app-staff-routine',
  templateUrl: './staff-routine.component.html',
  styleUrls: ['./staff-routine.component.scss']
})
export class StaffRoutineComponent implements OnInit {
  assignedSubjects = [];
  allAssignedSubjects = [];
  tableData: any[] = [];
  days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Friday', 'Saturday'];
  staffList: any[];
  selectedStaff = 'all';
  @Input() selectedStaffId: string;
  time: any[];

  constructor(private staffService: StaffService, private subjectService: SubjectService,
              private routineSerice: RoutineService) { }

  ngOnInit(): void {
    // console.log(this.selectedStaffId);
    if (this.selectedStaffId){
      this.selectedStaff = this.selectedStaffId;
    }else{
      this.staffService.listStaffForDropDown().subscribe(
        (response: ApiResponse) => {
          // console.log(response.data);
          this.staffList = response.data;
        }
      );
    }
    this.setup();
  }

  setup(){
    this.tableData = [];
    this.subjectService.list().subscribe( (res: any) => {
      this.allAssignedSubjects = res.data;
      if (this.selectedStaff === 'all'){
        this.staffList.map((v) => {
          this.assignedSubjects = res.data.filter(p => p.StaffId === v.StaffId);
          if (this.assignedSubjects.length !== 0){
            // console.log(this.assignedSubjects);
            this.assignedSubjects.map( vx => this.getTimingsData(vx.ID));
          }
        });
      } else {
        this.assignedSubjects = res.data.filter(p => p.StaffId === this.selectedStaff);
        if (this.assignedSubjects.length !== 0){
          // console.log(this.assignedSubjects);
          this.assignedSubjects.map(vx => this.getTimingsData(vx.ID));
        }
      }
    });
    this.getRoutineTime();
  }

  employeeChange(e){
    console.log(e.target.value);
    this.selectedStaff = e.target.value;
    this.setup();
  }

  getTimingsData(subjectid){
    this.routineSerice.getTimingsData(subjectid).subscribe(
      (res: ApiResponse) => {
        if (res.status === 1 ){
          // res.data.filter(p => p.Day === 'Sunday').sort( ( a, b ) => {
          //   a = a.Timings.toLowerCase();
          //   b = b.Timings.toLowerCase();
          //   return a < b ? -1 : a > b ? 1 : 0;
          // });
          this.tableData = this.tableData.concat(res.data);
        }
      }
    );
  }

  getSubject(id, timings){
    // console.log(id);
    const subject = this.allAssignedSubjects.filter(p => p.ID === id);
    // console.log(subject);
    if (subject.length === 0){
      return;
    }
    return  '<strong class="mb-1 mr-2 d-inline-block">' + subject[0].SubjectGroup + ' </strong>' +
            subject[0].GradeName +
            // '<br/><strong class="mb-1 mr-2 d-inline-block">Class: </strong>' + subject[0].GradeName +
            '<br/><strong class="mb-1 mr-2 d-inline-block text-black-50">Teacher: </strong>' +
            subject[0].FirstName + ' ' + subject[0].LastName;
  //           '<br/><strong class="mr-2 d-inline-block"><span class="mdi mdi-clock text-default mdi-18px"></span> </strong>' + timings;
   }

  getRoutineTime(){
    this.routineSerice.getRoutineTime().subscribe(
      (res: ApiResponse) => {
        console.log(res.data);
        this.time = res.data;
      }
    )
  }

}
