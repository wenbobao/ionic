
import { SlideshowPage } from './../slideshow/slideshow';
import { PhotoModel } from './../../models/photo-model';
import { SimpleAlertProvider } from './../../providers/simple-alert/simple-alert';
import { DataProvider } from './../../providers/data/data';

import { Component } from '@angular/core';
import { NavController, ModalController, Keyboard, Platform, AlertController } from 'ionic-angular';

import { Camera } from '@ionic-native/camera';
import { File } from '@ionic-native/file';
import { SocialSharing } from '@ionic-native/social-sharing';

declare var cordova;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  loaded: boolean = false;
  // 用于标记今天有没有拍照
  photoTaken: boolean = false;
  photos: PhotoModel[] = [];

  constructor(public navCtrl: NavController,
              public modalCtrl: ModalController,
              public simpleAlert: SimpleAlertProvider,
              public alertCtrl: AlertController,
              public keyboard: Keyboard,
              public platform: Platform,
              public dataService: DataProvider,
              public camera: Camera,
              public file: File,
              public socialSharing: SocialSharing
              ) {

  }

  ionViewDidLoad() {
    this.platform.ready().then(()=> {
      this.loadPhotos();
    });

    document.addEventListener('resume', ()=> {
      if(this.photos.length > 0) {
        let today = new Date();
        if(this.photos[0].date.setHours(0,0,0,0) === today.setHours(0,0,0,0)){
          this.photoTaken = true;
        }
        else {
          this.photoTaken = false;
        }
      }
    }, false);
  }

  loadPhotos() {

    this.dataService.getData().then((photos)=>{
      let savedPhotos: any = false;
      if(typeof(photos) != 'undefined') {
        savedPhotos = JSON.parse(photos);
      }

      if(savedPhotos) {
        savedPhotos.forEach(savedPhoto => {
          this.photos.push(new PhotoModel(savedPhoto.image, new Date(savedPhoto.date)));
        });
      }

      if(this.photos.length > 0) {
        let today = new Date();
        if(this.photos[0].date.setHours(0,0,0,0) === today.setHours(0,0,0,0)) {
          this.photoTaken = true;
        }
      }

      this.loaded = true;

    });
  }

  takePhoto() {

    if(!this.loaded || this.photoTaken) {
      return false;
    }

    if(!this.platform.is('cordova')) {
      console.log('====================================');
      console.log("You can only take photos on a device");
      console.log('====================================');
      return false;
    }

    let options = {
      quality: 100,
      destinationType: 1,
      sourceType: 1,
      encodingType: 0,
      cameraDirection: 1,
      saveToPhotoAlbum: true
    }

    this.camera.getPicture(options).then((imagePath)=> {
      console.log(imagePath);
      let currentName = imagePath.replace(/^.*[\\\/]/, '');
      let d = new Date();
      let n = d.getTime();
      let newFileName = n + '.jpg';

      if(this.platform.is('ios')) {
        this.file.moveFile(cordova.file.tempDirectory, currentName,cordova.file.dataDirectory, newFileName).then((success)=>{
          this.photoTaken = true;
          this.createPhoto(success.nativeURL);
          this.sharePhoto(success.nativeURL);
        }).catch((err)=>{
          console.log(err);
          let alert = this.simpleAlert.createAlert('Oops','Something ewnt wrong.');
          alert.present();
        });
      }
      else {
        this.photoTaken = true;
        this.createPhoto(imagePath);
        this.sharePhoto(imagePath);
      }

    }).catch((err)=>{
      let alert = this.simpleAlert.createAlert('Oops','Something ewnt wrong.');
      alert.present();
    });

  }

  createPhoto(photo) {
    let newPhoto = new PhotoModel(photo, new Date());
    // 将数据加载到数组的头部
    this.photos.unshift(newPhoto);
    this.save();
  }

  removePhoto(photo: PhotoModel) {
    let today = new Date();
    if(photo.date.setHours(0,0,0,0) ===today.setHours(0,0,0,0)) {
      this.photoTaken = false;
    }

    let index = this.photos.indexOf(photo);
    if(index > -1) {
      this.photos.splice(index, 1);
      this.save();
    }
  }

  playSlideshow() {
    if(this.photos.length > 1) {
      let modal = this.modalCtrl.create(SlideshowPage,{
        photos: this.photos
      });
      modal.present();
    }
    else {
      let alert = this.simpleAlert.createAlert('Oops','You need at least two photos before you can play a slideshow.');
      alert.present();
    }
  }

  sharePhoto(image) {
    let alert = this.alertCtrl.create({
      title: 'Noce one!',
      message: 'You have taken your photo for today, would you also like to share it?',
      buttons:[
        {
          text: 'No, Thanks'
        },
        {
          text: 'Share',
          handler: () => {
            this.socialSharing.share('I am taking a selfie every day with snapaday', null, image, null);
          }
        }
      ]
    });
    alert.present();
  }

  save() {
    this.dataService.save(this.photos);
  }

}
