import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GameService } from '../../services/game.service'

import { IframeGameComponent } from './../../components-child/iframe-game/iframe-game.component';
import { IframeAdsComponent } from './../../components-child/iframe-ads/iframe-ads.component';
import { GameIntroComponent } from './../../components-child/game-intro/game-intro.component';
import { GameShareComponent } from './../../components-child/game-share/game-share.component';
import { GameRecommendRightComponent } from './../../components-child/game-recommend-right/game-recommend-right.component';
import { GameRecommendLeftComponent } from './../../components-child/game-recommend-left/game-recommend-left.component';
import { GameRecommendBottomComponent } from './../../components-child/game-recommend-bottom/game-recommend-bottom.component';
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
  private facebookCommentShowed: boolean;
  @ViewChild(IframeGameComponent) private iframeGameComponent: IframeGameComponent;
  @ViewChild(IframeAdsComponent) private iframeAdsComponent: IframeAdsComponent;
  @ViewChild(GameIntroComponent) private gameIntroComponent: GameIntroComponent;
  @ViewChild(GameShareComponent) private gameShareComponent: GameShareComponent;
  @ViewChild(GameRecommendBottomComponent) private gameRecommendBottomComponent: GameRecommendBottomComponent;
  @ViewChild(GameRecommendRightComponent) private gameRecommendRightComponent: GameRecommendRightComponent;
  @ViewChild(GameRecommendLeftComponent) private gameRecommendLeftComponent: GameRecommendLeftComponent;
  @ViewChild(UsersRankedSidebarComponent) private usersRankedSidebarComponent: UsersRankedSidebarComponent;

  constructor(private route: ActivatedRoute, private gameService: GameService) { }

  ngOnInit() {
    // this.show = "intro";
    this.route.params.subscribe(params => {
      this.gameService.getGame(params['id']).subscribe((res: any) => {
        // console.log("IN PUT " + JSON.stringify(res.data));
        this.gameService.gameSource.next(res.data);
        this.game = res.data;
        this.gameIntroComponent.setVisible(true);
        this.iframeGameComponent.setVisible(false);
        this.gameShareComponent.setVisible(false);
        this.gameIntroComponent.setLibrariesPreloadDone(false);
        this.gameRecommendBottomComponent.loadRecommendGame();
        this.gameRecommendLeftComponent.loadRecommendGame();
        this.gameRecommendRightComponent.loadRecommendGame();
        this.facebookCommentShowed = false;
        this.facebookCommentShowed = true;
        this.iframeAdsComponent._closeAds();
      });
    });
  }
  // renderGame(game) {
  // this.game = game;
  // this.iframeGameComponent.setGame(game);

  // console.log("GAME " + JSON.stringify(game));
  // this.usersRankedSidebarComponent.setGame(game);

  // }
  handleLibrariesLoadDoneDone(){
    this.iframeAdsComponent._showAds();
    setTimeout(()=>{
      this.gameIntroComponent.setLibrariesPreloadDone(true);
    },360);

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
    setTimeout(function () {
      if(self.game.publish){
        // $scope.time = Date.now();
        if(self.game.long && self.game.long > 2){
          self.iframeAdsComponent._showAds({ channelID: '9629683846' });
        } else {
          if(Math.floor(Math.random()*3)==1) self.iframeAdsComponent._showAds({ channelID: '9629683846' });
        }

      }
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
