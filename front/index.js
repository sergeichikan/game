import { botFillStyle, endAngle, enemyFillStyle, playerFillStyle, startAngle } from "../configs/wizard.js";
import * as fireBallConfig from "../configs/fire-ball.js";
import { Point } from "../libs/point.js";
import { fillStyle as fireBallFillStyle } from "../configs/fire-ball.js";
import { initCanvas } from "./init-canvas.js";
const idInput = document.querySelector('input[id="idInput"]');
const joinButton = document.querySelector('button[id="joinButton"]');
const closeButton = document.querySelector('button[id="closeButton"]');
const addBotButton = document.querySelector('button[id="addBotButton"]');
const hpSpan = document.querySelector('span[id="hpSpan"]');
if (!idInput || !joinButton || !closeButton || !hpSpan || !addBotButton) {
    throw new Error("invalid elements");
}
const { canvas, ctx } = initCanvas();
let game = {
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
let isPreCast = "";
const eventSource = new EventSource("/sse");
eventSource.addEventListener("message", ({ data }) => {
    game = JSON.parse(data);
    const [{ hp = 0 } = {}] = game.wizards.filter(({ id }) => id === idInput.value);
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
document.addEventListener("keydown", (event) => {
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
addBotButton.addEventListener("click", async () => {
    await fetch("/bot", {
        method: "POST",
    });
});
const drawWizard = (wizard, fillStyle) => {
    ctx.beginPath();
    ctx.arc(wizard.follower.from.x, wizard.follower.from.y, wizard.radius, startAngle, endAngle);
    ctx.fillStyle = fillStyle;
    ctx.fill();
    ctx.closePath();
};
const wizardDrawTarget = (wizard) => {
    ctx.beginPath();
    ctx.arc(wizard.follower.to.x, wizard.follower.to.y, 4, 0, Math.PI * 2);
    ctx.fillStyle = "black";
    ctx.fill();
    ctx.closePath();
};
const wizardDrawPath = (wizard) => {
    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.moveTo(wizard.follower.from.x, wizard.follower.from.y);
    ctx.lineTo(wizard.follower.to.x, wizard.follower.to.y);
    ctx.strokeStyle = "black";
    ctx.stroke();
    ctx.closePath();
};
const fireBallDraw = (fireBall) => {
    ctx.beginPath();
    ctx.arc(fireBall.follower.from.x, fireBall.follower.from.y, fireBall.radius, fireBallConfig.startAngle, fireBallConfig.endAngle);
    ctx.fillStyle = fireBallFillStyle;
    ctx.fill();
    ctx.closePath();
};
const bombDraw = (bomb) => {
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
        }
        else {
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
//# sourceMappingURL=index.js.map