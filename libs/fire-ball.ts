import { radius, startAngle, endAngle, fillStyle } from "../configs/fire-ball.js";
import { Point } from "./point.js";
import { FireBallFollower } from "./fire-ball-follower.js";

export class FireBall {

    public readonly follower: FireBallFollower;

    public constructor(from: Point, to: Point, stepLength: number) {
        this.follower = new FireBallFollower(from, to, stepLength);
    }

    // public draw(ctx: CanvasRenderingContext2D) {
    //     ctx.beginPath();
    //     ctx.arc(this.follower.from.x, this.follower.from.y, radius, startAngle, endAngle);
    //     ctx.fillStyle = fillStyle;
    //     ctx.fill();
    //     ctx.closePath();
    // }
}
