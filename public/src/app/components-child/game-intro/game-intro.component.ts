import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {Game} from '../../classes/game';
@Component({
  selector: 'app-game-intro',
  templateUrl: './game-intro.component.html',
  styleUrls: ['./game-intro.component.scss']
})
export class GameIntroComponent implements OnInit {
  private visible: boolean;
  @Input() game: Game;
  @Input() isLoading: boolean;
  @Output() playGame = new EventEmitter();
  constructor() {
   
  }

  ngOnInit() {
  }
  _playGame(){
    this.playGame.emit("game");
    this.visible = false;
    // this.angulartics2.eventTrack.next({ action: 'playButtonClick', properties: { category: 'gamePlay' }});
  }
  // setVisible(visible){
  //   this.visible = visible;
  //   if(visible==true){
  //     this.angulartics2.eventTrack.next({ action: 'startGame', properties: { category: 'gamePlay' }});
  //   }
  // }
}
