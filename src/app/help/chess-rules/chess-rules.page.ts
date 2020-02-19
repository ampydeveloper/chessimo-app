import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-chess-rules',
  templateUrl: './chess-rules.page.html',
  styleUrls: ['./chess-rules.page.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ChessRulesPage implements OnInit {

  constructor(
    private router: Router
  ) { }

  ngOnInit() {
  }

  gotoOptions() {
    this.router.navigate(['/options']);
  }

}
