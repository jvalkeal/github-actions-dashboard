import { TestBed } from '@angular/core/testing';

import { DispatchesService } from './dispatches.service';

describe('DispatchesService', () => {
  let service: DispatchesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DispatchesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
