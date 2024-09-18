import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserDetailListViewComponent } from './user-detail-list-view.component';

describe('UserDetailListViewComponent', () => {
  let component: UserDetailListViewComponent;
  let fixture: ComponentFixture<UserDetailListViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserDetailListViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserDetailListViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
