import { IncomingMessage } from "http";

export const concatBody = (req: IncomingMessage): Promise<Buffer> => {
    return new Promise((resolve) => {
        const chunks: Buffer[] = [];
        req.on("data", (chunk: Buffer) => chunks.push(chunk));
        req.on("end", () => resolve(Buffer.concat(chunks)));
    });
};
