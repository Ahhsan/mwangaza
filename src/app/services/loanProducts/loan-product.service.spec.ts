import { TestBed } from '@angular/core/testing';

import { LoanProductService } from './loan-product.service';

describe('LoanProductService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LoanProductService = TestBed.get(LoanProductService);
    expect(service).toBeTruthy();
  });
});
