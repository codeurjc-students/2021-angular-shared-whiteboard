import { Component, OnInit } from '@angular/core';
import { fabric } from 'fabric';
import { Cmyk, ColorPickerService } from 'ngx-color-picker';
import { SocketWebService } from '../services/socket-web.service';
import * as uuid from 'uuid';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.css']
})
export class CanvasComponent implements OnInit {

  selectedColor: string = '#000000';
  private canvas = new fabric.Canvas('canvas');
  private emite: boolean = true;
  public isShown = false;
  public isDrawButtonActive?= false;

  constructor(private socketService: SocketWebService) {

    this.socketService.callDraw.subscribe((res: any) => {
      this.emite = false;
      console.log(res);
      this.drawFromEvent(res)
    });
    this.socketService.callRemove.subscribe((res: any) => {
      this.emite = false;
      this.deleteFromEvent(res)
    });
    this.socketService.callModify.subscribe((res: any) => {
      this.emite = false;
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


  toggleShow() {
    this.isShown = !this.isShown;
  }
  ngOnInit(): void {
    this.isShown = false; //hidden every time subscribe detects change
    this.canvas = new fabric.Canvas('canvas');
    this.isDrawButtonActive = this.canvas.isDrawingMode;
    this.canvas.on('object:added', (e) => {
      console.log(e);
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
      this.socketService.changeTextEvent(({ e, name }));
    });
  }
  changeTextFromEvent(res: any) {
    var object = this.getObjectByName(res.name) as fabric.Text
    object.text = res.e.target.text;
    this.canvas.renderAll()
  }

  modifyObjectFromEvent(event: any) {
    var target = event.res.target;
    if (target.objects != null) {
      console.log('Multiple objects not available.')
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
      if (object != null) {
        if (object.type == 'path') {
          object.set('stroke', payload.color);
        } else {
          object.set('fill', payload.color);
        }
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
        case "line":
          console.log("switch", target);
          this.canvas.add(new fabric.Line([350, 100, 350, 400], newTarget));
          break;
        default:
          console.log('Target type not valid: ', target.type);
      }
    }
  }
  addObjectIdToTargetOptions(target: any, objectId: string): fabric.IObjectOptions {
    var ret = target as fabric.IObjectOptions;
    ret.name = objectId;
    return ret;
  }
  mapPathFromEvent(e: any): string {
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

  checkFreeDrawValue() {
    this.emite = true;
    this.canvas.isDrawingMode = !this.canvas.isDrawingMode;
    this.isDrawButtonActive = this.canvas.isDrawingMode;
    this.canvas.freeDrawingBrush.color = this.selectedColor;
  }

  onClick_drawCircleButton(): void {
    this.emite = true;
    this.canvas.add(new fabric.Circle({
      width: 100, height: 100, left: 100, top: 100, fill: this.selectedColor, angle: 45, radius: 50, name: this.generateObjectId()
    }))
  }
  onClick_drawLineButton(): void {
    this.emite = true;
    this.canvas.add(new fabric.Line([350, 100, 350, 400], {
      height: 100, left: 100, top: 100, stroke: this.selectedColor, name: this.generateObjectId()
    }))
  }
  onClick_drawRectButton(): void {
    this.emite = true;
    this.canvas.add(new fabric.Rect({
      width: 100, height: 100, left: 100, top: 100, fill: this.selectedColor, name: this.generateObjectId()
    }))

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
      if (o.type == 'path' || o.type == 'line') {
        o.set('stroke', this.selectedColor);
      } else {
        o.set('fill', this.selectedColor);
      }
      if (o.name != null) {
        this.socketService.changeColorEvent(o.name, this.selectedColor);
      }
    });
    this.canvas.renderAll();

  }
  public onChangeColor(color: string): void {
    this.selectedColor = color;
    if (this.canvas.isDrawingMode)
      this.canvas.freeDrawingBrush.color = color;
  }
  removeShape(s: fabric.Object) {
    if (s == null) return;
    this.canvas.remove(s);
  }
  generateObjectId(): string | undefined {
    return uuid.v4();
  }
  getObjectByName(n: string): fabric.Object {
    var ret: any;
    this.canvas.getObjects().forEach((object: any) => {
      if (object.name == n) {
        ret = object;
      }
    });
    return ret;
  }
}