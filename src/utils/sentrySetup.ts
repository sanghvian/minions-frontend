// sentrySetup.ts
import * as Sentry from "@sentry/react";
import { useEffect } from "react";
import { createRoutesFromChildren, matchRoutes, useLocation, useNavigationType } from "react-router-dom";

// Sentry initialization and setup

export const setupSentry = () => {
    Sentry.init({
        dsn: process.env.REACT_APP_SENTRY_DSN,
        integrations: [
            new Sentry.BrowserTracing({
                // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
                tracePropagationTargets: [
                    "localhost",
                    "https://api.recontact.world",
                    "https://api.develop.recontact.world"
                ],
                routingInstrumentation: Sentry.reactRouterV6Instrumentation(
                    useEffect,
                    useLocation,
                    useNavigationType,
                    createRoutesFromChildren,
                    matchRoutes
                ),
            }),
            new Sentry.Replay(),
        ],
        environment: process.env.REACT_APP_NODE_ENV,
        // Performance Monitoring
        tracesSampleRate: 1.0, //  Capture 100% of the transactions
        // Session Replay
        replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
        replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
    });
}
