import { Component, OnInit, Input } from '@angular/core';
import { Game } from '../../classes/game';
@Component({
  selector: 'app-game-card-vertical',
  templateUrl: './game-card-vertical.component.html',
  styleUrls: ['./game-card-vertical.component.scss']
})
export class GameCardVerticalComponent implements OnInit {
   @Input('game') game: Game;
  constructor() { }

  ngOnInit() {
  }

}
