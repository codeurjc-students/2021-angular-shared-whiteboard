import { EventEmitter, Output, Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Socket } from 'ngx-socket-io';

@Injectable({
  providedIn: 'root'
})
export class SocketWebService extends Socket {

  @Output() callDraw: EventEmitter<any> = new EventEmitter();
  @Output() callRemove: EventEmitter<any> = new EventEmitter();
  @Output() callChangeColor: EventEmitter<any> = new EventEmitter();
  @Output() callModify: EventEmitter<any> = new EventEmitter();
  @Output() callTextChanged: EventEmitter<any> = new EventEmitter();
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
    this.ioSocket.on('objectDrawed', (res: any, name: string) => this.callDraw.emit({ res, name }))
    this.ioSocket.on('objectRemoved', (res: any) => this.callRemove.emit(res))
    this.ioSocket.on('objectModified',(res:any, objects: any)=> this.callModify.emit({res, objects}))
    this.ioSocket.on('textChanged',(res:any)=> this.callTextChanged.emit(res))
    this.ioSocket.on('colorChanged', (obj: string, color: string) => this.callChangeColor.emit({ obj, color }))
  }
  drawEvent = (payload: any, name: string) => {
    this.ioSocket.emit('objectDrawed', payload, name);
  }
  removeEvent = (payload = {}) => {
    this.ioSocket.emit('objectRemoved', payload);
  }
  modifyEvent = (payload: any, objects: any) => {
    this.ioSocket.emit('objectModified', payload, objects);
  }
  changeColorEvent = (objectId: string, color: string) => {
    this.ioSocket.emit('colorChanged', objectId, color);
  }
  changeTextEvent = (payload: {}) => {
    this.ioSocket.emit('textChanged', payload);
  }
}

