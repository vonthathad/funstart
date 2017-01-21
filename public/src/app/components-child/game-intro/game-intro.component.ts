import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-game-intro',
  templateUrl: './game-intro.component.html',
  styleUrls: ['./game-intro.component.scss']
})
export class GameIntroComponent implements OnInit {
  @Input() private show: string;
  @Output() playGame = new EventEmitter();
  constructor() { }

  ngOnInit() {
  }
  _playGame(){
    this.playGame.emit("game");
  }
}
