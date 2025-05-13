export interface BSConfigInterface {
  endpoint?: string;
  servers: {
    [key: string]: {
      binding: string;
      defaultMinPeriod: number;
      lifetime: number;
      notifIfDisabled: boolean;
      shortId: number;
    };
  };
  security: {
    [key: string]: {
      bootstrapServer: boolean;
      clientOldOffTime: number;
      publicKeyOrId: number[];
      secretKey: number[];
      securityMode: string;
      serverId?: number;
      serverPublicKey: number[];
      serverSmsNumber: string;
      smsBindingKeyParam: number[];
      smsBindingKeySecret: number[];
      smsSecurityMode: string;
      uri: string;
      oscoreSecurityMode: number;
    };
  };
  oscore?: {
    [key: string]: {
      oscoreMasterSecret: string;
      oscoreSenderId: string;
      oscoreRecipientId: string;
      oscoreAeadAlgorithm: number;
      oscoreHmacAlgorithm: number;
      oscoreMasterSalt: string;
    };
  };
  edhoc?: {
    [key: string]: {
      initiator: string;
      authenticationMethod: string;
      ciphersuite: string;
      credentialIdentifier: number[];
      publicCredential: number[];
      privateKey: number[];
      serverCredentialIdentifier: number[];
      serverPublicKey: number[];
      oscoreMasterSecretLength: string;
      oscoreMasterSaltLength: string;
      edhocOscoreCombined: string;
    };
  };
  toDelete?: string[];
}
