import { Point } from "./point.js";

export class Follower {

    public to: Point;
    public from: Point;
    public stepLength: number;
    public distance: number;
    private cos: number;
    private sin: number;

    public constructor(from: Point, stepLength: number) {
        this.stepLength = stepLength;
        this.from = this.to = from;
        this.distance = 0;
        this.cos = 0;
        this.sin = 0;
    }

    protected rebuild() {
        this.distance = this.from.distance(this.to);
        const angle: number = Math.atan2(this.to.y - this.from.y, this.to.x - this.from.x);
        this.cos = Math.cos(angle);
        this.sin = Math.sin(angle);
    }

    public setTarget(target: Point) {
        this.to = target;
        this.rebuild();
    }

    protected getPointOnLine(stepLength: number) {
        const dx = this.cos * stepLength;
        const dy = this.sin * stepLength;
        return new Point(this.from.x + dx, this.from.y + dy);
    }

    public step() {
        const isLastStep: boolean = this.distance < this.stepLength;
        const localStepLength = isLastStep ? this.distance : this.stepLength;
        this.from = this.getPointOnLine(localStepLength);
        this.distance = isLastStep ? 0 : this.from.distance(this.to);
    }

    public stop() {
        this.to = this.from;
        this.distance = 0;
    }
}
