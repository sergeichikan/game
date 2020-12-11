import { botFillStyle, endAngle, enemyFillStyle, playerFillStyle, startAngle } from "../configs/wizard.js";
import * as fireBallConfig from "../configs/fire-ball.js";
import { Point } from "../libs/point.js";
import { Game } from "../libs/game.js";
import { Wizard } from "../libs/wizard";
import { fillStyle as fireBallFillStyle } from "../configs/fire-ball.js";
import { FireBall } from "../libs/fire-ball.js";
import { initCanvas } from "./init-canvas.js";
import {Bomb} from "../libs/bomb";

const idInput = document.querySelector<HTMLInputElement>('input[id="idInput"]');
const joinButton = document.querySelector<HTMLButtonElement>('button[id="joinButton"]');
const closeButton = document.querySelector<HTMLButtonElement>('button[id="closeButton"]');
const hpSpan = document.querySelector<HTMLSpanElement>('span[id="hpSpan"]');

if (!idInput || !joinButton || !closeButton || !hpSpan) {
    throw new Error("invalid elements");
}

const { canvas, ctx } = initCanvas();

let game: Game = {
    wizards: [],
    bots: [],
    fireBalls: [],
    bombs: [],
};
const keyUrlMap = new Map([
    ["KeyW", "/blink"],
    ["KeyR", "/fire"],
    ["KeyE", "/bomb"],
]);
let isPreCast: string = "";

const eventSource: EventSource = new EventSource("/sse");

eventSource.addEventListener("message", ({ data }: MessageEvent<string>) => {
    game = JSON.parse(data);
    const [ { hp = 0 } = {} ] = game.wizards.filter(({ id }) => id === idInput.value);
    hpSpan.textContent = hp.toString(10);
});

closeButton.addEventListener("click", () => {
    eventSource.close();
});

canvas.addEventListener("mousedown", (e) => {
    const { value: id } = idInput;
    const target = Point.fromMouse(e, canvas.getBoundingClientRect());
    const body = JSON.stringify({
        target,
        id,
    });
    const init = {
        method: "POST",
        body,
    };
    const url = keyUrlMap.get(isPreCast) || "/target";
    isPreCast = "";
    return fetch(url, init);
});

document.addEventListener("keydown", (event: KeyboardEvent) => {
    isPreCast = event.code;
});

joinButton.addEventListener("click", async () => {
    const { value: id } = idInput;
    const body = JSON.stringify({
        id,
    });
    console.log("/join", body);
    await fetch("/join", {
        method: "POST",
        body,
    });
});

const drawWizard = (wizard: Wizard, fillStyle: string) => {
    ctx.beginPath();
    ctx.arc(wizard.follower.from.x, wizard.follower.from.y, wizard.radius, startAngle, endAngle);
    ctx.fillStyle = fillStyle;
    ctx.fill();
    ctx.closePath();
};

const wizardDrawTarget = (wizard: Wizard) => {
    ctx.beginPath();
    ctx.arc(wizard.follower.to.x, wizard.follower.to.y, 4, 0, Math.PI * 2);
    ctx.fillStyle = "black";
    ctx.fill();
    ctx.closePath();
};

const wizardDrawPath = (wizard: Wizard) => {
    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.moveTo(wizard.follower.from.x, wizard.follower.from.y);
    ctx.lineTo(wizard.follower.to.x, wizard.follower.to.y);
    ctx.strokeStyle = "black";
    ctx.stroke();
    ctx.closePath();
};

const fireBallDraw = (fireBall: FireBall) => {
    ctx.beginPath();
    ctx.arc(fireBall.follower.from.x, fireBall.follower.from.y, fireBall.radius, fireBallConfig.startAngle, fireBallConfig.endAngle);
    ctx.fillStyle = fireBallFillStyle;
    ctx.fill();
    ctx.closePath();
};

const bombDraw = (bomb: Bomb) => {
    ctx.beginPath();
    ctx.arc(bomb.from.x, bomb.from.y, bomb.radius, 0, Math.PI * 2);
    ctx.fillStyle = bomb.fillStyle;
    ctx.strokeStyle = "black";
    ctx.lineWidth = 1;
    // ctx.fill();
    ctx.stroke();
    ctx.closePath();
};

const draw = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    game.wizards.forEach((wizard) => {
        if (wizard.id === idInput.value) {
            drawWizard(wizard, playerFillStyle);
        } else {
            drawWizard(wizard, enemyFillStyle);
        }
        wizardDrawTarget(wizard);
        wizardDrawPath(wizard);
    });
    game.bots.forEach((wizard) => {
        drawWizard(wizard, botFillStyle);
        wizardDrawTarget(wizard);
        wizardDrawPath(wizard);
    });
    game.fireBalls.forEach((fireBall) => {
        fireBallDraw(fireBall);
    });
    game.bombs.forEach(bombDraw);
    requestAnimationFrame(draw);
};

draw();
