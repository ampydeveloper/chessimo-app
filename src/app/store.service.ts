import { UserConnectService } from './user-connect.service';
import { AppService } from 'src/app/app.service';
import { AnalyticsService } from './analytics.service';
import { Injectable } from '@angular/core';
import { InAppPurchase2, IAPProduct } from '@ionic-native/in-app-purchase-2/ngx';
import { Platform } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class StoreService {

  storeInitialRefreshDone: any = {};

  constructor(public platform: Platform,
    public store: InAppPurchase2,
    public analytics: AnalyticsService,
    public appService: AppService,
    public userConnectService: UserConnectService) {

    platform.ready().then(() => {

      if (!platform.is('desktop')) {

        this.store.verbosity = this.store.DEBUG;
        for (const p of this.appService.productsList) {
          let product = { id: p.id, alias: p.alias, type: this.store.NON_CONSUMABLE };
          this.store.register(product);

          this.store.when(p.id).registered((product: IAPProduct) => {
            //console.log('Register' + JSON.stringify(product));
            this.appService.syncProductWithLocal(product, {fromStore: true, fromServer: false});
          });

          this.store.when(p.id).updated((product: IAPProduct) => {
            console.log('Updated' + product.id);
            // this.userConnectService.savePurchasedProduct(product.id);
            this.appService.syncProductWithLocal(product, {fromStore: true, fromServer: false});
          });

          this.store.when(p.id).cancelled((product) => {
            console.error('Purchase was Cancelled');
          });

          this.store.when(p.id).approved((product: IAPProduct) => {
            console.log("Purchase Approved");
            this.userConnectService.savePurchasedProduct(product.id);
            this.appService.syncProductWithLocal(product, {fromStore: true, fromServer: false});
            product.finish();
            this.analytics.purchaseProduct(product);
          });
        }
      }

      this.store.ready(() => {
        console.log('purchase Store is ready');
      });

      // Track all store errors
      this.store.error((err) => {
        console.error('purchase Store Error ' + JSON.stringify(err));
      });


      // Refresh the status of in-app products
      this.store.refresh();

    });
  }
}
