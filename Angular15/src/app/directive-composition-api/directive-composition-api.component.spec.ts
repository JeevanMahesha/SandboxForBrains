import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DirectiveCompositionAPIComponent } from './directive-composition-api.component';

describe('DirectiveCompositionAPIComponent', () => {
  let component: DirectiveCompositionAPIComponent;
  let fixture: ComponentFixture<DirectiveCompositionAPIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DirectiveCompositionAPIComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DirectiveCompositionAPIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
