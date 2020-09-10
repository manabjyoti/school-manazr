import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../shared/services/auth.service';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RoutineService {
  message: any = '';
  constructor(private http: HttpClient, private authService: AuthService) { }
  apiUrl: any = environment.apiURL + 'routine-api.php';
  quickcallUrl: any = environment.apiURL + 'quickcall-api.php';
  orgid: number = this.authService.myuser.organizationId;


addupdate(newData: any){
  newData.orgid = this.authService.myuser.organizationId;
  // newData.session = this.authService.myuser.sessionId;
  console.log(newData);
  const headers = new HttpHeaders({
    Authorization : 'Bearer ' + this.authService.myRawToken
  });
  return this.http.post(this.apiUrl, newData, {headers}).pipe(
    map((response: any) => {
      this.message = response;
    })
  );
}

getTimings(gid){
  const headers = new HttpHeaders({
    Authorization : 'Bearer ' + this.authService.myRawToken
  });
  const result = this.http.get(this.quickcallUrl +
    '?table=Routine' +
    '&filter=Timings' +
    '&where=GradeId = "' + gid + '" AND OrganizationId = ' + this.authService.myuser.organizationId + ' GROUP BY Timings', {headers});
    // '&where=OrganizationId = ' + this.authService.myuser.organizationId + ' GROUP BY Timings', {headers});
  return result;
}

getData(gid){
  const headers = new HttpHeaders({
    Authorization : 'Bearer ' + this.authService.myRawToken
  });
  const result = this.http.get(this.quickcallUrl +
    '?table=Routine' +
    '&filter=*' +
    '&where=GradeId = "' + gid + '" AND OrganizationId = ' + this.authService.myuser.organizationId, {headers});
  return result;
}

getTimingsData(subjectid){
  const headers = new HttpHeaders({
    Authorization : 'Bearer ' + this.authService.myRawToken
  });
  const result = this.http.get(this.quickcallUrl +
    '?table=Routine' +
    '&filter=*' +
    '&where=SubjectId = "' + subjectid + '" AND OrganizationId = ' + this.authService.myuser.organizationId + ' ORDER BY Timings, Day', {headers});
  return result;
}

getRoutineTime(){
  const headers = new HttpHeaders({
    Authorization : 'Bearer ' + this.authService.myRawToken
  });
  const result = this.http.get(this.quickcallUrl +
    '?table=Routine' +
    '&filter=DISTINCT Timings' +
    '&where=OrganizationId = ' + this.authService.myuser.organizationId , {headers});
  return result;
}

}
