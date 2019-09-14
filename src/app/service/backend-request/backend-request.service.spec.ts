import { TestBed } from '@angular/core/testing';

import { BackendRequestService } from './backend-request.service';

describe('BackendRequestService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BackendRequestService = TestBed.get(BackendRequestService);
    expect(service).toBeTruthy();
  });
});
