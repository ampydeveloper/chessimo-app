import { AppService } from 'src/app/app.service';
import { TrainDataService } from './train-data.service';
import { Injectable } from '@angular/core';
import { UserService } from './user.service';
import { RestApiService } from './rest-api.service';

@Injectable({
  providedIn: 'root'
})
export class UserConnectService {

  serveData: any = [];
  constructor(public userService: UserService, public restApi: RestApiService, public trainData: TrainDataService, public appService: AppService) { 
    
  }


  init() {
    console.log('user-connect init called');
    this.userService.loadFromLocal();
    if(this.userService.type == 'user') {
      this.login(this.userService.email, this.userService.password).subscribe((response: any) => {
        console.log("init response");
        if(response.error == true) {
          this.logout();
        } else {
          response.password = this.userService.password;
          this.afterLogin(response);
        }
      });
    }
  }

  login(email, password) {
    console.log(email, password);
    let response = this.restApi.post('/auth', {email:email, pass: password});
    return response;
  }  


  logout() {
    Object.assign(this.userService, this.userService.defaultUser);
    localStorage.clear();
    this.userService.storeToLocal();
    this.trainData.getSolvedExercisesPercentOverall();
  }

  //
  getUserDetails() {
    if( this.userService.type != 'user') return false;
    console.log('getUserDetails');
    this.restApi.post('/user-details', {token: this.userService.token}).subscribe((response:any) => {
      if(response.status == 'ok') {
        this.userService.name = response.success.username;
        this.userService.user_products = response.success.user_products;
        for(let p of this.appService.productsList) {
            if(this.userService.user_products.includes(p.id)) {
              p.owned = true;
            }
        }

        this.appService.syncProductsWithLocal();
        // console.log(this.userService.name);
      }
    });
  }

  savePurchasedProduct(product_id) {
    if( this.userService.type != 'user') return false;
    this.restApi.post('/products-purchased', {token: this.userService.token, product_id: product_id}).subscribe((response:any) => {
      if(response.status == 'ok') {
        for( const p of this.appService.productsList) {
          if(p.id == product_id) {
            p.owned = true;
          }
        }
        // this.userService.name = response.success.username;
        // console.log(this.userService.name);
      }
    });
  }

  getTrainingDates() {
    if( this.userService.type != 'user') return false;
    console.log('getTrainingDates');
    this.restApi.post('/begin_date', {token: this.userService.token}).subscribe((response:any) => {
      if(response.error == 'ok') {

        const format = (date)=> {
          let dd = date.getDate();
          let mm = date.getMonth()+1; 
          const yyyy = date.getFullYear();
          if(dd<10) 
          {
              dd=`0${dd}`;
          } 

          if(mm<10) 
          {
              mm=`0${mm}`;
          } 
          return `${mm}/${dd}/${yyyy}`;
        };
        
        let startDate = new Date(response.start_date*1000);
        let endDate = new Date(response.end_date*1000);
    
        this.userService.trainingSetting.startDate = format(startDate);
        this.userService.trainingSetting.endDate = format(endDate);
      }
    });
  }

  getExe(data) {
    if( this.userService.type != 'user') return false;
    data.token = this.userService.token;
    return new Promise((resolve, reject) => {
      this.restApi.post('/get-exercise-number', data).subscribe((response:any) => {
        
        this.serveData[data.theme_number] = [];
        response.data.forEach(element => {
          if( typeof this.serveData[data.theme_number] == 'undefined') this.serveData[data.theme_number] = [];
          if( typeof this.serveData[data.theme_number][element.module_number] == 'undefined') this.serveData[data.theme_number][element.module_number] = [];
          if( typeof this.serveData[data.theme_number][element.module_number][element.unit_number] == 'undefined') this.serveData[data.theme_number][element.module_number][element.unit_number] = [];
          if( typeof this.serveData[data.theme_number][element.module_number][element.unit_number][element.exercise_number] == 'undefined') this.serveData[data.theme_number][element.module_number][element.unit_number][element.exercise_number] = [];
          this.serveData[data.theme_number][element.module_number][element.unit_number][element.exercise_number] = {
            timeperexperSec: 0,
            unitTimer: Number(element.study_time),
            solved_date: Number(element.solved_date)
          }
        });
        
        // console.log(this.serveData);
        this.serveData[data.theme_number].forEach( (module, moduleIndex) => {
          module.forEach( (unit, unitIndex) => {
            let hisData = this.trainData.getLocalUnit({category: data.theme_number, module: moduleIndex, unit: unitIndex});
            if(hisData == null) hisData = [];
            // console.log('unit', unit);
            // console.log('hisData', hisData);
            unit.forEach((exe, exeIndex) => {
              if(exe != null)
                hisData[exeIndex] = exe;
            });

            this.trainData.saveLocalUnit({category: data.theme_number, module: moduleIndex, unit: unitIndex}, hisData);
          });
        });
        resolve(response);
      });
    });
  }     

  checkToken() {
    let data: any = {};
    data.token = this.userService.token;
    return this.restApi.post('/token-check', data);
  }

  
  saveField(key, value) {
    if( this.userService.type != 'user') {
      this.userService.save();
      return false;
    } 

    this.checkToken().subscribe((_res) => {
      console.log(_res);
    });
    console.log(key, value);
    let data: any = {};
    data[key] = value;
    data.token = this.userService.token;
    this.restApi.post('/user-settings', data).subscribe((response:any) => {
      console.log(response);
      this.userService.save();
    });
  }

  // Train 

  saveExe(data) {
    if( this.userService.type != 'user') return false;
    data.token = this.userService.token;
    this.restApi.post('/save-exercise', data).subscribe((response:any) => {
      console.log(response);
      if(response.status == 'ok') {

      }
    });
  }

  afterLogin(response) {
        this.userService.name = response.name;
        this.userService.email = response.email;
        this.userService.password = response.password;
        this.userService.token = response.token;
        this.userService.type = 'user';
        this.userService.profilePicData =response.profilePicData;
        this.userService.storeToLocal();

        this.getUserDetails();
        this.getTrainingDates();
        this.getExe({theme_number: 0});
        this.getExe({theme_number: 1});
        this.getExe({theme_number: 2});
        this.getExe({theme_number: 3});
        this.getExe({theme_number: 4});

        setTimeout(() => {
          this.trainData.getSolvedExercisesPercentOverall();
        }, 5000);
  }

}
