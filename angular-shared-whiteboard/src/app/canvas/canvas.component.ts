import { Component, OnInit } from '@angular/core';
import { fabric } from 'fabric';
import { Rect } from 'fabric/fabric-impl';
import { SocketWebService } from '../services/socket-web.service';



@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.css']
})
export class CanvasComponent implements OnInit {
  private canvas = new fabric.Canvas('canvas');
  private emite: boolean = true;
  constructor(private socketService: SocketWebService) {
    this.socketService.callDraw.subscribe((res: any) => {
      this.emite = false;
      this.draw(res)
    });
  }
  ngOnInit(): void {
    this.canvas = new fabric.Canvas('canvas');
    this.canvas.on("mouse:wheel", function (e) { //Event when spin mouse
      console.log(e);
    });

    this.canvas.on('object:added', (e) => {
      if (this.emite) {  //Event when an object is selected
        this.socketService.drawEvent((e));
      }
    });
    this.canvas.on('path:created', (e)=>{
        if (this.emite) {  //Event when an object is selected
          this.socketService.drawEvent((e));
        }
    });
    
  }

  draw(e: fabric.IEvent<Event>): void {
    if (e != null) {
      console.log('Target=> ',e.target)
      switch (e.target?.type) {
        case "rect":
          this.canvas.add(new fabric.Rect(e.target));
          break;
        case "circle":
          this.canvas.add(new fabric.Circle(e.target));
          break;
        case "textbox":
          this.canvas.add(new fabric.Textbox('',e.target));
          break;
          case "path":
            console.log('insertando path')
          this.canvas.add(new fabric.Path('M 0 20',e.target));
          break;
        default:
          console.log('Target type is null')
      }
    }
  }
  delete(): void {
    var selectedObjects = this.canvas.getActiveObjects();
    selectedObjects.forEach(shape => {
      this.canvas.remove(shape);
    });;
  }
  drawText(): void {
    this.emite = true;
    this.canvas.isDrawingMode = false;
    this.canvas.add(new fabric.Textbox('Insert text'));
  }
  freeDraw(): void {
    this.emite = true;
    this.canvas.isDrawingMode = true;
  }
  drawCircle(): void {
    this.emite = true;
    this.canvas.add(new fabric.Circle({
      width: 100, height: 100, left: 100, top: 100, fill: '#725AC1', angle: 45, radius: 50
    }))
  }

  drawRect(): void {
    this.emite = true;
    this.canvas.add(new fabric.Rect({
      width: 100, height: 100, left: 100, top: 100, fill: '#725AC1',
    }))

  }
  changeColor(): void {
    var activeObjects = this.canvas.getActiveObjects();
    activeObjects.forEach(o => {
      o.set('fill', 'blue')
    });;
  }

}

function e(e: any) {
  throw new Error('Function not implemented.');
}

