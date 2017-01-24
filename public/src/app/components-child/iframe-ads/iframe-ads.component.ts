import { Component, OnInit, Input, Output, EventEmitter,ElementRef } from '@angular/core';

@Component({
  selector: 'app-iframe-ads',
  templateUrl: './iframe-ads.component.html',
  styleUrls: ['./iframe-ads.component.scss']
})
export class IframeAdsComponent implements OnInit {
  adsManager: any;
  adsLoader: any;
  element: any;
  width_ads: number;
  height_ads: number;
  adDisplayContainer: any;
  intervalTimer: any;
  videoContent: any;
  @Input() private showAds: boolean;
  // @Output() private closeAds = new EventEmitter();
  constructor(private el: ElementRef) { }

  ngOnInit() {
    this.showAds = true
  }
  _showAds(obj) {
    this.showAds = true;
    setTimeout(function () {
      this.callAds();
    })

  }
  _closeAds() {
    this.showAds = false;
    // this.closeAds.emit();
  }


  callAds(){
    this.videoContent = (<HTMLElement>this.el.nativeElement).querySelector('#contentElement') as HTMLElement;
    this.createAdsLoader();
    this.requestAds();
  }
  addEventListernerAdsManager(){
    let self = this;
    this.adsManager.addEventListener(
        google.ima.AdErrorEvent.Type.AD_ERROR,
        onAdError);
    // adsManager.addEventListener(
    //   google.ima.AdEvent.Type.CONTENT_PAUSE_REQUESTED,
    //   this.onContentPauseRequested);
    // adsManager.addEventListener(
    //   google.ima.AdEvent.Type.CONTENT_RESUME_REQUESTED,
    //   this.onContentResumeRequested);
    this.adsManager.addEventListener(
        google.ima.AdEvent.Type.ALL_ADS_COMPLETED,
        onAdEvent);

    // Listen to any additional events, if necessary.
    this.adsManager.addEventListener(
        google.ima.AdEvent.Type.LOADED,
        onAdEvent);
    this.adsManager.addEventListener(
        google.ima.AdEvent.Type.STARTED,
        onAdEvent);
    this.adsManager.addEventListener(
        google.ima.AdEvent.Type.COMPLETE,
        onAdEvent);
    this.adsManager.addEventListener(
        google.ima.AdEvent.Type.CLICK,
        onAdEvent);
    this.adsManager.addEventListener(
        google.ima.AdEvent.Type.USER_CLOSE,
        onAdEvent);
    function onAdEvent(adEvent){
      self.onAdEvent(adEvent);
    }
    function onAdError(adErrorEvent){
      self.onAdError(adErrorEvent);
    }
  }
  onAdsManagerLoaded(adsManagerLoadedEvent) {
    // Get the ads manager.
    this.adsManager = adsManagerLoadedEvent.getAdsManager(this.videoContent);  // should be set to the content video element
    // Add listeners to the required events.
    this.addEventListernerAdsManager();
    try {
      // Initialize the ads manager. Ad rules playlist will start at this time.
      this.adsManager.init(this.width_ads, this.height_ads, google.ima.ViewMode.NORMAL);
      // Call play to start showing the ad. Single video and overlay ads will
      // start at this time; the call will be ignored for ad rules.
      this.adsManager.start();
    } catch (adError) {
      // An error may be thrown if there was a problem with the VAST response.
      //videoContent.play();
      console.log(adError);
      // eventAdsense.skipAds()
    }
  }
  onAdEvent(adEvent) {
    let self = this;
    // Retrieve the ad from the event. Some events (e.g. ALL_ADS_COMPLETED)
    // don't have ad object associated.
    var ad = adEvent.getAd();
    switch (adEvent.type) {
      case google.ima.AdEvent.Type.LOADED:
        // This is the first event sent for an ad - it is possible to
        // determine whether the ad is a video ad or an overlay.
        if (!ad.isLinear()) {
          // Position AdDisplayContainer correctly for overlay.
          // Use ad.width and ad.height.
        }
        // eventAdsense.doneLoad();
        break;
      case google.ima.AdEvent.Type.STARTED:
        // This event indicates the ad has started - the video player
        // can adjust the UI, for example display a pause button and
        // remaining time.
        if (ad.isLinear()) {
          // For a linear ad, a timer can be started to poll for
          // the remaining time.
          self.intervalTimer = setInterval(
              function() {
                self.adsManager.getRemainingTime();
              },
              300); // every 300ms
        }
        break;
      case google.ima.AdEvent.Type.COMPLETE:
        // This event indicates the ad has finished - the video player
        // can perform appropriate UI actions, such as removing the timer for
        // remaining time detection.
        self._closeAds();
        if (ad.isLinear()) {
          clearInterval(self.intervalTimer);
        }
        break;

      case google.ima.AdEvent.Type.CLICK:
        //when user click this ads
        // eventAdsense.click();
        self._closeAds();
        break;


      case google.ima.AdEvent.Type.USER_CLOSE:
        //when user click this ads
        // eventAdsense.close();
        self._closeAds();
        break;
    }
  }

//   onContentPauseRequested() {
//   //videoContent.pause();
//   // This function is where you should setup UI for showing ads (e.g.
//   // display ad timer countdown, disable seeking etc.)
//   // setupUIForAds();
// }
//
//   onContentResumeRequested() {
//   //videoContent.play();
//
//   // eventAdsense.skipAds();
//
//   // This function is where you should ensure that your UI is ready
//   // to play content. It is the responsibility of the Publisher to
//   // implement this function when necessary.
//   // setupUIForContent();
//
// }

