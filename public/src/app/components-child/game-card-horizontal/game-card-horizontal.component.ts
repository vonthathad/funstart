import { Component, OnInit, Input } from '@angular/core';
import { Game } from '../../classes/game';
import fadeIn  from '../../animations/fade-in';
@Component({
  selector: 'app-game-card-horizontal',
  templateUrl: './game-card-horizontal.component.html',
  styleUrls: ['./game-card-horizontal.component.scss'],
  animations: fadeIn  
})
export class GameCardHorizontalComponent implements OnInit {
   @Input('game') game: Game;
   @Input('link') link: string;
  constructor() { }

  ngOnInit() {
  }
  scrollTop(){
    window.scrollTo(0,0);
  }

}
