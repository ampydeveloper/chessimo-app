import { TestBed } from '@angular/core/testing';

import { PgnService } from './pgn.service';

describe('PgnService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PgnService = TestBed.get(PgnService);
    expect(service).toBeTruthy();
  });
});
