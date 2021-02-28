import { TestBed } from '@angular/core/testing';

import { EndUserReportService } from './end-user-report.service';

describe('EndUserReportService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EndUserReportService = TestBed.get(EndUserReportService);
    expect(service).toBeTruthy();
  });
});
