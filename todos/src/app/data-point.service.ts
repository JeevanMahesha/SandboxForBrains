import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable()
export class DataPointService {
  listOfTodos: any;
  editIndex = {
    index: null,
    showData: false,
  };

  constructor(private httpCall: HttpClient) {}

  getTodos() {
    return this.httpCall.get("https://jsonplaceholder.typicode.com/todos");
  }

  createTodos(body) {
    return this.httpCall.post(
      "https://jsonplaceholder.typicode.com/posts",
      body
    );
  }
}
