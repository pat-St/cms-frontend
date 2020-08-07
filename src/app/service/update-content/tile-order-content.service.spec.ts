import { TestBed } from '@angular/core/testing';

import { TileOrderContentService } from './tile-order-content.service';

describe('TileOrderContentService', () => {
  let service: TileOrderContentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TileOrderContentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
