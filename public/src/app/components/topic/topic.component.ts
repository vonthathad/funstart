import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { RestService } from '../../services/rest.service'

import { Game } from '../../classes/game';
@Component({
  selector: 'app-topic',
  templateUrl: './topic.component.html',
  styleUrls: ['./topic.component.scss']
})
export class TopicComponent implements OnInit {
  private topicId: string;
  private games: Game[];
  constructor(private route: ActivatedRoute, private rest: RestService) {
    route.params.subscribe(params => {
      this.topicId = params['id'];
      this.rest.getGames({ topic: this.topicId, order: "new" }).subscribe((res: any) => this.renderGames(res.data))
    });
  }

  ngOnInit() {
  }
  getGames(order) {
    console.log(order);
    this.rest.getGames({ topic: this.topicId, order: order }).subscribe((res: any) => this.renderGames(res.data))
  }
  renderGames(games) {
    this.games = games;
    console.log(JSON.stringify(games));
  }
}
