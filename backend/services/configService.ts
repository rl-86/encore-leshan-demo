// configService.ts
import * as fs from 'fs';

export interface GenerateConfigRequest {
  devicePrefix: string;
  startNumber: number;
  count: number;
  paddingLength: number;
}

export interface OSCOREParams {
  master_secret: string;
  sender_id: string;
  recipient_id: string;
}

export interface ConfigResult {
  endpoint: string;
  bootstrap: boolean;
  security: boolean;
  error?: string;
  command?: string;
  oscore?: OSCOREParams;
}

export type ConfigureSummary = {
  successful: number;
  total: number;
  results: ConfigResult[];
};

// Hjälpare för att bygga endpoints utifrån UI-parametrar
export function generateEndpoints(p: GenerateConfigRequest): string[] {
  return Array.from(
    { length: p.count },
    (_, i) =>
      `${p.devicePrefix}${String(p.startNumber + i).padStart(
        p.paddingLength,
        '0'
      )}`
  );
}

// Välj bas-URL: env-override eller default för lokal utveckling+
function resolveBaseUrl(): string {
  return process.env.LESHAN_BASE_URL || 'http://localhost';
}

// Publik funktion som Encore-API:t kan anropa
export async function runBulkGenerate(
  params: GenerateConfigRequest,
  opts: { token: string; baseUrl?: string }
): Promise<ConfigureSummary> {
  const endpoints = generateEndpoints(params);
  // bulkConfigure returnerar redan en sammanfattning
  const base = opts.baseUrl ?? resolveBaseUrl();
  const configurer = new LeshanBulkConfigurer(base, { token: opts.token });
  return await configurer.bulkConfigure(endpoints);
}

export class LeshanBulkConfigurer {
  private baseUrl: string;
  private results: ConfigResult[] = [];
  private token: string;
  private headers: Record<string, string>;

  constructor(
    baseUrl: string = 'http://localhost',
    { token }: { token: string }
  ) {
    this.baseUrl = baseUrl;
    this.token = token;
    this.headers = {
      'X-Auth-Token': this.token,
      'Content-Type': 'application/json',
    };
  }

  private generateOscoreParams(clientNumber: number): OSCOREParams {
    // Använd alltid hex-format för konsistens och för att undvika ogiltiga hex-värden
    const masterSecret = clientNumber
      .toString(16)
      .toUpperCase()
      .padStart(4, '0');

    // Sender/Recipient IDs
    const senderId = (clientNumber * 2)
      .toString(16)
      .toUpperCase()
      .padStart(2, '0');
    const recipientId = (clientNumber * 2 + 1)
      .toString(16)
      .toUpperCase()
      .padStart(2, '0');

    return {
      master_secret: masterSecret, // 0001, 0002, 0003..., 000A, 000B, etc.
      sender_id: senderId,
      recipient_id: recipientId,
    };
  }

