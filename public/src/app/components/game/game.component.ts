import { NgModule, Component, OnInit } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
export const routes: Routes = [
  { path: '', component: GameComponent },
  { path: 'home', component: GameComponent },
]


@NgModule({
  declarations: [
    GameComponent,
  ],
  exports: [
    GameComponent,
  ],
  imports: [
    RouterModule,
    CommonModule,
    FormsModule,
  ],
  providers: [
  ]
})
export class GameComponentModule { }