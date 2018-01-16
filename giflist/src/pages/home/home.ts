import { SettingsPage } from './../settings/settings';
import {RedditProvider} from './../../providers/reddit/reddit';
import {DataProvider} from './../../providers/data/data';
import {Component} from '@angular/core';
import {FormControl} from '@angular/forms';
import {NavController, ModalController, Keyboard, Platform} from 'ionic-angular';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';

@Component({selector: 'page-home', templateUrl: 'home.html'})
export class HomePage {

  subredditValue : string;
  subredditControl : FormControl;

  constructor(public navCtrl : NavController, public keyboard : Keyboard, public platform : Platform, public dataService : DataProvider, public redditService : RedditProvider, public modelCtrl: ModalController) {
    this.subredditControl = new FormControl();
  }

  ionViewDidLoad() {

    this.subredditControl.valueChanges.debounceTime(1500).distinctUntilChanged().subscribe((subreddit)=> {
      if (subreddit != '' && subreddit) {
        this.redditService.subreddit = subreddit;
        this.changeSubreddit();
        this.keyboard.close();
      }
    });
    this.platform.ready().then(() => {
        this.loadSettings();
      });
  }

  loadSettings() {
    this.dataService.getData().then((settings)=> {
     if(settings && typeof(settings) != 'undefined') {
       let newSettings = JSON.parse(settings);
       if(newSettings.length != 0) {
        this.redditService.perPage = newSettings.perPage;
        this.redditService.sort = newSettings.sort;
        this.redditService.subreddit = newSettings.subreddit;
       }
     }
     this.changeSubreddit();
    });
  }

  openSettings() {

    let settingsModel = this.modelCtrl.create(SettingsPage, {
      'perPage': this.redditService.perPage,
      'sort': this.redditService.sort,
      'subreddit': this.redditService.subreddit
    });

    settingsModel.onDidDismiss(settings => {
      if(settings) {
        this.redditService.perPage = settings.perPage;
        this.redditService.sort = settings.sort;
        this.redditService.subreddit = settings.subreddit;
        this.dataService.save(settings);
        this.changeSubreddit();
      }
    });
    settingsModel.present();

  }

  showComments(post) {

  }

  playVideo(e, post) {
    // 创建视频的引用
    let video = e.target.getElementsByTagName('video')[0];
    if(!post.alredayLoaded) {
      post.showLoader = true;
    }
    // 切换视频播放

    if(video.paused) {
      
      video.play();
      video.addEventListener("playing", ()=> {
        post.showLoader = false;
        post.alredayLoaded = true;
      });
    }
    else {
      video.pause();
    }
  }

  changeSubreddit() {
    this.redditService.resetPosts();
  }

  loadMore() {
    this.redditService.nextPage();
  }
}
