import crossSpawn from 'cross-spawn';
import { SpawnOptions, ChildProcess } from 'child_process';

export default async function asyncCrossSpawn(
  command: string,
  args?: string[],
  options?: SpawnOptions
): Promise<string | ChildProcess> {
  options = {
    stdio: 'pipe',
    ...(options || {})
  };
  return new Promise((resolve, reject) => {
    const ps = crossSpawn(command, args, options);
    let result: string | ChildProcess = ps;
    if (ps.stdout && ps.stderr) {
      result = '';
      ps.stdout.on('data', data => (result += data.toString()));
      ps.stderr.on('data', data => (result += data.toString()));
    }
    ps.on('close', () => resolve(result));
    ps.on('error', (err: Error) => reject(err));
  });
}
