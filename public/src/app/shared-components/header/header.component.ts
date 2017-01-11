import { Component, OnInit } from '@angular/core';
import {MdDialog} from '@angular/material';
import { RestService } from '../../services/rest.service'
import {ConstantService} from '../../services/constant.service';

import {Game} from '../../classes/game';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  private topics = ConstantService.TOPICS;
  private games: Game[];
  constructor(private rest: RestService, private model: MdDialog) { 
      this.rest.getGames({order: "random", paging: 6}).subscribe((res: any)=>this.renderGames(res))
  }
  
  ngOnInit() {

  }
  renderGames(games){
    this.games = games['data'];
  }
}
