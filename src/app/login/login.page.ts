import { Router } from '@angular/router';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { UserService } from '../user.service';
import { UserConnectService } from '../user-connect.service';
import { UtilityService } from '../utility.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  encapsulation: ViewEncapsulation.None
})
export class LoginPage implements OnInit {

  // loginForm = {
  //   email: 'goormachtigh.laurens@gmail.com',
  //   password: 'Ta2uchah*',
  // }
  loginForm = {
    email: '',
    password: '',
  }
  constructor(private router: Router,public userConnectService: UserConnectService, public utility: UtilityService, public userService: UserService) { }

  ngOnInit() {
  }

  gotoOptions() {
    this.router.navigate(['/options']);
  }

  login(email, password) {
    const validateEmail = (email) => 
    {
      if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))
      {
        return (true)
      }
      return (false)
    }

    if(validateEmail(email) === false) return this.utility.toast('Please fill proper email');
    if(password.length == 0) return this.utility.toast('Please fill password');

    this.utility.presentLoading('Login...');
    this.userConnectService.login(email, password).subscribe((response: any) => {
      console.log('login page', response);
      if(response.error == false) {
        
        response.password = password;
        this.userConnectService.afterLogin(response);
        console.log(this.userService);

      } 
      this.utility.dismissLoading();
      this.router.navigate(['/']);
    },
    (error: any) => {
      this.utility.dismissLoading();
      this.utility.toast('Connection Problem');
    });
  }
}
