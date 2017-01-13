import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';


@Component({
  selector: 'app-video-player',
  templateUrl: './video-player.component.html',
  styleUrls: ['./video-player.component.scss']
})
export class VideoPlayerComponent implements OnInit {
  isDisplay: boolean;
  @ViewChild('videoPlayer') videoplayer: any;

  constructor(private el: ElementRef) {
    this.isDisplay = false;
  }

  ngOnInit() {
  }

  playVideo() {
    this.videoplayer.nativeElement.play();
  }

  stopVideo() {
    this.videoplayer.nativeElement.pause();
  }

}
