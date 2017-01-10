import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';
import { LocationStrategy, PathLocationStrategy } from '@angular/common';
import { MaterialModule } from '@angular/material'
import { routing } from './app.routes';
import { APP_BASE_HREF } from '@angular/common';


import { HomeComponentModule } from './components/home/home.module';
import { GameComponentModule } from './components/game/game.module';
import { TopicComponentModule } from './components/topic/topic.module';
import { UserComponentModule } from './components/user/user.module';

import { AppComponent } from './app.component';
import { HeaderComponent } from './shared-components/header/header.component';
import { FooterComponent } from './shared-components/footer/footer.component';

import { REST_PROVIDER } from './services/rest.service';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    MaterialModule.forRoot(),
    HomeComponentModule,
    GameComponentModule,
    TopicComponentModule,
    UserComponentModule,
    routing
  ],
  providers: [
    REST_PROVIDER,
    { provide: LocationStrategy, useClass: PathLocationStrategy },
    { provide: APP_BASE_HREF, useValue: '/' }
  ],
  //  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent]
})
export class AppModule { }
