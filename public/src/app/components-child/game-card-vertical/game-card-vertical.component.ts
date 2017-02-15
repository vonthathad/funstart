import { Component, OnInit, Input, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { Game } from '../../classes/game';
import {style, animate, transition, state, trigger} from '@angular/core';
import fadeIn  from '../../animations/fade-in';
@Component({
  selector: 'app-game-card-vertical',
  templateUrl: './game-card-vertical.component.html',
  styleUrls: ['./game-card-vertical.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('fadeIn', [
      state('*', style({opacity: 1})),
      transition('void => *', [
        style({opacity: 0}),
        animate(200)
      ]),
      transition('* => void', animate(0, style({opacity: 0})))
    ])
  ]

})
export class GameCardVerticalComponent implements OnInit {
   @Input('game') game: Game;
   @Input('link') link: string;
  @ViewChild('videoPlayer') videoplayer: any;
  private isDisplay: boolean = false;
  constructor() {
  }

  ngOnInit() {
  }
  over(){
    this.isDisplay = true;
    this.videoplayer.nativeElement.play();
  }
  leave(){
    this.isDisplay = false;
    this.videoplayer.nativeElement.pause();
  }
  scrollTop(){
    window.scrollTo(0,0);
  }
}
