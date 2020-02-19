import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChessRulesPage } from './chess-rules.page';

describe('ChessRulesPage', () => {
  let component: ChessRulesPage;
  let fixture: ComponentFixture<ChessRulesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChessRulesPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChessRulesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
