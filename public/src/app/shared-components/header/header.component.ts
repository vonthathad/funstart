import { Component, OnInit } from '@angular/core';
import { MdDialog } from '@angular/material';
import { ActivatedRoute } from '@angular/router';


import { GameService } from '../../services/game.service'
import { UserService } from '../../services/user.service'
import { ConstantService } from '../../services/constant.service';


import { User } from '../../classes/user';
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
  private user: User;

  constructor(private gameService: GameService, private userService: UserService, public dialog: MdDialog, private route: ActivatedRoute) {
    // listening for registered user, if there is one, render to user
    this.userService.loggedUser$.subscribe(user => this.renderUser(user));
  }

  ngOnInit() {
    // load games for autocomplete
    this.gameService
      .getGames({ order: "random", paging: 6 })
      .subscribe((res: any) => this.renderGames(res['data']));
    
    // get user token if there is one in url
    this.route.queryParams.subscribe(queryParam => {
      let token = queryParam['token'];
      // if there is one, take user in db and render to user
      if (token) this.userService.getUser(token).subscribe((res: any) => this.renderUser(res.user));
    });
  }
  renderGames(games) {
    this.games = games;
  }
  renderUser(user) {
    console.log("USER " + JSON.stringify(user));
    this.user = new User();
    this.user.token = user.token;
    this.user.displayName = user.displayName;
    this.user.avatar = user.avatar;
  }
  openDialog() {
    let dialogRef = this.dialog.open(AccountDialogComponent, {
      height: '300px',
      width: '600px'
    });
  }
  logout() {
    this.userService.logout(this.user.token);
    delete this.user;
    // .subscribe((res: any) => this.renderUser(res.user));
    // window.location.href = `http://localhost:8235/logout`;
  }
}
