import { Injectable } from '@angular/core';
import { FacebookService, FacebookUiParams } from 'ng2-facebook-sdk';


@Injectable()
export class ShareService {

  info: any;
  constructor(private facebookService: FacebookService) {
    this.info = {};
  }
  setInfo(info) {
    if (info.shareUrl) this.info.shareUrl = info.shareUrl;
    if (info.pictureUrl) this.info.pictureUrl = info.pictureUrl;
    if (info.title) this.info.title = info.title;
    if (info.des) this.info.des = info.des;
  };
  shareFacebook(callback) {
    console.log(this.info.shareUrl);
    let shareParams: FacebookUiParams = {
      method: 'share',
      mobile_iframe: 'true',
      href: this.info.shareUrl + "?ref=share&rs_image=" + this.info.pictureUrl 
      + "&rs_title=" + this.info.title + "&rs_des=" + this.info.des
    };
    this.facebookService.ui(shareParams);

    // window.FB.init({
    //   appId: "1743828749275715",
    //   channelUrl: 'app/channel.html',
    //   status: true,
    //   xfbml: true
    // });
    // window.FB.ui({
    //   method: 'share',
    //   mobile_iframe: true,
    //   href: this.url + "?ref=share&rs_image="+this.pic+"&rs_title="+this.name+"&rs_des="+this.des
    // }, function(res){
    //   if (callback) callback();
    // });
  };

  // get currentUser$() { return this.fc.currentUser$; }

}

export var SHARE_PROVIDER: Array<any> = [
  { provide: ShareService, useClass: ShareService }
]