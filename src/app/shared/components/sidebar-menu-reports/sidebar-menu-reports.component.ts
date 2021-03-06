import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-sidebar-menu-reports',
  templateUrl: './sidebar-menu-reports.component.html',
  styleUrls: ['../sidebar-menu/sidebar-menu.component.scss']
})
export class SidebarMenuReportsComponent implements OnInit {

  isAdmin = false;
  user: any;

  constructor(public authService: AuthService) {
    if (typeof this.authService.myuser !== 'undefined'){
      this.user = this.authService.myuser;
    } else {
      this.user = localStorage.getItem('user');
    }
    if (this.user.usertype === 'admin'){
      this.isAdmin = true;
    }
    // console.log(this.user);
  }

  ngOnInit(): void {
    this.authService.watchStorage().subscribe((data: string) => {
      // console.log(data);
      this.user = this.authService.myuser;
    });
  }

}
