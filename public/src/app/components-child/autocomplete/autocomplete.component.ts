import { Component, OnInit, ElementRef } from '@angular/core';

import { GameService } from '../../services/game.service';

import { Game } from '../../classes/game';
@Component({
  selector: 'app-autocomplete',
  templateUrl: './autocomplete.component.html',
  styleUrls: ['./autocomplete.component.scss'],
  host: {
    '(document:click)': 'handleClick($event)',
  },
})
export class AutocompleteComponent implements OnInit {

  private query = '';
  private games: Game[];
  private filteredList = [];

  constructor(private elementRef: ElementRef, private gameService: GameService) {}

  ngOnInit() {
    this.gameService
      // .getGames({ paging: 100 })
      .getGames()
      .subscribe((res: any) => this.renderGames(res.data));
  }
  renderGames(games) {
    this.games = games;
  }
  handleClick(event) {
    var clickedComponent = event.target;
    var inside = false;
    do {
      if (clickedComponent === this.elementRef.nativeElement) {
        inside = true;
      }
      clickedComponent = clickedComponent.parentNode;
    } while (clickedComponent);
    if (!inside) {
      this.filteredList = [];
    }
  }

  filter() {
    if (this.query !== "") {
      this.filteredList = this.games.filter(function (el) {
        return el.title.toLowerCase().indexOf(this.query.toLowerCase()) > -1;
      }.bind(this));
      this.filteredList = this.filteredList.slice(0,4);
    } else {
      this.filteredList = [];
    }
  }

  select(title) {
    this.query = title;
    this.filteredList = [];
  }
}
