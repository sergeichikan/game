import { width, height } from "../configs/canvas.js";

import { Follower } from "./follower.js";
import { Point } from "./point.js";

const canvasDiagonal = Math.sqrt(Math.pow(width, 2) + Math.pow(height, 2));

export class FireBallFollower extends Follower {
    public constructor(from: Point, to: Point, stepLength: number, d: number) {
        super(from, stepLength);
        this.setTarget(to);
        this.from = this.getPointOnLine(d);
    }

    public setTarget(target: Point) {
        super.setTarget(target);
        super.setTarget(this.getPointOnLine(canvasDiagonal));
    }
}
