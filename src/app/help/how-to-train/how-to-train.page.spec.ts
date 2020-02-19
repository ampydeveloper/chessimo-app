import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HowToTrainPage } from './how-to-train.page';

describe('HowToTrainPage', () => {
  let component: HowToTrainPage;
  let fixture: ComponentFixture<HowToTrainPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HowToTrainPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HowToTrainPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
