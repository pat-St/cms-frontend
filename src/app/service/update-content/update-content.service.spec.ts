import { TestBed } from '@angular/core/testing';

import { UpdateContentService } from './update-content.service';

describe('UpdateContentService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UpdateContentService = TestBed.get(UpdateContentService);
    expect(service).toBeTruthy();
  });
});
