import { Router } from '@angular/router';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-about',
  templateUrl: './about.page.html',
  styleUrls: ['./about.page.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AboutPage implements OnInit {

  constructor(
    private router: Router
  ) { }

  ngOnInit() {
  }
  
  gotoOptions() {
    this.router.navigate(['/options']);
  }

  gotoImprint() {
    this.router.navigate(['/about/imprint']);
  }

  gotoLicense() {
    this.router.navigate(['/about/license']);
  }
}
