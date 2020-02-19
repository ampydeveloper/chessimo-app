import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlaygamePage } from './playgame.page';

describe('PlaygamePage', () => {
  let component: PlaygamePage;
  let fixture: ComponentFixture<PlaygamePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlaygamePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlaygamePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
