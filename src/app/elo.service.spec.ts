import { TestBed } from '@angular/core/testing';

import { EloService } from './elo.service';

describe('EloService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EloService = TestBed.get(EloService);
    expect(service).toBeTruthy();
  });
});
