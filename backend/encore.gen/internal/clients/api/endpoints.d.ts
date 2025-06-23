import { CallOpts } from "encore.dev/api";

type Parameters<T> = T extends (...args: infer P) => unknown ? P : never;
type WithCallOpts<T extends (...args: any) => any> = (
  ...args: [...Parameters<T>, opts?: CallOpts]
) => ReturnType<T>;

import { getAllClients as getAllClients_handler } from "../../../../api\\api-demo.js";
declare const getAllClients: WithCallOpts<typeof getAllClients_handler>;
export { getAllClients };

import { getBootstrapClients as getBootstrapClients_handler } from "../../../../api\\api-demo.js";
declare const getBootstrapClients: WithCallOpts<typeof getBootstrapClients_handler>;
export { getBootstrapClients };

import { getObjectSpec as getObjectSpec_handler } from "../../../../api\\api-demo.js";
declare const getObjectSpec: WithCallOpts<typeof getObjectSpec_handler>;
export { getObjectSpec };

import { getClient as getClient_handler } from "../../../../api\\api-demo.js";
declare const getClient: WithCallOpts<typeof getClient_handler>;
export { getClient };

import { getSecurityConf as getSecurityConf_handler } from "../../../../api\\api-demo.js";
declare const getSecurityConf: WithCallOpts<typeof getSecurityConf_handler>;
export { getSecurityConf };

import { postBootstrapConfig as postBootstrapConfig_handler } from "../../../../api\\api-demo.js";
declare const postBootstrapConfig: WithCallOpts<typeof postBootstrapConfig_handler>;
export { postBootstrapConfig };

import { postClientSecurityConf as postClientSecurityConf_handler } from "../../../../api\\api-demo.js";
declare const postClientSecurityConf: WithCallOpts<typeof postClientSecurityConf_handler>;
export { postClientSecurityConf };

import { deleteBsConf as deleteBsConf_handler } from "../../../../api\\api-demo.js";
declare const deleteBsConf: WithCallOpts<typeof deleteBsConf_handler>;
export { deleteBsConf };

import { deleteClientSecurityConf as deleteClientSecurityConf_handler } from "../../../../api\\api-demo.js";
declare const deleteClientSecurityConf: WithCallOpts<typeof deleteClientSecurityConf_handler>;
export { deleteClientSecurityConf };


