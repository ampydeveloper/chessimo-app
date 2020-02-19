import { TestBed } from '@angular/core/testing';

import { UserConnectService } from './user-connect.service';

describe('UserConnectService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UserConnectService = TestBed.get(UserConnectService);
    expect(service).toBeTruthy();
  });
});
