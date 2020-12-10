import { createServer, IncomingMessage, ServerResponse } from "http";

import { options } from "../configs/listen-options.js";
import { Point } from "../libs/point.js";
import { Wizard } from "../libs/wizard.js";
import { getBody } from "../libs/get-body.js";
import { notFound } from "../libs/not-found-res.js";
import { getRandomPoint } from "../libs/get-random-point.js";
import { Game } from "../libs/game.js";
import { sendStatic } from "../libs/send-static.js";

const game = new Game();

const bot1 = new Wizard(getRandomPoint(), "bot1");
game.wizards.push(bot1);
game.bots.push(bot1);

const server = createServer();

const runSSE = (req: IncomingMessage, res: ServerResponse) => {
    res.writeHead(200, {
        "Content-Type": "text/event-stream; charset=utf-8",
        "Cache-Control": "no-cache",
    });
    game.responses.push(res);
};

server.on("request", ({ method, url }) => console.log(method, url));

server.on("request", (req: IncomingMessage, res: ServerResponse) => {
    if (req.method !== "GET") {
        return;
    }
    switch (req.url) {
        case "/":
            return sendStatic("/front/index.html", res).catch((err) => {
                console.log(err);
                return notFound(res);
            });
        case "/sse":
            return runSSE(req, res);
        default:
            return sendStatic(req.url, res).catch(() => notFound(res));
    }
});

server.on("request", (req: IncomingMessage, res: ServerResponse) => {
    if (req.method !== "POST") {
        return;
    }
    switch (req.url) {
        case "/join":
            return getBody<any>(req)
                .then(({ id }) => {
                    const wizard = new Wizard(getRandomPoint(), id);
                    game.wizards.push(wizard);
                    res.end();
                });
        case "/target":
            return getBody<any>(req)
                .then(({ id, target }) => {
                    const wizard = game.getWizard(id);
                    wizard && wizard.follower.setTarget(target);
                    res.end();
                });
        case "/blink":
            return getBody<any>(req)
                .then(({ id, target }) => {
                    const wizard = game.getWizard(id);
                    wizard && wizard.blink(Point.fromObj(target));
                    res.end();
                });
        case "/fire":
            return getBody<any>(req)
                .then(({ id, target }) => {
                    const wizard = game.getWizard(id);
                    wizard && wizard.fireBall(Point.fromObj(target), game);
                    res.end();
                });
        default:
            return notFound(res);
    }
});

server.listen(options, () => {
    console.log(`http://${options.host}:${options.port}/`);
    game.runBots();
    game.run();
});
