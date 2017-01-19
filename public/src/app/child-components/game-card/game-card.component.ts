import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { Game } from '../../classes/game';
import { VideoPlayerComponent } from '../video-player/video-player.component';

@Component({
  selector: 'app-game-card',
  templateUrl: './game-card.component.html',
  styleUrls: ['./game-card.component.scss'],
})
export class GameCardComponent implements OnInit {
  isThumbDisplay: boolean;

  @Input('game') game: Game;
  @ViewChild(VideoPlayerComponent) videoplayer: VideoPlayerComponent;
  
  constructor(private el: ElementRef) {
    this.isThumbDisplay = true;
  }

  showGameInfo() {
    console.log("Show Info");
    this.videoplayer.isDisplay = true;
    this.videoplayer.playVideo();
  }

  over() {
    this.isThumbDisplay = false;
    // console.log('hide the thumb + hidden is  ' + this.isThumbDisplay );
    this.videoplayer.isDisplay = true;
    this.videoplayer.playVideo();
  }

  leave() {
    this.isThumbDisplay = true;
    // console.log('show the thumb + hidden is  ' + this.isThumbDisplay  );
    this.videoplayer.isDisplay = false;
    this.videoplayer.stopVideo();
  }

  ngOnInit() {
    // console.log(this.game);
  }

}
