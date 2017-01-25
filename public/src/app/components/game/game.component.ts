import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { GameService } from '../../services/game.service'

import { IframeGameComponent } from './../../components-child/iframe-game/iframe-game.component';
import { IframeAdsComponent } from './../../components-child/iframe-ads/iframe-ads.component';
import { GameIntroComponent } from './../../components-child/game-intro/game-intro.component';
import { GameShareComponent } from './../../components-child/game-share/game-share.component';
import { UsersRankedSidebarComponent } from './../../components-child/users-ranked-sidebar/users-ranked-sidebar.component';
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
  @ViewChild(UsersRankedSidebarComponent) private usersRankedSidebarComponent: UsersRankedSidebarComponent;

  constructor(private route: ActivatedRoute, private gameService: GameService) {
    route.params.subscribe(params => {
      this.gameService.getGame(params['id']).subscribe((res: any) => this.renderGame(res.data));
    });

  }
  
  ngOnInit() {
    // this.show = "intro";

  }
  renderGame(game) {
    this.game = game;
    this.iframeAdsComponent._showAds({channelId: '123'});
    // console.log("GAME " + JSON.stringify(game));
    this.usersRankedSidebarComponent.setGame(game);
  }
  handleContinueGame(show) {
    this.iframeGameComponent._continue();
    this.iframeAdsComponent._closeAds();
    this.iframeGameComponent.setVisible(true);
    this.gameShareComponent.setVisible(false);
  }
  handleUpdateResult(result) {
    var imageData = this.iframeGameComponent.getScreenShotData();
    this.gameShareComponent.setScreenShotData(imageData);
    this.gameShareComponent.updateResult(result);
    this.gameShareComponent.setVisible(true);
    this.iframeGameComponent.setVisible(false);
    let self = this;
    setTimeout(function(){
      self.iframeAdsComponent._showAds({channelId: '123'});
    });
  } 
  handleCloseAds() {
    
  }
  handlePlayGame() {
    this.iframeGameComponent._playGame();
    this.gameIntroComponent.setVisible(false);
    this.iframeGameComponent.setVisible(true);
  }
}
