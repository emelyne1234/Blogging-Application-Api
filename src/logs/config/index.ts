import { Logger, createLogger, format, transports } from "winston";

interface HttpRequest {
  originalUrl: string;
  url: string;
  method: string;
  query: any;
  headers: any;
}
// Function to format HTTP request information
const formatHttpRequest = ({
  originalUrl,
  url,
  method,
  query,
  headers,
}: HttpRequest) => {
  return `originalUrl: ${originalUrl}, url: ${url}, method: ${method}, query: ${JSON.stringify(
    query
  )}, headers: ${JSON.stringify(headers)}`;
};

// Custom format function to handle HTTP request related information
const httpRequestFormat = format.printf(
  ({ timestamp, level, message, meta }) => {
    if (meta && meta.req) {
      const { originalUrl, url, method, query, headers } = meta.req;
      return `${timestamp} [${level}]: ${message}, ${formatHttpRequest({
        originalUrl,
        url,
        method,
        query,
        headers,
      })}`;
    } else {
      return `${timestamp} [${level}]: ${message}`;
    }
  }
);

// Function to apply custom format function to all transports
const applyCustomFormat = (loggerInstance: Logger) => {
  loggerInstance.transports.forEach((transport) => {
    if (transport.format) {
      transport.format = format.combine(transport.format, httpRequestFormat);
    } else {
      transport.format = httpRequestFormat;
    }
  });
};
// Function to create a transports with a common configuration
const createCommonTransport = (filename: string, level: string) => {
  return new transports.File({
    filename,
    level,
    format: format.combine(
      format.timestamp({ format: "DD/MM/YYYY - HH:mm:ss" }),
      format.json()
    ),
  });
};

// Create a logger instance
export const logger = createLogger({
  transports: [
    new transports.Console({
      level: "info",
      format: format.combine(
        format.colorize(),
        format.timestamp({ format: "DD/MM/YYYY - HH:mm:ss" }),
        format.printf(({ timestamp, level, message, meta }) => {
          const httpRequest = meta?.req;
          if (httpRequest) {
            const { originalUrl, url, method, query, headers } = httpRequest;
            return `${timestamp} [${level}]: ${message}, originalUrl: ${originalUrl}, url: ${url}, method: ${method}, query: ${JSON.stringify(
              query
            )}, headers: ${JSON.stringify(headers)}`;
          }
          return `${timestamp} [${level}]: ${message}`;
        })
      ),
    }),
    createCommonTransport("./src/logs/system.log", "info"),
  ],
});
// Apply custom format function to all transports
applyCustomFormat(logger);

// Create an error logger instance
export const errorLogger = createLogger({
  transports: [
    new transports.Console({
      level: "error",
      format: format.combine(
        format.colorize(),
        format.json(),
        format.timestamp({ format: "DD/MM/YYYY - HH:mm:ss" })
      ),
    }),
    createCommonTransport("./src/logs/error.log", "error"),
  ],
});

// Apply custom format function to all error logger transports
applyCustomFormat(errorLogger);

export default logger;
