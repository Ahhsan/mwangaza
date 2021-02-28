import { TestBed } from '@angular/core/testing';

import { CollectionReportService } from './collection-report.service';

describe('CollectionReportService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CollectionReportService = TestBed.get(CollectionReportService);
    expect(service).toBeTruthy();
  });
});
