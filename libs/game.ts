import { ServerResponse } from "http";

import { interval, botInterval } from "../configs/game.js";
import { radius } from "../configs/wizard.js";
import { damage } from "../configs/fire-ball.js";
import { Wizard } from "./wizard.js";
import { getRandomPoint } from "./get-random-point.js";
import { FireBall } from "./fire-ball.js";

export class Game {

    public wizards: Wizard[];
    public bots: Wizard[];
    public readonly responses: ServerResponse[];
    public fireBalls: FireBall[];

    public constructor() {
        this.wizards = [];
        this.bots = [];
        this.responses = [];
        this.fireBalls = [];
    }

    public getWizard(id: string): Wizard | undefined {
        return this.wizards.filter(({ id: wizardId }) => wizardId === id)[0];
    }

    private wizardsStep() {
        this.wizards.forEach(({ follower }) => follower.distance && follower.step());
    }

    private fireBallsStep() {
        this.fireBalls = this.fireBalls.filter(({ follower: { distance } }) => distance);
        this.fireBalls.forEach((fireBall) => {
            fireBall.follower.step();
        });
    }

    private fireBallsDamage() {
        this.fireBalls.forEach((fireBall) => {
            this.wizards
                .filter(({ follower: { from } }) => fireBall.follower.from.distance(from) < radius)
                .forEach((wizard) => wizard.hp -= damage);
        });
    }

    private deaths() {
        this.wizards = this.wizards.filter(({ hp }) => hp > 0);
        this.bots = this.bots.filter(({ hp }) => hp > 0);
    }

    private tick() {
        this.wizardsStep();
        this.fireBallsStep();
        this.fireBallsDamage();
        this.deaths();
    }

    private send() {
        const json = JSON.stringify({
            wizards: this.wizards,
            bots: this.bots,
            fireBalls: this.fireBalls,
        });
        const data = `data: ${json}`;
        const id = `id: ${Date.now()}`;
        const msg = `${data}\n${id}\n\n`;
        this.responses.forEach((res) => res.write(msg));
    }

    public run() {
        setInterval(() => {
            this.tick();
            this.send();
        }, interval);
    }

    public runBots() {
        setInterval(() => {
            this.bots.forEach((wizard) => {
                wizard.follower.setTarget(getRandomPoint());
            });
        }, botInterval);
    }
}
