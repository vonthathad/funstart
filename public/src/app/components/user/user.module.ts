import {NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule}  from '@angular/router';
import { MaterialModule } from '@angular/material';

import { GameCardModule } from '../../child-components/game-card/game-card.module';

import { UserComponent } from './user.component';


@NgModule({
  declarations: [
    UserComponent,
  ],
  exports: [
    UserComponent,
  ],
  imports: [
    RouterModule,
    CommonModule,
  ],
  providers: [
  ]
})
export class UserComponentModule { }