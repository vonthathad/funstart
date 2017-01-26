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
    // alert(this.userService._getUser()._id);
    if (this.userService._getUser()) {
      console.log("ID " + this.userService._getUser()._id);
      this.userService
        .getRankedUsers({ game: this.game._id, user: this.userService._getUser()._id })
        .subscribe(rankedUsers => this.renderRankedUser(rankedUsers["data"]));
    } else {
      this.userService
        .getRankedUsers({ game: this.game._id })
        .subscribe(rankedUsers => this.renderRankedUser(rankedUsers["data"]));
    }

  }
  renderRankedUser(rankedUsersData) {
    this.rankedUsers = [];
    console.log("rankedUsersData " + JSON.stringify(rankedUsersData));
    var i;
    if (this.userService._getUser()) {
      var userOnTop = false;
      for (i = 0; i < rankedUsersData.length; i++) {
        if (i < rankedUsersData.length - 1) {
          let rankedUser: any = new Object();
          let rankedUserData = rankedUsersData[i];
          rankedUser.name = rankedUserData.user.username;
          rankedUser.avatar = rankedUserData.user.avatar;
          rankedUser.score = rankedUserData.score;
          rankedUser.rank = i;
          rankedUser.isCurrentUser = false;
          if (this.userService._getUser() && this.userService._getUser()._id == rankedUserData.user._id) {
            rankedUser.isCurrentUser = true;
            this.userService._getUser().score = rankedUserData.score;
            userOnTop = true;
          }
          this.rankedUsers.push(rankedUser);
        } else if (i == rankedUsersData.length - 1 && !userOnTop) {
          let rankedUserData = rankedUsersData[i];
          if (this.userService._getUser()._id == rankedUserData.user._id) {
            let rankedUser: any = new Object();
            rankedUser.name = rankedUserData.user.username;
            rankedUser.avatar = rankedUserData.user.avatar;
            rankedUser.score = rankedUserData.score;
            rankedUser.rank = i;
            rankedUser.isCurrentUser = true;
            this.userService._getUser().score = rankedUserData.score;
            this.rankedUsers.push(rankedUser);
          };
        }
      }
    } else {
      for (i = 0; i < rankedUsersData.length; i++) {
        let rankedUser: any = new Object();
        let rankedUserData = rankedUsersData[i];
        rankedUser.name = rankedUserData.user.username;
        rankedUser.avatar = rankedUserData.user.avatar;
        rankedUser.score = rankedUserData.score;
        rankedUser.rank = i;
        rankedUser.isCurrentUser = false;
        this.rankedUsers.push(rankedUser);
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
