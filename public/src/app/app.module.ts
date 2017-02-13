import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';
import { HttpModule, Http } from '@angular/http';
import { ModalModule } from 'angular2-modal';
import { BootstrapModalModule } from 'angular2-modal/plugins/bootstrap';
import { Routes, RouterModule } from '@angular/router';
import { InfiniteScrollModule } from 'angular2-infinite-scroll';
import { LocationStrategy, PathLocationStrategy } from '@angular/common';
import { APP_BASE_HREF } from '@angular/common';
import {MdProgressCircleModule} from '@angular2-material/progress-circle';

import { FacebookService } from 'ng2-facebook-sdk';
import { TranslateModule, TranslateLoader, TranslateStaticLoader } from 'ng2-translate';
import { Angulartics2Module, Angulartics2GoogleAnalytics } from 'angulartics2';

import { SafePipe } from './pipes/safe.pipe';

import { USER_PROVIDER } from './services/user.service';
import { GAME_PROVIDER } from './services/game.service';
import { CONSTANT_SERVICE } from './services/constant.service';
import { SHARE_PROVIDER } from './services/share.service';
import { IMAGE_PROVIDER } from './services/image.service';

import { routing } from './app.routes';

import { AppComponent } from './app.component';
import { HeaderComponent } from './components-shared/header/header.component';
import { FooterComponent } from './components-shared/footer/footer.component';
import { HomeComponent } from './components/home/home.component';
import { GameComponent } from './components/game/game.component';
// import { Game2Component } from './components/game/game2.component';
import { TopicComponent } from './components/topic/topic.component';
import { UserComponent } from './components/user/user.component';
import { GameCardComponent } from './components-child/game-card/game-card.component';
import { GameCollectionComponent } from './components-child/game-collection/game-collection.component';
import { GameCardHorizontalComponent } from './components-child/game-card-horizontal/game-card-horizontal.component';
import { AutocompleteComponent } from './components-child/autocomplete/autocomplete.component';
import { AccountDialogComponent } from './components-child/account-dialog/account-dialog.component';
import { FormLoginComponent } from './components-child/form-login/form-login.component';
import { FormRegisterComponent } from './components-child/form-register/form-register.component';
import { FormPasswordResetComponent } from './components-child/form-password-reset/form-password-reset.component';
import { VideoPlayerComponent } from './components-child/video-player/video-player.component';
import { IframeGameComponent } from './components-child/iframe-game/iframe-game.component';
import { IframeAdsComponent } from './components-child/iframe-ads/iframe-ads.component';
// import { GameIntroComponent } from './components-child/game-intro/game-intro.component';
// import { GameShareComponent } from './components-child/game-share/game-share.component';
import { GameRecommendBottomComponent } from './components-child/game-recommend-bottom/game-recommend-bottom.component';
import { GameRecommendRightComponent } from './components-child/game-recommend-right/game-recommend-right.component';
import { GameRecommendLeftComponent } from './components-child/game-recommend-left/game-recommend-left.component';
import { GameCardVerticalComponent } from './components-child/game-card-vertical/game-card-vertical.component';
// import { UsersRankedSidebarComponent } from './components-child/users-ranked-sidebar/users-ranked-sidebar.component';
import { FacebookCommentComponent } from './components-child/facebook-comment/facebook-comment.component';
import { SignupComponent } from './components/signup/signup.component';


@NgModule({
  declarations: [
    SafePipe,
    AppComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    GameComponent,
    // Game2Component,
    TopicComponent,
    UserComponent,
    GameCardComponent,
    GameCollectionComponent,
    GameCardHorizontalComponent,
    AutocompleteComponent,
    AccountDialogComponent,
    FormLoginComponent,
    FormRegisterComponent,
    FormPasswordResetComponent,
    VideoPlayerComponent,
    IframeGameComponent,
    IframeAdsComponent,
    // GameIntroComponent,
    // GameShareComponent,
    GameRecommendBottomComponent,
    GameRecommendRightComponent,
    GameRecommendLeftComponent,
    GameCardVerticalComponent,
    // UsersRankedSidebarComponent,
    FacebookCommentComponent,
    SignupComponent

  ],
  entryComponents: [AccountDialogComponent],
  imports: [
    BrowserModule,
    ModalModule.forRoot(),
    BootstrapModalModule,
    HttpModule,
    FormsModule,
    ReactiveFormsModule,
    InfiniteScrollModule,
    MdProgressCircleModule,
    TranslateModule.forRoot({
      provide: TranslateLoader,
      useFactory: (http: Http) => new TranslateStaticLoader(http, '/assets/i18n', '.json'),
      deps: [Http]
    }),
    Angulartics2Module.forRoot([ Angulartics2GoogleAnalytics ]),
    routing
  ],
  providers: [
    USER_PROVIDER,
    GAME_PROVIDER,
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
