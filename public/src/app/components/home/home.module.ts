import {NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule}  from '@angular/router';
import { MaterialModule } from '@angular/material';

import { GameCardModule } from '../../child-components/game-card/game-card.module';

import { HomeComponent } from './home.component';


@NgModule({
  declarations: [
    HomeComponent,
  ],
  exports: [
    HomeComponent
  ],
  imports: [
    RouterModule,
    CommonModule,
    MaterialModule,
    GameCardModule
  ],
  providers: [
  ]
})
export class HomeComponentModule { }