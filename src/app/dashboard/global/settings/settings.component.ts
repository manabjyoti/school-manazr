import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ProgressBarService } from 'src/app/shared/services/progress-bar.service';
import { AlertService } from 'ngx-alerts';
import { Router } from '@angular/router';
import { SettingsService } from 'src/app/services/settings.service';
import { first } from 'rxjs/operators';
import { StudentService } from 'src/app/services/student.service';
import { LocalDataSource } from 'ng2-smart-table';
import { StaffService } from 'src/app/services/staff.service';
import { MatDialog } from '@angular/material/dialog';
import { SessionDialogComponent } from 'src/app/shared/common/session-dialog/session-dialog.component';
import { DatepickerComponent, SmartTableDatepickerRenderComponent } from 'src/app/shared/common/datepicker/datepicker.component';
import { ConfirmDialogComponent } from 'src/app/shared/common/confirm-dialog/confirm-dialog.component';
import { AuthService } from 'src/app/shared/services/auth.service';
import { ApiResponse } from 'src/app/models/models';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  form: FormGroup;
  sessionform: FormGroup;
  loading = false;
  scanloading = false;
  submitted = false;
  isAddMode = true;
  sessions: Array<any> = [];
  settingObserver: any;
  activeSession = 0;
  feeStatus: boolean;
  feePendingCount = 0;
  leavePendingCount = 0;
  leaveStatus: boolean;
  source: LocalDataSource;
  icardSettings = {
    width: '2.63in',
    height: '3.88in',
    padding: '20px',
    spacing: '5px',
    align: 'center',
    studentid: true,
    photo: true,
    fullname: true,
    classname: true,
    rollnumber: true,
    address: true,
  };
  id = null;
  settings = {
    columns: {
      Name: {
        title: 'Session Name',
      },
      Start: {
        title: 'Start Date',
        type: 'custom',
        renderComponent: SmartTableDatepickerRenderComponent,
        editor: {
          type: 'custom',
          component: DatepickerComponent,
        }
      },
      MonthCount: {
        title: 'Duration',
        valuePrepareFunction: ( cell, row ) => {
          return cell + (cell <= 1 ? ' month' : ' months');
        },
        editor: {
          type: 'number'
        }
      },
      End: {
        title: 'End Date',
        type: 'custom',
        renderComponent: SmartTableDatepickerRenderComponent,
        editable: false,
        addable: false,
      },
      Status: {
        title: '',
        editable: false,
        addable: false,
        filter: false,
        type: 'html',
        valuePrepareFunction: ( cell, row ) => {
          return cell === 0 ? '<span class="text-success mdi mdi-lock-open-variant" title="Open"></span>' : '<span class="text-danger mdi mdi-lock" title="Closed"></span>';
        },
      },
    },
    rowClassFunction: (row) => {
      if (row.data.Status === 0){
        if (row.data.Id === this.authService.myuser.sessionId){
          return 'hide-delete';
        } else {
          return '';
        }
      } else {
          return 'hide-delete hide-edit';
      }
    },
    actions: { position: 'right', width: '50px'},
    add: {
      confirmCreate: true,
      addButtonContent: '<span class="p-2 bg-default text-white"><i class="mdi mdi-plus-circle" title="Add"></i> Add New</span>',
      createButtonContent: '<i class="mdi mdi-18px mdi-check-circle-outline p-2 mr-2 text-success" title="Create"></i>',
      cancelButtonContent: '<i class="mdi mdi-18px mdi-close-circle-outline p-2 text-warning" title="Cancel"></i>',
    },
    edit: {
      confirmSave: true,
      editButtonContent: '<i class="mdi mdi-18px mdi-lead-pencil p-2 text-info" title="Edit"></i>',
      saveButtonContent: '<i class="mdi mdi-18px mdi-content-save p-2 text-success" title="Save"></i>',
      cancelButtonContent: '<i class="mdi mdi-18px mdi-close-circle-outline p-2 text-warning" title="Cancel"></i>',
    },
    delete: {
      deleteButtonContent: '<i class="mdi mdi-delete-forever mdi-18px p-2 text-danger"  title="Delete"></i>',
      confirmDelete: true,
    },
    attr: {
      class: 'table table-bordered'
    }
  };
  staffListData: any;
  constructor(private formBuilder: FormBuilder,
              private progressbar: ProgressBarService,
              private alertService: AlertService,
              private router: Router,
              private settingsService: SettingsService,
              private studentService: StudentService,
              private staffService: StaffService,
              public dialog: MatDialog,
              private authService: AuthService) { }

  ngOnInit(): void {
    this.getAvailableSessions();
    this.checkFeePaymentForAll();
    this.checkLeaveForAll();
    this.getStaffList();
    this.form = this.formBuilder.group({
      activeSession: ['', Validators.required],
      reqAttendance: ['70', Validators.required],
      passMark: ['30', Validators.required],
      saturdayCheck: ['0', Validators.required],
      leaves: ['20', Validators.required],
      head: [''],
    });
    this.getSettings();

    // this.sessionform = this.formBuilder.group({
    //   sessionName: ['', Validators.required],
    //   startDate: ['', Validators.required],
    //   endDate: ['', Validators.required],
    // });

    this.settingObserver = {
      next: x => {
        this.progressbar.completeLoading();
        if (this.settingsService.message.status === 1){
          this.progressbar.setSuccess();
          this.alertService.success(this.settingsService.message.message);
          // this.sessionform.reset();
          // this.getAvailableSessions();
          this.activeSession = parseInt( this.form.value.activeSession );
          const session = this.sessions.filter(p => p.Id === this.activeSession);
          // const session = this.sessions.filter(p => p.Id === parseInt( this.form.value.activeSession ));
          // console.log(this.form.value.activeSession);
          const user = this.authService.myuser;
          user.sessionEnd = session[0].End;
          user.sessionId = session[0].Id;
          user.sessionName = session[0].Name;
          user.sessionStart = session[0].Start;
          this.authService.setItem('user', JSON.stringify(user));
          this.source.reset();
        }else{
          this.progressbar.setError();
          this.alertService.warning(this.settingsService.message.message);
        }
        this.loading = false;
        this.submitted = false;
      },
      error: err => {
        console.error(err);
        this.progressbar.completeLoading();
        this.progressbar.setError();
        this.alertService.danger('Something Wrong');
        this.loading = false;
        this.submitted = false;
      },
    };
  }

  get f() { return this.form.controls; }
  // get g() { return this.sessionform.controls; }

  openSessionDialog(data) {
    const dialogRef = this.dialog.open(SessionDialogComponent, {data});
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.onCloseSession(result);
      }
    });
  }

  openDialog(e) {
    e.data.id = e.data.Id;
    // console.log(e.data);
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {data : e.data});
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.settingsService.deleteSessions(result).subscribe(
          (res: any) => {
            e.confirm.resolve();
            this.alertService.success('Session Deleted');
          }
        );
      }
    });
  }

  getSettings(){
    this.settingsService.getSettings()
      .pipe(first())
      .subscribe((res: any) => {
        if (res.data){
          // console.log(res.data);
          this.id = res.data[0].Id;
          this.f.activeSession.setValue(res.data[0].ActiveSession);
          this.f.reqAttendance.setValue(res.data[0].MinAttendance);
          this.f.passMark.setValue(res.data[0].PassMark);
          this.f.saturdayCheck.setValue(res.data[0].Saturday);
          this.f.leaves.setValue(res.data[0].Leaves);
          this.f.head.setValue(res.data[0].Head);
          this.activeSession = res.data[0].ActiveSession;
        }

      });
  }


  onSubmit(){
    this.submitted = true;

    // stop here if form is invalid
    if (this.form.invalid) {
        return;
    }

    this.loading = true;
    this.form.value.id = this.id;
    this.form.value.saturdayCheck = +this.form.value.saturdayCheck;
    // console.log(this.form.value);
    this.progressbar.startLoading();
    this.settingsService.addSettings(this.form.value).subscribe(this.settingObserver);
  }

  getAvailableSessions(){
    this.settingsService.getSessions().subscribe(
      (res: ApiResponse) => {
        this.authService.checkError(res);
        if (res.data) {
          console.log(res.data);
          this.sessions = res.data;
          this.source = new LocalDataSource(res.data);
        }
      }
    );
  }

  // onSessionSubmit(){
  //   this.progressbar.startLoading();
  //   this.settingsService.addSession(this.sessionform.value).subscribe(this.settingObserver);
  // }

  onFormAction( e ){
    this.progressbar.startLoading();
    const sessionObserver = {
      next: x => {
        this.progressbar.completeLoading();
        if (this.settingsService.message.status === 1){
          this.progressbar.setSuccess();
          this.alertService.success(this.settingsService.message.message);
          e.confirm.resolve(e.newData);
          // this.source.refresh();
          this.getAvailableSessions();
        }else{
          this.progressbar.setError();
          this.alertService.warning(this.settingsService.message.message);
        }
        this.loading = false;
        this.submitted = false;
      },
      error: err => {
        console.error(err);
        this.progressbar.completeLoading();
        this.progressbar.setError();
        this.alertService.danger('Something Wrong');
        this.loading = false;
        this.submitted = false;
      },
    };
    if (e.data === undefined){
      this.settingsService.addSession(e.newData).subscribe(sessionObserver);
    }else{
      this.settingsService.updateSession(e.newData).subscribe(sessionObserver);
    }
  }

  onCloseSession(sessionId){
    this.settingsService.closeSession(sessionId).subscribe(
      (res: ApiResponse) => {
        if (res.status === 1) {
          this.alertService.success('Session Closed');
          this.getSettings();
          // this.form.reset();
          // console.log(this.sessions.filter(p => p.Id === this.activeSession) );
          const user = JSON.parse(localStorage.getItem('user'));
          user.sessionEnd = null;
          user.sessionId = null;
          user.sessionName = null;
          user.sessionStart = null;
          this.authService.setItem('user', JSON.stringify(user));
          // this.getAvailableSessions();
        }
      },
      (err) => {
        this.alertService.success(err);
      }
    );
  }

  checkFeePaymentForAll(){
    this.scanloading = true;
    this.settingsService.checkFeePaymentForAll().subscribe(
      (res: ApiResponse) => {
        if (res.data){
          res.data.forEach(element => {
            // console.log(element);
            this.studentService.getFeeStatus(element.StudentID, element.Class).subscribe(
              (response: ApiResponse) => {
                if ( +response.data[0].FeeCount !== +response.data[1].FeeCount){
                  // console.log(response.data);
                  this.feeStatus = false;
                  this.feePendingCount++;
                }
                // console.log(+response.data[0].FeeCount);
                // console.log(+response.data[0].FeeCount === +response.data[1].FeeCount);
              }
            );
          });
        }
        this.feeStatus = true;
        this.scanloading = false;
      },
      (err) => {
        console.log(err);
      }
    );
  }

  checkLeaveForAll(){
    this.settingsService.checkLeaveForAll().subscribe(
      (res: any) => {
        // console.log(res.data.count);
        this.leavePendingCount = res.data.count === undefined ? 0 : res.data.count;
        this.leaveStatus = res.data.count === undefined;
      },
      (err) => {
        console.log(err);
      }
    );
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
