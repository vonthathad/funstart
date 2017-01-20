import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-game-share',
  templateUrl: './game-share.component.html',
  styleUrls: ['./game-share.component.scss']
})
export class GameShareComponent implements OnInit {
  @Input() private show: string;
  @Input() private result: Object;
  @Output() continue = new EventEmitter();
  constructor() { }

  ngOnInit() {
  }
  _continue() {
    this.continue.emit();
  }
  updateResult(result) {
    this.result = result;
  }
  shareFacebook(){
    alert("NOT DONE");
  }
}
