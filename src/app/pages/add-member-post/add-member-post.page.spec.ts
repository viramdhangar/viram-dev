import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddMemberPostPage } from './add-member-post.page';

describe('AddMemberPostPage', () => {
  let component: AddMemberPostPage;
  let fixture: ComponentFixture<AddMemberPostPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(AddMemberPostPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
