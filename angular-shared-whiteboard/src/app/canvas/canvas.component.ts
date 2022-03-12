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

    this.canvas.on('object:added', (e) => {
      if (this.emite) {
        this.socketService.drawEvent((e));
      }
    });
    this.canvas.on('path:created', (e) => {
      if (this.emite) {
        this.socketService.drawEvent((e));
      }
    });

  }

  draw(e: fabric.IEvent<Event>): void {
    if (e != null) {
      console.log('Target => ', e.target)
      switch (e.target?.type) {
        case "rect":
          this.canvas.add(new fabric.Rect(e.target));
          break;
        case "circle":
          this.canvas.add(new fabric.Circle(e.target));
          break;
        case "textbox":
          this.canvas.add(new fabric.Textbox('', e.target));
          break;
        case "path":
          var pathValue = this.mapPathFromEvent(e);
          if (pathValue != null)
            this.canvas.add(new fabric.Path(pathValue, e.target))
          break;
        default:
          console.log('Target type is null')
      }
    }
  }
  mapPathFromEvent(e: fabric.IEvent<Event>): string {
    const path = (e as any).target.path as Array<Array<any>>;
    let pathValue = "";
    path.forEach((elements) => {
      elements.forEach((elementPath) => {
        pathValue += ' ' + elementPath
      });
    });
    return pathValue;
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

