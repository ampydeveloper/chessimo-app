import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckgamePage } from './checkgame.page';

describe('CheckgamePage', () => {
  let component: CheckgamePage;
  let fixture: ComponentFixture<CheckgamePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CheckgamePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckgamePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
