import { interval, botInterval } from "../configs/game.js";
import { getRandomPoint } from "./get-random-point.js";
import { FireBall } from "./fire-ball.js";
export class Game {
    constructor() {
        this.wizards = [];
        this.bots = [];
        this.responses = [];
        this.fireBalls = [];
        this.bombs = [];
    }
    getWizard(id) {
        return this.wizards.filter(({ id: wizardId }) => wizardId === id)[0];
    }
    wizardsStep() {
        this.wizards.forEach(({ follower }) => follower.distance && follower.step());
    }
    fireBallsStep() {
        this.fireBalls = this.fireBalls.filter(({ follower: { distance } }) => distance);
        this.fireBalls.forEach((fireBall) => fireBall.follower.step());
    }
    bombsStep() {
        this.bombs = this.bombs.filter(({ count }) => count > 0);
        this.bombs.forEach((bomb) => bomb.step());
    }
    bombsDamage() {
        this.bombs.forEach((bomb) => {
            this.wizards
                .filter(({ follower: { from } }, radius) => bomb.from.distance(from) < radius + bomb.radius)
                .forEach((wizard) => wizard.hp -= bomb.damage);
        });
    }
    fireBallsDamage() {
        this.fireBalls.forEach((fireBall) => {
            this.wizards
                .filter(({ follower: { from } }, radius) => fireBall.follower.from.distance(from) < radius + fireBall.radius)
                .forEach((wizard) => wizard.hp -= fireBall.damage);
        });
    }
    deaths() {
        this.wizards = this.wizards.filter(({ hp }) => hp > 0);
        this.bots = this.bots.filter(({ hp }) => hp > 0);
    }
    tick() {
        this.wizardsStep();
        this.fireBallsStep();
        this.bombsStep();
        this.fireBallsDamage();
        this.bombsDamage();
        this.deaths();
    }
    send() {
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
    run() {
        setInterval(() => {
            this.tick();
            this.send();
        }, interval);
    }
    runBots() {
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
//# sourceMappingURL=game.js.map