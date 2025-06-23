export interface DMConfigInterface {
  endpoint: string;
  edhoc: {
    initiator: string; // "True" eller "False" som sträng
    authenticationMethod: string; // t.ex. "0"
    ciphersuite: string; // t.ex. "2"
    credentialIdentifier: string; // ex: "07"
    publicCredential: string; // HEX-sträng
    serverCredentialIdentifier: string; // ex: "24"
    serverPublicKey: string; // HEX-sträng
    oscoreMasterSecretLength: string; // t.ex. "16"
    oscoreMasterSaltLength: string; // t.ex. "8"
    edhocOscoreCombined: string; // "True" eller "False"
  };
}
