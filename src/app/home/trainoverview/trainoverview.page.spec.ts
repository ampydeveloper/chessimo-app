import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainoverviewPage } from './trainoverview.page';

describe('TrainoverviewPage', () => {
  let component: TrainoverviewPage;
  let fixture: ComponentFixture<TrainoverviewPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrainoverviewPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrainoverviewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
