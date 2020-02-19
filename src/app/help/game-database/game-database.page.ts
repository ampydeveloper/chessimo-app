import { TrainDataService } from './../../train-data.service';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-game-database',
  templateUrl: './game-database.page.html',
  styleUrls: ['./game-database.page.scss'],
  encapsulation: ViewEncapsulation.None
})
export class GameDatabasePage implements OnInit {


  constructor(public traindata: TrainDataService) {
    
  }

  ngOnInit() {
  }

}
