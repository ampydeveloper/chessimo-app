import { Injectable } from '@angular/core';
import { FirebaseAnalytics } from '@ionic-native/firebase-analytics/ngx';
import { Platform } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {

  constructor(public firebaseAnalytics: FirebaseAnalytics, public platform: Platform) { }


  purchaseProduct(product) {
    this.firebaseAnalytics.logEvent('purchaseProduct', {product: product.id, })
    .then((res: any) => console.log('openApp',res))
    .catch((error: any) => console.error('openApp',error));
  }


  openApp() {
    if(!this.platform.is('desktop')) {
      this.firebaseAnalytics.logEvent('openApp', {time: new Date()})
        .then((res: any) => console.log('openApp',res))
        .catch((error: any) => console.error('openApp',error));
    }
  }
  
}
