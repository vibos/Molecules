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
    this.ctx = this.canvasRef.nativeElement.getContext('2d');

    this.width = this.canvasRef.nativeElement.offsetWidth;
    this.height = this.canvasRef.nativeElement.offsetHeight;

    this.canvasRef.nativeElement.width = this.width;
    this.canvasRef.nativeElement.style.width = "auto";
    this.canvasRef.nativeElement.height = this.height;
    this.canvasRef.nativeElement.style.height = "auto";

    this.ctx.fillStyle = "#fff";
    this.ctx.fillRect(0, 0, this.width, this.height);

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

  simulate() {
    const t = this.time || Date.now();
    this.dt = Date.now() - t;
    this.time = Date.now();

    this.Balls.forEach((item, i) => {
      let newX = item.x + this.dt * item.Vx / 1000;
      let newY = item.y + this.dt * item.Vy / 1000;// + 100 * (this.dt * this.dt / 1000000) / 2;
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

      item.moove(newX, newY);
    });

    // each other
    this.Balls.forEach((item, i) => {
      for (let j = i + 1; j < this.Balls.length; j++) {
        let ball = this.Balls[j];
        if (this.getDistanceBetweenDots(item.x, item.y, ball.x, ball.y) < item.radius + ball.radius) {
          if (this.getDistanceBetweenDots(item.prevX, item.prevY, ball.prevX, ball.prevY) > this.getDistanceBetweenDots(item.x, item.y, ball.x, ball.y)) {
            let tgA = (ball.y - item.y) / (ball.x - item.x);
            let cosA = Math.cos(Math.atan(tgA));
            let sinA = Math.sin(Math.atan(tgA));

            if (item.Vy * ball.Vy < 0) {
              // different directions
              // exchange impulses
              // console.log(ball.Px+ item.Px, ball.Py+ item.Py);

              // нужно доработать, появляется лишняя энергия

              let ix = ((item.Vx + item.Vy) * cosA * cosA) * item.m;
              let iy = ((item.Vx + item.Vy) * cosA * sinA) * item.m;
              let bx = ((ball.Vx + ball.Vy) * cosA * cosA) * ball.m;
              let by = ((ball.Vx + ball.Vy) * cosA * sinA) * ball.m;

              item.Vx += bx - ix;
              item.Vy += by - iy;

              ball.Vx += ix - bx;
              ball.Vy += iy - by;

              // console.log(ball.Px+ item.Px, ball.Py+ item.Py);
            } else if (Math.abs(item.Vy) < Math.abs(ball.Vy)) {
              // same directions
              // нужно доработать для передачи импульса вдоль линии столкновения центров

              item.Vy += ball.Py / item.m;
              ball.Vy = 0;

              item.Vx += ball.Px / item.m;
              ball.Vx = 0;
            } else if (Math.abs(item.Vy) > Math.abs(ball.Vy)) {
              // same directions
              // нужно доработать для передачи импульса вдоль линии столкновения центров
              ball.Vy += item.Py / ball.m;
              item.Vy = 0;

              ball.Vx += item.Px / ball.m;
              item.Vx = 0;
            }
          }
        }
      }
    });
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

    // this.ctx.fillStyle = "rgba(255, 255, 255, 0.06)";
    // this.ctx.fillRect(0, 0, this.width, this.height);

    this.ctx.clearRect(0, 0, this.width, this.height);

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
  }
}
