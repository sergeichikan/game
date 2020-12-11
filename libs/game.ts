import { ServerResponse } from "http";

import { interval, botInterval } from "../configs/game.js";
import { Wizard } from "./wizard.js";
import { getRandomPoint } from "./get-random-point.js";
import { FireBall } from "./fire-ball.js";
import { Bomb } from "./bomb";

export class Game {

    public wizards: Wizard[];
    public bots: Wizard[];
    public readonly responses: ServerResponse[];
    public fireBalls: FireBall[];
    public bombs: Bomb[];

    public constructor() {
        this.wizards = [];
        this.bots = [];
        this.responses = [];
        this.fireBalls = [];
        this.bombs = [];
    }

    public getWizard(id: string): Wizard | undefined {
        return this.wizards.filter(({ id: wizardId }) => wizardId === id)[0];
    }

    private wizardsStep() {
        this.wizards.forEach(({ follower }) => follower.distance && follower.step());
    }

    private fireBallsStep() {
        this.fireBalls = this.fireBalls.filter(({ follower: { distance } }) => distance);
        this.fireBalls.forEach((fireBall) => fireBall.follower.step());
    }

    private bombsStep() {
        this.bombs = this.bombs.filter(({ count }) => count > 0);
        this.bombs.forEach((bomb) => bomb.step());
    }

    private bombsDamage() {
        this.bombs.forEach((bomb) => {
            this.wizards
                .filter(({ follower: { from } }, radius) => bomb.from.distance(from) < radius + bomb.radius)
                .forEach((wizard) => wizard.hp -= bomb.damage);
        });
    }

    private fireBallsDamage() {
        this.fireBalls.forEach((fireBall: FireBall) => {
            this.wizards
                .filter(({ follower: { from } }, radius) => fireBall.follower.from.distance(from) < radius + fireBall.radius)
                .forEach((wizard) => wizard.hp -= fireBall.damage);
        });
    }

    private deaths() {
        this.wizards = this.wizards.filter(({ hp }) => hp > 0);
        this.bots = this.bots.filter(({ hp }) => hp > 0);
    }

    private tick() {
        this.wizardsStep();
        this.fireBallsStep();
        this.bombsStep();
        this.fireBallsDamage();
        this.bombsDamage();
        this.deaths();
    }

    private send() {
        const json = JSON.stringify({
            wizards: this.wizards,
            bots: this.bots,
            fireBalls: this.fireBalls,
            bombs: this.bombs,
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
            this.bots.forEach((wizard) => wizard.follower.setTarget(getRandomPoint()));
        }, botInterval);
        setInterval(() => {
            this.bots.forEach((wizard) => {
                const fireBall = new FireBall(wizard.follower.from, getRandomPoint(), wizard.radius);
                this.fireBalls.push(fireBall);
            });
        }, 100);
    }
}
