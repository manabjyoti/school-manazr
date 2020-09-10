import { Component, OnInit } from '@angular/core';
import { ClassService } from 'src/app/services/class.service';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-class-count',
  templateUrl: './class-count.component.html',
  styleUrls: ['./class-count.component.scss']
})
export class ClassCountComponent implements OnInit {
  classCount: number;

  constructor(private authService: AuthService, private classService: ClassService) { }

  ngOnInit(): void {
    const user = this.authService.myuser;
    this.classService.getClassCount().subscribe(
      (res: any) => {
        this.classCount = res.data[0].ClassCount;

        //  for setting up header
        user.classCount = this.classCount === 0 ? false : true;
        this.authService.setItem('user', JSON.stringify(user));
      },
      (err) => {
        console.log(err);
      }
    );
  }

}
