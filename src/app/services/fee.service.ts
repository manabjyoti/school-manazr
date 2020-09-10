import { Injectable } from '@angular/core';
import { AuthService } from '../shared/services/auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FeeService {

  message: any;
  feeTypeUrl: any = environment.apiURL + 'feetype-api.php';
  feeUrl: any = environment.apiURL + 'fee-api.php';
  feeMasterUrl: any = environment.apiURL + 'feemaster-api.php';
  quickcallUrl: any = environment.apiURL + 'quickcall-api.php';
  orgid: number = this.authService.myuser.organizationId;

  constructor( private authService: AuthService, private http: HttpClient) { }

  listFeeType(){
    const headers = new HttpHeaders({
      Authorization : 'Bearer ' + this.authService.myRawToken
    });
    const result = this.http.get(this.feeTypeUrl, {headers});
    return result;
  }

  listFeeDetails(sid, cid){
    const headers = new HttpHeaders({
      Authorization : 'Bearer ' + this.authService.myRawToken
    });
    const result = this.http.get(this.feeUrl + '?sid=' + sid + '&cid=' + cid + '&session=' + this.authService.myuser.sessionId, {headers});
    return result;
  }

  listFeeMaster(){
    const headers = new HttpHeaders({
      Authorization : 'Bearer ' + this.authService.myRawToken
    });
    const result = this.http.get(this.feeMasterUrl, {headers});
    return result;
  }

  addFeeType(model: any){
    const headers = new HttpHeaders({
      Authorization : 'Bearer ' + this.authService.myRawToken
    });
    model.orgid =  this.authService.myuser.organizationId; // sending organisation id
    // console.log(model);
    return this.http.post(this.feeTypeUrl, model, {headers}).pipe(
      map((response: any) => {
        this.message = response;
      })
    );
  }

  editFeeType(model: any){
    const headers = new HttpHeaders({
      Authorization : 'Bearer ' + this.authService.myRawToken
    });
    model.orgid =  this.authService.myuser.organizationId; // sending organisation id
    // console.log(model);
    model.methodtype =  'PUT';
    return this.http.post(this.feeTypeUrl, model, {headers}).pipe(
      map((response: any) => {
        this.message = response;
      })
    );
  }

  addUpdateFee(model: any){
    const headers = new HttpHeaders({
      Authorization : 'Bearer ' + this.authService.myRawToken
    });
    if (!this.authService.myuser.sessionId){
      this.message = {status: 0, message: 'No Active Session'};
      return;
    }
    model.session = this.authService.myuser.sessionId;
    model.orgid =  this.authService.myuser.organizationId; // sending organisation id
    // console.log(model);
    return this.http.post(this.feeUrl, model, {headers}).pipe(
      map((response: any) => {
        this.message = response;
      })
    );
  }

  addUpdateFeeMaster(model: any){
    const headers = new HttpHeaders({
      Authorization : 'Bearer ' + this.authService.myRawToken
    });
    model.orgid =  this.authService.myuser.organizationId; // sending organisation id
    console.log(model);
    return this.http.post(this.feeMasterUrl, model, {headers}).pipe(
      map((response: any) => {
        this.message = response;
      })
    );
  }

  deleteFeeType(id){
    const headers = new HttpHeaders({
      Authorization : 'Bearer ' + this.authService.myRawToken
    });
    const data = {id, methodtype:  'DELETE'};
    return this.http.post(this.feeTypeUrl, data, {headers});
    // return this.http.delete(this.feeTypeUrl + '?id=' + id, {headers});
  }
  deleteFeeMaster(id: number){
    const headers = new HttpHeaders({
      Authorization : 'Bearer ' + this.authService.myRawToken
    });
    const data = {id, methodtype:  'DELETE'};
    return this.http.post(this.feeMasterUrl, data, {headers});
    // return this.http.delete(this.feeMasterUrl + '?id=' + id, {headers});
  }

  getCollectionStats(){
    const headers = new HttpHeaders({
      Authorization : 'Bearer ' + this.authService.myRawToken
    });
    const staffId = this.authService.myuser.userId;
    const result = this.http.get(this.quickcallUrl +
      '?table=Sessions LEFT JOIN FeeDetails ON Sessions.Id = FeeDetails.Session AND Sessions.OrganizationId = FeeDetails.OrganizationId' +
      '&filter=Sessions.Name, SUM(FeeDetails.CollectedAmount) AS Collection, FeeDetails.Session' +
      '&where=FeeDetails.OrganizationId = ' + this.authService.myuser.organizationId + ' GROUP BY FeeDetails.Session', {headers});
    return result;
  }
}
