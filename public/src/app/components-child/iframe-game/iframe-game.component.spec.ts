/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { GameIframeComponent } from './game-iframe.component';

describe('GameIframeComponent', () => {
  let component: GameIframeComponent;
  let fixture: ComponentFixture<GameIframeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GameIframeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GameIframeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
