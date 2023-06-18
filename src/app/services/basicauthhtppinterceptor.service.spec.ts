import { TestBed } from '@angular/core/testing';

import { BasicauthhtppinterceptorService } from './basicauthhtppinterceptor.service';

describe('BasicauthhtppinterceptorService', () => {
  let service: BasicauthhtppinterceptorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BasicauthhtppinterceptorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
