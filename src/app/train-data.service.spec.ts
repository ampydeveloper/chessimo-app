import { TestBed } from '@angular/core/testing';

import { TrainDataService } from './train-data.service';

describe('TrainDataService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TrainDataService = TestBed.get(TrainDataService);
    expect(service).toBeTruthy();
  });
});
