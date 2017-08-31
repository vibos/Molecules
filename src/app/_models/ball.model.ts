export class Ball {
  x: number;
  y: number;
  m: number;
  radius: number;
  color: string;

  Vx: number;
  Vy: number;

  constructor(x: number, y: number, radius?: number, color?: string, Vx?: number, Vy?: number) {
    this.x = x;
    this.y = y;
    this.radius = radius || 30;
    this.color = color || '#ff0000';

    // this.Vx = (Math.random() * 100 - 50) * Math.sqrt(1 / Math.pow(this.radius, 2)) * 100; // px / second
    // this.Vy = (Math.random() * 100 - 50) * Math.sqrt(1 / Math.pow(this.radius, 2)) * 100; // px / second

    const ro = 3000;
    const p = 5000;
    const V = 4 / 3 * Math.PI * Math.pow(this.radius / 100, 3);
    this.m = ro * V;

    const angle = Math.random() * Math.PI * 2;

    this.Vx = Vx || p / this.m * Math.cos(angle);
    this.Vy = Vy || p / this.m * Math.sin(angle);
  }

  public moove(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  get Px(): number {
    return this.m * this.Vx;
  }

  get Py(): number {
    return this.m * this.Vy;
  }
}
