import {TestBed} from '@angular/core/testing';

import {ShareholdersService} from './shareholders.service';

describe('ShareholdersService', () => {
  let service: ShareholdersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ShareholdersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
