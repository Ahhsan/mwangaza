import { TestBed } from '@angular/core/testing';

import { ReceivePaymentService } from './receive-payment.service';

describe('ReceivePaymentService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ReceivePaymentService = TestBed.get(ReceivePaymentService);
    expect(service).toBeTruthy();
  });
});
