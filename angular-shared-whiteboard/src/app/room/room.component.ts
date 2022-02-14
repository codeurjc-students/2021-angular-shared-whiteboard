import { Variable } from '@angular/compiler/src/render3/r3_ast';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.css']
})
export class RoomComponent implements OnInit {
  room: string;
  constructor(private router: ActivatedRoute, private cookieService: CookieService) {
    this.room = this.router.snapshot.params['room'];
    this.cookieService.set('room',this.room);
   }

  ngOnInit(): void {
    
    }
  ngOnDestroy() {
  }
}
