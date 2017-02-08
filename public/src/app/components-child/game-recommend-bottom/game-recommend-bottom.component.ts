import { Component, OnInit,  } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { GameService } from '../../services/game.service';

import { Game } from '../../classes/game';
@Component({
  selector: 'app-game-recommend-bottom',
  templateUrl: './game-recommend-bottom.component.html',
  styleUrls: ['./game-recommend-bottom.component.scss']
})
export class GameRecommendBottomComponent implements OnInit {
  private games: Game[];
  
  constructor(private router: Router, private gameService: GameService) { }

  ngOnInit() {
    this.loadRecommendGame();
  }
  renderGames(games: Game[]) {
    this.games = games;
  }
  loadRecommendGame(){
    this.gameService
      .getGames({ order: "random", paging: 2 })
      .subscribe((res: any) => this.renderGames(res.data));
  }

}
