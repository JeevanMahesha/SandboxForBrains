import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomToggleComponent } from './custom-toggle.component';

describe('CustomToggleComponent', () => {
  let component: CustomToggleComponent;
  let fixture: ComponentFixture<CustomToggleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomToggleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomToggleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
