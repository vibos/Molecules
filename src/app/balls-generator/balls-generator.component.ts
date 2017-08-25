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
  color = "green";

  Balls: Ball[] = [];

  constructor() {}

  ngOnInit() {
    this.onBallAdd();
  }

  onBallAdd() {
    this.Balls.push( new Ball(0, 0, 30, this.color) );
  }

  /*
   * Remember offset of mouse pointer relative to the center
   */
  onMouseDown(e) {
    this.offsetX = e.offsetX;
    this.offsetY = e.offsetY;
  }
}
