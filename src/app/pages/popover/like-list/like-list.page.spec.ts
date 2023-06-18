import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LikeListPage } from './like-list.page';

describe('LikeListPage', () => {
  let component: LikeListPage;
  let fixture: ComponentFixture<LikeListPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(LikeListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
