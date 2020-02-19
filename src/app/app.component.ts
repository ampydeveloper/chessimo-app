import { StoreService } from './store.service';
import { UserService } from './user.service';
import { UserConnectService } from './user-connect.service';
import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { TrainDataService } from './train-data.service';
import { AnalyticsService } from './analytics.service';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit{
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    public userConnectService: UserConnectService,
    public userService: UserService,
    public trainDataService: TrainDataService,
    public analytics: AnalyticsService,
    private screenOrientation: ScreenOrientation,
    private storeService: StoreService
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // this.statusBar.styleDefault();
      this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);
      this.statusBar.backgroundColorByHexString('#67829F');
      this.userConnectService.init();
      this.trainDataService.loadData();
      this.analytics.openApp();
     
    });
  }

  ngOnInit() {
    this.splashScreen.hide();
  }
}
