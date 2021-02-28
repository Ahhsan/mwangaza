import { TestBed } from '@angular/core/testing';

import { AmountCollectedReportService } from './amount-collected-report.service';

describe('AmountCollectedReportService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AmountCollectedReportService = TestBed.get(AmountCollectedReportService);
    expect(service).toBeTruthy();
  });
});
