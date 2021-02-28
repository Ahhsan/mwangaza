import { TestBed } from '@angular/core/testing';

import { LoanPaymentService } from './loan-payment.service';

describe('LoanPaymentService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LoanPaymentService = TestBed.get(LoanPaymentService);
    expect(service).toBeTruthy();
  });
});
