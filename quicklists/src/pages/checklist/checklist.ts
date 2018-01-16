import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';

/**
 * Generated class for the ChecklistPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-checklist',
  templateUrl: 'checklist.html',
})

export class ChecklistPage {
  checklist: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController) {
    this.checklist = this.navParams.get("checklist");
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ChecklistPage');
  }

  addItem() {
    let prompt = this.alertCtrl.create({
      title: 'Add Item',
      message: 'Enter the name of the task for this checklist below:',
      inputs:[
        {
          name: 'name'
        }
      ],
      buttons:[
        {
          text: 'Cancell'
        },
        {
          text: 'Save',
          handler: (data) => {
            this.checklist.addItem(data.name);
          }
        }
      ]
    });
    prompt.present();
  }

  renameItem(item) {
    let prompt = this.alertCtrl.create({
      title: 'Rename Item',
      message: 'Enter the name of the task for this checklist below:',
      inputs:[
        {
          name: 'name'
        }
      ],
      buttons:[
        {
          text: 'Cancell'
        },
        {
          text: 'Save',
          handler: (data) => {
            this.checklist.renameItem(item, data.name);
          }
        }
      ]
    });
    prompt.present();
  }

  toggleItem(item) {
    this.checklist.toggleItem(item);
  }

  removeItem(item) {
    this.checklist.removeItem(item);
  }

  uncheckItems() {
    this.checklist.items.forEach(item => {
      if (item.checked) {
        this.checklist.toggleItem(item);
      }
    });
  }

}
