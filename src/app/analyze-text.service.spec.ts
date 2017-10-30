import { TestBed, inject } from '@angular/core/testing';

import { AnalyzeTextService } from './analyze-text.service';

describe('AnalyzeTextService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AnalyzeTextService]
    });
  });

  it('should be created', inject([AnalyzeTextService], (service: AnalyzeTextService) => {
    expect(service).toBeTruthy();
  }));
});
