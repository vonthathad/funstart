import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { MaterialModule } from '@angular/material'


import { AppComponent } from './app.component';
import { HomeComponent, HomeComponentModule, routes as homeChildRoutes } from './components/home/home.component';
import { GameComponent, GameComponentModule, routes as gameChildRoutes } from './components/game/game.component';
import { TopicComponent, TopicComponentModule, routes as topicChildRoutes } from './components/topic/topic.component';
import { UserComponent, UserComponentModule, routes as userChildRoutes } from './components/user/user.component';
import { HeaderComponent } from './child_components/header/header.component';
import { FooterComponent } from './child_components/footer/footer.component';

const routes: Routes = [
  { path: '', component: HomeComponent, children: homeChildRoutes },
  { path: 'topic', component: TopicComponent, children: topicChildRoutes },
  { path: 'game', component: GameComponent, children: gameChildRoutes },
  { path: 'user', component: UserComponent, children: userChildRoutes }
];

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent
  ],
  imports: [
    HomeComponentModule,
    GameComponentModule,
    TopicComponentModule,
    UserComponentModule,
    BrowserModule,
    HttpModule,
    MaterialModule.forRoot(),
    RouterModule.forRoot(routes)
  ],
  providers: [
    //  { provide: LocationStrategy, useClass: HashLocationStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
