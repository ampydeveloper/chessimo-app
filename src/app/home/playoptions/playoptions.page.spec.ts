import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayoptionsPage } from './playoptions.page';

describe('PlayoptionsPage', () => {
  let component: PlayoptionsPage;
  let fixture: ComponentFixture<PlayoptionsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlayoptionsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayoptionsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
