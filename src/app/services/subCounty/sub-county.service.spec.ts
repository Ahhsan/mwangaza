import { TestBed } from '@angular/core/testing';

import { SubCountyService } from './sub-county.service';

describe('SubCountyService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SubCountyService = TestBed.get(SubCountyService);
    expect(service).toBeTruthy();
  });
});
