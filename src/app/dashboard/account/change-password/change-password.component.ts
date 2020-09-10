import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AuthService } from 'src/app/shared/services/auth.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {
  form: FormGroup;
  loading = false;
  submitted = false;
  isChangeMode = true;
  notEqual = false;
  hashkey: string;
  constructor( private formBuilder: FormBuilder, private authService: AuthService,
               private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.hashkey = this.route.snapshot.queryParams.hashkey;
    console.log(this.route.snapshot);
    this.isChangeMode = !this.hashkey;
    this.form = this.formBuilder.group({
      password: ['', Validators.required],
      newpassword: ['', [Validators.required, Validators.minLength(4)]],
      confirmpassword: ['', [Validators.required, Validators.minLength(4)]],
    });
    if (this.isChangeMode) {
      this.authService.getUserById(this.authService.decodedToken.data.id)
          .pipe(first())
          .subscribe((res: any) => {
            console.log(res.data);
            this.f.password.setValue(res.data[0].username);
          });
    }
  }

  get f() { return this.form.controls; }

  onSubmit(){
    this.submitted = true;

    if (this.form.value.newpassword !== this.form.value.confirmpassword){
      this.notEqual = true;
      return;
    }else{
      this.notEqual = false;
    }

    // stop here if form is invalid
    if (this.form.invalid) {
        return;
    }

    this.loading = true;

  }

}
