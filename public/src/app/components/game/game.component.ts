import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import {GameService } from '../../services/game.service'
import {RestService } from '../../services/rest.service'

import { Game } from '../../classes/game';
@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],

})
export class GameComponent implements OnInit {
  private game: Game;
  constructor(private route: ActivatedRoute, private gameService: RestService) { 
    route.params.subscribe(params=>{
       this.gameService.getGame(params['id']).subscribe((res: any)=>this.renderGame(res.data))
    });
  }
  renderGame(game){
    this.game = game;
    console.log("GAME " + JSON.stringify(game));
  }
  ngOnInit() {
    
  }

}
