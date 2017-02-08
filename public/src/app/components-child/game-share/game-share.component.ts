import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { Game } from '../../classes/game';
import { User } from '../../classes/user';
import { Activity } from '../../classes/activity';

import { ImageService } from '../../services/image.service'
import { ShareService } from '../../services/share.service'
import { UserService } from '../../services/user.service'
import { GameService } from '../../services/game.service'

@Component({
      selector: 'app-game-share',
      templateUrl: './game-share.component.html',
      styleUrls: ['./game-share.component.scss']
})
export class GameShareComponent implements OnInit {
      private visible: boolean;
      private shareDisable: boolean = false;
      private imageData: number;
      private user: User;
      private result: Object;
      private game: Game;
      private bestScore: number;
      @Output() continueGame = new EventEmitter();

      constructor(private imageService: ImageService, private shareService: ShareService, private userService: UserService, private gameService: GameService) {
      }

      ngOnInit() {

            this.game = this.gameService.game;
            if (this.game) {
                  this.setInfoShareService();
            }
            this.gameService.game$.subscribe(game => {
                  this.game = game;
                  this.setInfoShareService();
            });
            // gameService.gameResult$.subscribe(gameResult => {this.updateResult(gameResult)});

            this.user = this.userService.user;
            this.userService.loggedUser$.subscribe(
                  user => {
                        this.user = user;
                  }
            )

            this.userService.rankedUser$.subscribe((rankedUsers:Activity[]) =>{
                  // console.log(rankedUsers, this.user);
                  let i = 0;
                  for (i=0; i < rankedUsers.length; i++){
                        if(this.user && this.user._id == rankedUsers[i].user._id){
                              this.bestScore = rankedUsers[i].score;
                              break;
                        }
                  }
            });
      }

      setInfoShareService() {
            this.shareService.setInfo({
                  title: this.game.title,
                  des: this.game.des,
                  shareUrl: location.protocol + '//' + location.hostname + "/game/" + this.game._id
            });
      }

      _continueGame() {
            this.continueGame.emit();
      }

      setScreenShotData(imageData) {
            this.imageData = imageData;
      }

      updateResult(result) {
            console.log(1);
            this.result = JSON.parse(result);


            // if (this.userService.checkUser()) {
            //   this.shareDisable = true;
            //   // THERE IS AN USER
            //   this.imageService.createImage(this.game._id, this.result).subscribe(
            //     pictureUrl => {
            //       console.log(pictureUrl);
            //       this.userService.postActivity({
            //         score: this.result["score"],
            //         game: this.game._id,
            //         pictureUrl: pictureUrl
            //       }).subscribe(() => {
            //         this.shareService.setInfo({ pictureUrl: pictureUrl });
            //         this.shareDisable = false;
            //       })
            if(this.bestScore && this.result["score"] < this.bestScore){
                  this.result["score"] = this.bestScore;
            }
            if (this.user) {
                  // check if user has played this game or not, it not, give him 0 init score
                  if (this.user.score == undefined) this.user.score = 0;
                  // adding new score
                  this.user.score = this.result["score"];
                  let score = this.user.score;
                  // console.log(this.user.score);

                  console.log("Score " + score)

                  // console.log(this.userService.checkUser());
                  //  console.log("USER " + this.user.score + " result " + this.result["score"] + " gameid " + this.game._id);
                  if (this.userService.checkUser()) {
                        this.shareDisable = true;
                        // THERE IS AN USER
                        this.imageService.createImage(this.game._id, this.result).subscribe(
                              res => {
                                    console.log("IMAGE SERVICE " + JSON.stringify(res.data));

                                    console.log("USER " + score + " result " + this.result["score"] + " gameid " + this.game._id);
                                    this.userService.postActivity({
                                          score: score,
                                          game: this.game._id,
                                          pictureUrl: res.data
                                    }).subscribe(() => {
                                          // this.shareService.setInfo({ pictureUrl: res.data });
                                          // this.shareDisable = false;
                                          // this.gameService.gameResultSource.next(result);


                                          this.result['pictureUrl'] = res.data;
                                          this.result['des'] = this.result['descr'];
                                          this.result['title'] = `If you beat my score [${this.result['score']}] in this Game, you're a GENIUS!`;
                                          console.log(this.result);
                                          this.shareService.setInfo(this.result);
                                          // this.shareService.shareFacebook(function () {
                                          //       console.log('done share');
                                          // });
                                          this.shareDisable = false;
                                          this.gameService.gameResultSource.next(result);

                                    }, err => console.error(err))
                              },
                              err => {
                                    // Log errors if any
                                    console.error(err);
                              });
                  }
            } else {
               // post activity to add play turn
                  this.userService.postActivity({
                        game: this.game._id
                  })
                  //    .subscribe(() => {
                  // },
                  //       err => console.error(err)
                  // );
                  // update result to share facebook
                  console.log(JSON.stringify(this.result));
               this.gameService.gameResultSource.next(this.result);
            }
      }

      shareFacebook() {

            // if (!this.userService.checkUser()) {
            //   // THERE IS NO USER
            //   this.imageService.createImage(32, this.result).subscribe(
            //     pictureUrl => {
            //       console.log(pictureUrl);
            //       this.shareService.setInfo({ pictureUrl: pictureUrl });
            //       this.shareService.shareFacebook(function () {
            //         console.log('done share');
            //       });
            //       this.shareDisable = false;
            //     },
            //     err => {
            //       // Log errors if any
            //       console.log(err);
            //     });
            // } else {
            //   this.shareService.shareFacebook(function () {
            //     console.log('done share');
            //   });
            // }
            console.log(this.result);
            if (!this.userService.checkUser()) {
                  this.shareDisable = true;
                  // THERE IS NO USER
                  this.imageService.createImage(this.game._id, this.result).subscribe(
                        res => {
                              this.result['pictureUrl'] = res.data;
                              this.result['des'] = this.result['descr'];
                              this.result['title'] = `If you beat my score [${this.result['score']}] in this Game, you're a GENIUS!`;
                               console.log(this.result);
                              this.shareService.setInfo(this.result);
                              this.shareService.shareFacebook(function () {
                                    console.log('done share');
                              });
                              this.shareDisable = false;
                        },
                        err => {
                              // Log errors if any
                              console.log(err);
                        });
            } else {
                  this.shareService.shareFacebook(function () {
                        console.log('done share');
                  });
            }

      }
      // TODO nothing
      shareTwitter() {
            alert("NOT DONE");
      }

      setVisible(visible) {
            this.visible = visible;
      }
}
