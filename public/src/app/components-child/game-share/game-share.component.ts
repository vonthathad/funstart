import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {Game} from '../../classes/game';
import { ImageService } from '../../services/image.service'
import { ShareService } from '../../services/share.service'

@Component({
  selector: 'app-game-share',
  templateUrl: './game-share.component.html',
  styleUrls: ['./game-share.component.scss']
})
export class GameShareComponent implements OnInit {
  private visible: boolean;
  @Input() private result: Object;
  @Input() private game: Game;
  @Output() continueGame = new EventEmitter();
  constructor(private imageService: ImageService, private shareService: ShareService) { }

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
    console.log("RESUKT" + JSON.stringify(result));
  }
  
  shareFacebook() {
    this.imageService.createImage(32, this.result).subscribe(
      // pictureUrl => {
      //   console.log(pictureUrl);
      //   this.shareService.setInfo({ pictureUrl: pictureUrl });
      //   this.shareService.shareFacebook(function () {
      //     console.log('done share');
      //   });
      // },
      // err => {
      //   // Log errors if any
      //   console.log(err);
      // }
      );
  }
  shareTwitter() {
    alert("NOT DONE");
  }
  setVisible(visible){
    this.visible = visible;
  }
}
