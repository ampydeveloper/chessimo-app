import { AppService } from './../../../app.service';
import { Router } from '@angular/router';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TrainService } from 'src/app/train.service';
import { UtilityService } from 'src/app/utility.service';

@Component({
  selector: 'app-trainunits',
  templateUrl: './trainunits.page.html',
  styleUrls: ['./trainunits.page.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TrainunitsPage implements OnInit {

  trainType: any = {};
  title: any = "Tactics";
  Units: Array<any> = [];
  isPurchased: boolean = false;

  constructor(private router: Router, 
              private appService: AppService, 
              private route: ActivatedRoute,
              public utility: UtilityService,
              public trainService: TrainService) { 
              
  }


  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.trainType = this.appService.gameTypes.train.trainings[params.get('trainType')];
     
      this.isPurchased = this.trainType.isPurchased();
      console.log("isPurchased", this.isPurchased); 
      
      this.title = this.trainType.name;
      console.log(this.trainType.name);
      // this.title = params.get('title');
      // let CategoryId = this.trainType.id;
      
      // console.log(this.Units);
    });
  }

  gotoOptions() {
    this.router.navigate(['/options']);
  }

  gotoTrainGame(l) {
    console.log(l);
    this.trainService.loadExe(l).then( res => {
      if(res === true) {
       this.router.navigate(['/home/trainoverview/trainunits/traingame']);
       return
      }
    
      this.utility.toast("Error in loading game, please try again");
    })
    
  }

}
