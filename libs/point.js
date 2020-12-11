export class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    clone() {
        return new Point(this.x, this.y);
    }
    distance({ x, y }) {
        return Math.sqrt(Math.pow(Math.abs(x - this.x), 2) + Math.pow(Math.abs(y - this.y), 2));
    }
}
Point.fromMouse = ({ clientX, clientY }, { left, top }) => {
    return new Point(clientX - left, clientY - top);
};
Point.fromObj = ({ x, y }) => {
    return new Point(x, y);
};
//# sourceMappingURL=point.js.map