import { TestBed } from '@angular/core/testing';

import { ControlServiceService } from './control-service.service';

describe('ControlServiceService', () => {
  let service: ControlServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ControlServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
