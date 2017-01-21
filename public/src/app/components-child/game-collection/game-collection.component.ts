import { Component, OnInit, Input } from '@angular/core';
import { Game } from '../../classes/game';

@Component({
  selector: 'app-game-collection',
  templateUrl: './game-collection.component.html',
  styleUrls: ['./game-collection.component.scss']
})
export class GameCollectionComponent implements OnInit {
  @Input('gamesCollection') gamesCollection: Game[];
  constructor() { }

  ngOnInit() {
  }

}
