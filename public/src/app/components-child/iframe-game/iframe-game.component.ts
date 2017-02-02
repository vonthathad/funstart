import { Component, OnInit, NgZone, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { Game } from '../../classes/game';
import { GameService } from '../../services/game.service'
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
  @Input() private playGame: boolean;
  @Output() updateResult = new EventEmitter();

  constructor(private zone: NgZone, private gameService: GameService,private cd: ChangeDetectorRef) {
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
      updateResult: (result) => {
        this.updateResult.emit(result);
        // result.imageData = getScreenShotData()  ;  
      },
      component: this
    };


    if (gameService.game) { this.setIframeSrc(gameService.game); };
    gameService.game$.subscribe(game => this.setIframeSrc(game));
  }
  ngOnInit() {
  }
  setIframeSrc(game) {
    this.src = "/sources/games/" + game._id + "/index.html";
    this.loadOnce = true;
    this.playGame = false;
    this._preload = false;
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

    console.log("preload done");
    this._preload = true;
    // this.pause();
    if (!this.playGame) {
      this.pause();
      // this.cd.markForCheck();
    } else {
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
    //  else {
    //   this.resume();
    // }
  }
  _continue() {
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
