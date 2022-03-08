import { Component, OnInit } from '@angular/core';
import { fabric } from 'fabric';
import { SocketWebService } from '../services/socket-web.service';



@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.css']
})
export class CanvasComponent implements OnInit {
  private canvas = new fabric.Canvas('canvas');
  
  constructor(private socketService: SocketWebService) {
    this.socketService.callDraw.subscribe((res: any) => {
      this.drawRect(res)
    });
  }
  ngOnInit(): void {
    this.canvas = new fabric.Canvas('canvas');
    this.canvas.on("mouse:wheel", function(e) { //Event when spin mouse
      console.log(e);
   });
   this.canvas.on('selection:created', (e) => {  //Event when an object is selected
    console.log(e);
    this.socketService.drawEvent(JSON.stringify(e));
});   
  }
  
  delete(): void {
    var selectedObjects = this.canvas.getActiveObjects();
    selectedObjects.forEach(shape => {
      this.canvas.remove(shape);
    });;
  }
  drawText(): void {
    this.canvas.isDrawingMode = false;
    this.canvas.add(new fabric.Textbox('Insert text'));
  }
  freeDraw(): void {
    this.canvas.isDrawingMode = true;
  }
  drawCircle():void{
    this.canvas.add(new fabric.Circle({
      width: 100, height: 100, left: 100, top: 100, fill: '#725AC1', angle:45, radius:50
    }))
  }
  drawRect(shape:any = null):void{
    if(shape!=null){
      console.log(shape);

      this.canvas.add(shape);
    }
    this.canvas.add(new fabric.Rect({
      width: 100, height: 100, left: 100, top: 100, fill: '#725AC1',
    }))
  }
  changeColor():void{
    var activeObjects = this.canvas.getActiveObjects();
    activeObjects.forEach(o => {
      o.set('fill','blue')
    });;
  }

}
function constructSpin(e: fabric.IEvent<WheelEvent>, arg1: { name: string; }) {
  console.log(arg1.name);
}

