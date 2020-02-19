import { TestBed } from '@angular/core/testing';

import { TrainingStateService } from './training-state.service';

describe('TrainingStateService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TrainingStateService = TestBed.get(TrainingStateService);
    expect(service).toBeTruthy();
  });
});
