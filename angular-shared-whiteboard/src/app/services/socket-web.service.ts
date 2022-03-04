import { EventEmitter, Output, Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Socket } from 'ngx-socket-io';

@Injectable({
  providedIn: 'root'
})
export class SocketWebService extends Socket {
  constructor(private cookieService: CookieService) {
    super({
      url: 'http://localhost:8080',
      options: {
        query: {
          nameRoom: cookieService.get('room')
        }
      }
    })
    this.listen();
  }
  listen = () => {
  }
  
}

