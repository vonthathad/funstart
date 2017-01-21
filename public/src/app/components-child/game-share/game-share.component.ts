import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-game-share',
  templateUrl: './game-share.component.html',
  styleUrls: ['./game-share.component.scss']
})
export class GameShareComponent implements OnInit {
  @Input() private show: string;
  @Input() private result: Object;
  @Output() continueGame = new EventEmitter();
  constructor() { }

  ngOnInit() {
  }
  _continueGame() {
    this.continueGame.emit();
  }
  updateResult(result) {
    this.result = result;
  }
  shareFacebook(){
    alert("NOT DONE");
  }
  shareTwitter(){
    alert("NOT DONE");
  }
}
