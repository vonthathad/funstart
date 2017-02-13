import { Component, OnInit, ViewChild, ChangeDetectionStrategy, ChangeDetectorRef,OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ImageService } from '../../services/image.service'
import { ShareService } from '../../services/share.service'
import { UserService } from '../../services/user.service'
import { GameService } from '../../services/game.service'
import { IframeGameComponent } from './../../components-child/iframe-game/iframe-game.component';
import { Game } from '../../classes/game';
import {ParentComponent} from "../../parent.component";
import { Angulartics2 } from 'angulartics2';
import {User} from "../../classes/user";
import {Activity} from "../../classes/activity";
@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GameComponent extends ParentComponent implements OnInit,OnDestroy {
  private game: Game;
  private share: string;
  private facebookCommentShowed: boolean;
  private leftrcmGames: Game[];
  private rightrcmGames: Game[];
  private isIntro: boolean = true;
  private isLoading: boolean = true;
  private isPlay: boolean = false;
  private isEnd: boolean = false;
  private isShowAds: boolean = false;
  private user: User;
  private result: Object;
  private bestScore: number;
  private channelID: string;
  private shareDisable: boolean = false;
  private isShowRank: boolean = false;
  private highScore: number;
  @ViewChild(IframeGameComponent) private iframeGameComponent: IframeGameComponent;
  // @ViewChild(IframeAdsComponent) private iframeAdsComponent: IframeAdsComponent;

  constructor(private route: ActivatedRoute, private gameService: GameService,private cd: ChangeDetectorRef,private angulartics2: Angulartics2,private imageService: ImageService, private shareService: ShareService, private userService: UserService) {
    super();
  }

  ngOnInit() {
    // this.show = "intro";
    this.route.params.subscribe(params => {
      this.gameService.getGame(params['id']).subscribe((res: any) => {
        this.channelID = '8152950647';
        this.isIntro = true;
        this.isLoading = true;
        this.isPlay = false;
        this.isEnd = false;
        this.isShowAds = false;
        this.shareDisable = false;
        this.isShowRank = false;
        // console.log("IN PUT " + JSON.stringify(res.data));
        this.gameService.gameSource.next(res.data);
        this.game = res.data;
        this.setInfoShareService();
        setTimeout(()=>{
          // this.iframeGameComponent.setVisible(false);
          // this.iframeAdsComponent._closeAds();
          this.cd.markForCheck();
        });
        this.loadRecommendGame(1);
        this.facebookCommentShowed = false;
        this.facebookCommentShowed = true;
        this.cd.markForCheck();
      });
    });
    this.user = this.userService.user;
    this.disposable = this.userService.loggedUser$.subscribe(
        user => {
          this.user = user;
        }
    )

    this.disposable = this.userService.rankedUser$.subscribe((rankedUsers:Activity[]) =>{
      // console.log(rankedUsers, this.user);
      for (var i = 0; i < rankedUsers.length; i++){
        if(this.user && this.user._id == rankedUsers[i].user._id){
          this.bestScore = rankedUsers[i].score;
          break;
        }
      }
    });
  }
  // renderGame(game) {
  // this.game = game;
  // this.iframeGameComponent.setGame(game);

  // console.log("GAME " + JSON.stringify(game));
  // this.usersRankedSidebarComponent.setGame(game);

  // }
  handleLibrariesLoadDoneDone(){
    console.log('done');

    this.isShowAds = true;
    // setTimeout(()=> {
      // this.iframeAdsComponent._showAds();
    // });
    // this.cd.markForCheck();
    setTimeout(()=>{
    this.isLoading = false;
      // this.gameIntroComponent.setLibrariesPreloadDone(true);
    },500);
  }
  continueGame() {
    this.angulartics2.eventTrack.next({ action: 'continueGame', properties: { category: 'gamePlay' }});
    this.channelID = '8152950647';
    this.isEnd = false;
    this.isPlay = true;
    this.iframeGameComponent._continue();
    // this.iframeAdsComponent._closeAds();

    // this.iframeGameComponent.setVisible(true);
    // this.gameShareComponent.setVisible(false);
  }
  handleUpdateResult(result) {
    this.angulartics2.eventTrack.next({ action: 'endGame', properties: { category: 'gamePlay' }});
    this.channelID = '9629683846';
    // var imageData = this.iframeGameComponent.getScreenShotData();
    // this.gameShareComponent.setScreenShotData(imageData);
    this.updateResult(result);
    // this.gameShareComponent.setVisible(true);
    this.isEnd = true;
    if(this.game.publish){
      if(this.game.long && this.game.long > 2){
        this.isShowAds = true;
        
      } else {
        if(Math.floor(Math.random()*3)==1) {
          this.isShowAds = true;
         
          // setTimeout(()=> {
          //   this.iframeAdsComponent._showAds({ channelID: '9629683846' });
          // });
        } 
      }
    }
    setTimeout(()=>{
      this.isShowRank = true;
      this.cd.markForCheck();
    },2000);
  }

  offRank(){
    this.isShowRank = false;
    this.cd.markForCheck();
  }
  renderGames(index:number, games: Game[]) {
    if(index == 1){
      this.rightrcmGames = games;
      this.loadRecommendGame(2);
    } else {
      this.leftrcmGames = games;
    }
    this.cd.markForCheck();
  }
  loadRecommendGame(index:number){
    let order;
    if(index == 1) {
      order = "random";
    } else{
      order = "hot";
    }
    this.disposable = this.gameService
        .getGames({ order: order, paging: 5 })
        .subscribe((res: any) => this.renderGames(index,res.data));
  }

  handleCloseAds() {
    this.isShowAds = false;
  }
  playGame() {
    this.angulartics2.eventTrack.next({ action: 'startGame', properties: { category: 'gamePlay' }});
    this.isIntro = false;
    this.isPlay = true;
    this.iframeGameComponent._playGame();
    // this.gameIntroComponent.setVisible(false);
    // this.iframeGameComponent.setVisible(true);
  }

  // setScreenShotData(imageData) {
  //   this.imageData = imageData;
  // }

  setInfoShareService() {
    this.shareService.setInfo({
      title: this.game.title,
      des: this.game.des,
      shareUrl: location.protocol + '//' + location.hostname + "/game/" + this.game._id
    });
  }

  updateResult(result) {
    console.log(1);
    this.result = JSON.parse(result);
    // if (this.userService.checkUser()) {
    //   this.shareDisable = true;
    //   // THERE IS AN USER
    //   this.imageService.createImage(this.game._id, this.result).subscribe(
    //     pictureUrl => {
    //       console.log(pictureUrl);
    //       this.userService.postActivity({
    //         score: this.result["score"],
    //         game: this.game._id,
    //         pictureUrl: pictureUrl
    //       }).subscribe(() => {
    //         this.shareService.setInfo({ pictureUrl: pictureUrl });
    //         this.shareDisable = false;
    //       })
    // if(this.bestScore && this.result["score"] < this.bestScore){
    //   this.result["score"] = this.bestScore;
    // }
    if (this.user && this.result["score"]) {
      // check if user has played this game or not, it not, give him 0 init score
      // adding new score
      this.user.score = this.result["score"];
      let score = this.user.score;
      // console.log(this.user.score);
      // console.log(this.userService.checkUser());
      //  console.log("USER " + this.user.score + " result " + this.result["score"] + " gameid " + this.game._id);
      if (this.userService.checkUser()) {
        this.shareDisable = true;
        // THERE IS AN USER
        this.disposable = this.imageService.createImage(this.game._id, this.result).subscribe(
            res => {
              console.log("IMAGE SERVICE " + JSON.stringify(res.data));

              console.log("USER " + score + " result " + this.result["score"] + " gameid " + this.game._id);
              this.userService.postActivity({
                score: score,
                game: this.game._id,
                pictureUrl: res.data
              }).subscribe((resp:any) => {
                // this.shareService.setInfo({ pictureUrl: res.data });
                // this.shareDisable = false;
                // this.gameService.gameResultSource.next(result);
                this.highScore = resp.score;
                this.result['pictureUrl'] = res.data;
                this.result['des'] = this.result['descr'];
                this.result['title'] = `If you beat my score [${resp.score}] in this Game, you're a GENIUS!`;
                console.log(this.result);
                this.shareService.setInfo(this.result);
                // this.shareService.shareFacebook(function () {
                //       console.log('done share');
                // });
                this.shareDisable = false;
                // this.gameService.gameResultSource.next(result);
                this.cd.markForCheck();

              }, err => console.error(err))
            },
            err => {
              // Log errors if any
              console.error(err);
            });
      }
    } else {
      // post activity to add play turn
      this.userService.postActivity({
        game: this.game._id
      })
      //    .subscribe(() => {
      // },
      //       err => console.error(err)
      // );
      // update result to share facebook
      console.log(JSON.stringify(this.result));
      // this.gameService.gameResultSource.next(this.result);
    }
  }

  shareFacebook() {
    this.angulartics2.eventTrack.next({ action: 'shareButtonClick', properties: { category: 'gamePlay' }});
    // if (!this.userService.checkUser()) {
    //   // THERE IS NO USER
    //   this.imageService.createImage(32, this.result).subscribe(
    //     pictureUrl => {
    //       console.log(pictureUrl);
    //       this.shareService.setInfo({ pictureUrl: pictureUrl });
    //       this.shareService.shareFacebook(function () {
    //         console.log('done share');
    //       });
    //       this.shareDisable = false;
    //     },
    //     err => {
    //       // Log errors if any
    //       console.log(err);
    //     });
    // } else {
    //   this.shareService.shareFacebook(function () {
    //     console.log('done share');
    //   });
    // }
    console.log(this.result);
    if (!this.userService.checkUser()) {
      this.shareDisable = true;
      // THERE IS NO USER
      this.imageService.createImage(this.game._id, this.result).subscribe(
          res => {
            this.result['pictureUrl'] = res.data;
            this.result['des'] = this.result['descr'];
            this.result['title'] = `If you beat my score [${this.result['score']}] in this Game, you're a GENIUS!`;
            console.log(this.result);
            this.shareService.setInfo(this.result);
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
  
  ngOnDestroy() {
    this.disposeSubscriptions();
  }
}
