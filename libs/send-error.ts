import { ServerResponse } from "http";

export const sendError = (res: ServerResponse, err?: unknown) => {
    res.writeHead(500, {
        "Content-Type": "text/plain; charset=utf-8",
    });
    res.end(JSON.stringify(err));
};
