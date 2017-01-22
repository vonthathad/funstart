import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-iframe-ads',
  templateUrl: './iframe-ads.component.html',
  styleUrls: ['./iframe-ads.component.scss']
})
export class IframeAdsComponent implements OnInit {
  @Input() private showAds: boolean;
  @Output() private closeAds = new EventEmitter();
  constructor() { }

  ngOnInit() {
    this.showAds = true
  }
  _showAds() {
    this.showAds = true;
  }
  _closeAds() {
    this.showAds = false;
    this.closeAds.emit();
  }

}
