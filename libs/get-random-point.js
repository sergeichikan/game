import { width, height } from "../configs/canvas.js";
import { Point } from "./point.js";
import { random } from "./random.js";
export const getRandomPoint = () => {
    return new Point(random(0, width), random(0, height));
};
//# sourceMappingURL=get-random-point.js.map