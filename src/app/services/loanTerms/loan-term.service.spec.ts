import { TestBed } from '@angular/core/testing';

import { LoanTermService } from './loan-term.service';

describe('LoanTermService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LoanTermService = TestBed.get(LoanTermService);
    expect(service).toBeTruthy();
  });
});
