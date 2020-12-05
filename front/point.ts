export class Point {

    public readonly x: number;
    public readonly y: number;

    public constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    public clone(): Point {
        return new Point(this.x, this.y);
    }

    public distance({ x, y }: Point) {
        return Math.sqrt(Math.pow(Math.abs(x - this.x), 2) + Math.pow(Math.abs(y - this.y), 2));
    }

    static fromMouse = ({ clientX, clientY }: MouseEvent, { left, top }: DOMRect): Point => {
        return new Point(clientX - left, clientY - top);
    };
}
