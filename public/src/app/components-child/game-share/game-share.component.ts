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
  @Input() private result: Object;
  @Input() private game: Game;
  @Output() continueGame = new EventEmitter();
  constructor(private imageService: ImageService, private shareService: ShareService, private userService: UserService) { }

  ngOnInit() {
    this.shareService.setInfo({
      title: "abc",
      des: "you win",
      shareUrl: "https://www.solome.co/games/32"
    });

  }
  _continueGame() {
    this.continueGame.emit();
  }
  updateResult(result) {
    this.result = JSON.parse(result);

    if (this.userService.checkUser()) {
      this.shareDisable = true;
      // THERE IS AN USER
      this.imageService.createImage(this.game._id, this.result).subscribe(
        res => {
          this.userService.postActivity({
            score: this.result["score"],
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
  share() {
    this.imageService.createImage
  }
  shareFacebook() {
    if (!this.userService.checkUser()) {
      this.shareDisable = true;
      // THERE IS NO USER
      this.imageService.createImage(32, this.result).subscribe(
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
