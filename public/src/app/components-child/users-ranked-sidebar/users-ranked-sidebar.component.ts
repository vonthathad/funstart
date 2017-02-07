import {Component, OnInit, Input} from '@angular/core';

import {Subscription} from 'rxjs/Subscription';

import {Game} from '../../classes/game';
import {User} from '../../classes/user';

import {UserService} from '../../services/user.service'
import {GameService} from '../../services/game.service'
@Component({
   selector: 'app-users-ranked-sidebar',
   templateUrl: './users-ranked-sidebar.component.html',
   styleUrls: ['./users-ranked-sidebar.component.scss']
})
export class UsersRankedSidebarComponent implements OnInit {
   private game: Game;
   private gameResult: Object;
   private rankedUsers: any;
   private user: User;
   private subscription: Subscription;

   constructor(private userService: UserService, private gameService: GameService) {
   }

   ngOnInit() {
      this.user = this.userService.user;
      this.userService.loggedUser$.subscribe(user => this.user = user);

      this.game = this.gameService.game;
      this.gameService.game$.subscribe(game => {
         this.game = game;
         this.setGame()
      });
      this.gameService.gameResult$.subscribe(whatever => this.setGame());
   }

   setGame() {

      if (this.user) {
         console.log("ID " + this.user._id);
         this.userService
            .getRankedUsers({game: this.game._id, user: this.user._id})
            .subscribe(rankedUsers => {
               this.renderRankedUser(rankedUsers["data"]);
               this.userService.rankedUserSource.next(rankedUsers["data"]);
            });
      } else {
         this.userService
            .getRankedUsers({game: this.game._id})
            .subscribe(rankedUsers =>{
               this.renderRankedUser(rankedUsers["data"]);
               this.userService.rankedUserSource.next(rankedUsers["data"]);
            });
      }

   }

   renderRankedUser(rankedUsersData) {
      this.rankedUsers = [];
      console.log("rankedUsersData " + JSON.stringify(rankedUsersData));
      var i;
      if (this.user) {
         var userOnTop = false;
         for (i = 0; i < rankedUsersData.length; i++) {
            if (i < rankedUsersData.length - 1) {
               let rankedUser: any = new Object();
               let rankedUserData = rankedUsersData[i];
               rankedUser.name = rankedUserData.user.displayName;
               rankedUser.avatar = rankedUserData.user.avatar;
               rankedUser.score = rankedUserData.score;
               rankedUser.rank = i;
               rankedUser.isCurrentUser = false;
               if (this.user && this.user._id == rankedUserData.user._id) {
                  rankedUser.isCurrentUser = true;
                  this.user.score = rankedUserData.score;
                  userOnTop = true;
               }
               this.rankedUsers.push(rankedUser);
            } else if (i == rankedUsersData.length - 1 && !userOnTop) {
               let rankedUserData = rankedUsersData[i];
               if (this.user._id == rankedUserData.user._id) {
                  let rankedUser: any = new Object();
                  rankedUser.name = rankedUserData.user.displayName;
                  rankedUser.avatar = rankedUserData.user.avatar;
                  rankedUser.score = rankedUserData.score;
                  rankedUser.rank = i;
                  rankedUser.isCurrentUser = true;
                  this.user.score = rankedUserData.score;
                  this.rankedUsers.push(rankedUser);
               }
               ;
            }
         }
      } else {
         for (i = 0; i < rankedUsersData.length; i++) {
            let rankedUser: any = new Object();
            let rankedUserData = rankedUsersData[i];
            rankedUser.name = rankedUserData.user.displayName;
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
