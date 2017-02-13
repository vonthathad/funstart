import { Component, OnInit,OnChanges, NgZone, Input, Output, EventEmitter } from '@angular/core';
import { Angulartics2 } from 'angulartics2';
import { Game } from '../../classes/game';
@Component({
  selector: 'app-iframe-game',
  templateUrl: './iframe-game.component.html',
  styleUrls: ['./iframe-game.component.scss']
})
export class IframeGameComponent implements OnInit, OnChanges{
  private angularComponentRef: any;
  private _preload: boolean;
  private loadOnce: boolean;
  private visible: boolean;
  @Input() private src: string;
  @Input() private playGame: boolean;
  @Input() private id: string;
  @Output() updateResult = new EventEmitter();
  @Output() librariesLoadDone = new EventEmitter();
  constructor(private angulartics2: Angulartics2, private zone: NgZone) {
    (<any>window).angularComponentRef = {
      zone: this.zone,
      startBoot: (func) => { this.startBoot = func },
      startPreload: (func) => { this.startPreload = func },
      startMenu: (func) => { this.startMenu = func },
      startLevel: (func) => { this.startLevel = func },
      startGame: (func) => { this.startGame = func },
      startHelp: (func) => { this.startHelp = func },
      startCredit: (func) => { this.startCredit = func },
      pause: (func) => { this.pause = func },
      resume: (func) => { this.resume = func },
      continue: (func) => { this.continue = func },
      getScreenShotData: (func) => { this.getScreenShotData = func },
      preloadDone: () => this.preloadDone(),
      librariesLoadDone: () => this.librariesLoadDone.emit(),
      updateResult: (result) => {
        this.updateResult.emit(result);
        // result.imageData = getScreenShotData()  ;
      },
      component: this
    };
    
  }
  ngOnInit() {
    this.setIframeSrc(this.id);
    // if (this.gameService.game) { this.setIframeSrc(this.gameService.game); };
    // this.
  }
  setIframeSrc(id) {
    console.log('set src');
    // set timeout to load after onLoad()
    this.src = "/sources/games/" + id + "/index.html";
    this.loadOnce = true;
    this.playGame = false;
    this._preload = false;
  }
  onLoad() {
      var iframe = document.getElementById('iframe-game');
      var win = (<HTMLIFrameElement>iframe).contentWindow;
      (<any>win).angularComponentRef = this.angularComponentRef;
      // console.log('Load from parent');
      (<any>win).game = (<any>window).game;
      this.disableInput();
  }
  disableInput(){
    let iframe = document.getElementById('iframe-game');
    var s = { insideIframe: false, scrollX:0, scrollY:0 }

    iframe.addEventListener('mouseenter', function() {
      s.insideIframe = true;
      // s.scrollX = window.scrollX;
      // s.scrollY = window.scrollY;
    });

    iframe.addEventListener('mouseleave', function() {
      s.insideIframe = false;
    });
    //
    // document.addEventListener('scroll', function() {
    //   if (s.insideIframe)
    //     window.scrollTo(s.scrollX, s.scrollY);
    // });
    window.addEventListener('keydown', function(e) {
      if(s.insideIframe)
        e.preventDefault();
    });
    window.addEventListener('keyup', function(e) {
      if(s.insideIframe)
        e.preventDefault();
    });
    (<any>iframe).contentWindow.document.addEventListener('keydown', function(e) {
      if(s.insideIframe)
        e.preventDefault();
    });
    (<any>iframe).contentWindow.document.addEventListener('keyup', function(e) {
      if(s.insideIframe)
        e.preventDefault();
    });
    // window.onkeydown = function(e) {
    //   if(s.insideIframe)
    //     e.preventDefault();
    // };

  }
  ngOnChanges(change){
    if(parseInt(change.id.previousValue)){
      this.id = change.id.currentValue;
      this.setIframeSrc(this.id);
    }
  }
  ngOnDestroy() {
    this.angularComponentRef = null;
  }

  startBoot() { };
  startPreload() { };
  startMenu() { };
  startLevel() { };
  startGame() { };
  startHelp() { };
  startCredit() { };
  resume() { };
  pause() { };
  continue() { };
  getScreenShotData() { };

  preloadDone() {
    // console.log("preload done");
    this._preload = true;
    // this.pause();
    // console.log(this.playGame);
    if (!this.playGame) {
      this.pause();
      // console.log(1);
      // this.cd.markForCheck();
    } else {
      // console.log(2);
      console.log("startMenu from preload");
      this.startMenu();
      this.resume();
      // this.cd.markForCheck();
    }
  }
  _playGame() {
    console.log("playGame click");
    this.playGame = true;
    if (this.loadOnce && this._preload) {
      console.log("startMenu from playGame click");
      this.startMenu();
      this.loadOnce = false;
    }
     else {
      this.resume();
    }
  }
  _continue() {
    this.angulartics2.eventTrack.next({ action: 'continueButtonClick', properties: { category: 'gamePlay' }});
    console.log("continue");
    // console.log(typeof this.level);
    // console.log(typeof this.game);
    // if (this.level) this.level();
    // else
    this.continue();
  }
  setVisible(visible) {
    this.visible = visible;
  }
  

}
