import { TestBed } from '@angular/core/testing';

import { InfoTextService } from './info-text.service';

describe('InfoTextService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: InfoTextService = TestBed.get(InfoTextService);
    expect(service).toBeTruthy();
  });
});
