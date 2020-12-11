export const concatBody = (req) => {
    return new Promise((resolve) => {
        const chunks = [];
        req.on("data", (chunk) => chunks.push(chunk));
        req.on("end", () => resolve(Buffer.concat(chunks)));
    });
};
//# sourceMappingURL=concat-body.js.map