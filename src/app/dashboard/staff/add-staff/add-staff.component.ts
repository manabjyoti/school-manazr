import { Component, OnInit, ViewChild } from '@angular/core';
import { ProgressBarService } from 'src/app/shared/services/progress-bar.service';
import { AlertService } from 'ngx-alerts';
import { StaffService } from 'src/app/services/staff.service';
import { NgForm , FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';
import { AuthService } from 'src/app/shared/services/auth.service';
import { Options, ImageResult } from 'ngx-image2dataurl';

@Component({
  selector: 'app-add-staff',
  templateUrl: './add-staff.component.html',
  styleUrls: ['./add-staff.component.scss']
})

export class AddStaffComponent implements OnInit {
  form: FormGroup;
  loading = false;
  submitted = false;
  staffTypeList: any;
  isAddMode = true;
  id: any;
  pid: any;
  staff: any;
  staffTypeData = true;
  staffListData: any;
  userType: string;
  statuses = {0: 'Active', 1: 'Expired', 2: 'Retired', 3: 'Resigned'};

  src = '../../../../assets/faces-clipart/male.png';
  options: Options = {
    resize: {
      maxHeight: 120,
      maxWidth: 120
    },
    allowedExtensions: ['JPG', 'PnG', 'JPEG']
  };
  isImageSet = false;

  selected(imageResult: ImageResult) {
    if (imageResult.error) { alert(imageResult.error); }
    this.src = imageResult.resized
      && imageResult.resized.dataURL
      || imageResult.dataURL;
  }

  constructor(public progressbar: ProgressBarService,
              public alertService: AlertService,
              private staffService: StaffService,
              private formBuilder: FormBuilder,
              private route: ActivatedRoute,
              private authService: AuthService) { }

  ngOnInit(): void {
    this.makeStaffTypeList();
    this.id = this.route.snapshot.params.id;
    this.isAddMode = !this.id;
    // if (!this.isAddMode) {
    //   this.getStaffByID(this.id);
    // }
    this.getStaffList();
    const stringValidators = [Validators.pattern('[a-zA-Z ]*')];

    this.form = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      username: ['', Validators.required],
      password: ['', Validators.required],
      usertype: ['', Validators.required],
      sex: [''],
      mobile: [''],
      dob: [''],
      pob: [''],
      address: [''],
      fatherfn: ['', stringValidators],
      fatherln: ['', stringValidators],
      fcontact: [''],
      motherfn: ['', stringValidators],
      motherln: ['', stringValidators],
      mcontact: [''],
      doh: [''],
      yoe: [''],
      expertise: [''],
      reportsto: [''],
      status: [0],
      OrganizationId: this.authService.decodedToken.data.organizationId
    });

    if (this.isAddMode) {
      this.form.controls.sex.setValue('male');
      this.form.controls.reportsto.setValue(this.authService.myuser.head, {onlySelf: true});
    }

    if (!this.isAddMode) {
      this.staffService.getStaffById(this.id)
          .pipe(first())
          .subscribe((res: any) => {
            this.f.firstName.setValue(res.data[0].FirstName);
            this.f.lastName.setValue(res.data[0].LastName);
            this.f.usertype.setValue(res.data[0].usertype);
            this.f.sex.setValue(res.data[0].Sex);
            this.f.mobile.setValue(res.data[0].MobilePhone);
            this.f.dob.setValue(res.data[0].DateOfBirth);
            this.f.pob.setValue(res.data[0].PlaceOfBirth);
            this.f.address.setValue(res.data[0].Address);
            this.f.fatherfn.setValue(res.data[0].FatherFirstName);
            this.f.fatherln.setValue(res.data[0].FatherLastName);
            this.f.fcontact.setValue(res.data[0].FatherContact);
            this.f.motherfn.setValue(res.data[0].MotherFirstName);
            this.f.motherln.setValue(res.data[0].MotherLastName);
            this.f.mcontact.setValue(res.data[0].MotherContact);
            this.f.doh.setValue(res.data[0].DateOfHiring),
            this.f.yoe.setValue(res.data[0].YearsOfExperience),
            this.f.reportsto.setValue(res.data[0].ReportsTo),
            this.f.status.setValue(res.data[0].Status),
            this.pid = res.data[0].ID;
            this.f.username.setValue('x');
            this.f.password.setValue('x');
            const sexType = res.data[0].Sex ? res.data[0].Sex : 'male';
            console.log(res.data[0].Photo);
            this.src = res.data[0].Photo ? res.data[0].Photo : '../../../../assets/faces-clipart/' + sexType + '.png';
            this.isImageSet = res.data[0].Photo ? true : false;
            this.userType = res.data[0].usertype.toLowerCase();
          });
    }

  }

  changeSex(e){
    console.log(this.src);
    if (this.isImageSet) {
      return;
    }
    this.src = '../../../../assets/faces-clipart/' + e.target.value + '.png';
  }

  // convenience getter for easy access to form fields
  get f() { return this.form.controls; }

  makeStaffTypeList(){
    this.staffService.list().subscribe( (res: any) => {
      if (res.status === 0 ){
        this.staffTypeData = false;
        return;
      }
      this.staffTypeList = res.stafftype.map((row) => {
        return { value : row.id, title : row.name };
      });
    });
  }

  onSubmit() {

    this.submitted = true;

    // stop here if form is invalid
    if (this.form.invalid) {
        return;
    }

    this.loading = true;
    this.createStaff(this.form);
  }

  createStaff(f: any, action: string = ''){
    f.value.photo = this.src;
    this.progressbar.startLoading();
    const studentObserver = {
      next: x => {
        this.progressbar.completeLoading();
        this.loading = false;
        if (this.staffService.message.status === 1){
          this.progressbar.setSuccess();
          this.alertService.success(this.staffService.message.message);
          this.submitted = false;
          this.userType = f.value.usertype.toLowerCase();
          if (this.isAddMode) {
            // console.log(this.staffService.message);
            f.value.staffId = this.staffService.message.staffId;
            this.authService.register(f.value).subscribe(userObserver);
            this.form.reset();
          }
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

    const userObserver = {
      next: x => {
        this.progressbar.completeLoading();
        this.loading = false;
        if (this.authService.message.status === 1){
          this.progressbar.setSuccess();
          this.alertService.success(this.authService.message.message);
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
      this.staffService.updateStaff(f.value, this.pid).subscribe(studentObserver);
    }else{
      this.staffService.addStaff(f.value).subscribe(studentObserver);
    }
  }

  getStaffList(){
    this.staffService.listStaffForDropDown(this.id).subscribe( (res: any) => {
      if (res.status === 0 ){
        this.staffListData = '';
        return;
      }
      this.staffListData = res.data.map((r) => {
        return { value : r.StaffId, title : r.FirstName + ' ' + r.LastName };
      });
    });
  }

}
