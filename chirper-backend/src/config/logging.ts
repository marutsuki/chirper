import pino from "pino";

const outputFile = "chirper.log";

const fileTransport = pino.transport({
    targets: [
        ...((process.env.NODE_ENV === "production" && [
            {
                level: "trace",
                target: "pino/file",
                options: {
                    destination: outputFile,
                },
            },
        ]) ||
            []),
        {
            level: "info",
            target: "pino-pretty",
            options: {},
        },
    ],
});

const logger = pino(fileTransport);

logger.info("Logger initialized.");
if (process.env.NODE_ENV === "production") {
    logger.info({ outputFile }, "Logger running in production mode");
}
export default logger;
