import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

@Injectable()
export class DataProvider {

  constructor(public storage: Storage) {
    console.log('Hello DataProvider Provider');
  }

  getData() {
    return this.storage.get('checklists');
  }

  save(data) {
    let saveData = [];
    data.forEach(checklist => {
      saveData.push({
        title: checklist.title,
        items: checklist.items
      });
    });
    
    let newData = JSON.stringify(saveData);
    this.storage.set('checklists', newData);
  }

}
