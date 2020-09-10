import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../shared/services/auth.service';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SubjectService {

  message: any = '';
  constructor(private http: HttpClient, private authService: AuthService) { }
  apiUrl: any = environment.apiURL + 'subject-api.php';
  quickcallUrl: any = environment.apiURL + 'quickcall-api.php';
  orgid: number = this.authService.myuser.organizationId;

  list(){
    const headers = new HttpHeaders({
      Authorization : 'Bearer ' + this.authService.myRawToken
    });
    return this.http.get(this.apiUrl, {headers});
  }

  listSubjectsByFilter(filter: any){
    const headers = new HttpHeaders({
      Authorization : 'Bearer ' + this.authService.myRawToken
    });
    return this.http.get(this.apiUrl + '?filter=' + filter, {headers});
  }

  edit(newData: any){
    newData.orgid = this.authService.myuser.organizationId;
    newData.methodtype =  'PUT';
    const headers = new HttpHeaders({
      Authorization : 'Bearer ' + this.authService.myRawToken
    });
    return this.http.post(this.apiUrl, newData, {headers}).pipe(
      map((response: any) => {
        this.message = response;
      })
    );
  }

  assignTeacher(newDataArray: any, staffid: any){
    const newData = { newDataArray, orgid : this.authService.myuser.organizationId, staffid, methodtype: 'PUT' };
    const headers = new HttpHeaders({
      Authorization : 'Bearer ' + this.authService.myRawToken
    });
    return this.http.post(this.apiUrl, newData, {headers}).pipe(
      map((response: any) => {
        this.message = response;
      })
    );
  }

  add(newData: any){
    newData.orgid = this.authService.myuser.organizationId;
    const headers = new HttpHeaders({
      Authorization : 'Bearer ' + this.authService.myRawToken
    });
    return this.http.post(this.apiUrl, newData, {headers}).pipe(
      map((response: any) => {
        this.message = response;
      })
    );
  }

  delete(id){
    const headers = new HttpHeaders({
      Authorization : 'Bearer ' + this.authService.myRawToken
    });
    const data = {id, methodtype:  'DELETE'};
    return this.http.post(this.apiUrl, data, {headers});
    // return this.http.delete(this.apiUrl + '?id=' + id, {headers});
  }

  getSubjectCount(){
    const headers = new HttpHeaders({
      Authorization : 'Bearer ' + this.authService.myRawToken
    });
    const result = this.http.get(this.quickcallUrl +
      '?table=Subject' +
      '&filter=Count(1) as SubjectCount' +
      '&where=OrganizationId = ' + this.authService.myuser.organizationId,
      {headers});
    return result;
  }
}
