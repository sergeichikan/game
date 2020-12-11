import { createServer } from "http";
import { options } from "../configs/listen-options.js";
import { Point } from "../libs/point.js";
import { Wizard } from "../libs/wizard.js";
import { getBody } from "../libs/get-body.js";
import { notFound } from "../libs/not-found-res.js";
import { getRandomPoint } from "../libs/get-random-point.js";
import { Game } from "../libs/game.js";
import { sendStatic } from "../libs/send-static.js";
import { sendError } from "../libs/send-error.js";
import { FireBall } from "../libs/fire-ball.js";
import { Bomb } from "../libs/bomb.js";
const game = new Game();
const bot0 = new Wizard(getRandomPoint(), "bot0");
game.wizards.push(bot0);
game.bots.push(bot0);
const server = createServer();
server.on("request", ({ method, url }) => console.log(method, url));
server.on("request", (req, res) => {
    if (req.method !== "GET") {
        return;
    }
    switch (req.url) {
        case "/":
            return sendStatic("/front/index.html", res).catch((err) => sendError(res, err));
        case "/sse":
            res.setHeader("Content-Type", "text/event-stream; charset=utf-8");
            res.setHeader("Cache-Control", "no-cache");
            game.responses.push(res);
            return;
        default:
            return sendStatic(req.url, res).catch((err) => sendError(res, err));
    }
});
server.on("request", (req, res) => {
    if (req.method !== "POST") {
        return;
    }
    switch (req.url) {
        case "/join":
            return getBody(req)
                .then(({ id }) => {
                const wizard = new Wizard(getRandomPoint(), id);
                game.wizards.push(wizard);
                res.end();
            });
        case "/target":
            return getBody(req)
                .then(({ id, target }) => {
                const wizard = game.getWizard(id);
                wizard && wizard.follower.setTarget(target);
                res.end();
            });
        case "/blink":
            return getBody(req)
                .then(({ id, target }) => {
                const wizard = game.getWizard(id);
                wizard && wizard.blink(Point.fromObj(target));
                res.end();
            });
        case "/fire":
            return getBody(req)
                .then(({ id, target }) => {
                const wizard = game.getWizard(id);
                if (!wizard) {
                    return sendError(res, new Error("wizard not found"));
                }
                const fireBall = new FireBall(wizard.follower.from, Point.fromObj(target), wizard.radius);
                game.fireBalls.push(fireBall);
                res.end();
            });
        case "/bomb":
            return getBody(req)
                .then(({ id, target }) => {
                const wizard = game.getWizard(id);
                if (!wizard) {
                    return sendError(res, new Error("wizard not found"));
                }
                const bomb = new Bomb(Point.fromObj(target));
                game.bombs.push(bomb);
                res.end();
            });
        default:
            return notFound(res);
    }
});
server.listen(options, () => {
    game.runBots();
    game.run();
    console.log(`http://${options.host}:${options.port}/`);
});
//# sourceMappingURL=index.js.map