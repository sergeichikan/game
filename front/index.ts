import { Point } from "./point.js";
import { Circle } from "./circle.js";
import { Follower } from "./follower.js";

const getCanvas = (): [HTMLCanvasElement, CanvasRenderingContext2D] => {
    const canvas = document.querySelector<HTMLCanvasElement>('canvas[id="myCanvas"]');
    if (!canvas) {
        throw new Error("canvas not found");
    }
    const ctx = canvas.getContext("2d");
    if (!ctx) {
        throw new Error("ctx is null");
    }
    return [
        canvas,
        ctx,
    ];
};

const [ canvas, ctx ] = getCanvas();

const canvasDiagonal = Math.sqrt(Math.pow(canvas.width, 2) + Math.pow(canvas.height, 2));
const random = (min: number, max: number): number => min + Math.random() * (max - min);
const randomPoint = () => new Point(random(0, canvas.width), random(0, canvas.height));

class FireBallFollower extends Follower {
    public constructor(from: Point) {
        super(from, 4);
    }

    public setTarget(target: Point) {
        super.setTarget(target);
        super.setTarget(this.getPointOnLine(canvasDiagonal));
    }
}

class FireBall {

    public shape: Circle;
    public follower: FireBallFollower;

    public constructor(from: Point, shape: Circle) {
        this.shape = shape;
        this.follower = new FireBallFollower(from);
    }
}

class Wizard {

    public readonly shape: Circle;
    public readonly follower: Follower;
    public isPreCast: string;

    public constructor(location: Point, shape: Circle) {
        this.shape = shape;
        this.follower = new Follower(location);
        this.isPreCast = "";
    }

    public mousedown(event: MouseEvent) {
        const point = Point.fromMouse(event, canvas.getBoundingClientRect());
        switch (this.isPreCast) {
            case "KeyW":
                return this.blink(point);
            case "KeyR":
                return this.fireBall(point);
        }
        return this.follower.setTarget(point);
    }

    public keydown(event: KeyboardEvent) {
        this.isPreCast = event.code;
    }

    public blink(target: Point) {
        this.follower.from = target;
        this.follower.stop();
        this.isPreCast = "";
    }

    public fireBall(target: Point) {
        const shape = new Circle(4, "red");
        const fireBall = new FireBall(this.follower.from, shape);
        fireBall.follower.setTarget(target);
        game.fireBalls.push(fireBall);
        this.isPreCast = "";
    }
}

class WizardBot extends Wizard {
    public constructor(location: Point, shape: Circle) {
        super(location, shape);
        setInterval(() => {
            this.follower.setTarget(randomPoint());
        }, 1000);
        setInterval(() => {
            this.fireBall(randomPoint());
        }, 500);
    }
}

class Game {

    public readonly wizards: Wizard[];
    public fireBalls: FireBall[];

    public constructor() {
        this.wizards = [];
        this.fireBalls = [];
    }

    public drawAll() {
        this.wizards.forEach((wizard) => {
            wizard.shape.draw(ctx, wizard.follower.from);
            wizard.follower.drawTarget(ctx);
            wizard.follower.drawPath(ctx);
        });
        this.fireBalls.forEach((fireBall) => {
            fireBall.shape.draw(ctx, fireBall.follower.from);
            fireBall.follower.drawPath(ctx);
            fireBall.follower.drawTarget(ctx);
        });
    }

    public stepAll() {
        this.wizards.forEach((wizard) => {
            wizard.follower.distance && wizard.follower.step();
        });
        this.fireBalls = this.fireBalls.filter((fireBall) => fireBall.follower.distance);
        this.fireBalls.forEach((fireBall) => {
            fireBall.follower.step();
        });
    }
}

canvas.addEventListener("contextmenu", (e) => e.button === 2 && e.preventDefault());

const wizard = new Wizard(new Point(canvas.width / 2, canvas.height / 2), new Circle(10, "#0095DD"));
const bot = new WizardBot(new Point(20, 20), new Circle(10, "blue"));

const game = new Game();
game.wizards.push(wizard);
game.wizards.push(bot);

canvas.addEventListener("mousedown", (event: MouseEvent) => {
    wizard.mousedown(event);
});

// let mousemoveX: number = 0;
// let mousemoveY: number = 0;
// canvas.addEventListener("mousemove", ({ clientX, clientY }: MouseEvent) => {
//     mousemoveX = clientX;
//     mousemoveY = clientY;
// });

document.addEventListener("keydown", (event: KeyboardEvent) => {
    wizard.keydown(event);
});

const draw = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    game.stepAll();
    game.drawAll();

    requestAnimationFrame(draw);
};

draw();
