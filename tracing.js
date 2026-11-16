
const { resourceFromAttributes } = require('@opentelemetry/resources');
const { ATTR_SERVICE_NAME } = require('@opentelemetry/semantic-conventions');

const opentelemetry = require('@opentelemetry/sdk-node');

const {
  getNodeAutoInstrumentations,
} = require('@opentelemetry/auto-instrumentations-node');
const {
  OTLPTraceExporter,
} = require('@opentelemetry/exporter-trace-otlp-proto');

// The OTLPMetricExporter can be used if we want to export otel metrics,
// but Jaeger doesn't seem to have a metrics UI for this. So for now I'll
// keep the console metrics exporter. In the real world we'd probably set up
// a Prometheus instance or something else to ingest the metrics.
// const {
//   OTLPMetricExporter,
// } = require('@opentelemetry/exporter-metrics-otlp-proto');
// const { PeriodicExportingMetricReader } = require('@opentelemetry/sdk-metrics');

const {
   ConsoleMetricExporter,
   PeriodicExportingMetricReader,
} = require('@opentelemetry/sdk-metrics');

//Instrumentations
const { ExpressInstrumentation } = require("opentelemetry-instrumentation-express");
const { MongoDBInstrumentation } = require("@opentelemetry/instrumentation-mongodb");
const { HttpInstrumentation } = require("@opentelemetry/instrumentation-http");

const sdk = new opentelemetry.NodeSDK({
    resource: resourceFromAttributes({
        [ATTR_SERVICE_NAME]: "todo-service"
    }),
    traceExporter: new OTLPTraceExporter(),
    metricReader: new PeriodicExportingMetricReader({
        exporter: new ConsoleMetricExporter(),
    }),
    instrumentations: [
        getNodeAutoInstrumentations(),
        new ExpressInstrumentation(),
        new MongoDBInstrumentation(),
        new HttpInstrumentation()
    ],
});

sdk.start();