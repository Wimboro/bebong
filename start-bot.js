#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting WhatsApp Bot...');

// Start the bot process
const botProcess = spawn('node', ['src/index.js'], {
  cwd: __dirname,
  stdio: 'inherit',
  env: { ...process.env }
});

botProcess.on('close', (code) => {
  console.log(`\n🛑 Bot process exited with code ${code}`);
  if (code !== 0) {
    console.log('❌ Bot stopped unexpectedly');
  } else {
    console.log('✅ Bot stopped gracefully');
  }
});

botProcess.on('error', (error) => {
  console.error('❌ Failed to start bot:', error.message);
  process.exit(1);
});

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Stopping bot starter...');
  botProcess.kill('SIGINT');
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Stopping bot starter...');
  botProcess.kill('SIGTERM');
}); 