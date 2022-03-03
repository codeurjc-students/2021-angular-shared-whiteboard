import { EventEmitter, Injectable, Output } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Socket } from 'ngx-socket-io';

@Injectable({
  providedIn: 'root'
})
export class SocketWebService extends Socket {
  @Output() callBack: EventEmitter<any> = new EventEmitter();

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
    this.ioSocket.on('draw', (res: any) => this.callBack.emit(res))
  }
  drawEvent = (payload = {}) => {
    this.ioSocket.emit('draw', payload);
  }

}
