import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Game } from '../../classes/game';
import { VideoPlayer } from '../video-player'; 

@Component({
  selector: 'app-game-card',
  templateUrl: './game-card.component.html',
  styleUrls: ['./game-card.component.scss'],
})
export class GameCardComponent implements OnInit {
  @Input('game') game: Game;
  constructor() { }
  
   showGameInfo(event) {
      event.preventDefault();
      console.log("Show Info");
   }

  @ViewChild('VideoPlayer') videoplayer: any;

   
  over(){
    console.log("Mouseover called");
  }

  toggleVideo(event: any) {
      this.videoplayer.nativeElement.play();
  }

  ngOnInit() {
    console.log(this.game);
  }

}
