import { Router } from '@angular/router';
import { Injectable, NgZone } from '@angular/core';
import { UserService } from './user.service';
import Product from './components/product/product';

declare var $;
@Injectable({
  providedIn: 'root'
})
export class AppService {

  apiurl = {
    base: 'https://api.chessimo.com',
  };

  isPurchased(products: Array<any>) {

    let ret = false; 

    for( const p of products) {
      console.log(p);
      if(typeof p.owned != 'undefined')
      {
        console.log(p.owned);
        if(p.owned == true) ret = true; 
      }
    }
  
    return ret;
  }

  productsList: Array<any> = [
    { name: "All Modules", description: "Chessimo All-in-one package", price: '0.00', image: '0.jpg', 
      id: 'de.chessimo.app.all', alias: 'all', owned: false,  type: "non consumable", storeProduct: {}
    },
    { name: "Tactics", description: "301 ways to perfect your tactics", price: '0.00', image: '1.jpg', 
      id: 'de.chessimo.app.tactics', alias: 'tactics', owned: false, type: "non consumable" , storeProduct: {} },
    { name: "Strategies", description: "148 exp, for competition-proof strategies", price: '0.00', image: '2.jpg', 
      id: 'de.chessimo.app.strategies', alias: 'strategies', owned: false, type: "non consumable" , storeProduct: {}  },
    { name: "Endgames", description: "148 additional examples for endgame situations", price: '0.00', image: '3.jpg', 
      id: 'de.chessimo.app.endgames', alias: 'endgames', owned: false, type: "non consumable", storeProduct: {} },
    { name: "Commented Endgames", description: "191 endgames, commented on by Grandmaster Gilberto Milos", price: '0.00', image: '4.jpg' ,
      id: 'de.chessimo.app.commented', alias: 'openings', owned: false, type: "non consumable", storeProduct: {} },
    { name: "Openings", description: "Chessimo shows with pratical exercises how to prepare the  duel`s finale from the very begining ", price: '0.00', image: '5.jpg',
      id: 'de.chessimo.app.openings', alias: 'commented', owned: false, type: "non consumable", storeProduct: {} },
  ];

  // products: Array<Product> = [];

  gameTypes: any = {};

  // Old
  CHO_CAT_ALL = -1;
  CHO_CAT_TACTICS = 0;
  CHO_CAT_STRATEGY = 1;
  CHO_CAT_ENDGAME = 2;
  CHO_CAT_COMMENTED_ENDGAME = 3;
  CHO_CAT_OPENING = 4;

  ONE_MINUTE = 60000;
  ONE_HOUR = 3600000;

  EVENT_USER_PROFILE_UPDATED = 'user_profile_update';
  EVENT_TRAIN_DATA_UPDATED = 'traindata_update';
  EVENT_SHOP_PRODUCT_UPDATED = 'shop_product_update';

  dataBaseURL: "traindata/";
  ui: null;
  traindata: null;
  gamedb: null;
  langCode: "de";
  aiPlayer: null; // white; black or null (if there is none)
  docWidth: -1;
  docHeight: -1;
  twoColumnLayout: false;
  currentBoardEl: null;
  trainmappingData: null;
  trainfileMetaData: null;
  activeCategory: 0;
  activeModule: 0;
  activeUnit: 0;
  activeExercise: 0;
  persistence: null;
  events: null;
  viewOptions: null;
  currentChessimoView: null;

  defaultPlayerOptions = {name:null, time:17, extraTime:7};

  // Old END


