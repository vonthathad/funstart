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

  // private gamesCollections: any[];
  private games: Game[];
  private paging: number;
  private page: number;
  private hasMore: boolean;
  private isLoading: boolean;
  private
  ngOnInit() {
    // let _this = this;
    // ConstantService.TOPICS.forEach(function (topic) { // loop through topics
    //   _this.gameService
    //     .getGames({ paging: 6, topic: topic._id })
    //     .subscribe((res: any) => _this.renderGames(res.data, topic)); // take game from database
    // });
    this.paging = 8;
    this.page = 1;
    this.isLoading = true;
    this.hasMore = true;
    this.gameService
        .getGames({ paging: this.paging,page: this.page})
        .subscribe((res: any) => this.renderGames(res.data,true,res.isNext));
  }
  onScroll(){
    if(this.hasMore && !this.isLoading){
      this.isLoading = true;
      this.page++;
      this.gameService
          .getGames({ paging: this.paging,page: this.page})
          .subscribe((res: any) => this.renderGames(res.data,false,res.isNext));
    }
  }
  renderGames(games: Game[],isNew,isNext) {
    console.log(isNext);
    // console.log(JSON.stringify(games));
    // this.gamesCollections.push({ topic: topic, games: games }); // set to views
    if(isNew){
      this.games = games;
    } else {
      this.games = this.games.concat(games);
    }
    this.hasMore = isNext;
    this.isLoading = false;
  }
  goUser() {
    this.router.navigate(['user']);
  }
}


