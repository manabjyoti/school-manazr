import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../shared/services/auth.service';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ExamService {
  message: any = '';
  constructor(private http: HttpClient, private authService: AuthService) { }
  apiUrl: any = environment.apiURL + 'exam-api.php';
  quickcallUrl: any = environment.apiURL + 'quickcall-api.php';
  orgid: number = this.authService.myuser.organizationId;

  list(){
    const headers = new HttpHeaders({
      Authorization : 'Bearer ' + this.authService.myRawToken
    });
    return this.http.get(this.apiUrl, {headers});
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

  edit(newData: any){
    newData.orgid = this.authService.myuser.organizationId;
    const headers = new HttpHeaders({
      Authorization : 'Bearer ' + this.authService.myRawToken
    });
    newData.methodtype =  'PUT';
    return this.http.post(this.apiUrl, newData, {headers}).pipe(
      map((response: any) => {
        this.message = response;
      })
    );
  }

  getExamDetails(){
    const headers = new HttpHeaders({
      Authorization : 'Bearer ' + this.authService.myRawToken
    });
    const result = this.http.get(this.quickcallUrl +
      '?table=Exams e LEFT JOIN Subject s ON e.SubjectId = s.SubjectId AND e.OrganizationId = s.OrganizationId' +
      '&filter=e.*, s.SubjectGroup' +
      '&where=e.OrganizationId = ' + this.authService.myuser.organizationId + ' ORDER BY s.SubjectGroup',
      {headers});
    return result;
  }

  getExamsByGrade(gradeId){
    const headers = new HttpHeaders({
      Authorization : 'Bearer ' + this.authService.myRawToken
    });
    const result = this.http.get(this.quickcallUrl +
      '?table=Exams LEFT JOIN Subject ON Subject.SubjectId = Exams.SubjectId LEFT JOIN Grade ON Subject.GradeId = Grade.GradeId' +
      '&filter=Exams.*, Subject.SubjectGroup, Subject.Optional' +
      '&where=Exams.OrganizationId = ' + this.authService.myuser.organizationId + ' AND Grade.GradeId ="' + gradeId + '"',
      {headers});
    return result;
  }

  // SELECT Exams.* FROM Exams LEFT JOIN Subject ON Subject.SubjectId = Exams.SubjectId
  // LEFT JOIN Grade ON Subject.GradeId = Grade.GradeId WHERE Exams.OrganizationId = 116 AND Grade.GradeId = 'G_016'

}
