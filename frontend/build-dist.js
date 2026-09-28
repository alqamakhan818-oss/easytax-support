import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontendDir = __dirname;
const rootDir = path.resolve(frontendDir, '..');

console.log('==> Step 1: Running Vite build...');
execSync('npx vite build', { stdio: 'inherit', cwd: frontendDir });

const frontendDist = path.join(frontendDir, 'dist');
const rootDist = path.join(rootDir, 'dist');

console.log('==> Step 2: Ensuring build output exists in both frontend/dist and root dist...');
if (fs.existsSync(frontendDist)) {
  try {
    fs.cpSync(frontendDist, rootDist, { recursive: true, force: true });
    console.log('==> Successfully synced build to root dist/');
  } catch (err) {
    console.warn('==> Note: Could not sync to parent dist:', err.message);
  }
}

console.log('==> Build completed successfully!');
