import { UtilityService } from 'src/app/utility.service';
import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import Product from './product';
import { StoreService } from 'src/app/store.service';
import { Router } from '@angular/router';
import { AppService } from 'src/app/app.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ProductComponent implements OnInit {

  @Input() product: Product;
  constructor(public storeService: StoreService, public appService: AppService, public utility: UtilityService, public router: Router) { }

  ngOnInit() {
  
  }

  order(product) {
    
    if(product.valid === true) {
      if(!product.owned === true) { 
        //if(product.canPurchase !== true) {
          this.utility.presentLoading("please wait...", 3000);
          // this.router.navigate(['']);

          this.storeService.store.order(product.id).then( res => {
            // this.utility.toast(res);
            console.log("on click to purchase", res);
          }).error( (res) => {
            // this.utility.toast(res);
            console.log('purchased error', res);
          })
        //} else {
         // this.utility.toast('Not Available For Purchased');
        //}
      } else {
        this.utility.toast('Already Purchased');
      }
    } else {
        this.utility.toast('Invaild Product');
    }
  }
}
