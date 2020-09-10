import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../shared/services/auth.service';
import { map } from 'rxjs/operators';
import * as moment from 'moment';
import { environment } from 'src/environments/environment';
import { ApiResponse } from '../models/models';

export interface Sessions {
  Name: string;
  Start: string;
  End: string;
  MonthCount: number;
  orgid: number;
  methodtype?: string;
}

@Injectable({
  providedIn: 'root'
})

export class SettingsService {
  message: any = '';
  ssessionUrl: any = environment.apiURL + 'sessions-api.php';
  settingsUrl: any = environment.apiURL + 'settings-api.php';
  quickcallUrl: any = environment.apiURL + 'quickcall-api.php';
  orgid: number = this.authService.myuser.organizationId;

  constructor(private http: HttpClient, private authService: AuthService) {}


  addSession(newData: Sessions){
    newData.orgid = this.authService.myuser.organizationId;
    // newData.Name = newData.sessionName;
    // newData.Start = moment(newData.startDate).format('YYYY-MM-DD');
    // newData.End = moment(newData.endDate).format('YYYY-MM-DD');
    newData.Start = moment(newData.Start).format('YYYY-MM-DD');
    newData.End = moment(newData.Start).add(newData.MonthCount, 'M').format('YYYY-MM-DD');
    const headers = new HttpHeaders({
      Authorization : 'Bearer ' + this.authService.myRawToken
    });
    return this.http.post(this.ssessionUrl, newData, {headers}).pipe(
      map((response: any) => {
        this.message = response;
      })
    );
  }

  updateSession(newData: Sessions){
    newData.orgid = this.authService.myuser.organizationId;
    newData.Start = moment(newData.Start).format('YYYY-MM-DD');
    newData.End = moment(newData.Start).add(newData.MonthCount, 'M').format('YYYY-MM-DD');
    newData.methodtype =  'PUT';
    const headers = new HttpHeaders({
      Authorization : 'Bearer ' + this.authService.myRawToken
    });
    return this.http.post(this.ssessionUrl, newData, {headers}).pipe(
      map((response: any) => {
        this.message = response;
      })
    );
  }

  addSettings(newData: any){
    newData.orgid = this.authService.myuser.organizationId;
    const headers = new HttpHeaders({
      Authorization : 'Bearer ' + this.authService.myRawToken
    });
    // console.log(newData);
    return this.http.post(this.settingsUrl, newData, {headers}).pipe(
      map((response: any) => {
        this.message = response;
      })
    );
  }

  getSessions(){
    console.log(this.authService.myuser.organizationId);
    console.log(this.authService.myuser.organizationId);
    const headers = new HttpHeaders({
      Authorization : 'Bearer ' + this.authService.myRawToken
    });
    // const result: any = this.http.get(this.quickcallUrl +
    //   '?table=Sessions' +
    //   '&filter=*' +
    //   '&where=OrganizationId = ' + this.authService.myuser.organizationId + ' ORDER BY Id DESC',
    //   {headers});
    const result: any = this.http.get(this.ssessionUrl, {headers});
    if (result.message === 'Expired token'){
      this.authService.logout();
    }
    return result;
  }

  // getSessionsAll(){
  //   const headers = new HttpHeaders({
  //     Authorization : 'Bearer ' + this.authService.myRawToken
  //   });
  //   const result = this.http.get(this.quickcallUrl +
  //     '?table=Sessions' +
  //     '&filter=*' +
  //     '&where=OrganizationId = ' + this.authService.myuser.organizationId,
  //     {headers});
  //   return result;
  // }

  getSettings(){
    const headers = new HttpHeaders({
      Authorization : 'Bearer ' + this.authService.myRawToken
    });
    // const result = this.http.get(this.quickcallUrl +
    //   '?table=Settings' +
    //   '&filter=*' +
    //   '&where=OrganizationId = ' + this.authService.myuser.organizationId + ' ORDER BY Id DESC LIMIT 1',
    //   {headers});
    const result: any = this.http.get(this.settingsUrl, {headers});
    return result;
  }

  checkFeePaymentForAll(){
    const headers = new HttpHeaders({
      Authorization : 'Bearer ' + this.authService.myRawToken
    });
    const result = this.http.get(this.quickcallUrl +
      '?table=Student s LEFT JOIN Grade g ON g.GradeId = s.GradeId AND g.OrganizationId = s.OrganizationId' +
      '&filter=g.Class, s.StudentID' +
      '&where=s.OrganizationId = ' + this.authService.myuser.organizationId,
      {headers});
    return result;
  }

  checkLeaveForAll(){
    const headers = new HttpHeaders({
      Authorization : 'Bearer ' + this.authService.myRawToken
    });
    const result = this.http.get(this.quickcallUrl +
      '?table=LeaveDetails' +
      '&filter=COUNT(1) as count' +
      '&where=LeaveStatus = 0 AND OrganizationId = ' + this.authService.myuser.organizationId,
      {headers});
    return result;
  }

  closeSession(sessionId){
    const headers = new HttpHeaders({
      Authorization : 'Bearer ' + this.authService.myRawToken
    });
    const result = this.http.get(this.quickcallUrl +
      '?query=UPDATE Sessions SET Status=1 WHERE Id = ' + sessionId + ' AND OrganizationId = ' + this.authService.myuser.organizationId,
      {headers});
    return result;
  }

  deleteSessions(id){
    const headers = new HttpHeaders({
      Authorization : 'Bearer ' + this.authService.myRawToken
    });
    const result = this.http.get(this.quickcallUrl +
      '?query=DELETE from Sessions WHERE Id = ' + id + ' AND OrganizationId = ' + this.authService.myuser.organizationId,
      {headers});
    return result;
  }
}
