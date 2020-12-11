import { createReadStream } from "fs";
import { extname, join } from "path";
const extContentType = new Map([
    [".html", "text/html; charset=utf-8"],
    [".css", "text/css; charset=utf-8"],
    [".js", "text/javascript; charset=utf-8"],
    [".png", "image/png; charset=utf-8"],
]);
const streamFile = async (res, path) => {
    return new Promise((resolve, reject) => {
        const stream = createReadStream(path);
        stream.on("end", resolve);
        stream.on("error", reject);
        stream.pipe(res);
    });
};
export const sendStatic = async (url = "/", res) => {
    const splittedUrl = url.split("/");
    const name = splittedUrl[splittedUrl.length - 1] || "";
    const ext = extname(name);
    const contentType = extContentType.get(ext) || "";
    res.setHeader("Content-Type", contentType);
    const path = join(...splittedUrl);
    return streamFile(res, path);
};
//# sourceMappingURL=send-static.js.map