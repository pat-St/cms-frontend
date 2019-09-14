import { TestBed } from '@angular/core/testing';

import { LoadContentService } from './load-content.service';

describe('LoadContentService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LoadContentService = TestBed.get(LoadContentService);
    expect(service).toBeTruthy();
  });
});
