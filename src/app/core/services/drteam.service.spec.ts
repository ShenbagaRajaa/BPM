import { TestBed } from '@angular/core/testing';

import { DrteamService } from './drteam.service';

describe('DrteamService', () => {
  let service: DrteamService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DrteamService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