  private createBootstrapConfig(endpoint: string, oscoreParams: OSCOREParams) {
    return {
      config: {
        servers: {
          '0': {
            binding: 'U',
            defaultMinPeriod: 1,
            lifetime: 300,
            notifIfDisabled: true,
            shortId: 123,
          },
        },
        security: {
          '0': {
            bootstrapServer: true,
            clientOldOffTime: 1,
            publicKeyOrId: [],
            secretKey: [],
            securityMode: 'NO_SEC',
            serverPublicKey: [],
            serverSmsNumber: '',
            smsBindingKeyParam: [],
            smsBindingKeySecret: [],
            smsSecurityMode: 'NO_SEC',
            uri: 'coap://localhost:5683',
            oscoreSecurityMode: 0,
          },
          '1': {
            bootstrapServer: false,
            clientOldOffTime: 1,
            publicKeyOrId: [],
            secretKey: [],
            securityMode: 'NO_SEC',
            serverId: 123,
            serverPublicKey: [],
            serverSmsNumber: '',
            smsBindingKeyParam: [],
            smsBindingKeySecret: [],
            smsSecurityMode: 'NO_SEC',
            uri: 'coap://localhost:5783',
            oscoreSecurityMode: 1,
          },
        },
        oscore: {
          '0': {
            oscoreMasterSecret: oscoreParams.master_secret,
            oscoreSenderId: oscoreParams.sender_id,
            oscoreRecipientId: oscoreParams.recipient_id,
            oscoreAeadAlgorithm: 10,
            oscoreHmacAlgorithm: -10,
            oscoreMasterSalt: '',
          },
        },
        edhoc: {
          '1': {
            initiator: 'True',
            authenticationMethod: '0',
            ciphersuite: '2',
            credentialIdentifier: [7],
            publicCredential: [
              103, 89, 154, 0, 37, 100, 53, 193, 232, 81, 159, 85, 92, 71, 172,
              29, 139, 47, 194, 76, 101, 168, 56, 38, 2, 184, 101, 198, 127,
              248, 96, 84, 185, 155, 18, 10, 24, 121, 133, 231, 50, 222, 126,
              14, 167, 233, 89, 100, 157, 177, 93, 214, 236, 207, 192, 216, 238,
              164, 102, 45, 210, 21, 106, 249,
            ],
            privateKey: [
              223, 201, 25, 81, 139, 30, 94, 239, 46, 76, 245, 163, 40, 134,
              250, 150, 26, 5, 130, 108, 37, 182, 81, 138, 59, 87, 146, 105,
              164, 113, 236, 68,
            ],
            serverCredentialIdentifier: [36],
            serverPublicKey: [
              245, 146, 77, 208, 125, 72, 33, 127, 248, 33, 151, 167, 46, 224,
              183, 47, 42, 138, 151, 81, 223, 75, 122, 30, 7, 69, 25, 10, 60,
              86, 40, 128, 94, 242, 66, 181, 117, 87, 4, 156, 38, 140, 198, 184,
              97, 212, 91, 113, 216, 35, 165, 122, 140, 231, 180, 182, 9, 145,
              13, 62, 181, 6, 66, 115,
            ],
            oscoreMasterSecretLength: '16',
            oscoreMasterSaltLength: '8',
            edhocOscoreCombined: 'False',
          },
        },
        toDelete: ['/0', '/1', '/21'],
      },
    };
  }

  private createSecurityConfig(endpoint: string, oscoreParams: OSCOREParams) {
    return {
      endpoint: endpoint,
      edhoc: {
        initiator: 'True',
        authenticationMethod: '0',
        ciphersuite: '2',
        credentialIdentifier: '07',
        publicCredential:
          '67599A00256435C1E8519F555C47AC1D8B2FC24C65A8382602B865C67FF86054B99B120A187985E732DE7E0EA7E959649DB15DD6ECCFC0D8EEA4662DD2156AF9',
        serverCredentialIdentifier: '24',
        serverPublicKey:
          'D709BFA1CB5C9B52ED7C29300932F8EC997721E16DC777B470EE64C5DE871B2DF5924DD07D48217FF82197A72EE0B72F2A8A9751DF4B7A1E0745190A3C5628805EF242B57557049C268CC6B861D45B71D823A57A8CE7B4B609910D3EB5064273',
        oscoreMasterSecretLength: '16',
        oscoreMasterSaltLength: '8',
        edhocOscoreCombined: 'False',
      },
    };
  }

