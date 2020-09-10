import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../shared/services/auth.service';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  message: any;
  constructor(public http: HttpClient, private authService: AuthService, private router: Router) { }

  studentUrl: any = environment.apiURL + 'student-api.php';
  quickcallUrl: any = environment.apiURL + 'quickcall-api.php';
  orgid: number = this.authService.myuser.organizationId;

  addStudent(model: any){
    model.orgid = this.authService.myuser.organizationId;
    const headers = new HttpHeaders({
      Authorization : 'Bearer ' + this.authService.myRawToken
    });
    return this.http.post(this.studentUrl, model, {headers}).pipe(
      map((response: any) => {
        this.message = response;
        return response;
      })
    );
  }

  editStudent(model: any, id: string){
    model.orgid = this.authService.myuser.organizationId;
    model.sid = id;
    model.methodtype =  'PUT';
    const headers = new HttpHeaders({
      Authorization : 'Bearer ' + this.authService.myRawToken
    });

    return this.http.post(this.studentUrl, model, {headers}).pipe(
      map((response: any) => {
        this.message = response;
      })
    );
  }

  bulkAddUpdateStudent(model: any){
    model.orgid = this.authService.myuser.organizationId;
    const valuesArr = [];
    const fieldsArr = ['StudentID', 'OrganizationId', 'RollNo'];
    const headers = new HttpHeaders({
      Authorization : 'Bearer ' + this.authService.myRawToken
    });
    model.forEach(element => {
      valuesArr.push(`('${element.StudentID}',${model.orgid},${element.RollNo})`);
    });
    const modelData = Object();
    modelData.fields = fieldsArr;
    modelData.values = valuesArr;
    modelData.methodtype =  'PUT';
    // console.log([modelData]);
    return this.http.post(this.studentUrl, modelData, {headers}).pipe(
      map((response: any) => {
        this.message = response;
        return response;
      })
    );
  }

  listStudent(){
    const headers = new HttpHeaders({
      Authorization : 'Bearer ' + this.authService.myRawToken
    });
    const res = this.http.get(this.studentUrl, {headers});
    return res;
  }

  listStudentById(sid: any){
    const headers = new HttpHeaders({
      Authorization : 'Bearer ' + this.authService.myRawToken
    });
    return this.http.get(this.studentUrl + '?sid=' + sid, {headers});
  }

  listStudentByGrade(gid: any){
    const headers = new HttpHeaders({
      Authorization : 'Bearer ' + this.authService.myRawToken
    });
    return this.http.get(this.studentUrl + '?gid=' + gid, {headers});
  }

  getAcademics(sid){
    const headers = new HttpHeaders({
      Authorization : 'Bearer ' + this.authService.myRawToken
    });
    const result = this.http.get(this.quickcallUrl +
      '?table=Marks m JOIN Exams e ON m.ExamId = e.ExamId AND m.OrganizationId = e.OrganizationId JOIN Subject s ON e.SubjectId = s.SubjectId AND e.OrganizationId = s.OrganizationId' +
      '&filter=s.Name as SubjectName, e.SubjectId, e.Name as ExamName,e.Date,e.TotalMarks, e.Weightage, m.Marks' +
      '&where=m.StudentID = "' + sid + '" AND m.OrganizationId = ' +
      this.authService.myuser.organizationId + ' AND m.Session = ' +
      this.authService.myuser.sessionId + ' AND ' +
      's.GradeId = (SELECT GradeId from Student WHERE StudentID = "' + sid +
       '" AND OrganizationId = ' + this.authService.myuser.organizationId + ')',
      {headers});
    return result;
  }

  getAttendanceDates(sid){
    const headers = new HttpHeaders({
      Authorization : 'Bearer ' + this.authService.myRawToken
    });
    // console.log(this.authService.myuser);
    const result = this.http.get(this.quickcallUrl +
      '?table=Attendance a JOIN Student s ON a.GradeId = s.GradeId' +
      '&filter=a.*' +
      '&where=s.StudentID = "' + sid + '" AND a.Date BETWEEN CAST("' + this.authService.myuser.sessionStart +
      '" AS DATE) AND CAST("' + this.authService.myuser.sessionEnd +
      '" AS DATE) AND a.OrganizationId = ' + this.authService.myuser.organizationId,
      {headers});
    return result;
  }

  getStudentCount(){
    const headers = new HttpHeaders({
      Authorization : 'Bearer ' + this.authService.myRawToken
    });
    const result = this.http.get(this.quickcallUrl +
      '?table=Student' +
      '&filter=Count(1) as StudentCount' +
      '&where=OrganizationId = ' + this.authService.myuser.organizationId,
      {headers});
    return result;
  }

  getFeeStatus(sid, cid){
    const headers = new HttpHeaders({
      Authorization : 'Bearer ' + this.authService.myRawToken
    });
    const result = this.http.get(this.quickcallUrl +
      '?query=(SELECT SUM(FeeType.Occurrence) AS FeeCount FROM FeeMaster LEFT JOIN FeeType ON FeeMaster.FeeTypeId = FeeType.ID AND FeeMaster.OrganizationId = FeeType.OrganizationId WHERE FeeMaster.ClassId = "' + cid + '" AND FeeMaster.OrganizationId =' + this.authService.myuser.organizationId + ') UNION ALL (SELECT SUM(Status) FROM FeeDetails WHERE StudentId = "' + sid + '" AND OrganizationId=' + this.authService.myuser.organizationId + ' AND Session =' + this.authService.myuser.sessionId + ')',
      {headers});
    return result;
  }

}
