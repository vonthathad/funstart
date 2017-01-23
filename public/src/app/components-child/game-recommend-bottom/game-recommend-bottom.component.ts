import { Component, OnInit } from '@angular/core';
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
    this.gameService
      .getGames({ order: "random", paging: 3 })
      .subscribe((res: any) => this.renderGames(res.data));
  }
  renderGames(games: Game[]) {
    this.games = games;
  }
}
