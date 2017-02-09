import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { GameService } from '../../services/game.service'

import { Game } from '../../classes/game';
@Component({
  selector: 'app-game2',
  templateUrl: './game2.component.html',
  styleUrls: ['./game.component.scss'],
})
export class Game2Component implements OnInit {
  private topicId: string;
  private games: Game[];
  private paging: number;
  private page: number;
  private order: string;
  private hasMore: boolean;
  private isLoading: boolean;
  constructor(private route: ActivatedRoute, private gameService: GameService) {
    this.paging = 8;
    this.page = 1;
    this.isLoading = true;
    this.hasMore = true;
    this.order = "new";
    route.params.subscribe(params => {
      this.topicId = params['id'];
      this.gameService.getGames({ topic: this.topicId, order: this.order, paging: this.paging, page: this.page }).subscribe((res: any) => this.renderGames(res.data,true,res.isNext))
    });

  }

  ngOnInit() {
  }
  getGames(order) {
    this.hasMore = true;
    this.page = 1;
    this.order = order;
    this.gameService.getGames({ topic: this.topicId, order: this.order, paging: this.paging, page: this.page }).subscribe((res: any) => this.renderGames(res.data,true,res.isNext))
  }
  onScroll(){

    if(this.hasMore && !this.isLoading){
      this.isLoading = true;
      this.page++;
      this.gameService
          .getGames({ topic: this.topicId, order: this.order, paging: this.paging, page: this.page})
          .subscribe((res: any) => this.renderGames(res.data,false,res.isNext));
    }
  }
  renderGames(games: Game[],isNew,isNext) {
    if(isNew){
      this.games = games;
    } else {
      this.games = this.games.concat(games);
    }
    this.hasMore = isNext;
    this.isLoading = false;
  }
}
