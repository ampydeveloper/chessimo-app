import { Router } from '@angular/router';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CheckService } from 'src/app/check.service';
import { EloService } from 'src/app/elo.service';

@Component({
  selector: 'app-checkoptions',
  templateUrl: './checkoptions.page.html',
  styleUrls: ['./checkoptions.page.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CheckoptionsPage implements OnInit {

  mintues = [];
  Elo = 500;
  aiElo: Number = 850;

  constructor(private router : Router, public checkService: CheckService,public eloService: EloService) {
    this.mintues = Array(100).fill(0, 0, 100).map((x,i)=>i + 1);
   }

  ngOnInit() {
    this.Elo = this.eloService.getELO();
    this.aiElo = Number(this.eloService.getKILevelBasedOnELO(this.Elo));
    console.log(this.aiElo);
  }

  ionViewDidEnter() {
    this.Elo = this.eloService.getELO();
    this.aiElo = Number(this.eloService.getKILevelBasedOnELO(this.Elo));
    console.log(this.aiElo);
  }

  startgame() {
    this.router.navigate(['/home/checkoptions/checkgame', {command:'start'}]);
  }

  continue() {
    this.router.navigate(['/home/checkoptions/checkgame', {command:'continue'}]);
  }

  gotoElo() {
    this.router.navigate(['/home/checkoptions/elo-history']);
  }
}
