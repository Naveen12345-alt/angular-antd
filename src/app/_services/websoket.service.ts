import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay, filter, map, retryWhen, switchMap } from 'rxjs/operators';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private socket$: WebSocketSubject<any>;

  constructor() {}

  public connect(): WebSocketSubject<any> {
    if (!this.socket$ || this.socket$.closed) {
      this.socket$ = webSocket('ws://127.0.0.1:8000/ws/notify/');
    }
    return this.socket$;
  }

  public dataUpdates$() {
    return this.connect().asObservable();
  }
}
