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
      this.drawFromEvent(res)
    });
    this.socketService.callRemove.subscribe((res: any) => {
      this.emite = false;
      console.log(res)
      this.deleteFromEvent(res)
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
            let name =this.generateObjectId();
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
  deleteFromEvent(nameToRemove: string): void {
    if (nameToRemove != null) {
      this.canvas.getObjects().forEach(shape => {
        console.log(shape)
        if (shape.name == nameToRemove) {
          this.removeShape(shape)
        }
      });
    }
  }

  drawFromEvent(e: any): void {
    if (e != null) {
      var target = e.res.target;
      var newTarget = this.addObjectIdToTargetOptions(target,e.name);
      switch (target.type) {
        case "rect":
          this.canvas.add(new fabric.Rect({
            width: target?.width, height: target?.height, left: target?.left, top: target?.top, fill: target?.fill, name: e.name
          }))
          break;
        case "circle":
          this.canvas.add(new fabric.Circle({ width: target?.width, height: target?.height, left: target?.left, top: target?.top, fill: target?.fill, name: e.name, angle: 45, radius: 50 }));
          break;
        case "textbox":
          this.canvas.add(new fabric.Textbox('', newTarget));
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
  addObjectIdToTargetOptions(target: any, objectId:string): fabric.IObjectOptions {
    var ret = target as fabric.IObjectOptions;
    console.log("name from method", objectId);
    ret.name = objectId;
    return ret;
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

  onClick_drawTextButton(): void {
    this.emite = true;
    this.canvas.isDrawingMode = false;
    this.canvas.add(new fabric.Textbox('Insert text'));
  }
  onClick_freeDrawButton(): void {
    this.emite = true;
    this.canvas.isDrawingMode = !this.canvas.isDrawingMode;
  }
  onClick_drawCircleButton(): void {
    this.emite = true;
    this.canvas.add(new fabric.Circle({
      width: 100, height: 100, left: 100, top: 100, fill: '#725AC1', angle: 45, radius: 50, name: this.generateObjectId()
    }))
  }
  onClick_drawRectButton(): void {
    this.emite = true;
    this.canvas.add(new fabric.Rect({
      width: 100, height: 100, left: 100, top: 100, fill: '#725AC1', name: this.generateObjectId()
    }))
    console.log(this.canvas.getObjects())

  }
  onClick_deleteButton(): void {
    this.emite = true;
    var selectedObjects = this.canvas.getActiveObjects();
    selectedObjects.forEach(shape => {
      this.removeShape(shape);
    });;
  }
  onClick_changeColor(): void {
    var activeObjects = this.canvas.getActiveObjects();
    activeObjects.forEach(o => {
      o.set('fill', 'blue')
    });;
  }
  removeShape(s: fabric.Object) {
    if (s == null) return;
    this.canvas.remove(s);
  }
 
  generateObjectId(): string | undefined {
    return Math.floor((Math.random() * 999999) + 1).toString();
  }
}