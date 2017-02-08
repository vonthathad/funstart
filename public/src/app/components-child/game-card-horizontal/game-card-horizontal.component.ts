import { Component, OnInit, Input } from '@angular/core';
import { Game } from '../../classes/game';
@Component({
  selector: 'app-game-card-horizontal',
  templateUrl: './game-card-horizontal.component.html',
  styleUrls: ['./game-card-horizontal.component.scss']
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
