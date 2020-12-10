import { Follower } from "./follower.js";
import { Point } from "./point.js";
import { FireBall } from "./fire-ball.js";
import { Game } from "./game.js";

export class Wizard {

    public readonly id: string;
    public readonly follower: Follower;
    public hp: number;

    public constructor(location: Point, id: string) {
        this.id = id;
        this.follower = new Follower(location, 2);
        this.hp = 100;
    }

    public blink(target: Point) {
        this.follower.from = target;
        this.follower.stop();
    }

    public fireBall(target: Point, game: Game) {
        const fireBall = new FireBall(this.follower.from, target, 4);
        game.fireBalls.push(fireBall);
    }
}
