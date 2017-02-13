import { Component, OnInit,ChangeDetectionStrategy,ChangeDetectorRef, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { GameService } from '../../services/game.service'

import { Game } from '../../classes/game';
import {ParentComponent} from "../../parent.component";
@Component({
  selector: 'app-topic',
  templateUrl: './topic.component.html',
  styleUrls: ['./topic.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TopicComponent extends ParentComponent implements OnInit, OnDestroy {
  private topicId: string;
  private games: Game[];
  private paging: number;
  private page: number;
  private order: string;
  private hasMore: boolean;
  private isLoading: boolean;
  constructor(private route: ActivatedRoute, private gameService: GameService,private cd: ChangeDetectorRef) {
    super();
  }

  ngOnInit() {
    this.paging = 8;
    this.page = 1;
    this.isLoading = true;
    this.hasMore = true;
    this.order = "new";
    this.disposable = this.route.params.subscribe(params => {
      this.topicId = params['id'];
      this.disposable = this.gameService.getGames({ topic: this.topicId, order: this.order, paging: this.paging, page: this.page }).subscribe((res: any) => this.renderGames(res.data,true,res.isNext))
    });
  }
  getGames(order) {
    this.hasMore = true;
    this.page = 1;
    this.order = order;
    this.disposable = this.gameService.getGames({ topic: this.topicId, order: this.order, paging: this.paging, page: this.page }).subscribe((res: any) => this.renderGames(res.data,true,res.isNext))
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
    this.cd.markForCheck();
  }
  ngOnDestroy() {
    this.disposeSubscriptions();
  }
}
