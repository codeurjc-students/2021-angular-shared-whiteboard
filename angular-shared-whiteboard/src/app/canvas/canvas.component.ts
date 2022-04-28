import { AnimationQueryMetadata } from '@angular/animations';
import { identifierName, ThrowStmt } from '@angular/compiler';
import { isGeneratedFile } from '@angular/compiler/src/aot/util';
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
  selectedColor: string = '#000000';
  private canvas = new fabric.Canvas('canvas');
  private emite: boolean = true;
  constructor(private socketService: SocketWebService) {

    this.socketService.callDraw.subscribe((res: any) => {
      this.emite = false;
      this.drawFromEvent(res)
    });
    this.socketService.callRemove.subscribe((res: any) => {
      this.emite = false;
      this.deleteFromEvent(res)
    });
    this.socketService.callModify.subscribe((res: any) => {
      this.emite = false;
      console.log(res)
      this.modifyObjectFromEvent(res)
    });
    this.socketService.callChangeColor.subscribe((res: any) => {
      this.emite = false;
      this.changeColorFromEvent(res);
    })
    this.socketService.callTextChanged.subscribe((res: any) => {
      this.emite = false;
      this.changeTextFromEvent(res)
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
            let name = this.generateObjectId();
            if (name != null) {
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
        this.socketService.removeEvent((nameShape));
      }
    });
    this.canvas.on('object:modified', (e) => {
        var objects: any[] = [];
        this.canvas.getActiveObjects().forEach((object: any) => {
          objects.push({
            name: object.name,
            shape: object
          });
        });
        this.socketService.modifyEvent(e, objects);
    });
    this.canvas.on('text:changed', (e) => {
        var name = e.target?.name;
        this.socketService.changeTextEvent(({e, name}));
    });
  }
  changeTextFromEvent(res: any) {
    var object = this.getObjectByName(res.name)
    object.text = res.e.target.text;
    this.canvas.renderAll()
  }

  modifyObjectFromEvent(event: any) {
    var target = event.res.target;
    if (target.objects != null) {
      console.log('a')
      // event.objects.forEach((from: any) => {
      //   this.canvas.getObjects().forEach(to => {
      //     if (to.name == from.name) {
      //       this.canvas.setActiveObject(to);
      //     }
      //   });
      // });
      // console.log(this.canvas.getActiveObjects());

      // //   event.objects.forEach((from: any) => {
      // //   this.canvas.getObjects().forEach(to => {
      // //     if (to.name == from.name) {
      // //       console.log('origen: ',to)
      // //       console.log('desde: ', from.shape.left);
      // //       console.log('hasta: ', to.left);
      // //       to.left = from.shape.left;
      // //       console.log('desde: ', from.shape.top);
      // //       console.log('hasta: ', to.top);
      // //       to.top = from.shape.top;
      // //       console.log('x: ', to.originX);
      // //       console.log('toyp', to.originY);
      // //       to.angle = from.shape.angle;
      // //       to.scaleX = from.shape.scaleX;
      // //       to.scaleY = from.shape.scaleY;
      // //       this.canvas.renderAll();
      // //       console.log('modificando to: ', to);
      // //       return;
      // //     }
      // //   });
      // // });
    } else {
      var from = event.objects[0];
      var object = this.getObjectByName(from.name);
      if (object != null) {
        object.left = from.shape.left;
        object.top = from.shape.top;
        object.angle = from.shape.angle;
        object.scaleX = from.shape.scaleX;
        object.scaleY = from.shape.scaleY;
        object.width = from.shape.width;
        object.height = from.shape.height;
        this.canvas.renderAll();
      }
    }


  }
  deleteFromEvent(nameToRemove: string): void {
    if (nameToRemove != null) {
      var object = this.getObjectByName(nameToRemove);
      if (object != null)
        this.removeShape(object)
    }
  }
  changeColorFromEvent(payload: any) {
    if (payload != null) {
      var object = this.getObjectByName(payload.obj);
      console.log(object);
      if (object != null) {
        console.log(object);
        object.set('fill', payload.color);
      }
      this.canvas.renderAll();
    }
  }
  drawFromEvent(e: any): void {
    if (e != null) {
      var target = e.res.target;
      var newTarget = this.addObjectIdToTargetOptions(target, e.name);
      switch (target.type) {
        case "rect":
          this.canvas.add(new fabric.Rect(newTarget))
          break;
        case "circle":
          this.canvas.add(new fabric.Circle(newTarget));
          break;
        case "textbox":
          this.canvas.add(new fabric.Textbox('', newTarget));
          break;
        case "path":
          var pathValue = this.mapPathFromEvent(e);
          if (pathValue != null)
            this.canvas.add(new fabric.Path(pathValue, newTarget));
          break;
        default:
          console.log('Target type is null')
      }
    }
  }
  addObjectIdToTargetOptions(target: any, objectId: string): fabric.IObjectOptions {
    var ret = target as fabric.IObjectOptions;
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
    });
  }
  onClick_changeColor(): void {
    var activeObjects = this.canvas.getActiveObjects();
    activeObjects.forEach(o => {
      o.set('fill', 'blue');
      if (o.name != null) {
        this.socketService.changeColorEvent(o.name, 'blue');
      }
    });
    this.canvas.renderAll();

  }
  removeShape(s: fabric.Object) {
    if (s == null) return;
    this.canvas.remove(s);
  }

  generateObjectId(): string | undefined {
    return Math.floor((Math.random() * 999999) + 1).toString();
  }

  getObjectByName(n: string): any {
    var ret: any;
    this.canvas.getObjects().forEach((object: any) => {
      if (object.name == n) {
        ret = object;
      }
    });
    return ret;
  }
}