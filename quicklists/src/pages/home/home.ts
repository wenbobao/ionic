import { IntroPage } from './../intro/intro';
import { Storage } from '@ionic/storage';

import { Component } from '@angular/core';
import { NavController, AlertController, Keyboard, Platform } from 'ionic-angular';

// import { ChecklistPage } from '../checklist/checklist';
import { ChecklistModel } from '../../models/checklist-model';
import { DataProvider } from '../../providers/data/data';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  checklists: ChecklistModel[] = [];

  constructor(public navCtrl: NavController, 
              public alertCtrl: AlertController,
              public dataService: DataProvider,
              public platform: Platform,
              public keyboard: Keyboard,
              public storage: Storage) {

  }

  ionViewDidLoad() {
    this.platform.ready().then(()=> {

      this.storage.get('introShown').then((result)=> {
        if(!result) {
          this.storage.set('introShown',true);
          this.navCtrl.setRoot(IntroPage);
        }
      });

      this.dataService.getData().then((checklists) => {
        let savedChecklists: any = false;

        if(typeof(checklists)!="undefined") {
          savedChecklists = JSON.parse(checklists);
        }

        if(savedChecklists) {
          savedChecklists.forEach(savedChecklist => {
            let loadChecklist = new ChecklistModel(savedChecklist.title, savedChecklist.items);
            this.checklists.push(loadChecklist);
            loadChecklist.checklist.subscribe(update => {
              this.save();
            });
          });6
        }

      });
    });
  }

  addChecklist() {
    let prompt = this.alertCtrl.create({
      title: 'New Checklist',
      message: 'Enter the name of your new checklist below:',
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
            let newChecklist = new ChecklistModel(data.name, []);
            this.checklists.push(newChecklist);
            newChecklist.checklist.subscribe((update)=> {
              this.save();
            });
            this.save();
          }
        }
      ]
    });
    prompt.present();
  }

  renameChecklist(checklist) {
    let prompt = this.alertCtrl.create({
      title: 'Rename Checklist',
      message: 'Enter the name of your new checklist below:',
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
            let index = this.checklists.indexOf(checklist);
            if (index > -1) {
              this.checklists[index].setTitle(data.name);
              this.save();
            }
          }
        }
      ]
    });
    prompt.present();
  }

  viewChecklist(checklist) {
    this.navCtrl.push('ChecklistPage', {"checklist":checklist});
  }

  removeChecklist(checklist) {
    let index = this.checklists.indexOf(checklist);
    if (index > -1) {
      this.checklists.splice(index, 1);
      this.save();
    }
  }

  save() {
    this.keyboard.close();
    this.dataService.save(this.checklists);
  }
}
