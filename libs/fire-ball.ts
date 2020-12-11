import { Point } from "./point.js";
import { FireBallFollower } from "./fire-ball-follower.js";

export class FireBall {

    public readonly follower: FireBallFollower;
    public damage: number;
    public radius: number;

    public constructor(from: Point, to: Point, radius: number = 0, stepLength?: number) {
        this.damage = 5;
        this.radius = 4;
        this.follower = new FireBallFollower(from, to, radius + this.radius, stepLength);
    }
}
