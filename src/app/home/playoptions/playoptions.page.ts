import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { PlayService } from 'src/app/play.service';

@Component({
  selector: 'app-playoptions',
  templateUrl: './playoptions.page.html',
  styleUrls: ['./playoptions.page.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PlayoptionsPage implements OnInit {

  mintues = [];
  constructor(private router : Router,  public playService: PlayService) {
    this.mintues = Array(100).fill(0, 0, 100).map((x,i)=>i +1 );
   }

  ngOnInit() {
  }

  startgame() {
    this.router.navigate(['/home/playoptions/playgame', {command:'start'}]);
  }

  continue() {
    this.router.navigate(['/home/playoptions/playgame', {command:'continue'}]);
  }

}
