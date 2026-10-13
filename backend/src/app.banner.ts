const CYAN = '\x1b[36m%s\x1b[0m';
const GREEN = '\x1b[32m%s\x1b[0m';

const BANNER = [
  '  ██████╗ ███████╗███████╗ █████╗ ███████╗██╗ ██████╗ ',
  '  ██╔══██╗██╔════╝██╔════╝██╔══██╗██╔════╝██║██╔═══██╗',
  '  ██║  ██║█████╗  ███████╗███████║█████╗  ██║██║   ██║',
  '  ██║  ██║██╔══╝  ╚════██║██╔══██║██╔══╝  ██║██║   ██║',
  '  ██████╔╝███████╗███████║██║  ██║██║     ██║╚██████╔╝',
  '  ╚═════╝ ╚══════╝╚══════╝╚═╝  ╚═╝╚═╝     ╚═╝ ╚═════╝ ',
];

export function printBanner(port: number): void {
  console.log('');
  BANNER.forEach((line) => console.log(CYAN, line));
  console.log('');
  console.info(GREEN, '  ✔ A aplicação está rodando de acordo');
  console.info(GREEN, '  ✔ Banco de dados conectado');
  console.info(`  API disponível em http://localhost:${port}/api/v1`);
  console.log('');
}
