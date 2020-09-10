import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { StaffService } from 'src/app/services/staff.service';
import { ProgressBarService } from 'src/app/shared/services/progress-bar.service';
import { AlertService } from 'ngx-alerts';
@Component({
  selector: 'app-add-staff-type',
  templateUrl: './add-staff-type.component.html',
  styleUrls: ['./add-staff-type.component.scss']
})
export class AddStaffTypeComponent implements OnInit {

  constructor( public staffService: StaffService, public progressbar: ProgressBarService, public alertService: AlertService) { }

  ngOnInit(): void {
  }

  onSubmit(f: NgForm) {
    this.progressbar.startLoading();
    const staffObserver = {
      next: x => {
        this.progressbar.completeLoading();
        if (this.staffService.message.status === 1){
          this.progressbar.setSuccess();
          this.alertService.success(this.staffService.message.message);
          f.reset();
        }else{
          this.progressbar.setError();
          this.alertService.warning(this.staffService.message.message);
        }
      },
      error: err => {
        console.error('Observer got an error: ' + err);
        this.progressbar.completeLoading();
        this.progressbar.setError();
        this.alertService.danger('Something Wrong' + err);
      },
    };
    this.staffService.create(f.value).subscribe(staffObserver);
  }

}
