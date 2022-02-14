import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CanvasComponent } from './canvas/canvas.component';
import { HomeComponent } from './home/home.component';
import { RoomComponent } from './room/room.component';
import{RouterModule, Routes} from '@angular/router'

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
    RouterModule.forRoot(routes),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
