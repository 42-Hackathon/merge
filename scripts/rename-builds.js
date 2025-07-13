const fs = require('fs');
const path = require('path');
const packageJson = require('../package.json');

const version = packageJson.version;
const outDir = path.join(__dirname, '../out');

// 빌드 결과 디렉토리 확인
if (!fs.existsSync(outDir)) {
    console.log('No build output found');
    process.exit(0);
}

function renameFiles(dirPath) {
    const items = fs.readdirSync(dirPath);
    
    items.forEach(item => {
        const fullPath = path.join(dirPath, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
            renameFiles(fullPath);
        } else {
            // 파일명에 버전 추가
            const ext = path.extname(item);
            const basename = path.basename(item, ext);
            
            // 이미 버전이 포함된 경우 스킵
            if (basename.includes(version)) {
                return;
            }
            
            // flux로 시작하는 파일만 처리
            if (basename.toLowerCase().includes('flux')) {
                const newName = `${basename}-v${version}${ext}`;
                const newPath = path.join(dirPath, newName);
                
                try {
                    fs.renameSync(fullPath, newPath);
                    console.log(`Renamed: ${item} → ${newName}`);
                } catch (err) {
                    console.error(`Failed to rename ${item}:`, err.message);
                }
            }
        }
    });
}

console.log(`Adding version ${version} to build files...`);
renameFiles(outDir);
console.log('File renaming completed!'); 