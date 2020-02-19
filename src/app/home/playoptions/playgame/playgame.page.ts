import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { UserService } from 'src/app/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { PlayService } from 'src/app/play.service';
import { NavController } from '@ionic/angular';

declare var $;
@Component({
  selector: 'app-playgame',
  templateUrl: './playgame.page.html',
  styleUrls: ['./playgame.page.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PlaygamePage implements OnInit {


  player1 = 'own';
  player2 = 'ai';
  command = 'start';
  finishmsg = 'Player 1';
  constructor(private route: ActivatedRoute,private navCtrl: NavController, public playService: PlayService, public user: UserService) { 
    this.playService.view = this;
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
    return this.playService[this.player1].name;
  }

  getPlayer2Name() {
    return this.playService[this.player2].name;
  }

  flip() {
    this.playService.board.flip();
  }
  
  restart() {
    this.playService.restart();
  }

  tooglePause() {
    if(this.playService.Paused === false) {
      this.playService.pause();
    } else {
      this.playService.resume();
    }
  }

  pauseForce(){
    this.playService.pause();
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
