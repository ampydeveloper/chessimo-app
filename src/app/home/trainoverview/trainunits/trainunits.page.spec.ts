import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainunitsPage } from './trainunits.page';

describe('TrainunitsPage', () => {
  let component: TrainunitsPage;
  let fixture: ComponentFixture<TrainunitsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrainunitsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrainunitsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
