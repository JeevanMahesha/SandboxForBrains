import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PosthttpcallComponent } from './posthttpcall.component';

describe('PosthttpcallComponent', () => {
  let component: PosthttpcallComponent;
  let fixture: ComponentFixture<PosthttpcallComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PosthttpcallComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PosthttpcallComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
