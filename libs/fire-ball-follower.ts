import { width, height } from "../configs/canvas.js";
import { radius } from "../configs/wizard.js";

import { Follower } from "./follower.js";
import { Point } from "./point.js";

const canvasDiagonal = Math.sqrt(Math.pow(width, 2) + Math.pow(height, 2));

export class FireBallFollower extends Follower {
    public constructor(from: Point, to: Point, stepLength: number) {
        super(from, stepLength);
        this.setTarget(to);
        this.from = this.getPointOnLine(radius);
        // console.log(from, this.from);
        // console.log(this.getPointOnLine(radius + 10))
    }

    public setTarget(target: Point) {
        super.setTarget(target);
        super.setTarget(this.getPointOnLine(canvasDiagonal));
    }
}
