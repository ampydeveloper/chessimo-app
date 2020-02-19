import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GameDatabasePage } from './game-database.page';

describe('GameDatabasePage', () => {
  let component: GameDatabasePage;
  let fixture: ComponentFixture<GameDatabasePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GameDatabasePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GameDatabasePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
