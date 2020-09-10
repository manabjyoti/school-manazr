import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StaffService } from 'src/app/services/staff.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AlertService } from 'ngx-alerts';
import { first } from 'rxjs/operators';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import { SubjectService } from 'src/app/services/subject.service';
import { ProgressBarService } from 'src/app/shared/services/progress-bar.service';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-assignment',
  templateUrl: './assignment.component.html',
  styleUrls: ['./assignment.component.scss']
})
export class AssignmentComponent implements OnInit {
  id: any;
  loading = false;
  submitted = false;
  form: FormGroup;
  staff: any = '';
  unassignedSubjects = [];
  assignedSubjects = [];

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
                        event.container.data,
                        event.previousIndex,
                        event.currentIndex);
      // console.log(this.assignedSubjects[event.currentIndex]);
      // console.log(this.unassignedSubjects[event.currentIndex]);
      if (event.container.element.nativeElement.classList.contains('assign-list')){
        this.onSubmit(this.assignedSubjects[event.currentIndex], this.id);
      } else{
        this.onSubmit(this.unassignedSubjects[event.currentIndex], '0');
      }
    }
  }

  constructor(private staffService: StaffService,
              private formBuilder: FormBuilder,
              private route: ActivatedRoute,
              public alertService: AlertService,
              private subjectService: SubjectService,
              public progressbar: ProgressBarService,
              public authService: AuthService) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.params.id;
    this.form = this.formBuilder.group({
        ID: ['', Validators.required],
        assignedSubjects: ['', Validators.required]
    });
    this.getList(this.id);
    this.getSujectList();
  }

  getList(id){
    this.staffService.getStaffById(id).pipe(first()).subscribe( (res: any) => {
      this.staff = res.data[0];
      this.f.ID.setValue(this.staff.ID);
    });
  }

  getSujectList(){
    this.subjectService.list().subscribe( (res: any) => {
      this.unassignedSubjects = res.data.filter(p => p.StaffId === '0');
      this.assignedSubjects = res.data.filter(p => p.StaffId === this.id);
    });
  }

  get f() { return this.form.controls; }

  onSubmit(sujectObj: any, assigneeId: any) {
    const subjectObserver = {
      next: x => {
        this.progressbar.completeLoading();
        if (this.subjectService.message.status === 1){
          this.progressbar.setSuccess();
          this.alertService.success(this.subjectService.message.message);
        }else{
          this.progressbar.setError();
          this.alertService.warning(this.subjectService.message.message);
        }
      },
      error: err => {
        console.error(err);
        this.progressbar.completeLoading();
        this.progressbar.setError();
        this.alertService.danger('Something Wrong');
      },
    };
    this.subjectService.assignTeacher([sujectObj], assigneeId).subscribe(subjectObserver);
  }
}
