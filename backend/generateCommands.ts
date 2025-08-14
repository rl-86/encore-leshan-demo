// configGenerator.ts — commands only (no POST/PUT to servers)
import * as fs from 'fs';

/** ---- Typer ---- */
interface OSCOREParams {
  master_secret: string;
  sender_id: string;
  recipient_id: string;
}

interface CommandResult {
  endpoint: string;
  command: string;
  oscore: OSCOREParams;
}

/** ---- Hjälpare ---- */
function generateOscoreParams(clientNumber: number): OSCOREParams {
  const master_secret = clientNumber
    .toString(16)
    .toUpperCase()
    .padStart(4, '0');
  const sender_id = (clientNumber * 2)
    .toString(16)
    .toUpperCase()
    .padStart(2, '0');
  const recipient_id = (clientNumber * 2 + 1)
    .toString(16)
    .toUpperCase()
    .padStart(2, '0');
  return { master_secret, sender_id, recipient_id };
}

function buildCommand(endpoint: string, o: OSCOREParams): string {
  // Behåll exakt samma format som tidigare så klienterna startas korrekt
  return `java -jar leshan-client-demo.jar -b -n ${endpoint} -msec ${o.master_secret} -sid ${o.recipient_id} -rid ${o.sender_id} -u 127.0.0.1`;
}

function generateEndpoints(
  devicePrefix: string,
  startNumber: number,
  count: number,
  paddingLength: number
): string[] {
  return Array.from(
    { length: count },
    (_, i) =>
      `${devicePrefix}${String(startNumber + i).padStart(paddingLength, '0')}`
  );
}

/** ---- Huvudlogik (ingen nätverkstrafik) ---- */
async function generateCommandsFor(
  devicePrefix: string,
  startNumber: number,
  count: number,
  paddingLength: number
): Promise<CommandResult[]> {
  const endpoints = generateEndpoints(
    devicePrefix,
    startNumber,
    count,
    paddingLength
  );

  const results: CommandResult[] = [];
  for (let i = 0; i < endpoints.length; i++) {
    const endpoint = endpoints[i];
    const oscore = generateOscoreParams(i + 1); // viktigt för att matcha UI/backend
    const command = buildCommand(endpoint, oscore);
    results.push({ endpoint, command, oscore });
  }
  return results;
}

/** ---- Utskrift till filer (som tidigare) ---- */
function saveClientCommands(results: CommandResult[]) {
  const timestamp = new Date().toISOString().slice(0, 19).replace('T', ' ');
  let content = `# Leshan Client Start Commands\n# Generated: ${timestamp}\n\n`;

  results.forEach((r) => {
    content += `# ${r.endpoint}\n`;
    content += `${r.command}\n\n`;
  });

  fs.writeFileSync('client_commands.txt', content);
  console.log("Client commands saved to 'client_commands.txt'");

  // Windows .bat (ingen delay)
  let batch = '@echo off\n';
  batch += 'echo Starting all Leshan clients...\n\n';
  results.forEach((r) => {
    batch += `echo Starting ${r.endpoint}...\n`;
    batch += `start cmd /k "${r.command}"\n`;
  });
  batch += `\necho All clients started!\n`;
  batch += 'pause\n';
  fs.writeFileSync('start_all_clients.bat', batch);
  console.log("Batch file 'start_all_clients.bat' created");

  // (valfritt) enkel bash-script för mac/linux
  let sh =
    '#!/usr/bin/env bash\nset -e\n\necho "Starting all Leshan clients..."\n\n';
  results.forEach((r) => {
    sh += `echo "Starting ${r.endpoint}..."\n`;
    sh += `${r.command} &\n`;
  });
  sh += `\necho "All clients started!"\n`;
  fs.writeFileSync('start_all_clients.sh', sh, { mode: 0o755 });
  console.log("Shell script 'start_all_clients.sh' created");
}

/** ---- CLI-entry ----
 * Kör med (exempel):
 *   npx ts-node configGenerator.ts Device 1 5 2
 * eller ändra default nedan och kör: npx ts-node configGenerator.ts
 */
async function main() {
  const [devicePrefixArg, startNumberArg, countArg, paddingLengthArg] =
    process.argv.slice(2);

  const devicePrefix = (devicePrefixArg ?? 'Device').trim();
  const startNumber = Number.isFinite(Number(startNumberArg))
    ? Number(startNumberArg)
    : 1;
  const count = Number.isFinite(Number(countArg)) ? Number(countArg) : 5;
  const paddingLength = Number.isFinite(Number(paddingLengthArg))
    ? Number(paddingLengthArg)
    : 2;

  // Samma basvalidering som i UI/backend
  if (!devicePrefix) throw new Error('devicePrefix is required');
  if (startNumber < 1) throw new Error('startNumber must be >= 1');
  if (count < 1 || count > 100)
    throw new Error('count must be between 1 and 100');
  if (paddingLength < 1 || paddingLength > 6)
    throw new Error('paddingLength must be between 1 and 6');

  console.log(`\nGenerating start commands for ${count} clients:`);
  console.log(
    `  prefix='${devicePrefix}', start=${startNumber}, padding=${paddingLength}\n`
  );

  const results = await generateCommandsFor(
    devicePrefix,
    startNumber,
    count,
    paddingLength
  );

  // Visa förhandsvisning i konsolen
  results.forEach((r, idx) => {
    console.log(`[${idx + 1}/${results.length}] ${r.endpoint}`);
    console.log(
      `  OSCORE: msec=${r.oscore.master_secret}, sid=${r.oscore.sender_id}, rid=${r.oscore.recipient_id}`
    );
    console.log(`  CMD:   ${r.command}\n`);
  });

  // Skriv filer
  saveClientCommands(results);

  console.log(`Done. Commands generated for ${results.length} clients.\n`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
