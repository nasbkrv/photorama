import { TestBed } from '@angular/core/testing';

import { PhotoramaGuard } from './photorama.guard';

describe('PhotoramaGuard', () => {
  let guard: PhotoramaGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(PhotoramaGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
