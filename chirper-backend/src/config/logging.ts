import pino from "pino";
import { Logger } from "pino";

const isLambda = !!process.env.AWS_LAMBDA_FUNCTION_NAME;

let logger: Logger;

if (isLambda) {
    logger = pino({
        level: "info",
        formatters: {
            level: (label) => {
                return { level: label };
            },
        },
    });
    logger.info("Logger initialized in Lambda environment");
} else if (process.env.NODE_ENV === "production") {
    const fileTransport = pino.transport({
        targets: [
            {
                level: "trace",
                target: "pino/file",
            },
        ],
    });
    logger = pino(fileTransport);
    logger.info("Logger running in production mode");
} else {
    logger = pino({
        level: "info",
        transport: {
            target: "pino-pretty",
        },
    });
    logger.info("Logger running in development mode");
}

export default logger;
