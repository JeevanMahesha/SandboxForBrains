import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZonelessComponent } from './zoneless.component';

describe('ZonelessComponent', () => {
  let component: ZonelessComponent;
  let fixture: ComponentFixture<ZonelessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ZonelessComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ZonelessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
