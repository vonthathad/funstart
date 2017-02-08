import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Angulartics2 } from 'angulartics2';
import { GameService } from '../../services/game.service'

import {Game} from '../../classes/game';
@Component({
  selector: 'app-game-intro',
  templateUrl: './game-intro.component.html',
  styleUrls: ['./game-intro.component.scss']
})
export class GameIntroComponent implements OnInit {
  private visible: boolean;
  private game: Game;
  private librariesPreloadDone: boolean;
  @Output() playGame = new EventEmitter();
  constructor(private angulartics2: Angulartics2, private gameService: GameService) {
    this.game = gameService.game;
    gameService.game$.subscribe(game => {this.game = game; this.librariesPreloadDone=false;});
   }

  ngOnInit() {
    this.visible = true;
  }
  _playGame(){
    this.playGame.emit("game");
    this.visible = false;
    this.angulartics2.eventTrack.next({ action: 'playButtonClick', properties: { category: 'gamePlay' }});
  }
  setVisible(visible){
    this.visible = visible;
    if(visible==true){
      this.angulartics2.eventTrack.next({ action: 'startGame', properties: { category: 'gamePlay' }});
    }
  }
  setLibrariesPreloadDone(preloadDone){
    this.librariesPreloadDone = preloadDone;
  }
}
