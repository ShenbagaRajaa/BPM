import { TestBed } from '@angular/core/testing';

import { PlanLevelService } from './plan-level.service';

describe('PlanLevelService', () => {
  let service: PlanLevelService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PlanLevelService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
