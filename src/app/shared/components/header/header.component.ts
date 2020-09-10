import { Component, OnInit, AfterViewInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import {NgbDropdownConfig} from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { MatDialog } from '@angular/material/dialog';
import { interval } from 'rxjs/internal/observable/interval';
import { ApiResponse } from 'src/app/models/models';
import { environment } from '../../../../environments/environment';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  providers: [NgbDropdownConfig]
})
export class HeaderComponent implements OnInit {
  remainingDays: number;
  public sidebarOpened = false;
  notifications = [];
  notificationCount: number;
  photo = '../../../../assets/faces-clipart/pic-1.png';
  user: any;
  chkCount = 0;
  toggleOffcanvas() {
    this.sidebarOpened = !this.sidebarOpened;
    if (this.sidebarOpened) {
      document.querySelector('.sidebar-offcanvas').classList.add('active');
    }
    else {
      document.querySelector('.sidebar-offcanvas').classList.remove('active');
    }
  }

  constructor(public authService: AuthService, config: NgbDropdownConfig, public dialog: MatDialog) {
    config.placement = 'bottom-right';
  }

  ngOnInit(): void {
    if (this.authService.myuser){
      const days = this.expiryDate(this.authService.myuser.addedDate, this.authService.myuser.package);
      this.remainingDays = days;
      if (this.remainingDays < 0) {
        this.dialog.open(SubscriptionDialogComponent);
      }
      this.getNotification();
      this.getPhoto();

      const user = this.authService.myuser;

      this.authService.watchStorage().subscribe((data: string) => {
        this.user = this.authService.myuser;
  
        // add unique value to array without duplicates
        const arr = new Set();
        if (this.user) {
          if (!this.user.sessionName){
            arr.add('sessionName');
          }
          if (!this.user.studentCount){
            arr.add('studentCount');
          }
          if (!this.user.staffCount){
            arr.add('staffCount');
          }
          this.chkCount = [...arr].length;
        }
      });
    }
  }

  expiryDate(dateString, pakage: any) {
    const expiration = pakage === 0 ? moment(dateString, 'YYYY-MM-DD').add(30, 'days') : moment(dateString, 'YYYY-MM-DD').add(1, 'year');
    const currentDate = moment().format('YYYY-MM-DD');
    const days = moment(expiration).diff(currentDate, 'days');
    return days;
  }

  groupBy(list, keyGetter) {
    const map = new Map();
    list.forEach((item) => {
        const key = keyGetter(item);
        const collection = map.get(key);
        if (!collection) {
            map.set(key, [item]);
        } else {
            collection.push(item);
        }
    });
    return map;
  }

  getNotification(){
    this.authService.getNotification().subscribe((res: any) => {
      // this.notifications = res.data;
      const filterArr = ['Leave'];
      this.notificationCount = 0;
      if (!res || res.status === 0){
        return;
      }
      const grouped = this.groupBy(res.data, notification => notification.MenuTarget);
      // console.log(grouped.get('Leave'));
      filterArr.map((val) => {
        this.notificationCount = this.notificationCount + grouped.get(val).length;
        const noti = { count: grouped.get(val).length, description: grouped.get(val)[0].Description };
        // console.log(noti);
        this.notifications.push(noti);
      });
      // console.log(this.notifications);
      //
    });
  }

  getPhoto(){
    const fileName = 'org_avatar_' + this.authService.myuser.organizationId + '.jpg';
    this.photo = environment.uploadFilesURL + fileName;
  }

}

@Component({
  selector: 'app-subscription-dialog',
  template: `<h1 mat-dialog-title>Dialog with elements</h1>
  <div mat-dialog-content><p>Your Subscription is ended. Please contact the provider to continue using it.</p>
  <button class="btn btn-primary">Logging Out in {{secondscount}} Sec</button></div>
  `,
})
export class SubscriptionDialogComponent implements AfterViewInit {
  seconds = 10;
  secondscount = 10;
  constructor(public authService: AuthService, public dialog: MatDialog){}
  ngAfterViewInit(){
    // const stopCondition = false;
    const subscription = interval(1000).subscribe(
      (value: number) => {
        this.secondscount = this.seconds - value;
        if (this.secondscount <= 0){
          this.dialog.closeAll();
          this.authService.logout();
          subscription.unsubscribe();
        }
      },
      (error: any) => {
        console.log('error');
      },
      () => {
        console.log('observable completed !');
      }
    );
  }
}
