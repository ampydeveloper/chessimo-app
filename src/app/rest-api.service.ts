import { Platform } from '@ionic/angular';
import { Injectable } from '@angular/core';
import { AppService } from './app.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HTTP } from '@ionic-native/http/ngx';
import { Observable, from } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RestApiService {

  token = 'my-auth-token';
  constructor(public appService: AppService, public http: HttpClient, public httpNative: HTTP, public platform : Platform) { 
    this.token = '';
  }

  url(endpoint) {
    return this.appService.apiurl.base + endpoint;
  }

  post(endpoint, data) {
    const url = this.url(endpoint);
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      })
    };

    if(this.platform.is('desktop') || this.platform.is('mobileweb')) {
      return this.http.post(url, data);
    } else {
      console.log(url, data);
      return new Observable( (resolve) => {
        let headers = {
            'Content-Type': 'application/json'
        };
        this.httpNative.post(url, data, headers
          ).then( (res: any) => {
          // console.log("res",  typeof res.data);
          // console.log("res.data",  typeof res.data);
          resolve.next(JSON.parse(res.data));
          resolve.complete();
        }).catch(e => {
          resolve.error(e);
          resolve.complete();
        })
      });
    }
  }

  get(endpoint, data) {
    const url = this.url(endpoint);

    if(this.platform.is('desktop') || this.platform.is('mobileweb')) {
      return this.http.get(url);
    } else {
      console.log(url, data);
      return new Observable( (resolve) => { 
        this.httpNative.get(url, {}, {}).then( (res: any) => {
          console.log("res",  typeof res.data);
          console.log("res.data",  typeof res.data);
          resolve.next(JSON.parse(res.data));
          resolve.complete();
        })
      });
    }
  }

}
