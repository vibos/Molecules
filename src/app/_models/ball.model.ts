export class Ball {
  x: number;
  y: number;
  radius: number;
  color: string;

  Vx: number;
  Vy: number;

  constructor(x: number, y: number, radius?: number, color?: string) {
    this.x = x;
    this.y = y;
    this.radius = radius || 30;
    this.color = color || '#ff0000';

    this.Vx = (Math.random() * 100 - 50) * 4; // px / second
    this.Vy = (Math.random() * 100 - 50) * 4; // px / second
  }

  public moove(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}
