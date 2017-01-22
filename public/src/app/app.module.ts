import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule, Http } from '@angular/http';
import { ModalModule } from 'angular2-modal';
import { BootstrapModalModule } from 'angular2-modal/plugins/bootstrap';
import { Routes, RouterModule } from '@angular/router';
import { InfiniteScrollModule } from 'angular2-infinite-scroll';
import { LocationStrategy, PathLocationStrategy } from '@angular/common';
import { APP_BASE_HREF } from '@angular/common';

import { FacebookService } from 'ng2-facebook-sdk';
import { TranslateModule, TranslateLoader, TranslateStaticLoader } from 'ng2-translate';

import { SafePipe } from './pipes/safe.pipe';

import { USER_PROVIDER } from './services/user.service';
import { GAME_PROVIDER } from './services/game.service';
import { REST_PROVIDER } from './services/rest.service';
import { CONSTANT_SERVICE } from './services/constant.service';
import { SHARE_PROVIDER } from './services/share.service';
import { IMAGE_PROVIDER } from './services/image.service';

import { routing } from './app.routes';

import { AppComponent } from './app.component';
import { HeaderComponent } from './components-shared/header/header.component';
import { FooterComponent } from './components-shared/footer/footer.component';
import { HomeComponent } from './components/home/home.component';
import { GameComponent } from './components/game/game.component';
import { TopicComponent } from './components/topic/topic.component';
import { UserComponent } from './components/user/user.component';
import { SidebarComponent } from './components-shared/sidebar/sidebar.component';
import { GameCardComponent } from './components-child/game-card/game-card.component';
import { GameCollectionComponent } from './components-child/game-collection/game-collection.component';
import { GameCardDetailComponent } from './components-child/game-card-detail/game-card-detail.component';
import { AutocompleteComponent } from './components-child/autocomplete/autocomplete.component';
import { AccountDialogComponent } from './components-child/account-dialog/account-dialog.component';
import { FormLoginComponent } from './components-child/form-login/form-login.component';
import { FormRegisterComponent } from './components-child/form-register/form-register.component';
import { FormPasswordResetComponent } from './components-child/form-password-reset/form-password-reset.component';
import { VideoPlayerComponent } from './components-child/video-player/video-player.component';
import { IframeGameComponent } from './components-child/iframe-game/iframe-game.component';
import { IframeAdsComponent } from './components-child/iframe-ads/iframe-ads.component';
import { GameIntroComponent } from './components-child/game-intro/game-intro.component';
import { GameShareComponent } from './components-child/game-share/game-share.component';



@NgModule({
  declarations: [
    SafePipe,
    AppComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    GameComponent,
    TopicComponent,
    UserComponent,
    GameCardComponent,
    SidebarComponent,
    GameCollectionComponent,
    GameCardDetailComponent,
    AutocompleteComponent,
    AccountDialogComponent,
    FormLoginComponent,
    FormRegisterComponent,
    FormPasswordResetComponent,
    VideoPlayerComponent,
    IframeGameComponent,
    IframeAdsComponent,
    GameIntroComponent,
    GameShareComponent

  ],
  entryComponents: [AccountDialogComponent],
  imports: [
    BrowserModule,
    ModalModule.forRoot(),
    BootstrapModalModule,
    HttpModule,
    FormsModule,
    InfiniteScrollModule,
    TranslateModule.forRoot({
      provide: TranslateLoader,
      useFactory: (http: Http) => new TranslateStaticLoader(http, '/assets/i18n', '.json'),
      deps: [Http]
    }),
    routing
  ],
  providers: [
    USER_PROVIDER,
    GAME_PROVIDER,
    REST_PROVIDER,
    CONSTANT_SERVICE,
    SHARE_PROVIDER,
    IMAGE_PROVIDER,
    FacebookService,
    { provide: LocationStrategy, useClass: PathLocationStrategy },
    { provide: APP_BASE_HREF, useValue: '/' }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
