import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppService } from '../app.service';
import { FirebaseAnalytics } from '@ionic-native/firebase-analytics/ngx';

declare var $;
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  encapsulation: ViewEncapsulation.None
})
export class HomePage {

  constructor(
    private router: Router,
    public appService: AppService,
    public firebaseAnalytics: FirebaseAnalytics,
  ) {

  }

  ionViewDidEnter() {

    let height = $('.upper-body').innerHeight() /3;
    let width = $('.upper-body').innerWidth() /2;
    let size = 0;
    if(height > width) size = width;
    else size = height;

    $('.circleTab').width(size - 16); 
    $('.circleTab').height(size - 16);
  }


  gotoOptions() {
    this.router.navigate(['/options']);
  }

  gotoShop() {
    this.router.navigate(['/shop']);
  }

  gotoHelp() {
    this.router.navigate(['/help']);
  }

  gotoAbout() {
    this.router.navigate(['/about']);
  }

  gotoInfo() {
    this.router.navigate(['/shop']);
  }

  gotoTrainOverview() {
    this.router.navigate(['/home/trainoverview']);
  }

  gotoCheckOptions() {
    this.router.navigate(['/home/checkoptions']);
  }

  gotoPlayOptions() {
    this.router.navigate(['/home/playoptions']);
  }

}
