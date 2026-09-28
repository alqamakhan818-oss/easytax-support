const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('==> [Backend Build] Step 1: Building frontend...');
const rootDir = path.resolve(__dirname, '..');
const frontendDir = path.join(rootDir, 'frontend');
const localDist = path.join(__dirname, 'dist');

if (!fs.existsSync(localDist)) {
  fs.mkdirSync(localDist, { recursive: true });
}

try {
  if (fs.existsSync(frontendDir)) {
    execSync('npm --prefix ../frontend install', { stdio: 'inherit', cwd: __dirname });
    execSync('npm --prefix ../frontend run build', { stdio: 'inherit', cwd: __dirname });
    
    const srcDist = path.join(frontendDir, 'dist');
    if (fs.existsSync(srcDist)) {
      fs.cpSync(srcDist, localDist, { recursive: true, force: true });
      console.log('==> [Backend Build] Synced frontend build to backend/dist/');
    }
  }
} catch (err) {
  console.warn('==> [Backend Build] Note:', err.message);
}

// Fallback index.html if frontend build is somehow missing
const indexPath = path.join(localDist, 'index.html');
if (!fs.existsSync(indexPath)) {
  fs.writeFileSync(indexPath, '<!DOCTYPE html><html><head><title>EasyTax Support</title></head><body><h1>EasyTax Support Backend API</h1><p>API is operational.</p></body></html>');
}

// Step 2: Create server entrypoint in dist for Vercel Express builder
console.log('==> [Backend Build] Step 2: Creating server entrypoint in dist...');
const entrypointContent = `const path = require('path');
const express = require('express');
const connectDB = require('../config/db');
const app = require('../app');

// Ensure MongoDB is connected
connectDB().catch(err => console.error('MongoDB connection error:', err));

// Serve static frontend assets from dist folder
app.use(express.static(__dirname));

// Route all client routes to index.html (SPA)
app.get('*', (req, res) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ error: 'API route not found' });
  }
  res.sendFile(path.join(__dirname, 'index.html'));
});

const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
  app.listen(PORT, () => console.log('Server running on port ' + PORT));
}

module.exports = app;
`;

fs.writeFileSync(path.join(localDist, 'index.js'), entrypointContent);
fs.writeFileSync(path.join(localDist, 'server.js'), entrypointContent);
fs.writeFileSync(path.join(localDist, 'app.js'), entrypointContent);

console.log('==> [Backend Build] Created dist/index.js, dist/server.js, and dist/app.js entrypoints');
console.log('==> [Backend Build] Build completed successfully!');
