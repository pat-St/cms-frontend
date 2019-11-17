import { TestBed } from '@angular/core/testing';

import { ApartmentDetailsContentService } from './apartment-details-content.service';

describe('ApartmentDetailsContentService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ApartmentDetailsContentService = TestBed.get(ApartmentDetailsContentService);
    expect(service).toBeTruthy();
  });
});
