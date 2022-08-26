import { Component, OnInit } from '@angular/core';
import { fabric } from 'fabric';
import { SocketWebService } from '../services/socket-web.service';
import * as uuid from 'uuid';
import { ThisReceiver } from '@angular/compiler';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.css']
})
export class CanvasComponent implements OnInit {

  selectedColor: string = '#000000';
  sak = "";
  public canvas = new fabric.Canvas('canvas');
  private emite: boolean = true;
  isColorShown = false;
  isImageShown = false;
  public isDrawButtonActive?= false;
  private arrow1 = [{x:20,y:40},{x:110,y:40},
     {x:110,y:20},{x:140,y:50},{x:110,y:80}, 
     {x:110,y:60},{x:20,y:60}, {x:20,y:40} ]  ;

  private arrow2 = [{x:20,y:50},{x:139,y:50},
     {x:110,y:30},{x:111,y:30},{x:141,y:50},
     {x:141,y:51},
     {x:111,y:70},{x:110,y:70}, {x:139,y:50},
     {x:20,y:51}]  ;

  private arrow3 = [{x:20,y:50},{x:110,y:50},
     {x:110,y:30},{x:140,y:50},{x:110,y:70}, 
     {x:110,y:50} ]  ;

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


  showCanvasComponent() {
    this.isColorShown = !this.isColorShown;
  }
  showImageURL() {
    this.isImageShown = !this.isImageShown;
  }
  ngOnInit(): void {
    this.isColorShown = false;
    this.isImageShown = false;
    this.canvas = new fabric.Canvas('canvas');
    this.isDrawButtonActive = this.canvas.isDrawingMode;
    
    this.canvas.on('object:added', (e) => {
      if (this.emite) {
        if (e.target?.name != null) {
          this.socketService.drawEvent(e, e.target?.name?.toString());
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
    var object = this.getObjectById(res.name) as fabric.Text
    object.text = res.e.target.text;
    this.canvas.renderAll()
  }

  modifyObjectFromEvent(event: any) {
    var target = event.res.target;
    if (target.objects != null) {
      console.log('Multiple objects not available.')
    } else {
      var from = event.objects[0];
      var object = this.getObjectById(from.name);
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
      var object = this.getObjectById(nameToRemove);
      if (object != null)
        this.removeShape(object)
    }
  }
  changeColorFromEvent(payload: any) {
    if (payload != null) {
      var object = this.getObjectById(payload.obj);
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
      console.log(target);
      var newTarget = this.addObjectIdToTargetOptions(target, e.name);
      console.log(newTarget);
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
            this.canvas.add(new fabric.Path(pathValue, newTarget));
          break;
          case "polyline":
            console.log(e);
            this.canvas.add(new fabric.Polyline(target.points, newTarget))
            break;
        case "line":
          this.canvas.add(new fabric.Line([350, 100, 350, 400], newTarget));
          break;
        case "image":
          this.insertImageToCanvas(target.src, e.name, newTarget.scaleX!=null? newTarget.scaleX : 0.5);
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
    this.canvas.add(new fabric.Textbox('Insert text',{name:this.generateObjectId()}));
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
  onClick_drawArrow1Button(): void {
    this.emite = true;
    this.drawArrow(this.arrow1);
  }
  onClick_drawArrow2Button(): void {
    this.emite = true;
    this.drawArrow(this.arrow2);
  }
  onClick_drawArrow3Button(): void {
    this.emite = true;
    this.drawArrow(this.arrow3);
  }
  onClick_AddImage(): void {
    this.emite = true;
    var url = document.getElementById('imageInput') as HTMLInputElement;
    var image = new fabric.Image(url.value);
    var id = this.generateObjectId();
    this.insertImageToCanvas(url.value, id, 0.5);

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
  onChangeColor(color: string): void {
    this.selectedColor = color;
    if (this.canvas.isDrawingMode)
      this.canvas.freeDrawingBrush.color = color;
  }
  drawArrow(arrow: {x:number;y:number}[]) {
    var pline = new fabric.Polyline(arrow, {
      fill: 'white',
      stroke: this.selectedColor,
      opacity: 1,
      strokeWidth: 2,
      originX: 'left',
      originY: 'top',
      selectable: true,
      name:this.generateObjectId()
    });
  
    this.canvas.add(pline);
    this.canvas.renderAll();
  
  }
  insertImageToCanvas(url:string, id:string, scale:number): void {
    fabric.Image.fromURL(url, img => {
        img.scale(scale);
        img.name=id;
      this.canvas.add(img);
      this.canvas.renderAll();
    });
  }
  removeShape(s: fabric.Object) {
    if (s == null) return;
    this.canvas.remove(s);
  }
  generateObjectId(): string {
    return uuid.v4();
  }
  getObjectById(n: string): fabric.Object {
    var ret: any;
    this.canvas.getObjects().forEach((object: any) => {
      if (object.name == n) {
        ret = object;
      }
    });
    return ret;
  }

}
