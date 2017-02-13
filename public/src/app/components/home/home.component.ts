import { Component, OnInit,OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';

import { GameService } from '../../services/game.service';
import { ParentComponent } from '../../parent.component';
import { Game } from '../../classes/game';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent extends ParentComponent implements OnInit, OnDestroy {
  constructor(private gameService: GameService,private cd: ChangeDetectorRef) {
    super();
  }

  // private gamesCollections: any[];
  private games: Game[];
  private paging: number;
  private page: number;
  private hasMore: boolean;
  private isLoading: boolean;
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
    this.disposable = this.gameService
        .getGames({ paging: this.paging,page: this.page,order: 'created'})
        .subscribe((res: any) => this.renderGames(res.data,true,res.isNext));
  }
  onScroll(){
    if(this.hasMore && !this.isLoading){
      this.isLoading = true;
      this.page++;
      this.disposable = this.gameService
          .getGames({ paging: this.paging,page: this.page,order: 'created'})
          .subscribe((res: any) => this.renderGames(res.data,false,res.isNext));
    }
  }
  renderGames(games: Game[],isNew,isNext) {
    console.log(isNext);
    console.log('games',games);
    // console.log(JSON.stringify(games));
    // this.gamesCollections.push({ topic: topic, games: games }); // set to views
    if(isNew){
      this.games = games;
    } else {
      this.games = this.games.concat(games);
    }
    console.log('thisgames',this.games);
    this.hasMore = isNext;
    this.isLoading = false;
    this.cd.markForCheck();
  }

  ngOnDestroy() {
    this.disposeSubscriptions();
  }

  // goUser() {
  //   this.router.navigate(['user']);
  // }
}


