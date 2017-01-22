import { Component, OnInit, NgZone, Input, Output, EventEmitter } from '@angular/core';
@Component({
  selector: 'app-iframe-game',
  templateUrl: './iframe-game.component.html',
  styleUrls: ['./iframe-game.component.scss']
})
export class IframeGameComponent implements OnInit {
  private angularComponentRef: any;
  private _preload: boolean;
  private loadOnce: boolean;
  private visible: boolean;
  @Input() private src: string;
  @Input() private adsClosed: boolean;
  @Output() updateResult = new EventEmitter();

  constructor(private zone: NgZone) {
    (<any>window).angularComponentRef = {
      zone: this.zone,
      boot: (func) => { this.boot = func },
      preload: (func) => { this.preload = func },
      menu: (func) => { this.menu = func },
      level: (func) => { this.level = func },
      game: (func) => { this.game = func },
      help: (func) => { this.help = func },
      credit: (func) => { this.credit = func },
      pause: (func) => { this.pause = func },
      resume: (func) => { this.resume = func },
      continue: (func) => { this.continue = func },
      preloadDone: () => this.preloadDone(),
      updateResult: (result) => { this.updateResult.emit(result); },
      component: this
    };
    this.src = "http://localhost:4200/sources/games/32/index.html";
  }
  ngOnInit() {
    this.loadOnce = true;
  }
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

  boot() { };
  preload() { };
  menu() { };
  level() { };
  game() { };
  help() { };
  credit() { };
  resume() { };
  pause() { };
  continue() { };

  preloadDone() {
    console.log("done preload");
    this._preload = true;
    // this.pause();
    if (!this.adsClosed) this.pause();
    else this.menu();

  }
  _adsClosed() {
    alert("done adsClosed");
    this.adsClosed = true;
    if (this.loadOnce && this._preload) {
      this.menu();
      this.loadOnce = false;
    }

  }
  _continue() {
    console.log("continue");
    console.log(typeof this.level);
    console.log(typeof this.game);
    // if (this.level) this.level();
    // else 
    this.continue();
  }
  setVisible(visible) {
    this.visible = visible;
  }
}
