import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from 'src/app/shared/services/auth.service';
import { ProgressBarService } from 'src/app/shared/services/progress-bar.service';
import { AlertService } from 'ngx-alerts';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(private authService: AuthService, public progressbar: ProgressBarService, private alertService: AlertService) { }

  ngOnInit(): void {
  }

  onSubmit(f: NgForm) {
    this.progressbar.startLoading();
    const loginObserver = {
      next: x => {
        console.log('User Logged In');
        console.log(this.authService.myuser);
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

    this.authService.login(f.value).subscribe(loginObserver);
    // console.log(f.value);  // { first: '', last: '' }
    // console.log(f.valid);  // false
  }
}
