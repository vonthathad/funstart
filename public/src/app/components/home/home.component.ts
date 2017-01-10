import { NgModule, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Routes, RouterModule } from '@angular/router';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';

import { RestService} from '../../services/rest.service';


import { Game } from '../../classes/game';
import { GameTopic } from '../../classes/game-topic';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  constructor(private router: Router, private rest: RestService) { }

    private games: Game[];

  ngOnInit() {
    this.rest
    .getGames()
    .subscribe((res: any)=>this.renderGame(res));

     this.games = new Array<Game>();
    this.games.push(new Game(1, "Trùm nhảy", new GameTopic(1, "Nhanh nhạy"), "Nhảy qua bẫy để về đến đích", "", "", 1234));
    this.games.push(new Game(2, "Thần bay đại hiệp", new GameTopic(1, "Nhanh nhạy"), "Các hạ có phải là một trong thập đại cao thủ trong võ lâm?", "", "", 1234));
    this.games.push(new Game(3, "Đớp mồi", new GameTopic(1, "Nhanh nhạy"), "Né những con cá dữ và đớp mồi thật nhanh", "", "", 1234));
    this.games.push(new Game(4, "Flappy 2048", new GameTopic(1, "Nhanh nhạy"), "Sự kết hợp vi diệu giữa 2048 và Flappy Bird", "", "", 1234));
    this.games.push(new Game(5, "Ghi nhớ hình ảnh", new GameTopic(2, "Trí nhớ"), "Lật hình và ghi nhớ vị trí của chúng", "", "", 1234));
    this.games.push(new Game(6, "Game Kiểm tra trí nhớ", new GameTopic(2, "Trí nhớ"), "Ghi nhớ và tìm số theo đúng thứ tự nào!", "", "", 1234));
    this.games.push(new Game(7, "Chấm điểm người yêu", new GameTopic(2, "Trí nhớ"), "Trên 3500 điểm thì phải lấy gấp!!!!!", "", "", 1234));
  }
  renderGame(res){
    console.log(JSON.stringify(res));
  }
  goUser() {
    this.router.navigate(['user']);
  }
}
export const routes: Routes = [
  // { path: '', component: HomeComponent },
  // { path: 'home', component: HomeComponent }
]


