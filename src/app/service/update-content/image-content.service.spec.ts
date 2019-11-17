import { TestBed } from '@angular/core/testing';

import { ImageContentService } from './image-content.service';

describe('ImageContentService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ImageContentService = TestBed.get(ImageContentService);
    expect(service).toBeTruthy();
  });
});
