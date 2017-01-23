/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { GameRecommendBottomComponent } from './game-recommend-bottom.component';

describe('GameRecommendBottomComponent', () => {
  let component: GameRecommendBottomComponent;
  let fixture: ComponentFixture<GameRecommendBottomComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GameRecommendBottomComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GameRecommendBottomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
