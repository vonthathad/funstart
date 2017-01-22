import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { GameService } from '../../services/game.service'
import { RestService } from '../../services/rest.service'


import { IframeGameComponent } from '../..../../../components-child/iframe-game/iframe-game.component';
import { IframeAdsComponent } from '../..../../../components-child/iframe-ads/iframe-ads.component';
import { GameIntroComponent } from '../..../../../components-child/game-intro/game-intro.component';
import { GameShareComponent } from '../..../../../components-child/game-share/game-share.component';
import { Game } from '../../classes/game';
@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
})
export class GameComponent implements OnInit {
  private game: Game;
  private show: string;
  private share: string;

  @ViewChild(IframeGameComponent) private iframeGameComponent: IframeGameComponent;
  @ViewChild(IframeAdsComponent) private iframeAdsComponent: IframeAdsComponent;
  @ViewChild(GameIntroComponent) private gameIntroComponent: GameIntroComponent;
  @ViewChild(GameShareComponent) private gameShareComponent: GameShareComponent;

  constructor(private route: ActivatedRoute, private gameService: RestService) {
    route.params.subscribe(params => {
      this.gameService.getGame(params['id']).subscribe((res: any) => this.renderGame(res.data))
    });

  }
  
  ngOnInit() {
    // this.show = "intro";
    // this.iframeAdsComponent._showAds();
  }
  renderGame(game) {
    this.game = game;
    console.log("GAME " + JSON.stringify(game));
  }
  handleContinueGame(show) {
    this.iframeGameComponent._continue();
    this.iframeAdsComponent._closeAds();
    this.iframeGameComponent.setVisible(true);
    this.gameShareComponent.setVisible(false);
  }
  handleUpdateResult(result) {
    console.log(1234);
    this.iframeAdsComponent._showAds();
    this.gameShareComponent.updateResult(result);
    this.gameShareComponent.setVisible(true);
    this.iframeGameComponent.setVisible(false);
  }
  handleCloseAds() {
    
  }
  handlePlayGame() {
    this.iframeGameComponent._playGame();
    this.gameIntroComponent.setVisible(false);
    this.iframeGameComponent.setVisible(true);
  }
}
