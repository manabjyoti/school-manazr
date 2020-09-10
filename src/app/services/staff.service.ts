import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { AuthService } from '../shared/services/auth.service';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})

export class StaffService {
  message: any = '';
  constructor(private http: HttpClient, private authService: AuthService) {
    if (this.authService.myRawToken === ''){
      this.authService.myRawToken = localStorage.getItem('token');
    }
  }
  staffTypeUrl: any = environment.apiURL + 'stafftype-api.php';
  staffUrl: any = environment.apiURL + 'staff-api.php';
  quickcallUrl: any = environment.apiURL + 'quickcall-api.php';
  orgid: number = this.authService.myuser.organizationId;
  // headerDict = {
  //   'Content-Type': 'application/json',
  //   'Authorization': 'Bearer ' + this.rawToken
  // };
  // requestOptions = {
  //   headers: new HttpHeaders(this.headerDict)
  // };
  // headersobject = new HttpHeaders().set('Authorization', 'Bearer ' + localStorage.getItem('token'));

  create(model: any){
    const headers = new HttpHeaders({
      Authorization : 'Bearer ' + this.authService.myRawToken
    });
    model.orgid =  this.authService.myuser.organizationId; // sending organisation id
    console.log(model);
    return this.http.post(this.staffTypeUrl, model, {headers}).pipe(
      map((response: any) => {
        this.message = response;
      })
    );
  }

  editStaffType(model: any){
    const headers = new HttpHeaders({
      Authorization : 'Bearer ' + this.authService.myRawToken
    });
    model.orgid =  this.authService.myuser.organizationId; // sending organisation id
    model.methodtype =  'PUT';
    console.log(model);
    return this.http.post(this.staffTypeUrl, model, {headers}).pipe(
      map((response: any) => {
        this.message = response;
      })
    );
  }

  addStaff(model: any){
    model.orgid =  this.authService.myuser.organizationId;
    return this.http.post(this.staffUrl, model).pipe(
      map((response: any) => {
        this.message = response;
      })
    );
  }

  list(){
    const headers = new HttpHeaders({
      Authorization : 'Bearer ' + this.authService.myRawToken
    });
    const result = this.http.get(this.staffTypeUrl, {headers});
    console.log(result);
    return result;
  }

  deleteStaffType(id){
    const headers = new HttpHeaders({
      Authorization : 'Bearer ' + this.authService.myRawToken
    });
    const data = {id, methodtype:  'DELETE'};
    const result = this.http.post(this.staffTypeUrl, data, {headers});
    // console.log(result);
    return result;
  }

  listStaff(){
    const headers = new HttpHeaders({
      Authorization : 'Bearer ' + this.authService.myRawToken
    });
    return this.http.get(this.staffUrl, {headers});
  }

  getStaffById(id){
    const headers = new HttpHeaders({
      Authorization : 'Bearer ' + this.authService.myRawToken
    });
    return this.http.get(this.staffUrl + '?staffid=' + id, {headers});
  }

  editStaff(newData: any){
    const headers = new HttpHeaders({
      Authorization : 'Bearer ' + this.authService.myRawToken
    });
    return this.http.put(this.staffUrl, newData, {headers}).pipe(
      map((response: any) => {
        this.message = response;
      })
    );
  }

  updateStaff(newData: any, id: number){
    newData.orgid = this.authService.myuser.organizationId;
    newData.ID = id;
    newData.methodtype =  'PUT';
    const headers = new HttpHeaders({
      Authorization : 'Bearer ' + this.authService.myRawToken
    });
    console.log(newData);
    return this.http.post(this.staffUrl, newData, {headers}).pipe(
      map((response: any) => {
        this.message = response;
      })
    );
  }

  listStaffForDropDown(id?){
    const headers = new HttpHeaders({
      Authorization : 'Bearer ' + this.authService.myRawToken
    });
    const result = this.http.get(this.quickcallUrl + '?table=Staff&filter=StaffId,FirstName,LastName&where=StaffId !="' + id + '" AND OrganizationId=' + this.authService.myuser.organizationId, {headers});
    // console.log(result);
    return result;
  }

  getStaffCount(){
    const headers = new HttpHeaders({
      Authorization : 'Bearer ' + this.authService.myRawToken
    });
    const result = this.http.get(this.quickcallUrl + '?table=Staff&filter=COUNT(1) as count&where=OrganizationId=' + this.authService.myuser.organizationId, {headers});
    return result;
  }

}
