import { Router } from '@angular/router';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { UserConnectService } from '../user-connect.service';
import { UserService } from '../user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ProfilePage implements OnInit {

  constructor(
    public userService: UserService,
    public router: Router, 
    public userConnectService: UserConnectService
  ) { }

  ngOnInit() {
  }

  logout() {
    this.router.navigate(['/home']);
    this.userConnectService.logout()
  }

}
