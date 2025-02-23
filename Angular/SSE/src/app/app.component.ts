import { JsonPipe } from '@angular/common';
import { Component, computed, effect, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  imports: [FormsModule],
})
export class AppComponent {
  private readonly url = 'http://localhost:3000/';
  readonly notificationCount = signal(0);
  // readonly eventSourceSignal = signal(new EventSource(this.url + 'events'));

  // constructor() {
  //   effect(() => {
  //     if (this.notificationCount() > 0) {
  //       this.initializeEventStream();
  //     }
  //   });
  // }

  private initializeEventStream() {
    console.log('Initializing event stream');

    // const eventSource = new EventSource(this.url + 'events');
    // let count = 0;
    // eventSource.onmessage = (notificationEvent) => {
    //   count++;
    //   console.log(notificationEvent.data, count);
    //   if (count > this.notificationCount()) {
    //     eventSource.close();
    //   }
    // };
    // eventSource.onerror = (error) => {
    //   console.error('EventSource failed:', error);
    //   eventSource.close();
    // };
  }
}
