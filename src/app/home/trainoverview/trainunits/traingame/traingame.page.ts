import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { UserService } from 'src/app/user.service';
import { TrainService } from 'src/app/train.service';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-traingame',
  templateUrl: './traingame.page.html',
  styleUrls: ['./traingame.page.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TraingamePage implements OnInit {

  player1 = 'own';
  command = 'start';

  isUnitFinished = false;
  comment = '';
  finishmsg = '!! Exercise Finished !!';
  constructor(public trainService: TrainService,
              private router: Router,
              private navCtrl: NavController,
              public user: UserService) {
      this.trainService.view = this;
  }

  ngOnInit() {
    if(this.trainService.ExeList.length == 0) {
      this.router.navigate(['/home/trainoverview']);
    }
  }

  ionViewWillLeave(){
    this.pauseForce();
  }

  getPlayer1Name() {
    return this.trainService[this.player1].name;
  }

  flip() {
    this.trainService.board.flip();
  }
  
  restart() {
    this.trainService.restart();
  }

  tooglePause() {
    if(this.trainService.Paused === false) {
      this.trainService.pause();
    } else {
      this.trainService.resume();
    }
  }

  pauseForce(){
    this.trainService.pause();
  }

  solution() {
    this.trainService.pgn.doTipp();
  }

  setExtraSize() {
    let fixedContent = 112;
    let infoBox = 135;
    return fixedContent + infoBox;
  }

  showUnitFinished(msg) {
    this.finishmsg = msg;
    this.isUnitFinished = true;
  }

  playagain() {
    this.isUnitFinished = false;
    this.restart();
  }

  goback() {
    this.navCtrl.back();
  }

}
