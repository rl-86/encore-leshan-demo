import { registerGateways, registerHandlers, run, type Handler } from "encore.dev/internal/codegen/appinit";

import { myGateway as api_gatewayGW } from "../../../../auth\\auth";
import { getAllClients as api_getAllClientsImpl0 } from "../../../../api\\api-demo";
import { getBootstrapClients as api_getBootstrapClientsImpl1 } from "../../../../api\\api-demo";
import { getObjectSpec as api_getObjectSpecImpl2 } from "../../../../api\\api-demo";
import { getClient as api_getClientImpl3 } from "../../../../api\\api-demo";
import { getSecurityConf as api_getSecurityConfImpl4 } from "../../../../api\\api-demo";
import { postBootstrapConfig as api_postBootstrapConfigImpl5 } from "../../../../api\\api-demo";
import { postClientSecurityConf as api_postClientSecurityConfImpl6 } from "../../../../api\\api-demo";
import { deleteBsConf as api_deleteBsConfImpl7 } from "../../../../api\\api-demo";
import { deleteClientSecurityConf as api_deleteClientSecurityConfImpl8 } from "../../../../api\\api-demo";
import * as api_service from "../../../../api\\encore.service";
import * as auth_service from "../../../../auth\\encore.service";

const gateways: any[] = [
    api_gatewayGW,
];

const handlers: Handler[] = [
    {
        apiRoute: {
            service:           "api",
            name:              "getAllClients",
            handler:           api_getAllClientsImpl0,
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
            handler:           api_getBootstrapClientsImpl1,
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
            handler:           api_getObjectSpecImpl2,
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
            handler:           api_getClientImpl3,
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
            handler:           api_getSecurityConfImpl4,
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
            handler:           api_postBootstrapConfigImpl5,
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
            handler:           api_postClientSecurityConfImpl6,
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
            handler:           api_deleteBsConfImpl7,
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
            handler:           api_deleteClientSecurityConfImpl8,
            raw:               false,
            streamingRequest:  false,
            streamingResponse: false,
        },
        endpointOptions: {"expose":true,"auth":true,"isRaw":false,"isStream":false,"tags":[]},
        middlewares: api_service.default.cfg.middlewares || [],
    },
];

registerGateways(gateways);
registerHandlers(handlers);

await run(import.meta.url);
