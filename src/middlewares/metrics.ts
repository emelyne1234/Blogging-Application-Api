// metrics.ts

import { Request, Response, NextFunction } from "express";
import client from "prom-client";

// Create a Registry which registers the metrics
const register = new client.Registry();

// Add a default metrics exporter to the registry
client.collectDefaultMetrics({ register });

// Create a histogram to measure response times
const httpRequestDurationMicroseconds = new client.Histogram({
  name: "http_request_duration_seconds",
  help: "Duration of HTTP requests in seconds",
  labelNames: ["method", "route", "status_code"],
  buckets: [0.1, 0.2, 0.5, 1, 2, 5], // buckets for response time from 0.1s to 5s
});

// Register the histogram
register.registerMetric(httpRequestDurationMicroseconds);

// Middleware to measure response time
export const metricsMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const end = httpRequestDurationMicroseconds.startTimer();
  res.on("finish", () => {
    end({
      method: req.method,
      route: req.route ? req.route.path : "",
      status_code: res.statusCode,
    });
  });
  next();
};

// Endpoint to expose metrics
export const metricsEndpoint = async (
  req: Request,
  res: Response
): Promise<void> => {
  res.setHeader("Content-Type", register.contentType);
  res.end(await register.metrics());
};
