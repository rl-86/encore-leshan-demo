import { apiCall, streamIn, streamOut, streamInOut } from "encore.dev/internal/codegen/api";

const TEST_ENDPOINTS = typeof ENCORE_DROP_TESTS === "undefined" && process.env.NODE_ENV === "test"
    ? await import("./endpoints_testing.js")
    : null;

export async function getAllClients(opts) {
    const params = undefined;
    if (typeof ENCORE_DROP_TESTS === "undefined" && process.env.NODE_ENV === "test") {
        return TEST_ENDPOINTS.getAllClients(params, opts);
    }

    return apiCall("api", "getAllClients", params, opts);
}
export async function getBootstrapClients(opts) {
    const params = undefined;
    if (typeof ENCORE_DROP_TESTS === "undefined" && process.env.NODE_ENV === "test") {
        return TEST_ENDPOINTS.getBootstrapClients(params, opts);
    }

    return apiCall("api", "getBootstrapClients", params, opts);
}
export async function getObjectSpec(params, opts) {
    if (typeof ENCORE_DROP_TESTS === "undefined" && process.env.NODE_ENV === "test") {
        return TEST_ENDPOINTS.getObjectSpec(params, opts);
    }

    return apiCall("api", "getObjectSpec", params, opts);
}
export async function getClient(params, opts) {
    if (typeof ENCORE_DROP_TESTS === "undefined" && process.env.NODE_ENV === "test") {
        return TEST_ENDPOINTS.getClient(params, opts);
    }

    return apiCall("api", "getClient", params, opts);
}
export async function getSecurityConf(opts) {
    const params = undefined;
    if (typeof ENCORE_DROP_TESTS === "undefined" && process.env.NODE_ENV === "test") {
        return TEST_ENDPOINTS.getSecurityConf(params, opts);
    }

    return apiCall("api", "getSecurityConf", params, opts);
}
export async function postBootstrapConfig(params, opts) {
    if (typeof ENCORE_DROP_TESTS === "undefined" && process.env.NODE_ENV === "test") {
        return TEST_ENDPOINTS.postBootstrapConfig(params, opts);
    }

    return apiCall("api", "postBootstrapConfig", params, opts);
}
export async function postClientSecurityConf(params, opts) {
    if (typeof ENCORE_DROP_TESTS === "undefined" && process.env.NODE_ENV === "test") {
        return TEST_ENDPOINTS.postClientSecurityConf(params, opts);
    }

    return apiCall("api", "postClientSecurityConf", params, opts);
}
export async function deleteBsConf(params, opts) {
    if (typeof ENCORE_DROP_TESTS === "undefined" && process.env.NODE_ENV === "test") {
        return TEST_ENDPOINTS.deleteBsConf(params, opts);
    }

    return apiCall("api", "deleteBsConf", params, opts);
}
export async function deleteClientSecurityConf(params, opts) {
    if (typeof ENCORE_DROP_TESTS === "undefined" && process.env.NODE_ENV === "test") {
        return TEST_ENDPOINTS.deleteClientSecurityConf(params, opts);
    }

    return apiCall("api", "deleteClientSecurityConf", params, opts);
}
export async function postGenerateConfigs(params, opts) {
    if (typeof ENCORE_DROP_TESTS === "undefined" && process.env.NODE_ENV === "test") {
        return TEST_ENDPOINTS.postGenerateConfigs(params, opts);
    }

    return apiCall("api", "postGenerateConfigs", params, opts);
}
