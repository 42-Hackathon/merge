const fs = require('fs');
const path = require('path');

// Create a simple placeholder icon (1x1 transparent PNG)
const iconData = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==', 'base64');

const sizes = [16, 32, 48, 64, 128, 256, 512];
const iconDir = path.join(__dirname, '..', 'assets');

// Ensure assets directory exists
if (!fs.existsSync(iconDir)) {
  fs.mkdirSync(iconDir, { recursive: true });
}

// Create icon files
sizes.forEach(size => {
  const iconPath = path.join(iconDir, `icon${size}.png`);
  fs.writeFileSync(iconPath, iconData);
  console.log(`Created ${iconPath}`);
});

// Create main icon.png
fs.writeFileSync(path.join(iconDir, 'icon.png'), iconData);
console.log('Created main icon.png');

// Create icon.ico for Windows
fs.writeFileSync(path.join(iconDir, 'icon.ico'), iconData);
console.log('Created icon.ico');

// Create icon.icns placeholder for macOS
fs.writeFileSync(path.join(iconDir, 'icon.icns'), iconData);
console.log('Created icon.icns');

console.log('Icon generation complete!');