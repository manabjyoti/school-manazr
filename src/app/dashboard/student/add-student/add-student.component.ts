import { Component, OnInit } from '@angular/core';
import { ProgressBarService } from 'src/app/shared/services/progress-bar.service';
import { StudentService } from 'src/app/services/student.service';
import { AlertService } from 'ngx-alerts';
import { first } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GradeService } from 'src/app/services/grade.service';
import { Options, ImageResult } from 'ngx-image2dataurl';
import { ImageService } from 'src/app/services/image.service';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from 'src/app/models/models';
@Component({
  selector: 'app-add-student',
  templateUrl: './add-student.component.html',
  styleUrls: ['./add-student.component.scss']
})
export class AddStudentComponent implements OnInit {
  form: FormGroup;
  loading = false;
  submitted = false;
  isAddMode = true;
  id: string;
  gradeList: any;
  gradeListData = true;
  gradeId: any;
  gradeListRawData: any;
  selectedClassId: any;
  statuses = {0: 'Active', 1: 'Expired', 2: 'Transfered', 3: 'Drop-Off'};
  siblingsList: any;
  selectedIndex = 0;

  src = environment.uploadFilesURL + 'male.png';
  options: Options = {
    resize: {
      maxHeight: 120,
      maxWidth: 120
    },
    allowedExtensions: ['JPG', 'PnG']
  };

  constructor(public progressbar: ProgressBarService,
              private studentService: StudentService,
              public alertService: AlertService,
              private formBuilder: FormBuilder,
              private route: ActivatedRoute,
              private gradeService: GradeService,
              private imageService: ImageService) { }

  selected(imageResult: ImageResult) {
    if (imageResult.error) { alert(imageResult.error); }
    this.src = imageResult.resized
      && imageResult.resized.dataURL
      || imageResult.dataURL;
    const d = new Date();
    let fileName = 'avatar_' + d.getTime() + '.jpg';
    if (!this.isAddMode){
      fileName = 'avatar_' + this.id + '.jpg';
    }
    const file = new File([this.dataURLtoBlob(this.src)], fileName);
    // this.form.controls.photo.setValue(fileName, {onlySelf: true});
    // return;
    this.progressbar.startLoading();
    const fileUploadObserver = {
      next: x => {
        this.progressbar.completeLoading();
        this.loading = false;
        if (this.imageService.message.status === 1){
          this.form.controls.photo.setValue(fileName);
          if (!this.isAddMode){
            console.log(this.form.value);
            this.studentService.editStudent(this.form.value, this.id).subscribe();
          }
          this.progressbar.setSuccess();
          this.alertService.success(this.imageService.message.message);
        }else{
          this.progressbar.setError();
          this.alertService.warning(this.imageService.message.message);
        }
      },
      error: err => {
        console.error(err);
        this.progressbar.completeLoading();
        this.progressbar.setError();
        this.alertService.danger('Something Wrong' + err);
      },
    };
    this.imageService.uploadImage(file).subscribe(fileUploadObserver);
  }

  dataURLtoBlob(dataurl) {
    const arr = dataurl.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], {type: mime});
  }

  ngOnInit(): void {
    this.makeGradeList();
    this.getSiblings();
    this.id = this.route.snapshot.params.sid;
    this.isAddMode = !this.id;

    const stringValidators = [Validators.pattern('[a-zA-Z ]*')];

    this.form = this.formBuilder.group({
      applicationNo: [''],
      caste: ['general'],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      gradeId: ['', Validators.required],
      sex: ['male'],
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
      photo: [''],
      siblings: [''],
      status: [0],
    });

    if (!this.isAddMode) {
      this.studentService.listStudentById(this.id)
          .pipe(first())
          .subscribe((res: any) => {
            // console.log(res.data.FirstName);
            this.f.applicationNo.setValue(res.data[0].ApplicationNo);
            this.f.firstName.setValue(res.data[0].FirstName);
            this.f.lastName.setValue(res.data[0].LastName);
            this.f.gradeId.setValue(res.data[0].GradeId);
            this.f.sex.setValue(res.data[0].Sex);
            this.f.caste.setValue(res.data[0].Caste);
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
            this.f.siblings.setValue(res.data[0].Siblings);
            this.f.status.setValue(res.data[0].Status);
            this.f.photo.setValue(res.data[0].Photo);
            this.src = environment.uploadFilesURL + (res.data[0].Photo ? res.data[0].Photo : res.data[0].Sex + '.png');
            this.gradeId = res.data[0].GradeId;
            this.selectedclass(this.gradeId);
          });
    }

  }
  // convenience getter for easy access to form fields
  get f() { return this.form.controls; }

  makeGradeList(){
    this.gradeService.listGrade().subscribe( (res: any) => {
      if (res.status === 0 ){
        this.gradeListData = false;
        return;
      }
      this.gradeListRawData = res.data;
      this.gradeList = res.data.map((row) => {
        return { value : row.GradeId, title : row.Name };
      });
    });
  }

  selectedclass(gradeId){
    for (const key in this.gradeListRawData){
      if (this.gradeListRawData[key].GradeId === gradeId)
        {
          this.selectedClassId = this.gradeListRawData[key].Class;
        }
    }
  }

  onSubmit() {

    this.submitted = true;

    // stop here if form is invalid
    if (this.form.invalid) {
        return;
    }

    this.loading = true;
    this.createStudent(this.form);
  }

  createStudent(f: any, action: string = ''){
    this.progressbar.startLoading();
    const studentObserver = {
      next: x => {
        this.progressbar.completeLoading();
        this.loading = false;
        if (this.studentService.message.status === 1){
          this.progressbar.setSuccess();
          this.alertService.success(this.studentService.message.message);
          this.submitted = false;
          if (this.isAddMode){
            this.form.reset();
          }
        }else{
          this.progressbar.setError();
          this.alertService.warning(this.studentService.message.message);
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
      this.studentService.editStudent(f.value, this.id).subscribe(studentObserver);
    }else{
      this.studentService.addStudent(f.value).subscribe(studentObserver);
    }
  }

  getSiblings(){
    this.studentService.listStudent().subscribe(
      (res: ApiResponse) => {
        if (this.id){
          this.siblingsList = res.data.filter(p => p.StudentID !== this.id);
        } else {
          this.siblingsList = res.data;
        }
      }
    );
  }

}
