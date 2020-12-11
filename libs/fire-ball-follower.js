import { width, height } from "../configs/canvas.js";
import { Follower } from "./follower.js";
const canvasDiagonal = Math.sqrt(Math.pow(width, 2) + Math.pow(height, 2));
export class FireBallFollower extends Follower {
    constructor(from, to, d, stepLength = FireBallFollower.defaultStepLength) {
        super(from, stepLength);
        this.setTarget(to);
        this.from = this.getPointOnLine(d);
    }
    setTarget(target) {
        super.setTarget(target);
        super.setTarget(this.getPointOnLine(canvasDiagonal));
    }
}
FireBallFollower.defaultStepLength = 6;
//# sourceMappingURL=fire-ball-follower.js.map