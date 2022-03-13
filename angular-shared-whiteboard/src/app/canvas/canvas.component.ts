import { identifierName, ThrowStmt } from '@angular/compiler';
import { transformAll } from '@angular/compiler/src/render3/r3_ast';
import { Component, OnInit } from '@angular/core';
import { fabric } from 'fabric';
import { Rect } from 'fabric/fabric-impl';
import { identity } from 'rxjs';
import { Namespace } from 'socket.io';
import { SocketWebService } from '../services/socket-web.service';



@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.css']
})
export class CanvasComponent implements OnInit {
  private canvas = new fabric.Canvas('canvas');
  private emite: boolean = true;
  private idShape = '';
  constructor(private socketService: SocketWebService) {
    this.socketService.callDraw.subscribe((res: any) => {
      this.emite = false;
      this.idShape = res.name;
      console.log('subscribe', res, this.idShape)
      this.draw(res)
    });
    this.socketService.callRemove.subscribe((res: any) => {
      this.emite = false;
      console.log(res)
      this.delete(res)
    });
  }
  ngOnInit(): void {
    this.canvas = new fabric.Canvas('canvas');

    this.canvas.on('object:added', (e) => {
      if (this.emite) {
        if (e.target?.name != null) {
          this.socketService.drawEvent(e, e.target?.name?.toString());
        } else {
          if (e != null && e.target != null) {
            let name =this.generateId();
            if(name!=null){
              e.target.name = name;
              this.socketService.drawEvent(e, name);
            }
          }

        }
      }
    });
    this.canvas.on('object:removed', (e) => {
      if (this.emite) {
        let nameShape = (e.target?.name)
        console.log('nombre para borrar', nameShape);
        this.socketService.removeEvent((nameShape));
      }
    });
 
  }
  delete(nameToRemove: string): void {
    if (nameToRemove != null) {
      this.canvas.getObjects().forEach(shape => {
        console.log(shape)
        if (shape.name == nameToRemove) {
          this.removeShape(shape)
        }
      });
    }
  }

  draw(e: any): void {
    if (e != null) {
      var target = e.res.target;
      console.log(e.res.target.type)
      switch (target.type) {
        case "rect":
          this.canvas.add(new fabric.Rect({
            width: target?.width, height: target?.height, left: target?.left, top: target?.top, fill: target?.fill, name: e.name
          }))
          console.log(this.canvas.getObjects())
          break;
        case "circle":
          this.canvas.add(new fabric.Circle({ width: target?.width, height: target?.height, left: target?.left, top: target?.top, fill: target?.fill, name: e.name, angle: 45, radius: 50 }));
          break;
        case "textbox":
          this.canvas.add(new fabric.Textbox('', e.target));
          break;
        case "path":
          var pathValue = this.mapPathFromEvent(e);
          if (pathValue != null)
          console.log(target)
            this.canvas.add(new fabric.Path(pathValue, {
              name: e.name,
              width: target?.width, height: target?.height, left: target?.left, top: target?.top, fill: target?.fill, stroke: target?.stroke
            }));
          console.log('drawed', this.canvas.getObjects())
          break;
        default:
          console.log('Target type is null')
      }
    }
  }
  mapPathFromEvent(e: any): string {
    console.log(e)
    const path = e.res.target.path as Array<Array<any>>;
    let pathValue = "";
    path.forEach((elements) => {
      elements.forEach((elementPath) => {
        pathValue += ' ' + elementPath
      });
    });
    return pathValue;
  }

  drawText(): void {
    this.emite = true;
    this.canvas.isDrawingMode = false;
    this.canvas.add(new fabric.Textbox('Insert text'));
  }
  freeDraw(): void {
    this.emite = true;
    this.canvas.isDrawingMode = !this.canvas.isDrawingMode;
  }
  drawCircle(): void {
    this.emite = true;
    this.canvas.add(new fabric.Circle({
      width: 100, height: 100, left: 100, top: 100, fill: '#725AC1', angle: 45, radius: 50, name: this.generateId()
    }))
  }

  drawRect(): void {
    this.emite = true;
    this.canvas.add(new fabric.Rect({
      width: 100, height: 100, left: 100, top: 100, fill: '#725AC1', name: this.generateId()
    }))
    console.log(this.canvas.getObjects())

  }
  generateId(): string | undefined {
    return Math.floor((Math.random() * 999999) + 1).toString();
  }
  deleteBtn(): void {
    this.emite = true;
    var selectedObjects = this.canvas.getActiveObjects();
    selectedObjects.forEach(shape => {
      this.removeShape(shape);
    });;
  }
  removeShape(s: fabric.Object) {
    if (s == null) return;
    this.canvas.remove(s);
  }
  changeColor(): void {
    var activeObjects = this.canvas.getActiveObjects();
    activeObjects.forEach(o => {
      o.set('fill', 'blue')
    });;
  }

}