import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HttpcallsComponent } from './httpcalls.component';

describe('HttpcallsComponent', () => {
  let component: HttpcallsComponent;
  let fixture: ComponentFixture<HttpcallsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HttpcallsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HttpcallsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
