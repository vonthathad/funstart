import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Game } from '../../classes/game';
import { VideoPlayerComponent } from '../video-player/video-player.component';

@Component({
  selector: 'app-game-card',
  templateUrl: './game-card.component.html',
  styleUrls: ['./game-card.component.scss'],
})
export class GameCardComponent implements OnInit {
  @Input('game') game: Game;
  @ViewChild(VideoPlayerComponent) videoplayer: VideoPlayerComponent;

  constructor() { }


  showGameInfo() {    
    console.log("Show Info");
    this.videoplayer.isDisplay = true;
    this.videoplayer.playVideo();
  }

  over() {
    this.videoplayer.isDisplay = true;
    this.videoplayer.playVideo();
  }

  leave(){
      this.videoplayer.isDisplay = false;
      this.videoplayer.stopVideo();
  }

  ngOnInit() {
    console.log(this.game);
  }

}
