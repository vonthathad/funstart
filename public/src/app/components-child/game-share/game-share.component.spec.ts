/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { GameShareComponent } from './game-share.component';

describe('GameShareComponent', () => {
  let component: GameShareComponent;
  let fixture: ComponentFixture<GameShareComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GameShareComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GameShareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
