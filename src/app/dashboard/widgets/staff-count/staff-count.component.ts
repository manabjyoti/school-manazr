import { Component, OnInit } from '@angular/core';
import { StaffService } from 'src/app/services/staff.service';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-staff-count',
  templateUrl: './staff-count.component.html',
  styleUrls: ['./staff-count.component.scss']
})
export class StaffCountComponent implements OnInit {
  staffCount: any;

  constructor( private staffService: StaffService, public authService: AuthService) { }

  ngOnInit(): void {
    const user = this.authService.myuser;
    this.staffService.getStaffCount().subscribe(
      (res: any) => {
        this.staffCount = res.data[0].count;

        //  for setting up header
        user.staffCount = this.staffCount === 0 ? false : true;
        this.authService.setItem('user', JSON.stringify(user));
      },
      (err) => {
        console.log(err);
      }
    );
  }

}
