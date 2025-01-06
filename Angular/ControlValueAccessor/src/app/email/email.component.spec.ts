import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailComponent } from './email.component';

describe('EmailComponent', () => {
  let component: EmailComponent;
  let fixture: ComponentFixture<EmailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EmailComponent]
    });
    fixture = TestBed.createComponent(EmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
