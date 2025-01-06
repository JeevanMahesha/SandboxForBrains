import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class APIcallsService {

  constructor(private apiCall:HttpClient) { }

  getName() {
    return 'Jeevan'
  }

  getAPIcall(data = null){
    if(data){
    return this.apiCall.get('https://jsonplaceholder.typicode.com/todos/'+data)
    }
    return this.apiCall.get('https://jsonplaceholder.typicode.com/todos')
  }

  postAPIcall(data){
    return this.apiCall.post('https://jsonplaceholder.typicode.com/posts',data)
  }

}
