import { Component, OnInit, Input } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';
import { NgForm, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProgressBarService } from 'src/app/shared/services/progress-bar.service';
import { AlertService } from 'ngx-alerts';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {
  form: FormGroup;
  loading = false;
  submitted = false;
  isAddMode = true;
  @Input() userId = null;

  constructor(private authService: AuthService, private formBuilder: FormBuilder,
              private progressbar: ProgressBarService,
              private alertService: AlertService,
              private router: Router) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', Validators.required],
      username: ['', Validators.required],
      password: ['', Validators.required],
      orgName: ['', Validators.required],
      address: [''],
      package: [1],
      mobile: ['', Validators.required],
    });
    this.isAddMode = this.userId === null;
    if (!this.isAddMode) {
      this.authService.getUserById(this.userId)
          .pipe(first())
          .subscribe((res: any) => {
            console.log(res.data);
            this.f.firstName.setValue(res.data[0].firstname);
            this.f.lastName.setValue(res.data[0].lastname);
            this.f.email.setValue(res.data[0].email);
            this.f.username.setValue(res.data[0].username);
            this.f.password.setValue(res.data[0].username);
            this.f.mobile.setValue(res.data[0].mobile);
            this.f.orgName.setValue(res.data[0].orgName);
            this.f.address.setValue(res.data[0].orgAddress);
          });
    }
  }

  get f() { return this.form.controls; }

  // onSubmit(f: NgForm) {
  //   const registrationObserver = {
  //     next: x => console.log('User Registered'),
  //     error: err => console.error('Observer got an error: ' + err),
  //   };
  //   console.log(f.value);
  //   this.authService.register(f.value).subscribe(registrationObserver);
  // }

  onSubmit(){
    this.submitted = true;

    // stop here if form is invalid
    if (this.form.invalid) {
        return;
    }

    this.loading = true;
    this.createUser(this.form);

  }

  createUser(f: any, action: string = ''){
    this.progressbar.startLoading();
    const userObserver = {
      next: x => {
        this.progressbar.completeLoading();
        this.loading = false;
        if (this.authService.message.status === 1){
          this.progressbar.setSuccess();
          this.alertService.success(this.authService.message.message);
          this.submitted = false;
          if (this.isAddMode){
            this.form.reset();
            this.router.navigate(['/login']);
          }
        }else{
          this.progressbar.setError();
          this.alertService.warning(this.authService.message.message);
        }
      },
      error: err => {
        console.error('Observer got an error: ' + err);
        this.progressbar.completeLoading();
        this.progressbar.setError();
        this.alertService.danger('Something Wrong' + err);
      },
    };
    if (!this.isAddMode) {
      // this.staffService.updateStaff(f.value, this.pid).subscribe(studentObserver);
      this.authService.updateAccount(f.value, this.userId).subscribe(userObserver);
    }else{
      // console.log(f.value);
      this.authService.register(f.value).subscribe(userObserver);
    }
  }
}
