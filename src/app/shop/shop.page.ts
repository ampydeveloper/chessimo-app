import { UtilityService } from 'src/app/utility.service';
import { StoreService } from './../store.service';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { AppService } from '../app.service';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.page.html',
  styleUrls: ['./shop.page.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ShopPage implements OnInit {

  constructor(
    private router: Router,
    private storeService: StoreService,
    public appService: AppService,
    public utility: UtilityService
  ) { 
    
  }

  ngOnInit() {
  }

  gotoOptions() {
    this.router.navigate(['/options']);
  }

  
  restore() {
    this.storeService.store.refresh();
    this.utility.presentLoading('Please wait ...', 3000);
    // this.router.navigate(['']);
  }
}
