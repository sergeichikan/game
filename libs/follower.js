import { Point } from "./point.js";
export class Follower {
    constructor(from, stepLength) {
        this.stepLength = stepLength;
        this.from = this.to = from;
        this.distance = 0;
        this.cos = 0;
        this.sin = 0;
    }
    rebuild() {
        this.distance = this.from.distance(this.to);
        const angle = Math.atan2(this.to.y - this.from.y, this.to.x - this.from.x);
        this.cos = Math.cos(angle);
        this.sin = Math.sin(angle);
    }
    setTarget(target) {
        this.to = target;
        this.rebuild();
    }
    getPointOnLine(stepLength) {
        const dx = this.cos * stepLength;
        const dy = this.sin * stepLength;
        return new Point(this.from.x + dx, this.from.y + dy);
    }
    step() {
        const isLastStep = this.distance < this.stepLength;
        const localStepLength = isLastStep ? this.distance : this.stepLength;
        this.from = this.getPointOnLine(localStepLength);
        this.distance = isLastStep ? 0 : this.from.distance(this.to);
    }
    stop() {
        this.to = this.from;
        this.distance = 0;
    }
}
//# sourceMappingURL=follower.js.map