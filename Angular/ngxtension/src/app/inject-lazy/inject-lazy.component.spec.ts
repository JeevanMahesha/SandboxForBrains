import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InjectLazyComponent } from './inject-lazy.component';

describe('InjectLazyComponent', () => {
  let component: InjectLazyComponent;
  let fixture: ComponentFixture<InjectLazyComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [InjectLazyComponent]
    });
    fixture = TestBed.createComponent(InjectLazyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
