import { Component, OnInit, ElementRef, ViewChild, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';

import { GameService } from '../../services/game.service';

import { Game } from '../../classes/game';
import {ParentComponent} from "../../parent.component";
@Component({
  selector: 'app-autocomplete',
  templateUrl: './autocomplete.component.html',
  styleUrls: ['./autocomplete.component.scss'],
  host: {
    '(document:click)': 'handleClick($event)',
  },
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AutocompleteComponent extends ParentComponent implements OnInit, OnDestroy {
  @ViewChild("input") private input;
  private query = '';
  private games: Game[];
  private filteredList = [];

  constructor(private elementRef: ElementRef, private gameService: GameService,private cd: ChangeDetectorRef) {
    super();
  }

  ngOnInit() {
    this.disposable = this.gameService
      // .getGames({ paging: 100 })
      .getGames()
      .subscribe((res: any) => this.renderGames(res.data));
  }
  renderGames(games) {
    this.games = games;
    this.cd.markForCheck();
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
  onInputClick(){
    this.input.nativeElement.select();
  }
  ngOnDestroy() {
    this.disposeSubscriptions();
  }
}
