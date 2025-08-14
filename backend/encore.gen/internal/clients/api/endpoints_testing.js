import { apiCall, streamIn, streamOut, streamInOut } from "encore.dev/internal/codegen/api";
import { registerTestHandler } from "encore.dev/internal/codegen/appinit";

import * as api_service from "../../../../api\\encore.service";

export async function getAllClients(params, opts) {
    const handler = (await import("../../../../api\\api-demo")).getAllClients;
    registerTestHandler({
        apiRoute: { service: "api", name: "getAllClients", raw: false, handler, streamingRequest: false, streamingResponse: false },
        middlewares: api_service.default.cfg.middlewares || [],
        endpointOptions: {"expose":true,"auth":true,"isRaw":false,"isStream":false,"tags":[]},
    });

    return apiCall("api", "getAllClients", params, opts);
}

export async function getBootstrapClients(params, opts) {
    const handler = (await import("../../../../api\\api-demo")).getBootstrapClients;
    registerTestHandler({
        apiRoute: { service: "api", name: "getBootstrapClients", raw: false, handler, streamingRequest: false, streamingResponse: false },
        middlewares: api_service.default.cfg.middlewares || [],
        endpointOptions: {"expose":true,"auth":true,"isRaw":false,"isStream":false,"tags":[]},
    });

    return apiCall("api", "getBootstrapClients", params, opts);
}

export async function getObjectSpec(params, opts) {
    const handler = (await import("../../../../api\\api-demo")).getObjectSpec;
    registerTestHandler({
        apiRoute: { service: "api", name: "getObjectSpec", raw: false, handler, streamingRequest: false, streamingResponse: false },
        middlewares: api_service.default.cfg.middlewares || [],
        endpointOptions: {"expose":true,"auth":true,"isRaw":false,"isStream":false,"tags":[]},
    });

    return apiCall("api", "getObjectSpec", params, opts);
}

export async function getClient(params, opts) {
    const handler = (await import("../../../../api\\api-demo")).getClient;
    registerTestHandler({
        apiRoute: { service: "api", name: "getClient", raw: false, handler, streamingRequest: false, streamingResponse: false },
        middlewares: api_service.default.cfg.middlewares || [],
        endpointOptions: {"expose":true,"auth":true,"isRaw":false,"isStream":false,"tags":[]},
    });

    return apiCall("api", "getClient", params, opts);
}

export async function getSecurityConf(params, opts) {
    const handler = (await import("../../../../api\\api-demo")).getSecurityConf;
    registerTestHandler({
        apiRoute: { service: "api", name: "getSecurityConf", raw: false, handler, streamingRequest: false, streamingResponse: false },
        middlewares: api_service.default.cfg.middlewares || [],
        endpointOptions: {"expose":true,"auth":true,"isRaw":false,"isStream":false,"tags":[]},
    });

    return apiCall("api", "getSecurityConf", params, opts);
}

export async function postBootstrapConfig(params, opts) {
    const handler = (await import("../../../../api\\api-demo")).postBootstrapConfig;
    registerTestHandler({
        apiRoute: { service: "api", name: "postBootstrapConfig", raw: false, handler, streamingRequest: false, streamingResponse: false },
        middlewares: api_service.default.cfg.middlewares || [],
        endpointOptions: {"expose":true,"auth":true,"isRaw":false,"isStream":false,"tags":[]},
    });

    return apiCall("api", "postBootstrapConfig", params, opts);
}

export async function postClientSecurityConf(params, opts) {
    const handler = (await import("../../../../api\\api-demo")).postClientSecurityConf;
    registerTestHandler({
        apiRoute: { service: "api", name: "postClientSecurityConf", raw: false, handler, streamingRequest: false, streamingResponse: false },
        middlewares: api_service.default.cfg.middlewares || [],
        endpointOptions: {"expose":true,"auth":true,"isRaw":false,"isStream":false,"tags":[]},
    });

    return apiCall("api", "postClientSecurityConf", params, opts);
}

export async function deleteBsConf(params, opts) {
    const handler = (await import("../../../../api\\api-demo")).deleteBsConf;
    registerTestHandler({
        apiRoute: { service: "api", name: "deleteBsConf", raw: false, handler, streamingRequest: false, streamingResponse: false },
        middlewares: api_service.default.cfg.middlewares || [],
        endpointOptions: {"expose":true,"auth":true,"isRaw":false,"isStream":false,"tags":[]},
    });

    return apiCall("api", "deleteBsConf", params, opts);
}

export async function deleteClientSecurityConf(params, opts) {
    const handler = (await import("../../../../api\\api-demo")).deleteClientSecurityConf;
    registerTestHandler({
        apiRoute: { service: "api", name: "deleteClientSecurityConf", raw: false, handler, streamingRequest: false, streamingResponse: false },
        middlewares: api_service.default.cfg.middlewares || [],
        endpointOptions: {"expose":true,"auth":true,"isRaw":false,"isStream":false,"tags":[]},
    });

    return apiCall("api", "deleteClientSecurityConf", params, opts);
}

export async function postGenerateConfigs(params, opts) {
    const handler = (await import("../../../../api\\api-demo")).postGenerateConfigs;
    registerTestHandler({
        apiRoute: { service: "api", name: "postGenerateConfigs", raw: false, handler, streamingRequest: false, streamingResponse: false },
        middlewares: api_service.default.cfg.middlewares || [],
        endpointOptions: {"expose":true,"auth":true,"isRaw":false,"isStream":false,"tags":[]},
    });

    return apiCall("api", "postGenerateConfigs", params, opts);
}

