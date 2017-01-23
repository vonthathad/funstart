/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { GameRecommendRightComponent } from './game-recommend-right.component';

describe('GameRecommendRightComponent', () => {
  let component: GameRecommendRightComponent;
  let fixture: ComponentFixture<GameRecommendRightComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GameRecommendRightComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GameRecommendRightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
