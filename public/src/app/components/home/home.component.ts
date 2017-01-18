import { NgModule, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';

import { GameService } from '../../services/game.service';
import { ConstantService } from '../../services/constant.service';

import { Game } from '../../classes/game';
import { Topic } from '../../classes/topic';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  constructor(private router: Router, private gameService: GameService) { }

  private gamesCollections: any[];

  ngOnInit() {
    this.gamesCollections = [];

    let _this = this;
    ConstantService.TOPICS.forEach(function (topic) { // loop through topics
      _this.gameService
        .getGames({ paging: 6, topic: topic._id })
        .subscribe((res: any) => _this.renderGames(res.data, topic)); // take game from database
    });
  }
  renderGames(games: any, topic: Topic) {
    // console.log(JSON.stringify(games));
    this.gamesCollections.push({ topic: topic, games: games }); // set to views
  }
  goUser() {
    this.router.navigate(['user']);
  }
}