  onAdError(adErrorEvent){
    console.log(adErrorEvent.getError());
    this._closeAds();
  }
  addEventListenerAds(){
    let self = this;
    function onAdsManagerLoaded(adsManagerLoadedEvent){
      self.onAdsManagerLoaded(adsManagerLoadedEvent);
    }
    function onAdError(adErrorEvent){
      self.onAdError(adErrorEvent);
    }
    this.adsLoader.addEventListener(
        google.ima.AdsManagerLoadedEvent.Type.ADS_MANAGER_LOADED,
        onAdsManagerLoaded,
        false);
    this.adsLoader.addEventListener(
        google.ima.AdErrorEvent.Type.AD_ERROR,
        onAdError,
        false);
  }
  createAdsLoader(){
    // Create ads loader.
    this.element = (<HTMLElement>this.el.nativeElement).querySelector('#adContainer') as HTMLElement;
    // let adDisplayContainer = new google.ima.AdDisplayContainer(element);
    this.adDisplayContainer = new google.ima.AdDisplayContainer(this.element);
    this.adDisplayContainer.initialize();
    this.adsLoader = new google.ima.AdsLoader(this.adDisplayContainer);
    // Listen and respond to ads loaded and error events.
    this.addEventListenerAds();

  }
  requestAds(){
    // Request video ads.
    let adsRequest = new google.ima.AdsRequest();
    let channel_id = '8788971041'; //channel ads main
    let href_ads = location.href;
    let url_ads = "https://googleads.g.doubleclick.net/pagead/ads?ad_type=video_image_text_flash&client=ca-games-pub-8167045239596974&description_url="+href_ads+"&channel="+channel_id+"&videoad_start_delay=0&hl=en&max_ad_duration=30000";
    this.width_ads = this.element.clientWidth;
    this.height_ads = this.element.clientHeight;
    //adsRequest.adTagUrl = "http://googleads.g.doubleclick.net/pagead/ads?ad_type=video_image_flash&client=ca-games-pub-5477307030870200&description_url=http://www.topnhe.com/317/10-ly-do-khong-nen-song-o-da-nang&videoad_start_delay=0&hl=vi&max_ad_duration=30000";
    adsRequest.adTagUrl = url_ads;
    // Specify the linear and nonlinear slot sizes. This helps the SDK to
    // select the correct creative if multiple are returned.
    adsRequest.linearAdSlotWidth = this.width_ads;
    adsRequest.linearAdSlotHeight = this.height_ads;
    adsRequest.nonLinearAdSlotWidth = this.width_ads;
    adsRequest.nonLinearAdSlotHeight = this.height_ads;
    this.adsLoader.requestAds(adsRequest);
  }
}
