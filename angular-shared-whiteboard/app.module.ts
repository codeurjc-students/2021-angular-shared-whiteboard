import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './src/app/app-routing.module';
import { AppComponent } from './src/app/app.component';
import { CanvasComponent } from './src/app/canvas/canvas.component';
import { HomeComponent } from './src/app/home/home.component';
import { RoomComponent } from './src/app/room/room.component';
import { CookieService } from 'ngx-cookie-service';
import { ColorPickerModule } from 'ngx-color-picker';
import { RouterTestingModule } from '@angular/router/testing'
import { RouterModule, Routes } from '@angular/router';


const routes: Routes=[
  {
    path:'',
    component:HomeComponent
  },
  {
    path:':room',
    component:RoomComponent
  }
];


@NgModule({
  declarations: [
    AppComponent,
    CanvasComponent,
    HomeComponent,
    RoomComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule.forRoot([]),
    RouterTestingModule,
    ColorPickerModule
  ],
  providers: [
    CookieService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
