import { TestBed } from '@angular/core/testing';

import { ApartmentContentService } from './apartment-content.service';

describe('ApartmentContentService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ApartmentContentService = TestBed.get(ApartmentContentService);
    expect(service).toBeTruthy();
  });
});
