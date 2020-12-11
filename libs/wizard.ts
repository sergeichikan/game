import { Follower } from "./follower.js";
import { Point } from "./point.js";

export class Wizard {

    public readonly id: string;
    public readonly follower: Follower;
    public hp: number;
    public radius: number;

    public constructor(location: Point, id: string) {
        this.id = id;
        this.follower = new Follower(location, 2);
        this.hp = 100;
        this.radius = 10;
    }

    public blink(target: Point) {
        this.follower.from = target;
        this.follower.stop();
    }
}
