import { Component, OnInit } from '@angular/core';
import {fabric} from 'fabric';



@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.css']
})
export class CanvasComponent implements OnInit {
  canvas: any;

  ngOnInit(): void {
    this.canvas = new fabric.Canvas('canvas');
     this.canvas.add(new fabric.Textbox('gooordo'));
  }
  drawText():void{
    this.canvas.isDrawingMode = false;
  }
  freeDraw():void{
    this.canvas.isDrawingMode = true;
    console.log("draw")

  }
}
