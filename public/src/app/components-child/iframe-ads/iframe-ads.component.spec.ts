/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { IframeAdsComponent } from './iframe-ads.component';

describe('IframeAdsComponent', () => {
  let component: IframeAdsComponent;
  let fixture: ComponentFixture<IframeAdsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IframeAdsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IframeAdsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
