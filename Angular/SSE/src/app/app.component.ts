import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'SSE';

  private readonly url = 'http://localhost:3000/';
  private readonly http = inject(HttpClient);

  ngOnInit() {
    this.http.get(this.url).subscribe((data) => {
      console.log(data);
      this.getEvents();
    });
  }

  private getEvents() {
    const eventSource = new EventSource(this.url + 'events');
    let count = 0;
    eventSource.onmessage = (event) => {
      count++;
      console.log(event.data, count);
      if (count > 10) {
        eventSource.close();
      }
    };
    eventSource.onerror = (error) => {
      console.error('EventSource failed:', error);
      eventSource.close();
    };
  }
}
