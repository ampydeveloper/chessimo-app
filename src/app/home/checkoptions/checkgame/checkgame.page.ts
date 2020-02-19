import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CheckService } from 'src/app/check.service';
import { UserService } from 'src/app/user.service';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-checkgame',
  templateUrl: './checkgame.page.html',
  styleUrls: ['./checkgame.page.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CheckgamePage implements OnInit {

  player1 = 'own';
  player2 = 'ai';
  command = 'start';
  finishmsg = '!! Sergio Won !!';

  constructor(private route: ActivatedRoute,private navCtrl: NavController, public checkService: CheckService, public user: UserService) { 
    this.checkService.view = this;
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.command = params.get('command');
      console.log(this.command);
    });
  }

  ionViewWillLeave(){
    this.pauseForce();
  }

  getPlayer1Name() {
    return this.checkService[this.player1].name;
  }

  getPlayer2Name() {
    return this.checkService[this.player2].name;
  }

  flip() {
    this.checkService.board.flip();
  }
  
  restart() {
    this.checkService.restart();
  }

  tooglePause() {
    if(this.checkService.Paused === false) {
      this.checkService.pause();
    } else {
      this.checkService.resume();
    }
  }

  pauseForce(){
    this.checkService.pause();
  }

  setExtraSize() {
    let fixedContent = 120;
    let infoBox = 90;
    return fixedContent + infoBox;
  }
  
  gameFinished(name) {
    this.finishmsg = name;
    console.log("game finish");
  }

  playagain() {
    this.restart();
  }

  goback() {
    this.navCtrl.back();
  }

}
