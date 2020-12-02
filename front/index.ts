const canvas = document.querySelector<HTMLCanvasElement>('canvas[id="myCanvas"]');

if (!canvas) {
    throw new Error("canvas not found");
}

const ctx = canvas.getContext("2d");

if (!ctx) {
    throw new Error("ctx is null");
}

class Point {

    public x: number;
    public y: number;

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

    static readonly fromMouse = ({ clientX, clientY }: MouseEvent, canvas: HTMLCanvasElement) => {
        const { left, top } = canvas.getBoundingClientRect();
        return new Point(clientX - left, clientY - top);
    };
}

class Wizard {

    public location: Point;
    public radius: number;
    public stepLength: number;
    public target: Point;
    public distance: number;
    private cos: number;
    private sin: number;

    public constructor(location: Point) {
        this.target = this.location = location;
        this.radius = 10;
        this.stepLength = 2;
        this.distance = 0;
        this.cos = 0;
        this.sin = 0;
    }

    public draw(ctx: CanvasRenderingContext2D) {
        ctx.beginPath();
        ctx.arc(this.location.x, this.location.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = "#0095DD";
        ctx.fill();
        ctx.closePath();
    }

    public drawTarget(ctx: CanvasRenderingContext2D) {
        ctx.beginPath();
        ctx.arc(this.target.x, this.target.y, 4, 0, Math.PI * 2);
        ctx.fillStyle = "#000000";
        ctx.fill();
        ctx.closePath();
    }

    public drawPath(ctx: CanvasRenderingContext2D) {
        ctx.beginPath();
        ctx.lineWidth = 1;
        ctx.moveTo(this.location.x, this.location.y);
        ctx.lineTo(this.target.x, this.target.y);
        ctx.strokeStyle = "black";
        ctx.stroke();
        ctx.closePath();
    }

    public setTarget(target: Point) {
        this.target = target;
        this.distance = this.location.distance(target);
        const angle: number = Math.atan2(target.y - this.location.y, target.x - this.location.x);
        this.cos = Math.cos(angle);
        this.sin = Math.sin(angle);
    }

    public step() {
        const isLastStep: boolean = this.distance < this.stepLength;
        const stepLength = isLastStep ? this.distance : this.stepLength;
        const dx = this.cos * stepLength;
        const dy = this.sin * stepLength;
        this.location.x += dx;
        this.location.y += dy;
        this.distance = isLastStep ? 0 : this.location.distance(this.target);
    }
}

// canvas.addEventListener("contextmenu", (e) => e.button === 2 && e.preventDefault());

const wizard = new Wizard(new Point(canvas.width / 2, canvas.height / 2));

canvas.addEventListener("mousedown", (event: MouseEvent) => {
    wizard.setTarget(Point.fromMouse(event, canvas));
});

const draw = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    wizard.distance && wizard.step();
    wizard.draw(ctx);
    wizard.drawTarget(ctx);
    wizard.drawPath(ctx);
    requestAnimationFrame(draw);
};

draw();
