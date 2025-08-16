// socket.service.ts
import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { BehaviorSubject, Observable } from 'rxjs';
import { getClientConfig,clientName } from 'src/environments/environment.prod';
// import { getLocalConfig, clientName } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class SocketService {

  public socketIO: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public socketIOEmitter: Observable<any> = this.socketIO.asObservable();
  private socket: Socket;

  constructor() {
    this.socket = io(getClientConfig(clientName).imgUrl); // Replace with your Strapi domain    
  }

  listen(eventName: string): Observable<any> {
    return new Observable((subscriber) => {
      this.socket.on(eventName, (data) => {
        subscriber.next(data);
      });
    });
  }
}
