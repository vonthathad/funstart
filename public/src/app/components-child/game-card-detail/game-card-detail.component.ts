import { Component, OnInit, Input } from '@angular/core';
import { Game } from '../../classes/game';
@Component({
  selector: 'app-game-card-detail',
  templateUrl: './game-card-detail.component.html',
  styleUrls: ['./game-card-detail.component.scss']
})
export class GameCardDetailComponent implements OnInit {
 @Input('game') game: Game;
  constructor() { }

  ngOnInit() {
  }

}
