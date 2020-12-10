import { ServerResponse } from "http";

export const notFound = (res: ServerResponse) => {
    res.writeHead(404, {
        "Content-Type": "text/plain; charset=utf-8",
    });
    return res.end("not found");
};
