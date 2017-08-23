export class Ball {
  x: number;
  y: number;
  radius: number;
  color: string;

  v: number;
  Vx: number;
  Vy: number;

  constructor(x: number, y: number, radius?: number, color?: string) {
    this.x = x;
    this.y = y;
    this.radius = radius || 30;
    this.color = color || '#ff0000';

    this.v = Math.random() * 3 + 1;
    this.Vx = Math.random() * 10 - 5;
    this.Vy = Math.random() * 10 - 5;
  }
}
