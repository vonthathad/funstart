import { Component } from '@angular/core';
import {TranslateService} from "ng2-translate/index";
import {FacebookService, FacebookInitParams} from 'ng2-facebook-sdk';
import { Angulartics2GoogleAnalytics } from 'angulartics2';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(private translate: TranslateService, private facebookService: FacebookService, angulartics2GoogleAnalytics: Angulartics2GoogleAnalytics) {
    translate.addLangs(["en", "fr"]);
    translate.setDefaultLang('en');
    let browserLang: string = translate.getBrowserLang();
    translate.use(browserLang.match(/en|fr/) ? browserLang : 'en');

  //////////////////////////
  ///// INIT FACEBOOK SDK
  //////////////////////////

    let facebookInitParams: FacebookInitParams = {
      appId: '170584416691811',
      xfbml: true,
      version: 'v2.7'
    };
    facebookService.init(facebookInitParams);
  }
}
