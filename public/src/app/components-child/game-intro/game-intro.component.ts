import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-game-intro',
  templateUrl: './game-intro.component.html',
  styleUrls: ['./game-intro.component.scss']
})
export class GameIntroComponent implements OnInit {
  private visible: boolean;
  @Output() playGame = new EventEmitter();
  constructor() { }

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
