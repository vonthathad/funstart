import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { GameService } from '../../services/game.service'

import {Game} from '../../classes/game';
@Component({
  selector: 'app-game-intro',
  templateUrl: './game-intro.component.html',
  styleUrls: ['./game-intro.component.scss']
})
export class GameIntroComponent implements OnInit {
  private visible: boolean;
  @Input() private game: Game;
  @Output() playGame = new EventEmitter();
  constructor(private gameService: GameService) {
    this.game = gameService.game;
    gameService.game$.subscribe(game => this.game = game);
   }

  ngOnInit() {
    this.visible = true;
  }
  _playGame(){
    this.playGame.emit("game");
    this.visible = false;
  }
  setVisible(visible){
    this.visible = visible;
  }
}
