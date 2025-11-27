import { TestBed } from '@angular/core/testing';

import { PlanTypeService } from './plan-type.service';

describe('PlanTypeService', () => {
  let service: PlanTypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PlanTypeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
