import { Component, OnInit } from '@angular/core';
import { fabric } from 'fabric';
import { SocketWebService } from '../services/socket-web.service';



@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.css']
})
export class CanvasComponent implements OnInit {
  private _canvas = new fabric.Canvas('canvas');
  
  constructor(private socketService: SocketWebService) {
  }
  ngOnInit(): void {
    this._canvas = new fabric.Canvas('canvas');
  }
  delete(): void {
    var selectedObjects = this._canvas.getActiveObjects();
    selectedObjects.forEach(shape => {
      this._canvas.remove(shape);
    });;
  }
  drawText(): void {
    this._canvas.isDrawingMode = false;
    this._canvas.add(new fabric.Textbox('Insert text'));
  }
  freeDraw(): void {
    this._canvas.isDrawingMode = true;
  }
  drawCircle():void{
    this._canvas.add(new fabric.Circle({
      width: 100, height: 100, left: 100, top: 100, fill: '#725AC1', angle:45, radius:50
    }))
  }
  drawRect():void{
    this._canvas.add(new fabric.Rect({
      width: 100, height: 100, left: 100, top: 100, fill: '#725AC1',
    }))
    this.changeColor();
  }
  changeColor():void{
    var activeObjects = this._canvas.getActiveObjects();
    activeObjects.forEach(o => {
      o.set('fill','blue')
    });;
  }

}
