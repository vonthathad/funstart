import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { GameService } from '../../services/game.service'
import { RestService } from '../../services/rest.service'
import { IframeGameComponent } from '../..../../../child-components/iframe-game/iframe-game.component';
import { IframeAdsComponent } from '../..../../../child-components/iframe-ads/iframe-ads.component';
import { GameIntroComponent } from '../..../../../child-components/game-intro/game-intro.component';
import { GameShareComponent } from '../..../../../child-components/game-share/game-share.component';
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
  private adsClosed: boolean;

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
    this.show = "intro";
  }
  renderGame(game) {
    this.game = game;
    console.log("GAME " + JSON.stringify(game));
  }
  handleContinue(show) {
    this.show = "game";
    this.iframeGameComponent._continue();
    this.iframeAdsComponent._closeAds();
  }
  handleUpdateResult(result) {
    console.log(1234);
    this.show = "share";
    this.gameShareComponent.updateResult(result);
    this.iframeAdsComponent._showAds();
  }
  handleCloseAds() {
    this.iframeGameComponent._adsClosed();
  }
  handlePlay() {
    this.show = "game";
    this.iframeAdsComponent._showAds();
  }
}
