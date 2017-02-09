import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GameService } from '../../services/game.service'

import { GameRecommendRightComponent } from './../../components-child/game-recommend-right/game-recommend-right.component';
import { GameRecommendLeftComponent } from './../../components-child/game-recommend-left/game-recommend-left.component';
import { GameRecommendBottomComponent } from './../../components-child/game-recommend-bottom/game-recommend-bottom.component';
import { UsersRankedSidebarComponent } from './../../components-child/users-ranked-sidebar/users-ranked-sidebar.component';
import { Game } from '../../classes/game';
@Component({
  selector: 'app-game2',
  templateUrl: './game2.component.html',
  styleUrls: ['./game.component.scss'],
})
export class Game2Component implements OnInit {
  private game: Game;
  private show: string;
  private share: string;
  private facebookCommentShowed: boolean;
  @ViewChild(GameRecommendBottomComponent) private gameRecommendBottomComponent: GameRecommendBottomComponent;
  @ViewChild(GameRecommendRightComponent) private gameRecommendRightComponent: GameRecommendRightComponent;
  @ViewChild(GameRecommendLeftComponent) private gameRecommendLeftComponent: GameRecommendLeftComponent;
  @ViewChild(UsersRankedSidebarComponent) private usersRankedSidebarComponent: UsersRankedSidebarComponent;

  constructor(private route: ActivatedRoute, private gameService: GameService) { }

  ngOnInit() {

    this.show = "intro";
    this.route.params.subscribe(params => {
      this.gameRecommendBottomComponent.loadRecommendGame();
      this.gameRecommendLeftComponent.loadRecommendGame();
      this.gameRecommendRightComponent.loadRecommendGame();
      this.gameService.getGame(params['id']).subscribe((res: any) => {
        // console.log("IN PUT " + JSON.stringify(res.data));
        this.gameService.gameSource.next(res.data);
        this.game = res.data;
        // this.gameIntroComponent.setVisible(true);
        // this.iframeGameComponent.setVisible(false);
        // this.gameShareComponent.setVisible(false);
        // this.gameIntroComponent.setLibrariesPreloadDone(false);

        this.facebookCommentShowed = false;
        this.facebookCommentShowed = true;
        // this.iframeAdsComponent._closeAds();
      });
    });
  }

}
