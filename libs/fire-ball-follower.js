import { width, height } from "../configs/canvas.js";
import { Follower } from "./follower.js";
const canvasDiagonal = Math.sqrt(Math.pow(width, 2) + Math.pow(height, 2));
export class FireBallFollower extends Follower {
    constructor(from, to, stepLength, d) {
        super(from, stepLength);
        this.setTarget(to);
        this.from = this.getPointOnLine(d);
    }
    setTarget(target) {
        super.setTarget(target);
        super.setTarget(this.getPointOnLine(canvasDiagonal));
    }
}
//# sourceMappingURL=fire-ball-follower.js.map