import { registerHandlers, run, type Handler } from "encore.dev/internal/codegen/appinit";
import { Worker, isMainThread } from "node:worker_threads";
import { fileURLToPath } from "node:url";
import { availableParallelism } from "node:os";

import * as auth_service from "../../../../../auth\\encore.service";

const handlers: Handler[] = [
];

registerHandlers(handlers);

await run(import.meta.url);
