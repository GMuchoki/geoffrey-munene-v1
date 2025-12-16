// Import Sentry SDK
import * as Sentry from "@sentry/node";

Sentry.init({
  dsn: "https://7b07c22e60ba9e4ac1d6a4741c2f6e52@o4510535994572800.ingest.de.sentry.io/4510535996735568",
  // Setting this option to true will send default PII data to Sentry.
  // For example, automatic IP address collection on events
  sendDefaultPii: true,
});





