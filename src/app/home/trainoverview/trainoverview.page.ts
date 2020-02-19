import { TrainDataService } from './../../train-data.service';
import { AppService } from './../../app.service';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-trainoverview',
  templateUrl: './trainoverview.page.html',
  styleUrls: ['./trainoverview.page.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TrainoverviewPage implements OnInit {

  trainings = {};
  
  constructor(
    private router: Router,
    public appService: AppService,
    public trainData: TrainDataService
  ) {
    this.trainings = this.appService.gameTypes.train.trainings;
  }

  ngOnInit() {
  }

  gotoTrainUnits(trainType) {
    console.log(trainType);
    this.router.navigate(['/home/trainoverview/trainunits', {trainType:trainType}]);
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

}
