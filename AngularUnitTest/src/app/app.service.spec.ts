import { TestBed } from '@angular/core/testing';

import { AppService } from './app.service';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { IUserDetail } from './app.model';
import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';

describe('AppService', () => {
  let service: AppService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AppService],
    });
    service = TestBed.inject(AppService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('AppService should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('User Service', () => {
    it('get Users Details', () => {
      let userDetails: IUserDetail[] | undefined;
      service.getUsers().subscribe((res) => {
        userDetails = res;
      });
      const apiRequest = httpTestingController.expectOne(
        'https://jsonplaceholder.typicode.com/users'
      );
      const mockApiResponse = [
        {
          id: 1,
          name: 'Leanne Graham',
          username: 'Bret',
          email: 'Sincere@april.biz',
          address: {
            street: 'Kulas Light',
            suite: 'Apt. 556',
            city: 'Gwenborough',
            zipcode: '92998-3874',
            geo: {
              lat: '-37.3159',
              lng: '81.1496',
            },
          },
          phone: '1-770-736-8031 x56442',
          website: 'hildegard.org',
          company: {
            name: 'Romaguera-Crona',
            catchPhrase: 'Multi-layered client-server neural-net',
            bs: 'harness real-time e-markets',
          },
        },
        {
          id: 2,
          name: 'Ervin Howell',
          username: 'Antonette',
          email: 'Shanna@melissa.tv',
          address: {
            street: 'Victor Plains',
            suite: 'Suite 879',
            city: 'Wisokyburgh',
            zipcode: '90566-7771',
            geo: {
              lat: '-43.9509',
              lng: '-34.4618',
            },
          },
          phone: '010-692-6593 x09125',
          website: 'anastasia.net',
          company: {
            name: 'Deckow-Crist',
            catchPhrase: 'Proactive didactic contingency',
            bs: 'synergize scalable supply-chains',
          },
        },
      ];
      apiRequest.flush(mockApiResponse);
      expect(userDetails).toEqual(mockApiResponse);
      expect(apiRequest.request.method).toEqual('GET');
    });

    it('Handle Error', () => {
      let errorResponse: HttpErrorResponse | undefined;
      service.getUsers().subscribe({
        next: () => fail('Success should not be called'),
        error: (errorRes) => (errorResponse = errorRes),
      });
      const apiRequest = httpTestingController.expectOne(
        'https://jsonplaceholder.typicode.com/users'
      );
      apiRequest.flush('Server error', {
        status: 401,
        statusText: 'unauthorized',
      });

      expect(errorResponse?.status).toEqual(HttpStatusCode.Unauthorized);
      expect(errorResponse?.statusText).toBe('unauthorized');
    });
  });
});
