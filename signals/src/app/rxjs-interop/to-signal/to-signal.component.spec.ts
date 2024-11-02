import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToSignalComponent } from './to-signal.component';

describe('ToSignalComponent', () => {
  let component: ToSignalComponent;
  let fixture: ComponentFixture<ToSignalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToSignalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ToSignalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
