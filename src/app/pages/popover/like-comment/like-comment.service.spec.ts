import { TestBed } from '@angular/core/testing';

import { LikeCommentService } from './like-comment.service';

describe('LikeCommentService', () => {
  let service: LikeCommentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LikeCommentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
