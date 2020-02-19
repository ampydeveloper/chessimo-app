import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-help',
  templateUrl: './help.page.html',
  styleUrls: ['./help.page.scss'],
  encapsulation: ViewEncapsulation.None
})
export class HelpPage implements OnInit {

  constructor(
    private router: Router
  ) { }

  ngOnInit() {
  }

  gotoOptions() {
    this.router.navigate(['/options']);
  }

  gotoChessRules() {
    this.router.navigate(['/help/chess-rules']);
  }
  gotoChessTips() {
    this.router.navigate(['/help/chess-tips']);
  }
  gotoGameDatabase() {
    this.router.navigate(['/help/game-database']);
  }
  gotoHowToTrain() {
    this.router.navigate(['/help/how-to-train']);
  }

}
