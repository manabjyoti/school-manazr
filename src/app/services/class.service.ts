import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../shared/services/auth.service';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { startCase } from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class ClassService {

  message: any = '';
  constructor(private http: HttpClient, private authService: AuthService) { }
  classUrl: any = environment.apiURL + 'class-api.php';
  quickcallUrl: any = environment.apiURL + 'quickcall-api.php';
  orgid: number = this.authService.myuser.organizationId;

  listClass(){
    const headers = new HttpHeaders({
      Authorization : 'Bearer ' + this.authService.myRawToken
    });
    return this.http.get(this.classUrl, {headers});
  }

  deleteClass(id){
    const headers = new HttpHeaders({
      Authorization : 'Bearer ' + this.authService.myRawToken
    });
    const data = {id, methodtype:  'DELETE'};
    return this.http.post(this.classUrl, data, {headers});
    // return this.http.delete(this.classUrl + '?id=' + id, {headers});
  }

  editGrade(newData: any){
    newData.orgid = this.authService.myuser.organizationId;
    const headers = new HttpHeaders({
      Authorization : 'Bearer ' + this.authService.myRawToken
    });
    newData.Name = startCase(newData.Name);
    newData.methodtype =  'PUT';
    return this.http.post(this.classUrl, newData, {headers}).pipe(
      map((response: any) => {
        this.message = response;
      })
    );
  }

  addGrade(newData: any){
    newData.orgid = this.authService.myuser.organizationId;
    const headers = new HttpHeaders({
      Authorization : 'Bearer ' + this.authService.myRawToken
    });
    newData.Name = startCase(newData.Name);
    return this.http.post(this.classUrl, newData, {headers}).pipe(
      map((response: any) => {
        this.message = response;
      })
    );
  }

  getClassCount(){
    const headers = new HttpHeaders({
      Authorization : 'Bearer ' + this.authService.myRawToken
    });
    const result = this.http.get(this.quickcallUrl +
      '?table=Class' +
      '&filter=Count(1) as ClassCount' +
      '&where=OrganizationId = ' + this.authService.myuser.organizationId,
      {headers});
    return result;
  }
}
