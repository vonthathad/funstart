import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { Game } from '../../classes/game';
@Component({
  selector: 'app-game-recommend-left',
  templateUrl: './game-recommend-left.component.html',
  styleUrls: ['./game-recommend-left.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GameRecommendLeftComponent implements OnInit {
  @Input() games: Game[];
  
  constructor() {
  }

  ngOnInit() {
    // this.loadRecommendGame();
  }
  
  
}
