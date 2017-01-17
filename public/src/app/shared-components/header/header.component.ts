import { Component, OnInit } from '@angular/core';
import { MdDialog } from '@angular/material';

import { GameService } from '../../services/game.service'
import { ConstantService } from '../../services/constant.service';

import { Game } from '../../classes/game';

import { AccountDialogComponent } from '../../child-components/account-dialog/account-dialog.component';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  private topics = ConstantService.TOPICS;
  private games: Game[];
  constructor(private gameService: GameService, public dialog: MdDialog) {
    this.gameService.getGames({ order: "random", paging: 6 }).subscribe((res: any) => this.renderGames(res))
  }

  ngOnInit() {

  }
  renderGames(games) {
    this.games = games['data'];
  }
  openDialog() {
    let dialogRef = this.dialog.open(AccountDialogComponent, {
      height: '300px',
      width: '600px'
    });
  }
}
