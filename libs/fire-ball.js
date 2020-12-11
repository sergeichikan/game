import { defaultStepLength } from "../configs/fire-ball.js";
import { FireBallFollower } from "./fire-ball-follower.js";
export class FireBall {
    constructor(from, to, radius = 0, stepLength = defaultStepLength) {
        this.damage = 5;
        this.radius = 4;
        this.follower = new FireBallFollower(from, to, stepLength, radius + this.radius);
    }
}
//# sourceMappingURL=fire-ball.js.map