import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';
import { SubjectService } from 'src/app/services/subject.service';

@Component({
  selector: 'app-subject-count',
  templateUrl: './subject-count.component.html',
  styleUrls: ['./subject-count.component.scss']
})
export class SubjectCountComponent implements OnInit {
  subjectCount: number;

  constructor(public authService: AuthService, private subjectService: SubjectService) { }

  ngOnInit(): void {
    const user = this.authService.myuser;
    this.subjectService.getSubjectCount().subscribe(
      (res: any) => {
        this.subjectCount = res.data[0].SubjectCount;

        //  for setting up header
        user.subjectCount = this.subjectCount === 0 ? false : true;
        this.authService.setItem('user', JSON.stringify(user));
      },
      (err) => {
        console.log(err);
      }
    );
  }

}
