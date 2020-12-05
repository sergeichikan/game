import { Point } from "./point.js";

export class Circle {

    public readonly radius: number;
    public readonly fillStyle: string;

    public constructor(radius: number = 4, fillStyle: string = "black") {
        this.radius = radius;
        this.fillStyle = fillStyle;
    }

    public draw(ctx: CanvasRenderingContext2D, center: Point) {
        ctx.beginPath();
        ctx.arc(center.x, center.y, this.radius, Circle.startAngle, Circle.endAngle);
        ctx.fillStyle = this.fillStyle;
        ctx.fill();
        ctx.closePath();
    }

    private static readonly startAngle = 0;
    private static readonly endAngle = Math.PI * 2;
}
