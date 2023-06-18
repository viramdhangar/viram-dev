import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BirthdayWishesPage } from './birthday-wishes.page';

describe('BirthdayWishesPage', () => {
  let component: BirthdayWishesPage;
  let fixture: ComponentFixture<BirthdayWishesPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(BirthdayWishesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
