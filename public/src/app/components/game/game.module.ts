import {NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule}  from '@angular/router';
import { MaterialModule } from '@angular/material';

import { GameComponent } from './game.component';
@NgModule({
  declarations: [
    GameComponent
  ],
  exports: [
    GameComponent,
  ],
  imports: [
    RouterModule,
    CommonModule
  ],
  providers: [
  ]
})
export class GameComponentModule { }