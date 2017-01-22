import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { GameService } from '../../services/game.service'

import { Game } from '../../classes/game';
@Component({
  selector: 'app-topic',
  templateUrl: './topic.component.html',
  styleUrls: ['./topic.component.scss']
})
export class TopicComponent implements OnInit {
  private topicId: string;
  private games: Game[];
  private paging: number;
  constructor(private route: ActivatedRoute, private gameService: GameService) {
    this.paging = 6;
    route.params.subscribe(params => {
      this.topicId = params['id'];
      this.gameService.getGames({ topic: this.topicId, order: "new", paging: this.paging }).subscribe((res: any) => this.renderGames(res.data))
    });

  }

  ngOnInit() {
  }
  getGames(order) {
    console.log(order);
    this.gameService.getGames({ topic: this.topicId, order: order, paging: this.paging }).subscribe((res: any) => this.renderGames(res.data))
  }
  renderGames(games) {
    this.games = games;
    console.log(JSON.stringify(games));
  }
}
