import { Injectable } from '@angular/core';
import { AlertController } from 'ionic-angular';

@Injectable()
export class SimpleAlertProvider {

  constructor(public alertCtrl: AlertController) {
    console.log('Hello SimpleAlertProvider Provider');
  }

  createAlert(title: string, message: string) {
    return this.alertCtrl.create({
      title: title,
      message: message,
      buttons: [
        {
          text: 'OK'
        }
      ]
    });
  }

}
