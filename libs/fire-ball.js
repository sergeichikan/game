import { FireBallFollower } from "./fire-ball-follower.js";
export class FireBall {
    constructor(from, to, radius = 0, stepLength) {
        this.damage = 5;
        this.radius = 4;
        this.follower = new FireBallFollower(from, to, radius + this.radius, stepLength);
    }
}
//# sourceMappingURL=fire-ball.js.map