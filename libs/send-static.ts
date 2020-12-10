import { ServerResponse } from "http";
import { createReadStream } from "fs";
import { extname, join } from "path";

const extContentType = new Map<string, string>([
    [".html", "text/html; charset=utf-8"],
    [".css", "text/css; charset=utf-8"],
    [".js", "text/javascript; charset=utf-8"],
    [".png", "image/png; charset=utf-8"],
]);

const streamFile = async (res: ServerResponse, path: string) => {
    return new Promise((resolve, reject) => {
        const stream = createReadStream(path);
        stream.on("end", resolve);
        stream.on("error", reject);
        stream.pipe(res);
    });
};

export const sendStatic = async (url: string = "/", res: ServerResponse) => {
    const splittedUrl: string[] = url.split("/");
    const name: string = splittedUrl[splittedUrl.length - 1] || "";
    const ext: string = extname(name);
    const contentType: string = extContentType.get(ext) || "";
    res.setHeader("Content-Type", contentType);
    const path: string = join(...splittedUrl);
    return streamFile(res, path);
};
