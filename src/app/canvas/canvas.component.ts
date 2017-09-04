import { Component, Input, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { Ball } from '../_models/ball.model';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.css']
})
export class CanvasComponent implements OnInit, OnDestroy {
  @Input() offsetX: number;
  @Input() offsetY: number;
  @Input() radius: number;
  @Input() color: string;

  width: number;
  height: number;

  private running: boolean;
  interaction = true;
  shadow = false;

  dt = 1000 / 60; // ms
  time: number;
  ctx: CanvasRenderingContext2D;

  // @ViewChild('myIdentifier')
  // myIdentifier: ElementRef;
  @ViewChild('myCanvas') canvasRef: ElementRef;
  // @ViewChild('myCanvasWrap') myCanvasWrap: ElementRef;

  Balls: Ball[] = [];

  constructor() { }

  ngOnInit() {
    this.onResize();

    this.running = true;
    this.paint();

    // this.simulate();
  }

  ngOnDestroy() {
    this.running = false;
  }

  onDragOver(e: DragEvent) {
    e.preventDefault();
  }

  onDragDrop(e: DragEvent) {
    if ( typeof(this.radius) !== 'undefined' ) {
      const x = e.offsetX - (this.offsetX - this.radius);
      const y = e.offsetY - (this.offsetY - this.radius);

      this.Balls.push(new Ball(x, y, this.radius, this.color));
    }

    if (!this.running) {
      this.time = Date.now();
      this.running = true;
      this.paint();
      this.running = false;
    }
  }

  /*
   * Resize canvas
   */
  onResize() {
    this.canvasRef.nativeElement.style.width = '';
    this.canvasRef.nativeElement.style.height = '';

    this.ctx = this.canvasRef.nativeElement.getContext('2d');

    this.width = this.canvasRef.nativeElement.offsetWidth;
    this.height = this.canvasRef.nativeElement.offsetHeight;

    this.canvasRef.nativeElement.width = this.width;
    this.canvasRef.nativeElement.style.width = "auto";
    this.canvasRef.nativeElement.height = this.height;
    this.canvasRef.nativeElement.style.height = "auto";

    this.ctx.fillStyle = "#fff";
    this.ctx.fillRect(0, 0, this.width, this.height);
  }

  /*
   * Get balls positions
   */
  simulate() {
    const t = this.time || Date.now();
    this.dt = Date.now() - t;
    this.time = Date.now();

    this.Balls.forEach((item, i) => {
      let newX = item.x + this.dt * item.Vx / 1000;
      let newY = item.y + this.dt * item.Vy / 1000;
      // item.Vy += (this.dt / 1000) * 100;

      // x borders
      if (newX + item.radius > this.width && item.Vx > 0) {
        newX = this.width * 2 - newX - item.radius * 2;
        item.Vx *= -1;
      } else if (newX - item.radius < 0 && item.Vx < 0) {
        newX = - newX + item.radius * 2;
        item.Vx *= -1;
      }

      // y borders
      if (newY + item.radius > this.height && item.Vy > 0) {
        newY = this.height * 2 - newY - item.radius * 2;
        item.Vy *= -1;
      } else if (newY - item.radius < 0 && item.Vy < 0) {
        newY = - newY + item.radius * 2;
        item.Vy *= -1;
      }

      item.move(newX, newY);
    });

    if (this.interaction) {
      // interaction
      this.Balls.forEach((item, i) => {
        for (let j = i + 1; j < this.Balls.length; j++) {
          let ball = this.Balls[j];
          if (this.getDistanceBetweenDots(item.x, item.y, ball.x, ball.y) < item.radius + ball.radius) {
            if (this.getDistanceBetweenDots(item.prevX, item.prevY, ball.prevX, ball.prevY) > this.getDistanceBetweenDots(item.x, item.y, ball.x, ball.y)) {
              // console.log("P: ", Math.round(ball.Px + item.Px + ball.Py + item.Py), "E: ", Math.round(item.P * item.P / (2 * item.m) + ball.P * ball.P / (2 * ball.m)));

              let tgA = (ball.y - item.y) / (ball.x - item.x);
              let cosA = Math.cos(Math.atan(tgA));
              let sinA = Math.sin(Math.atan(tgA));

              // problem with energy saving

              const Vi = item.Vy * sinA + item.Vx * cosA;
              const Vb = ball.Vy * sinA + ball.Vx * cosA;

              const ix = Vi * cosA * item.m;
              const iy = Vi * sinA * item.m;

              const bx = Vb * cosA * ball.m;
              const by = Vb * sinA * ball.m;

              if (Vi * Vb <= 0) {
                item.Vx += (bx - ix) / item.m;
                item.Vy += (by - iy) / item.m;
                ball.Vx += (ix - bx) / ball.m;
                ball.Vy += (iy - by) / ball.m;
              } else if (Math.abs(Vi) > Math.abs(Vb)) {
                item.Vx += ( -ix) / item.m;
                item.Vy += ( -iy) / item.m;
                ball.Vx += (ix) / ball.m;
                ball.Vy += (iy) / ball.m;
              } else if (Math.abs(Vb) > Math.abs(Vi)) {
                item.Vx += (bx) / item.m;
                item.Vy += (by) / item.m;
                ball.Vx += ( -bx) / ball.m;
                ball.Vy += ( -by) / ball.m;
              }

              item.move(item.prevX, item.prevY);
              ball.move(ball.prevX, ball.prevY);

              // console.log("P: ", Math.round(ball.Px + item.Px + ball.Py + item.Py), "E: ", Math.round(item.P * item.P / (2 * item.m) + ball.P * ball.P / (2 * ball.m)));
              // console.log("------");
            }
          }
        }
      });
    }
  }

  /*
   * Draw circles on canvas
   */
  protected paint() {
    // Check that we're still running.
    if (!this.running) {
      return;
    }

    this.simulate();

    // Leave shadow after balls
    if (this.shadow) {
      this.ctx.fillStyle = "rgba(255, 255, 255, 0.06)";
      this.ctx.fillRect(0, 0, this.width, this.height);
    } else {
      this.ctx.clearRect(0, 0, this.width, this.height);
    }

    this.Balls.forEach((ball) => {
      this.ctx.beginPath();
      this.ctx.fillStyle = ball.color;
      this.ctx.moveTo(ball.x, ball.y);
      this.ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
      this.ctx.fill();
    });

    requestAnimationFrame(() => this.paint());
  }

  protected getDistanceBetweenDots(x1, y1, x2, y2) {
    return Math.sqrt( Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2) );
  }

  onStateChange() {
    this.running = !this.running;
    if (this.running) {
      this.time = Date.now();
      this.paint();
    } else {
      localStorage.setItem('balls', JSON.stringify(this.Balls));
    }
  }

  onSavedLoad() {
    let balls = JSON.parse(localStorage.getItem('balls'));
    this.Balls = [];
    balls.forEach((item) => {
      this.Balls.push(new Ball(item.x, item.y, item.radius, item.color, item.Vx, item.Vy));
    });
    this.running = true;
    this.time = Date.now();
    this.paint();
    this.running = false;
  }

  onClear() {
    this.Balls = [];
    this.time = undefined;
    this.ctx.clearRect(0, 0, this.width, this.height);
    console.clear();
  }
}
