import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModelInputsComponent } from './model-inputs.component';

describe('ModelInputsComponent', () => {
  let component: ModelInputsComponent;
  let fixture: ComponentFixture<ModelInputsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModelInputsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModelInputsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
