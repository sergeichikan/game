import { createServer, IncomingMessage, ServerResponse } from "http";

const host = "localhost";
const port = 3000;

const server = createServer();

const getRawBody = (req: IncomingMessage): Promise<string> => {
    return new Promise((resolve) => {
        const chunks: Buffer[] = [];
        req.on("data", (chunk: Buffer) => {
            chunks.push(chunk);
        });
        req.on("end", () => {
            const allChunks: Buffer = Buffer.concat(chunks);
            const body: string = allChunks.toString("utf-8");
            resolve(body);
        });
    });
};

server.on("request", (req: IncomingMessage, res: ServerResponse) => {
    console.log(req.method, req.url);
});

server.listen(port, () => console.log(`http://${host}:${port}/`));
