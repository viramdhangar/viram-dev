import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LikeCommentPage } from './like-comment.page';

describe('LikeCommentPage', () => {
  let component: LikeCommentPage;
  let fixture: ComponentFixture<LikeCommentPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(LikeCommentPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
