import { Point } from "./point.js";

export class Bomb {

    public from: Point;
    public radius: number;
    public count: number;
    public readonly dr: number;
    public damage: number;
    public fillStyle: string;

    public constructor(from: Point) {
        this.from = from;
        this.radius = 5;
        this.count = 5;
        this.dr = 10;
        this.damage = 10;
        this.fillStyle = "red";
    }

    public step() {
        if (this.count <= 0) {
            return;
        }
        this.count--;
        this.radius += this.dr;
    }
}
