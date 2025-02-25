import { NgClass } from '@angular/common';
import { Component, effect, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  imports: [FormsModule, NgClass],
})
export class AppComponent {
  readonly notificationCount = signal(0);

  eventSource: EventSource | null = null;

  readonly connectionStatusClass = {
    'bg-yellow-100 text-yellow-800':
      this.eventSource?.readyState === EventSource.CONNECTING,
    'bg-green-100 text-green-800':
      this.eventSource?.readyState === EventSource.OPEN,
    'bg-red-100 text-red-800':
      this.eventSource?.readyState === EventSource.CLOSED,
  };
  readonly connectionStatusText: Record<number, string> = {
    0: 'Connecting...',
    1: 'Connected',
    2: 'Disconnected',
  };

  readonly liveNotifications = signal<SSEResponse[]>([]);

  constructor() {
    effect(() => {
      if (this.eventSource?.readyState === EventSource.OPEN) {
        this.eventSource?.close();
      }
      if (this.notificationCount() > 0) {
        this.initializeEventStream();
        this.liveNotifications.set([]);
      }
    });
  }

  private initializeEventStream() {
    this.eventSource = new EventSource('http://localhost:3000/events');
    if (!this.eventSource) {
      console.error('EventSource not supported');
      return;
    }
    let count = 0;
    this.eventSource.onmessage = (notificationEvent: MessageEvent<string>) => {
      const sseResponse = JSON.parse(notificationEvent.data) as SSEResponse;
      count++;
      this.liveNotifications.update((notifications) => [
        ...notifications,
        sseResponse,
      ]);
      if (count >= this.notificationCount()) {
        this.eventSource?.close();
      }
    };
    this.eventSource.onerror = (error) => {
      console.error('EventSource failed:', error);
      this.eventSource?.close();
    };
  }
}

interface SSEResponse {
  message: string;
  currentTime: string;
}
