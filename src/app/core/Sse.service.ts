// src/app/services/sse.service.ts
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SseService {
  private eventSource: EventSource;
  private dataSubject = new Subject<any>();

  constructor() {}

  public connect(url: string) {
    this.eventSource = new EventSource(url);

    this.eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      this.dataSubject.next(data);
    };

    this.eventSource.onerror = (error) => {
      console.error('EventSource failed:', error);
      this.eventSource.close();
    };
  }

  public getData() {
    return this.dataSubject.asObservable();
  }

  public disconnect() {
    if (this.eventSource) {
      this.eventSource.close();
    }
  }
}
