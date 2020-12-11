export const sendError = (res, err) => {
    res.writeHead(500, {
        "Content-Type": "text/plain; charset=utf-8",
    });
    res.end(JSON.stringify(err));
};
//# sourceMappingURL=send-error.js.map