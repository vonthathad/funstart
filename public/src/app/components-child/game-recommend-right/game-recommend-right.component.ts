import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { GameService } from '../../services/game.service';

import { Game } from '../../classes/game';

@Component({
  selector: 'app-game-recommend-right',
  templateUrl: './game-recommend-right.component.html',
  styleUrls: ['./game-recommend-right.component.scss']
})
export class GameRecommendRightComponent implements OnInit {
 private games: Game[];
  constructor(private router: Router, private gameService: GameService) { }

  ngOnInit() {
    this.gameService
      .getGames({ order: "random", paging: 4 })
      .subscribe((res: any) => this.renderGames(res.data));
  }
  renderGames(games: Game[]) {
    this.games = games;
  }

}
