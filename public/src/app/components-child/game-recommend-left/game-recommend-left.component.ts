import { Component, OnInit,  } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { GameService } from '../../services/game.service';

import { Game } from '../../classes/game';
@Component({
  selector: 'app-game-recommend-left',
  templateUrl: './game-recommend-left.component.html',
  styleUrls: ['./game-recommend-left.component.scss']
})
export class GameRecommendLeftComponent implements OnInit {
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
      .getGames({ order: "random", paging: 3 })
      .subscribe((res: any) => this.renderGames(res.data));
  }

}
