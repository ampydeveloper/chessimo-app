import { AppService } from 'src/app/app.service';
import { Injectable } from '@angular/core';
import * as moment from 'moment';
@Injectable({
  providedIn: 'root'
})
export class UserService {

  name: any = '';
  email: any = '';
  password: any = '';
  profilePicData: any = null;
  token: any = '';
  type: any = 'guest';
  user_products: Array<any> = [];
  
  trainingSetting: any = {
    startDate: "01/01/2020",
    endDate  : "12/31/2020",
    trainSolutionTries: "3",
    trainTimePerExercise: "3",
  };
  gameSetting: any = {
    soundEnabled: 1,
    whiteAlwaysSouth: 0,
    showSergio: 1,
    autoloadNextExercise: 1,
    boardSet : "E",
    pieceSet : "E"
  };

  defaultUser: any = {
    name:  '',
    email: '',
    password: '',
    token: '',
    type: 'guest',
    user_products: [],
    trainingSetting: {
      startDate: "01/01/2020",
      endDate  : "12/31/2020",
      trainSolutionTries: "3",
      trainTimePerExercise: "3",
    },
    gameSetting: {
      soundEnabled: 1,
      whiteAlwaysSouth: 0,
      showSergio: 1,
      autoloadNextExercise: 1,
      boardSet: "E",
      pieceSet: "E"
    },
  };
  
  constructor(public appService: AppService) { 
    this.loadFromLocal();
  }

  loadDefaults() {
    this.storeToLocal();
  }

  loadFromLocal() {
    let localuser = localStorage.getItem('user');
    
    if(localuser == null) {
      let cdate = moment().format('l');
      let edate = moment().add(1, 'years').add(9, 'days').format('l');

      this.defaultUser.trainingSetting.startDate = cdate;
      this.defaultUser.trainingSetting.endDate = edate;
      this.trainingSetting.startDate = cdate;
      this.trainingSetting.endDate = edate;

      console.log(cdate, edate);
      
      this.loadDefaults();
    } else {
      Object.assign(this, JSON.parse(localuser));
    }

    for(let p of this.appService.productsList) {
      if(this.user_products.includes(p.id)) {
        p.owned = true;
      }
    }
    console.log(this);
  }

  storeToLocal() {
    let newuser: any = {};
    let e = this;
    for(let i in e)
    {
      if(i != 'appService') {
        newuser[i] = e[i];
      }
    }

    console.log(newuser);
    localStorage.setItem('user', JSON.stringify(newuser));
  }

  save() {
    this.storeToLocal();
  }

  getName() {
    if(this.name == ''){
      return 'You'
    }

    return this.name;
  }
}
