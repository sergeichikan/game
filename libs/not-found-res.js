export const notFound = (res) => {
    res.writeHead(404, {
        "Content-Type": "text/plain; charset=utf-8",
    });
    return res.end("not found");
};
//# sourceMappingURL=not-found-res.js.map