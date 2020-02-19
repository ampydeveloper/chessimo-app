import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AppService } from 'src/app/app.service';
import { UserService } from 'src/app/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header-buttons',
  templateUrl: './header-buttons.component.html',
  styleUrls: ['./header-buttons.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class HeaderButtonsComponent implements OnInit {

  constructor(public appService: AppService, public userService: UserService, private router: Router) { }

  ngOnInit() {}
  
  profilePic() {
    if(this.userService.profilePicData == null) return "url(/assets/images/avatarPlaceholder.png)";
    return this.userService.profilePicData;
  }

  
  // Naviagtation
  gotoLogin() {
    if(this.userService.type == 'guest') {
      return this.router.navigate(['/login']);
    }

    return this.router.navigate(['/profile']);
  }

  gotoOptions() {
    this.router.navigate(['/options']);
  }

}
