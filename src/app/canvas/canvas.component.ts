import { Component, Input, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { Ball } from '../_models/ball.model';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.css']
})
export class CanvasComponent implements OnInit {
  @Input() offsetX: number;
  @Input() offsetY: number;
  @Input() radius: number;
  @Input() color: string;

  dt = 100; // ms

  @ViewChild('myIdentifier')
  myIdentifier: ElementRef;

  Balls: Ball[] = [];

  constructor() { }

  ngOnInit() {
    console.log(this.myIdentifier.nativeElement.clientX );
    this.simulate();
  }

  onDragOver(e: DragEvent) {
    e.preventDefault();
  }

  onDragDrop(e: DragEvent) {
    const x = e.offsetX - (this.offsetX - this.radius);
    const y = e.offsetY - (this.offsetY - this.radius);

    this.Balls.push(new Ball(x, y, this.radius, this.color));
  }

  simulate() {
   setInterval(() => {
      this.Balls.forEach((item, i) => {
        let newX = item.x + this.dt * item.Vx / 1000;
        let newY = item.y + this.dt * item.Vy / 1000;

        // x borders
        if (newX + item.radius > 500 && item.Vx > 0) {
          newX = 500 * 2 - newX - item.radius * 2;
          item.Vx *= -1;
        } else if (newX - item.radius < 0 && item.Vx < 0) {
          newX = - newX + item.radius * 2;
          item.Vx *= -1;
        }

		// y borders
        if (newY + item.radius > 500 && item.Vy > 0) {
          newY = 500 * 2 - newY - item.radius * 2;
          item.Vy *= -1;
        } else if(newY - item.radius < 0 && item.Vy < 0) {
          newY = - newY + item.radius * 2;
          item.Vy *= -1;
        }

        item.moove(newX, newY);
      });
    }, this.dt);
  }
  
  protected getDistanceBetweenDots(x1, y1, x2, y2) {
	  return Math.sqrt( Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2) );
  }
}
