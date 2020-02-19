import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChessTipsPage } from './chess-tips.page';

describe('ChessTipsPage', () => {
  let component: ChessTipsPage;
  let fixture: ComponentFixture<ChessTipsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChessTipsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChessTipsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
