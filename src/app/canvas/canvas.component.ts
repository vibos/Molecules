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

  @ViewChild('myIdentifier')
  myIdentifier: ElementRef;

  Balls: Ball[] = [];

  constructor() { }

  ngOnInit() {
    // console.log(this.myIdentifier.nativeElement.clientTop);
    // console.log(this.myIdentifier.nativeElement.clientLeft);
    setInterval(() => {
      this.Balls.forEach(function(item) {
        // let newX = item.x + Math.random() * 10 - 5;
        // let newY = item.y + Math.random() * 10 - 5;
        let newX = item.x + item.v * item.Vx;
        let newY = item.y + item.v * item.Vy;

        if (newX + item.radius / 2 > 500 || newX - item.radius / 2 < 0) {
          item.Vx *= -1;
          let newX = item.x + item.v * item.Vx;
        } else if (newY + item.radius / 2 > 500 || newY - item.radius / 2 < 0) {
          item.Vy *= -1;
          let newY = item.y + item.v * item.Vy;
        }
        item.x = newX;
        item.y = newY;
      });
    }, 100);
  }

  onDragOver(e: DragEvent) {
    e.preventDefault();
  }

  onDragDrop(e: DragEvent) {
    const x = e.offsetX - (this.offsetX - 25);
    const y = e.offsetY - (this.offsetY - 25);

    this.Balls.push(new Ball(x, y, this.radius, this.color));
  }
}