  private async configureClient(
    endpoint: string,
    clientNumber: number
  ): Promise<ConfigResult> {
    const result: ConfigResult = {
      endpoint: endpoint,
      bootstrap: false,
      security: false,
    };

    try {
      // Generera OSCORE parametrar
      const oscoreParams = this.generateOscoreParams(clientNumber);

      // 1. POST Bootstrap config
      const bsConfig = this.createBootstrapConfig(endpoint, oscoreParams);
      const bsUrl = `${this.baseUrl}/api/bsclients/${encodeURIComponent(
        endpoint
      )}`;

      console.log(`Configuring bootstrap for ${endpoint}...`);
      const bsResponse = await fetch(bsUrl, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify(bsConfig),
      });

      if (bsResponse.ok) {
        result.bootstrap = true;
        console.log(`[OK] Bootstrap config for ${endpoint} successful`);
      } else {
        console.log(
          `[FAIL] Bootstrap config for ${endpoint} failed: ${bsResponse.status}`
        );
        const responseText = await bsResponse.text();
        console.log(`Response: ${responseText}`);
        console.log(`OSCORE params: ${JSON.stringify(oscoreParams)}`);
        result.error = `Bootstrap failed: ${responseText}`;
      }

      // 2. PUT Security config
      const secConfig = this.createSecurityConfig(endpoint, oscoreParams);
      const secUrl = `${this.baseUrl}/api/clients`;

      console.log(`Configuring security for ${endpoint}...`);
      const secResponse = await fetch(secUrl, {
        method: 'PUT',
        headers: this.headers,
        body: JSON.stringify(secConfig),
      });

      if (secResponse.ok) {
        result.security = true;
        console.log(`[OK] Security config for ${endpoint} successful`);
      } else {
        console.log(
          `[FAIL] Security config for ${endpoint} failed: ${secResponse.status}`
        );
        result.error = `Security failed: ${await secResponse.text()}`;
      }

      // Spara klient-kommando
      result.command = `java -jar leshan-client-demo.jar -b -n ${endpoint} -msec ${oscoreParams.master_secret} -sid ${oscoreParams.recipient_id} -rid ${oscoreParams.sender_id} -u 127.0.0.1`;
      result.oscore = oscoreParams;

      // Delay mellan klienter
      await new Promise((resolve) => setTimeout(resolve, 500));
    } catch (error) {
      result.error = String(error);
      console.log(`[ERROR] Error configuring ${endpoint}: ${error}`);
    }

    return result;
  }

  async bulkConfigure(endpoints: string[]): Promise<ConfigureSummary> {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`Starting bulk configuration for ${endpoints.length} clients`);
    console.log(`${'='.repeat(60)}\n`);

    for (let i = 0; i < endpoints.length; i++) {
      const result = await this.configureClient(endpoints[i], i + 1);
      this.results.push(result);
      console.log(`Progress: ${i + 1}/${endpoints.length}\n`);
    }

    const successful = this.results.filter(
      (r) => r.bootstrap && r.security
    ).length;

    console.log(`\n${'='.repeat(60)}`);
    console.log(`Configuration complete!`);
    console.log(`Successful: ${successful}/${endpoints.length}`);
    console.log(`${'='.repeat(60)}\n`);

    this.saveClientCommands();

    return { successful, total: endpoints.length, results: this.results };
  }

  private saveClientCommands() {
    const timestamp = new Date().toISOString().slice(0, 19).replace('T', ' ');
    let content = `# Leshan Client Start Commands\n`;
    content += `# Generated: ${timestamp}\n\n`;

    this.results.forEach((result) => {
      if (result.command) {
        content += `# ${result.endpoint}\n`;
        content += `${result.command}\n\n`;
      }
    });

    fs.writeFileSync('client_commands.txt', content);
    console.log("Client commands saved to 'client_commands.txt'");

    // Skapa också en batch-fil för Windows (utan delay)
    let batchContent = '@echo off\n';
    batchContent += 'echo Starting all Leshan clients...\n\n';

    this.results.forEach((result) => {
      if (result.command) {
        batchContent += `echo Starting ${result.endpoint}...\n`;
        batchContent += `start cmd /k "${result.command}"\n`;
      }
    });

    batchContent += '\necho All clients started!\n';
    batchContent += 'pause\n';

    fs.writeFileSync('start_all_clients.bat', batchContent);
    console.log("Batch file 'start_all_clients.bat' created");
  }
}
