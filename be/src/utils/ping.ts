import { exec } from 'child_process';

export function pingHost(host: string): Promise<void> {
  return new Promise((resolve) => {
    const isWin = process.platform === 'win32';
    const cmd = isWin ? `ping -n 1 ${host}` : `ping -c 1 ${host}`;

    exec(cmd, () => {
      resolve();
    });
  });
}
