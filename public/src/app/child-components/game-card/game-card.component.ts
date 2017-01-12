import { Component, OnInit, Input } from '@angular/core';
import { Game } from '../../classes/game';


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
   
  over(){
    console.log("Mouseover called");
  }

  ngOnInit() {
    console.log(this.game);
  }

}
