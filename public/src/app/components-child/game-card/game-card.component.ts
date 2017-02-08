import { Component, OnInit, Input, ElementRef, HostListener, ViewChild } from '@angular/core';
import { Game } from '../../classes/game';
// import { VideoPlayerComponent } from '../video-player/video-player.component';
@Component({
  selector: 'app-game-card',
  templateUrl: './game-card.component.html',
  styleUrls: ['./game-card.component.scss'],
})
export class GameCardComponent implements OnInit {
  // isThumbDisplay: boolean;
  private checkView: boolean = false;
  private isDisplay: boolean = false;
  @Input('game') game: Game;
  @Input('link') link: string;
  @ViewChild('videoPlayer') videoplayer: any;
  @HostListener("window:scroll", [])
  onWindowScroll() {
    let element = this.el.nativeElement;
    if(this.checkView != this.elementInViewport(element)){
      this.checkView = this.elementInViewport(element);
      if(this.checkView){
        this.isDisplay = true;
        this.videoplayer.nativeElement.play();
      } else {
        this.isDisplay = false;
      }
    }

  }
  constructor(private el: ElementRef) {
    // this.isThumbDisplay = true;
  }
  elementInViewport(el) {
    const rec = el.getBoundingClientRect();

    const vp = {
      width: window.innerWidth,
      height: window.innerHeight
    };
    return rec.top >= 0 && rec.top < vp.height && rec.bottom > 0 && rec.bottom <= vp.height;

  }
  //
  // showGameInfo() {
  //   console.log("Show Info");
  //   this.videoplayer.isDisplay = true;
  //   this.videoplayer.playVideo();
  // }
  //
  // over() {
  //   this.isThumbDisplay = false;
  //   // console.log('hide the thumb + hidden is  ' + this.isThumbDisplay );
  //   this.videoplayer.isDisplay = true;
  //   this.videoplayer.playVideo();
  // }
  //
  // leave() {
  //   this.isThumbDisplay = true;
  //   // console.log('show the thumb + hidden is  ' + this.isThumbDisplay  );
  //   this.videoplayer.isDisplay = false;
  //   this.videoplayer.stopVideo();
  // }

  ngOnInit() {

    // console.log(this.game);
  }
  scrollTop(){
    window.scrollTo(0,0);
  }


}
