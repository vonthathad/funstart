import { Component, OnInit, Input } from '@angular/core';
import { Game } from '../../classes/game';
import {style, animate, transition, state, trigger} from '@angular/core';
@Component({
  selector: 'app-game-card-horizontal',
  templateUrl: './game-card-horizontal.component.html',
  styleUrls: ['./game-card-horizontal.component.scss'],
  animations: [
    trigger('fadeIn', [
      state('*', style({opacity: 1})),
      transition('void => *', [
        style({opacity: 0}),
        animate(200)
      ]),
      transition('* => void', animate(0, style({opacity: 0})))
    ])
  ]
})
export class GameCardHorizontalComponent implements OnInit {
   @Input('game') game: Game;
   @Input('link') link: string;
  constructor() { }

  ngOnInit() {
  }
  scrollTop(){
    window.scrollTo(0,0);
  }

}
