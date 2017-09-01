import { Component, OnInit } from '@angular/core';
import { Ball } from '../_models/ball.model';

@Component({
  selector: 'app-balls-generator',
  templateUrl: './balls-generator.component.html',
  styleUrls: ['./balls-generator.component.css']
})
export class BallsGeneratorComponent implements OnInit {
  offsetX: number;
  offsetY: number;
  radius: number;
  color: string;

  Balls: Ball[] = [];

  constructor() {}

  ngOnInit() {
    for (let i = 0; i < 75; i++) {
      this.onBallAdd();
    }
  }

  onBallAdd() {
    this.Balls.push( new Ball(0, 0, Math.random() * 40 + 8, this.getRandomColor()) );
    // this.Balls.push( new Ball(0, 0, 15, this.getRandomColor()) );
  }

  /*
   * Remember offset of mouse pointer relative to the center
   */
  onMouseDown(e) {
    this.offsetX = e.offsetX;
    this.offsetY = e.offsetY;
  }

  onDragStart(e, i) {
    e.dataTransfer.effectAllowed = "move";
    this.radius = this.Balls[i].radius;
    this.color = this.Balls[i].color;
  }

  onDragEnd(e, i) {
    this.radius = undefined;
    if (e.dataTransfer.dropEffect === "move") {
      this.Balls.splice(i, 1);
    }
  }

  private getRandomColor():string {
    return "hsl(" + Math.round(Math.random() * 255) + ", 80%, 50%)";
  }
}
