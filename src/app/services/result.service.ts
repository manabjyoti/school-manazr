import { Injectable } from '@angular/core';
import { AuthService } from '../shared/services/auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ResultService {
  message: any = '';
  constructor(private http: HttpClient, private authService: AuthService) { }
  apiUrl: any = environment.apiURL + 'result-api.php';
  orgid: number = this.authService.myuser.organizationId;

  list(gid?){
    const headers = new HttpHeaders({
      Authorization : 'Bearer ' + this.authService.myRawToken
    });
    const params = '?type=marks&session=' + this.authService.myuser.sessionId + (gid !== undefined ? '&gid=' + gid : '');
    return this.http.get(this.apiUrl + params, {headers});
  }

  resultlist(gid?){
    const headers = new HttpHeaders({
      Authorization : 'Bearer ' + this.authService.myRawToken
    });
    // const params = gid !== undefined ? '?gid=' + gid + '&type=result' : '?type=result';
    const params = '?type=result&session=' + this.authService.myuser.sessionId + (gid !== undefined ? '&gid=' + gid : '');
    return this.http.get(this.apiUrl + params, {headers});
  }

  add(newData: any){
    newData.orgid = this.authService.myuser.organizationId;
    if (!this.authService.myuser.sessionId){
      this.message = {status: 0, message: 'No Active Session'};
      return;
    }
    newData.session = this.authService.myuser.sessionId;
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

}
