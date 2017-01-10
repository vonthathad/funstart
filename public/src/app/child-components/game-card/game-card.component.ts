import { Component, OnInit, Input } from '@angular/core';
import { Game } from '../../classes/game';
@Component({
  selector: 'app-game-card',
  templateUrl: './game-card.component.html',
  styleUrls: ['./game-card.component.scss'],
})
export class GameCardComponent implements OnInit {
  @Input('game') game: Game;
  constructor() { }

  ngOnInit() {
  }

}
