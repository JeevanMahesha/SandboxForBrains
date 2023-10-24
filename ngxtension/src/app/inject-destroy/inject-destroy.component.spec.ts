import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InjectDestroyComponent } from './inject-destroy.component';

describe('InjectDestroyComponent', () => {
  let component: InjectDestroyComponent;
  let fixture: ComponentFixture<InjectDestroyComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [InjectDestroyComponent]
    });
    fixture = TestBed.createComponent(InjectDestroyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
