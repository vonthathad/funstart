import {NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule}  from '@angular/router';
import { MaterialModule } from '@angular/material';

import { GameCardModule } from '../../child-components/game-card/game-card.module';

import { TopicComponent } from './topic.component';


@NgModule({
  declarations: [
    TopicComponent,
  ],
  exports: [
    TopicComponent,
  ],
  imports: [
    RouterModule,
    CommonModule,
    MaterialModule,
  ],
  providers: [
  ]
})
export class TopicComponentModule { }