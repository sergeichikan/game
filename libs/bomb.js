export class Bomb {
    constructor(from) {
        this.from = from;
        this.radius = 5;
        this.count = 5;
        this.dr = 10;
        this.damage = 10;
        this.fillStyle = "red";
    }
    step() {
        if (this.count <= 0) {
            return;
        }
        this.count--;
        this.radius += this.dr;
    }
}
//# sourceMappingURL=bomb.js.map