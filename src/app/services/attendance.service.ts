import { Injectable } from '@angular/core';
import { AuthService } from '../shared/services/auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import * as moment from 'moment';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AttendanceService {

  message: any;
  attendanceUrl: any = environment.apiURL + 'attendance-api.php';
  orgid: number = this.authService.myuser.organizationId;

  constructor( private authService: AuthService, private http: HttpClient) { }

  addUpdateAttendance(model: any){
    const headers = new HttpHeaders({
      Authorization : 'Bearer ' + this.authService.myRawToken
    });
    model.orgid =  this.authService.myuser.organizationId; // sending organisation id
    model.Date = moment(model.Date).format('YYYY-MM-DD');
    model.StaffId = this.authService.myuser.userId;
    console.log(model);
    return this.http.post(this.attendanceUrl, model, {headers}).pipe(
      map((response: any) => {
        this.message = response;
      })
    );
  }

  getAttendance(GradeId, Date){
    const headers = new HttpHeaders({
      Authorization : 'Bearer ' + this.authService.myRawToken
    });
    return this.http.get(this.attendanceUrl + '?GradeId=' + GradeId + '&Date=' + moment(Date).format('YYYY-MM-DD'), {headers});
  }

  getAllAttendance(GradeId){
    const headers = new HttpHeaders({
      Authorization : 'Bearer ' + this.authService.myRawToken
    });
    return this.http.get(this.attendanceUrl + '?GradeId=' + GradeId, {headers});
  }
}
