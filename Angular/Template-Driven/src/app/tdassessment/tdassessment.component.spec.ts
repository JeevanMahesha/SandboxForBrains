import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TdassessmentComponent } from './tdassessment.component';

describe('TdassessmentComponent', () => {
  let component: TdassessmentComponent;
  let fixture: ComponentFixture<TdassessmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TdassessmentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TdassessmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
