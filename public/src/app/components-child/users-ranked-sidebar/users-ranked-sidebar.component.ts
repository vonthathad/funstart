import { Component, OnInit, Input } from '@angular/core';
import { Game } from '../../classes/game';
import { UserService } from '../../services/user.service'
@Component({
  selector: 'app-users-ranked-sidebar',
  templateUrl: './users-ranked-sidebar.component.html',
  styleUrls: ['./users-ranked-sidebar.component.scss']
})
export class UsersRankedSidebarComponent implements OnInit {
  @Input() private game: Game;
  private rankedUsers: any;
  constructor(private userService: UserService) { }

  ngOnInit() {
  }
  setGame(game) {
    this.game = game;
    this.userService
      .getRankedUsers({ game: this.game._id, user:this.userService._getUser()._id })
      .subscribe(rankedUsers => this.renderRankedUser(rankedUsers["data"]));

  }
  renderRankedUser(rankedUsersData) {
    this.rankedUsers = [];
    console.log("rankedUsersData " + JSON.stringify(rankedUsersData));
    var i;
    for (i = 0; i < rankedUsersData.length; i++) {
      if (i < 3) {
        let rankedUser: any = new Object();
        let rankedUserData = rankedUsersData[i];
        rankedUser.name = rankedUserData.user.username;
        rankedUser.avatar = rankedUserData.user.avatar;
        rankedUser.score = rankedUserData.score;
        rankedUser.rank = i;
        rankedUser.isCurrentUser = this.userService._getUser()._id == rankedUserData.user._id;
        this.rankedUsers.push(rankedUser);
      } else {
        let rankedUserData = rankedUsersData[i];
        if (this.userService._getUser()._id == rankedUserData.user._id) {
          let rankedUser: any = new Object();
          rankedUser.name = rankedUserData.user.username;
          rankedUser.avatar = rankedUserData.user.avatar;
          rankedUser.score = rankedUserData.score;
          rankedUser.rank = i;
          rankedUser.isCurrentUser = true;
          this.rankedUsers.push(rankedUser);
        };
      }
    }
    console.log("rankedUsers " + JSON.stringify(this.rankedUsers));
    // rankedUsersData.forEach(function () {
    //   let rankedUser : any;
    //   rankedUser.name = name;
    //   rankedUser.score = name;
    // });
  }
}
