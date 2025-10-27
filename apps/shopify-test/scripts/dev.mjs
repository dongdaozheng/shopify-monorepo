import { spawn } from 'child_process';
import { config } from 'dotenv';

config();

const viteProcess = spawn('npx', ['vite', 'dev'], {
  stdio: 'inherit',
  shell: true
});

const serverProcess = spawn('npx', ['nodemon', '--watch', 'server.mjs', '--watch', 'build/', 'server.mjs'], {
  stdio: 'inherit',
  shell: true,
  env: {
    ...process.env,
    NODE_ENV: 'development'
  }
});

process.on('SIGINT', () => {
  viteProcess.kill();
  serverProcess.kill();
  process.exit();
});

process.on('exit', () => {
  viteProcess.kill();
  serverProcess.kill();
});