  constructor(private zone:NgZone) { 

    this.syncProductFromLocal();
    // for(const p of this.productsList) {
    //   let pro: Product;
    //   let lp: Product = JSON.parse(localStorage.getItem(p));
    //   if( lp == null)
    //   {
    //     pro = new Product(p);
    //   }
    //   else {
    //     pro = lp;
    //   }

    //   this.products.push(pro);
    // }



    this.gameTypes = {
      train: {
        name: 'Train', brief: 'Improve Your chess with the chessimo method.',
        trainings : {
          tactics: {
              id: 0, name: 'Tactics', percentage: '0', brief: 'Buy Tactis units', description: 'Try 3 Tactics units for free or buy additional exercises below', 
              levels: [{name: 'Unit 1', category: 0, module: 0, unit: 0}, {name: 'Unit 2', category: 0, module: 0, unit: 1}, {name: 'Unit 3', category: 0, module: 0, unit: 2}],
              products: [this.productsList[1], this.productsList[0]],
              isPurchased: () => this.isPurchased([this.productsList[1], this.productsList[0]])
          },
  
          strategies: {
              id: 1, name: 'Strategies', percentage: '0', brief: 'Buy Strategies units', description: 'Try 3 Strategies units for free or buy additional exercises below', 
              levels: [{name: 'Unit 1', category: 1, module: 0, unit: 0}, {name: 'Unit 2', category: 1, module: 0, unit: 1}, {name: 'Unit 3', category: 1, module: 0, unit: 2}],
              products: [this.productsList[2], this.productsList[0]],
              isPurchased: () => this.isPurchased([this.productsList[2], this.productsList[0]])
          },
  
          endgames: {
              id: 2, name: 'Endgames', percentage: '0', brief: 'Buy Endgames units', description: 'Try 3 Endgames units for free or buy additional exercises below', 
              levels: [{name: 'Unit 1', category: 2, module: 0, unit: 0}, {name: 'Unit 2', category: 2, module: 0, unit: 1}, {name: 'Unit 3', category: 2, module: 0, unit: 2}],
              products: [this.productsList[3], this.productsList[0]],
              isPurchased: () => this.isPurchased([this.productsList[3], this.productsList[0]])
          },
  
          commentedEndgames: {
              id: 3, name: 'Commented Endgames', percentage: '0',  brief: 'Buy Commented units', description: 'Try 3 Commented units for free or buy additional exercises below', 
              levels: [{name: 'Unit 1', category: 3, module: 0, unit: 0}, {name: 'Unit 2', category: 3, module: 0, unit: 1}, {name: 'Unit 3', category: 3, module: 0, unit: 2}],
              products: [this.productsList[4], this.productsList[0]],
              isPurchased: () => this.isPurchased([this.productsList[4], this.productsList[0]])
          },
  
          openings: {
              id: 4, name: 'Openings', percentage: '0',  brief: 'Buy Openings units', description: 'Try 3 Openings units for free or buy additional exercises below', 
              levels: [{name: 'Accepted', category: 4, module: 0, unit: 0}, {name: 'Fisher Variation', category: 4, module: 0, unit: 1}, {name: 'Declined', category: 4, module: 0, unit: 1}],
              products: [this.productsList[5], this.productsList[0]],
              isPurchased: () => this.isPurchased([this.productsList[5], this.productsList[0]])
          }
        }
      },
    check: {name: 'Check', brief: 'Test your skills against the Stockfish Chess engine.'},
    play : {name: 'Play',  brief: 'Compete with partner, One-on-One.'}
    };

    // OLD
      this.docWidth = $( window ).width();
      this.docHeight = $( window ).height();
    // OLD END
  }

  public asIsOrder(a, b) {
    const aStepId = parseInt(a.key, 10);
    const bStepId = parseInt(b.key, 10);
    return aStepId > bStepId ? 1 : (bStepId > aStepId ? -1 : 0);
  }

  syncProductsWithLocal() {
    for(const p of this.productsList) {
      localStorage.setItem(p.id, JSON.stringify(p));
    }
  }

  syncProductWithLocal(product, from: {fromStore: boolean, fromServer: boolean}) {
    console.log(product);
    for(const i in this.productsList){
      let p = this.productsList[i];

      if(p.id == product.id) {
        this.zone.run (() => {
          this.productsList[i].price = product.price;
          if(!this.productsList[i].owned) this.productsList[i].owned = product.owned; 
          if(from.fromStore === true) {
            this.productsList[i].storeProduct = product;
          }
        })
        
        localStorage.setItem(this.productsList[i].id, JSON.stringify(this.productsList[i]));
        console.log("product sync with local");
      }
    }
  }

  syncProductFromLocal() {
    for(let i in this.productsList) {
      
      let product = localStorage.getItem(this.productsList[i].id);
      if(product != null) {
        this.productsList[i] = JSON.parse(product);
      }
    }
  }
}
