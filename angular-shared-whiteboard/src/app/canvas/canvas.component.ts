import { Component, OnInit } from '@angular/core';
import { fabric } from 'fabric';



@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.css']
})
export class CanvasComponent implements OnInit {
  private _canvas=new fabric.Canvas('canvas');

  constructor() {
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
  drawRect():void{
  }
  drawCircle():void{

  }
}
