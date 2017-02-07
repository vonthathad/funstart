import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { Game } from '../../classes/game';
import { User } from '../../classes/user';

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
      @Output() continueGame = new EventEmitter();

      constructor(private imageService: ImageService, private shareService: ShareService, private userService: UserService, private gameService: GameService) {
            this.game = gameService.game;
            if (this.game) {
                  this.setInfoShareService();
            }
            gameService.game$.subscribe(game => {
                  this.game = game;
                  this.setInfoShareService();
            });
            // gameService.gameResult$.subscribe(gameResult => {this.updateResult(gameResult)});

      }

      ngOnInit() {

            // this.shareService.setInfo({
            //   title: "abc",
            //   des: "you win",
            //   shareUrl: "https://www.solome.co/games/32"
            // });
            this.user = this.userService.user;
            this.userService.loggedUser$.subscribe(
                  user => {
                        this.user = user;
                  }
            )
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

            if (this.user) {
                  // check if user has played this game or not, it not, give him 0 init score
                  if (this.user.score == undefined) this.user.score = 0;
                  // adding new score
                  this.user.score = this.result["score"];
                  let score = this.user.score;
                  // alert(this.user.score);

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
                                          console.log(this.result);
                                          this.shareService.setInfo(this.result);
                                          this.shareService.shareFacebook(function () {
                                                console.log('done share');
                                          });
                                          this.shareDisable = false;
                                          this.gameService.gameResultSource.next(result);

                                    }, err => console.log(2))
                              },
                              err => {
                                    // Log errors if any
                                    console.log(err);
                              });
                  }
            } else {
                  this.userService.postActivity({
                        game: this.game._id
                  }).subscribe(() => {
                        this.gameService.gameResultSource.next(result);
                  }, (err) => console.log(2));
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
