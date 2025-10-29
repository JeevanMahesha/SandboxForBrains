import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MV15Component } from './m-v15.component';

describe('MV15Component', () => {
  let component: MV15Component;
  let fixture: ComponentFixture<MV15Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MV15Component]
    });
    fixture = TestBed.createComponent(MV15Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
