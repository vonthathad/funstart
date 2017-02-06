/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { FormPasswordResetComponent } from './form-password-reset.component';

describe('FormPasswordResetComponent', () => {
  let component: FormPasswordResetComponent;
  let fixture: ComponentFixture<FormPasswordResetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormPasswordResetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormPasswordResetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
