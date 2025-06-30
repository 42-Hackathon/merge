#!/usr/bin/env node

// eslint-disable-next-line @typescript-eslint/no-var-requires
const fs = require('fs');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const os = require('os');

/**
 * Native Messaging Host 설정 스크립트
 * Chrome Extension과 Electron 앱 간의 통신을 위해 Native Host를 등록합니다.
 */

const HOST_NAME = 'com.flux.collector';

function getPlatformHostDir() {
  const platform = os.platform();
  const homeDir = os.homedir();
  
  switch (platform) {
    case 'win32':
      return path.join(homeDir, 'AppData', 'Local', 'Google', 'Chrome', 'User Data', 'NativeMessagingHosts');
    case 'darwin':
      return path.join(homeDir, 'Library', 'Application Support', 'Google', 'Chrome', 'NativeMessagingHosts');
    case 'linux':
      return path.join(homeDir, '.config', 'google-chrome', 'NativeMessagingHosts');
    default:
      throw new Error(`Unsupported platform: ${platform}`);
  }
}

function setupNativeHost() {
  try {
    console.log('🔧 Setting up Flux Collector Native Messaging Host...\n');
    
    // 1. Native Host 디렉토리 확인/생성
    const hostDir = getPlatformHostDir();
    console.log(`📁 Host directory: ${hostDir}`);
    
    if (!fs.existsSync(hostDir)) {
      fs.mkdirSync(hostDir, { recursive: true });
      console.log('✅ Created host directory');
    }
    
    // 2. Host 스크립트 경로 설정
    const hostScriptPath = path.resolve(__dirname, 'native-host', 'flux-collector-host.js');
    console.log(`📄 Host script: ${hostScriptPath}`);
    
    if (!fs.existsSync(hostScriptPath)) {
      console.error('❌ Host script not found! Please ensure flux-collector-host.js exists.');
      return;
    }
    
    // 3. Host Manifest 생성
    const manifest = {
      name: HOST_NAME,
      description: 'Flux Collector Native Messaging Host',
      path: hostScriptPath,
      type: 'stdio',
      allowed_origins: [
        'chrome-extension://demkgcpdpbnlbcggbolilpkdknpcabhg/'
      ]
    };
    
    // 4. Manifest 파일 저장
    const manifestPath = path.join(hostDir, `${HOST_NAME}.json`);
    
    // JSON 문자열을 더 안전하게 생성
    const manifestJson = JSON.stringify(manifest, null, 2);
    fs.writeFileSync(manifestPath, manifestJson, 'utf8');
    
    console.log('✅ Native Host manifest created');
    console.log(`📄 Manifest path: ${manifestPath}\n`);
    
    // 5. Host 스크립트 실행 권한 설정 (Unix 계열)
    if (os.platform() !== 'win32') {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const { execSync } = require('child_process');
      try {
        execSync(`chmod +x "${hostScriptPath}"`);
        console.log('✅ Host script made executable');
      } catch {
        console.warn('⚠️  Could not set execute permissions on host script');
      }
    }
    
    console.log('🎉 Native Messaging Host setup complete!\n');
    console.log('📋 Next steps:');
    console.log('1. Load the Chrome Extension in Chrome');
    console.log('2. Copy the Extension ID and update the manifest');
    console.log('3. Start your Electron app');
    console.log('4. Test the connection by collecting data from a webpage\n');
    
    console.log('🔧 Manual setup (if needed):');
    console.log(`   Manifest: ${manifestPath}`);
    console.log(`   Host script: ${hostScriptPath}`);
    
  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    console.error('\n📋 Manual setup required:');
    console.error('1. Create the Chrome Native Messaging Host directory');
    console.error('2. Copy the manifest file to the correct location');
    console.error('3. Update the manifest with your extension ID');
  }
}

function updateExtensionId(extensionId) {
  if (!extensionId) {
    console.error('❌ Please provide an extension ID');
    console.error('Usage: node setup-native-host.js update <extension-id>');
    return;
  }
  
  try {
    const hostDir = getPlatformHostDir();
    const manifestPath = path.join(hostDir, `${HOST_NAME}.json`);
    
    if (!fs.existsSync(manifestPath)) {
      console.error('❌ Manifest not found. Please run setup first.');
      return;
    }
    
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    manifest.allowed_origins = [`chrome-extension://${extensionId}/`];
    
    // JSON 문자열을 더 안전하게 생성
    const manifestJson = JSON.stringify(manifest, null, 2);
    fs.writeFileSync(manifestPath, manifestJson, 'utf8');
    console.log('✅ Extension ID updated in manifest');
    console.log(`🆔 Extension ID: ${extensionId}`);
    
  } catch (error) {
    console.error('❌ Failed to update extension ID:', error.message);
  }
}

// CLI 처리
const args = process.argv.slice(2);
const command = args[0];

switch (command) {
  case 'update':
    updateExtensionId(args[1]);
    break;
  case 'help':
    console.log('Flux Collector Native Host Setup');
    console.log('');
    console.log('Commands:');
    console.log('  setup                  Set up the native messaging host');
    console.log('  update <extension-id>  Update the extension ID in manifest');
    console.log('  help                   Show this help');
    break;
  default:
    setupNativeHost();
} 