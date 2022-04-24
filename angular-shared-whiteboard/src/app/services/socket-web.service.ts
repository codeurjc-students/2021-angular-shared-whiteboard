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
    this.ioSocket.on('draw', (res: any, name: string) => this.callDraw.emit({ res, name }))
    this.ioSocket.on('remove', (res: any) => this.callRemove.emit(res))
    this.ioSocket.on('modify',(res:any, objects: any)=> this.callModify.emit({res, objects}))
    this.ioSocket.on('colorChanged', (obj: string, color: string) => this.callChangeColor.emit({ obj, color }))
  }
  drawEvent = (payload: any, name: string) => {
    this.ioSocket.emit('draw', payload, name);
  }
  removeEvent = (payload = {}) => {
    this.ioSocket.emit('remove', payload);
  }
  modifyEvent = (payload: any, objects: any) => {
    console.log(payload);
    this.ioSocket.emit('modify', payload, objects);
  }
  changeColorEvent = (objectId: string, color: string) => {
    console.log("desde service: ", objectId, color)
    this.ioSocket.emit('colorChanged', objectId, color);
  }
}

