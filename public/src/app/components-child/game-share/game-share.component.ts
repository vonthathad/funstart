import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Game } from '../../classes/game';
import { ImageService } from '../../services/image.service'
import { ShareService } from '../../services/share.service'
import { UserService } from '../../services/user.service'

@Component({
  selector: 'app-game-share',
  templateUrl: './game-share.component.html',
  styleUrls: ['./game-share.component.scss']
})
export class GameShareComponent implements OnInit {
  private visible: boolean;
  private shareDisable: boolean = false;
  private imageData: number;
  @Input() private result: Object;
  @Input() private game: Game;
  @Output() continueGame = new EventEmitter();
  constructor(private imageService: ImageService, private shareService: ShareService, private userService: UserService) { }

  ngOnInit() {
    this.shareService.setInfo({
      title: this.game.title,
      des: this.game.des,
      shareUrl: location.protocol + '//' + location.hostname + "/game/" + this.game._id
    });
    // this.shareService.setInfo({
    //   title: "abc",
    //   des: "you win",
    //   shareUrl: "https://www.solome.co/games/32"
    // });

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

    
    if (this.userService._getUser()) {
      // check if user has played this game or not, it not, give him 0 init score
      if (this.userService._getUser().score == undefined) this.userService._getUser().score = 0;
      // adding new score
      this.userService._getUser().score += this.result["score"];

      alert(this.userService._getUser().score);

      if (this.userService.checkUser()) {
        this.shareDisable = true;
        // THERE IS AN USER
        this.imageService.createImage(this.game._id, this.result).subscribe(
          res => {
            console.log("IMAGE SERVICE " + JSON.stringify(res.data));
            this.userService.postActivity({
              score: this.userService._getUser().score,
              game: this.game._id,
              pictureUrl: res.data
            }).subscribe(() => {
              this.shareService.setInfo({ pictureUrl: res.data });
              this.shareDisable = false;
            })
          },
          err => {
            // Log errors if any
            console.log(err);
          });
      }
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

    if (!this.userService.checkUser()) {
      this.shareDisable = true;
      // THERE IS NO USER
      this.imageService.createImage(this.game._id, this.result).subscribe(
        res => {
          this.shareService.setInfo({ pictureUrl: res.data });
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
  shareTwitter() {
    alert("NOT DONE");
  }
  setVisible(visible) {
    this.visible = visible;
  }
}
