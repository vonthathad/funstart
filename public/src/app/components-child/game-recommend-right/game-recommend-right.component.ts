import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';

import { Game } from '../../classes/game';
@Component({
  selector: 'app-game-recommend-right',
  templateUrl: './game-recommend-right.component.html',
  styleUrls: ['./game-recommend-right.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GameRecommendRightComponent implements OnInit {
  @Input() private games: Game[];
  constructor() {

  }
  ngOnInit() {
  }
}
