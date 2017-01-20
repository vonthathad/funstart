import { Component, OnInit, NgZone } from '@angular/core';
@Component({
  selector: 'app-iframe-game',
  templateUrl: './iframe-game.component.html',
  styleUrls: ['./iframe-game.component.scss']
})
export class IframeGameComponent implements OnInit {
  private angularComponentRef: any;
  private process: string;
  src: string;
  constructor(private zone: NgZone) {
    (<any>window).angularComponentRef = {
      zone: this.zone,
      preload: (func) => { this.preload = func },
      start: (func) => { this.start = func },
      pause: (func) => { this.pause = func },
      resume: (func) => { this.resume = func },
      next: (func) => { this.next = func },
      share: (result) => this.share(result),
      component: this
    };
    this.src = "http://localhost:4200/sources/games/32/index.html";
    this.process = "intro";
  }
  ngOnInit() { }
  onLoad() {
    var iframe = document.getElementById('iframe-game');
    var win = (<HTMLIFrameElement>iframe).contentWindow;
    (<any>win).angularComponentRef = this.angularComponentRef;
    console.log('Load from parent');
    (<any>win).game = (<any>window).game;
  }
  ngOnDestroy() {
    this.angularComponentRef = null;
  }

  preload() { };
  start() { };
  resume() { };
  pause() { };
  next() { };
  share(result) {
    alert(result);
  }
  show() {
    this.process = "play";
  }
}
