import { registerHandlers, run, type Handler } from "encore.dev/internal/codegen/appinit";
import { Worker, isMainThread } from "node:worker_threads";
import { fileURLToPath } from "node:url";
import { availableParallelism } from "node:os";

import { getAllClients as getAllClientsImpl0 } from "../../../../../api\\api-demo";
import { getBootstrapClients as getBootstrapClientsImpl1 } from "../../../../../api\\api-demo";
import { getObjectSpec as getObjectSpecImpl2 } from "../../../../../api\\api-demo";
import { getClient as getClientImpl3 } from "../../../../../api\\api-demo";
import { getSecurityConf as getSecurityConfImpl4 } from "../../../../../api\\api-demo";
import { postBootstrapConfig as postBootstrapConfigImpl5 } from "../../../../../api\\api-demo";
import { postClientSecurityConf as postClientSecurityConfImpl6 } from "../../../../../api\\api-demo";
import { deleteBsConf as deleteBsConfImpl7 } from "../../../../../api\\api-demo";
import { deleteClientSecurityConf as deleteClientSecurityConfImpl8 } from "../../../../../api\\api-demo";
import * as api_service from "../../../../../api\\encore.service";

const handlers: Handler[] = [
    {
        apiRoute: {
            service:           "api",
            name:              "getAllClients",
            handler:           getAllClientsImpl0,
            raw:               false,
            streamingRequest:  false,
            streamingResponse: false,
        },
        endpointOptions: {"expose":true,"auth":true,"isRaw":false,"isStream":false,"tags":[]},
        middlewares: api_service.default.cfg.middlewares || [],
    },
    {
        apiRoute: {
            service:           "api",
            name:              "getBootstrapClients",
            handler:           getBootstrapClientsImpl1,
            raw:               false,
            streamingRequest:  false,
            streamingResponse: false,
        },
        endpointOptions: {"expose":true,"auth":true,"isRaw":false,"isStream":false,"tags":[]},
        middlewares: api_service.default.cfg.middlewares || [],
    },
    {
        apiRoute: {
            service:           "api",
            name:              "getObjectSpec",
            handler:           getObjectSpecImpl2,
            raw:               false,
            streamingRequest:  false,
            streamingResponse: false,
        },
        endpointOptions: {"expose":true,"auth":true,"isRaw":false,"isStream":false,"tags":[]},
        middlewares: api_service.default.cfg.middlewares || [],
    },
    {
        apiRoute: {
            service:           "api",
            name:              "getClient",
            handler:           getClientImpl3,
            raw:               false,
            streamingRequest:  false,
            streamingResponse: false,
        },
        endpointOptions: {"expose":true,"auth":true,"isRaw":false,"isStream":false,"tags":[]},
        middlewares: api_service.default.cfg.middlewares || [],
    },
    {
        apiRoute: {
            service:           "api",
            name:              "getSecurityConf",
            handler:           getSecurityConfImpl4,
            raw:               false,
            streamingRequest:  false,
            streamingResponse: false,
        },
        endpointOptions: {"expose":true,"auth":true,"isRaw":false,"isStream":false,"tags":[]},
        middlewares: api_service.default.cfg.middlewares || [],
    },
    {
        apiRoute: {
            service:           "api",
            name:              "postBootstrapConfig",
            handler:           postBootstrapConfigImpl5,
            raw:               false,
            streamingRequest:  false,
            streamingResponse: false,
        },
        endpointOptions: {"expose":true,"auth":true,"isRaw":false,"isStream":false,"tags":[]},
        middlewares: api_service.default.cfg.middlewares || [],
    },
    {
        apiRoute: {
            service:           "api",
            name:              "postClientSecurityConf",
            handler:           postClientSecurityConfImpl6,
            raw:               false,
            streamingRequest:  false,
            streamingResponse: false,
        },
        endpointOptions: {"expose":true,"auth":true,"isRaw":false,"isStream":false,"tags":[]},
        middlewares: api_service.default.cfg.middlewares || [],
    },
    {
        apiRoute: {
            service:           "api",
            name:              "deleteBsConf",
            handler:           deleteBsConfImpl7,
            raw:               false,
            streamingRequest:  false,
            streamingResponse: false,
        },
        endpointOptions: {"expose":true,"auth":true,"isRaw":false,"isStream":false,"tags":[]},
        middlewares: api_service.default.cfg.middlewares || [],
    },
    {
        apiRoute: {
            service:           "api",
            name:              "deleteClientSecurityConf",
            handler:           deleteClientSecurityConfImpl8,
            raw:               false,
            streamingRequest:  false,
            streamingResponse: false,
        },
        endpointOptions: {"expose":true,"auth":true,"isRaw":false,"isStream":false,"tags":[]},
        middlewares: api_service.default.cfg.middlewares || [],
    },
];

registerHandlers(handlers);

await run(import.meta.url);
