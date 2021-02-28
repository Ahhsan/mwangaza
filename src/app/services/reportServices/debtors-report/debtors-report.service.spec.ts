import { TestBed } from '@angular/core/testing';

import { DebtorsReportService } from './debtors-report.service';

describe('DebtorsReportService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DebtorsReportService = TestBed.get(DebtorsReportService);
    expect(service).toBeTruthy();
  });
});
