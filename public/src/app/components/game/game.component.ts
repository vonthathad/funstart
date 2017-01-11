import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { RestService } from '../../services/rest.service'

import { Game } from '../../classes/game';
@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],

})
export class GameComponent implements OnInit {
  private game: Game;
  constructor(private route: ActivatedRoute, private rest: RestService) { 
    route.params.subscribe(params=>{
       this.rest.getGame(params['id']).subscribe((res: any)=>this.renderGame(res.data))
    });
  }
  renderGame(game){
    this.game = game;
    console.log(JSON.stringify(game));
  }
  ngOnInit() {
    
  }

}
