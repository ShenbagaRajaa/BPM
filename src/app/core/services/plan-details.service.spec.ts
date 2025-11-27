import { TestBed } from '@angular/core/testing';

import { PlanDetailsService } from './plan-details.service';

describe('PlanDetailsService', () => {
  let service: PlanDetailsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PlanDetailsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
