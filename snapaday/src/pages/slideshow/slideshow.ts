import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

/**
 * Generated class for the SlideshowPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-slideshow',
  templateUrl: 'slideshow.html',
})
export class SlideshowPage {

  @ViewChild('imagePlayer') imagePlayer: ElementRef;
  imagePlayerInterval: any;
  photos: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController) {
    this.photos = this.navParams.get('photos');
  }

  ionViewDidEnter() {
    this.playPhotos();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SlideshowPage');
  }

  playPhotos() {
    let imagePlayer = this.imagePlayer.nativeElement;
    let i = 0;

    clearInterval(this.imagePlayerInterval);

    this.imagePlayerInterval = setInterval(()=>{
      if(i < this.photos.length) {
        imagePlayer.src = this.photos[i].image;
        i++;
      }
      else {
        clearInterval(this.imagePlayerInterval);
      }
    }, 500);
  }

  closeModal() {
    this.viewCtrl.dismiss();
  }
}
