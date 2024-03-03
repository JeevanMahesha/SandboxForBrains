import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [AppComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('Create Component', async () => {
    expect(component).toBeTruthy();
  });

  it('App Title', async () => {
    const title = 'AngularUnitTest';
    expect(component.title).toBe(title);
  });

  describe('Users', () => {
    it('Add Users', () => {
      const user = {
        id: '1',
        name: 'jeevan',
      };
      component.addNewUser(user);
      expect(component.users$.getValue()).toEqual([user]);
    });

    it('Remove Users', () => {
      component.removeUsers('1');
      expect(component.users$.getValue()).toEqual([]);
    });
  });
});
