import { Injectable } from '@angular/core';
import { ToastController, LoadingController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class UtilityService {

  loading: any;
  constructor(
    public toastController: ToastController,
    public loadingController: LoadingController,
    public alertController: AlertController
  ) { }

  async toast(message, position = 'bottom', duration = 2000) {
    const toast = await this.toastController.create({
      message: message,
      position: 'bottom',
      duration: duration,
    });
    toast.present();
  }

  async presentLoading(message, duration = 0) {
    this.loading = await this.loadingController.create({
      message,
      duration,
      animated: true,
      spinner: 'lines'
    });
    await this.loading.present();
  }

  dismissLoading(){
    this.loading.dismiss();
  }

  async presentAlert( message = '', handler) {
    const alert = await this.alertController.create({
      message: message,
      buttons: [{
        text: 'Okay',
        handler: () => {
          if(typeof handler.e[handler.fn] != 'undefined' )  handler.e[handler.fn]();
        }
      }]
    });

    await alert.present();
  }
}
