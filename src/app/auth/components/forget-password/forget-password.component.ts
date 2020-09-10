import { Component, OnInit } from '@angular/core';
import { AlertService } from 'ngx-alerts';
import { AuthService } from 'src/app/shared/services/auth.service';
import { ProgressBarService } from 'src/app/shared/services/progress-bar.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.scss']
})
export class ForgetPasswordComponent implements OnInit {

  constructor(private authService: AuthService, public progressbar: ProgressBarService, private alertService: AlertService) { }

  ngOnInit(): void {
  }

  onSubmit(f: NgForm) {
    this.progressbar.startLoading();
    const loginObserver = {
      next: x => {
        console.log('User Logged In');
        this.progressbar.completeLoading();
        this.progressbar.setSuccess();
        this.alertService.success('Login Successful');
      },
      error: err => {
        console.error('Observer got an error: ' + err);
        this.progressbar.completeLoading();
        this.progressbar.setError();
        this.alertService.danger('Something Wrong');
      },
    };
    console.log(f.value);
    this.authService.sendEmail(f.value).subscribe(loginObserver);
  }

}
