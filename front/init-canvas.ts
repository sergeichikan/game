import { width, height } from "../configs/canvas.js";

export const initCanvas = () => {
    const canvas = document.querySelector<HTMLCanvasElement>('canvas[id="mainCanvas"]');
    const ctx = canvas && canvas.getContext("2d");

    if (!canvas || !ctx) {
        throw new Error("invalid canvas or ctx");
    }

    canvas.width = width;
    canvas.height = height;

    // отключаем контекстное меню по нажатию на ПКМ
    canvas.addEventListener("contextmenu", (e) => e.button === 2 && e.preventDefault());

    return {
        canvas,
        ctx,
    };
};
