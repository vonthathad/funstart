import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {FormsModule} from '@angular/forms';
import { HttpModule, Http } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';
import { TranslateModule, TranslateLoader, TranslateStaticLoader } from 'ng2-translate';
import { LocationStrategy, PathLocationStrategy } from '@angular/common';
import { MaterialModule } from '@angular/material'
import { APP_BASE_HREF } from '@angular/common';
import { FlexLayoutModule } from "@angular/flex-layout";

import { SafePipe } from './pipes/safe.pipe';

import { USER_PROVIDER } from './services/user.service';
import { GAME_PROVIDER } from './services/game.service';
import { REST_PROVIDER } from './services/rest.service';
import { CONSTANT_SERVICE } from './services/constant.service';

import { routing } from './app.routes';

import { AppComponent } from './app.component';
import { HeaderComponent } from './shared-components/header/header.component';
import { FooterComponent } from './shared-components/footer/footer.component';
import { HomeComponent } from './components/home/home.component';
import { GameComponent } from './components/game/game.component';
import { TopicComponent } from './components/topic/topic.component';
import { UserComponent} from './components/user/user.component';
import { SidebarComponent } from './shared-components/sidebar/sidebar.component';
import { GameCardComponent} from './child-components/game-card/game-card.component';
import { GameCollectionComponent } from './child-components/game-collection/game-collection.component';
import { GameCardDetailComponent } from './child-components/game-card-detail/game-card-detail.component';
import { AutocompleteComponent } from './child-components/autocomplete/autocomplete.component';
import { AccountDialogComponent } from './child-components/account-dialog/account-dialog.component';
import { FormLoginComponent } from './child-components/form-login/form-login.component';
import { FormRegisterComponent } from './child-components/form-register/form-register.component';
import { FormPasswordResetComponent } from './child-components/form-password-reset/form-password-reset.component';
import { VideoPlayerComponent } from './child-components/video-player/video-player.component';
import { IframeGameComponent } from './child-components/iframe-game/iframe-game.component'; 
import { IframeAdsComponent } from './child-components/iframe-ads/iframe-ads.component';



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
    IframeAdsComponent
    
  ],
  entryComponents:[AccountDialogComponent],
  imports: [
    BrowserModule,
    HttpModule,
    FormsModule,
    MaterialModule.forRoot(),
    TranslateModule.forRoot({
      provide: TranslateLoader,
      useFactory: (http: Http) => new TranslateStaticLoader(http, '/assets/i18n', '.json'),
      deps: [Http]
    }),
    FlexLayoutModule,
    routing
  ],
  providers: [
    USER_PROVIDER,
    GAME_PROVIDER,
    REST_PROVIDER,  
    CONSTANT_SERVICE,
    { provide: LocationStrategy, useClass: PathLocationStrategy },
    { provide: APP_BASE_HREF, useValue: '/' }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
