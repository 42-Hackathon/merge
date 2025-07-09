# Flux Collector 배포 가이드

## 개요
Flux Collector는 Electron 데스크톱 앱과 Chrome 확장프로그램으로 구성됨.
두 컴포넌트는 별도로 배포하며, HTTP API(localhost:3737)로 통신함.

## 1. Electron 앱 배포

### 1.1 로컬 빌드
```bash
# 의존성 설치
npm install

# 플랫폼별 빌드
npm run make:linux    # Linux (.deb, .rpm)
npm run make:win      # Windows (.exe) - Windows에서만 실행
npm run make:mac      # macOS (.dmg) - macOS에서만 실행
```

### 1.2 GitHub Actions CI/CD
1. **버전 태그 생성**
   ```bash
   # package.json 버전 업데이트
   npm version patch  # 0.1.0 → 0.1.1
   # 또는
   npm version minor  # 0.1.0 → 0.2.0
   
   # 태그 푸시
   git push origin v0.1.0
   ```

2. **자동 빌드 및 릴리스**
   - GitHub Actions가 자동으로 3개 플랫폼 빌드
   - Releases 페이지에 자동 업로드
   - 사용자는 GitHub Releases에서 다운로드

### 1.3 배포 체크리스트
- [ ] package.json 버전 업데이트
- [ ] CHANGELOG 작성
- [ ] 태그 생성 및 푸시
- [ ] GitHub Actions 빌드 확인
- [ ] Release 페이지 확인

## 2. Chrome 확장프로그램 배포

### 2.1 확장프로그램 빌드
```bash
cd packages/chrome-extension

# 전체 플랫폼 빌드
npm run build

# 특정 플랫폼만
npm run build:windows
npm run build:macos
```

### 2.2 Chrome Web Store 배포

1. **개발자 계정 등록**
   - https://chrome.google.com/webstore/devconsole
   - 일회성 등록비 $5

2. **확장프로그램 패키징**
   ```bash
   # 배포용 ZIP 생성
   cd packages/chrome-extension
   zip -r flux-collector-extension.zip manifest.json *.js *.css assets/
   ```

3. **스토어 등록 정보 준비**
   - 이름: Flux Collector
   - 설명: 웹 콘텐츠를 Flux 애플리케이션으로 손쉽게 수집
   - 스크린샷: 1280x800 (최소 1개, 최대 5개)
   - 아이콘: 128x128 PNG
   - 프로모션 타일: 440x280 (선택사항)

4. **심사 제출**
   - Chrome Web Store에 ZIP 업로드
   - 개인정보 처리방침 URL 입력
   - 권한 설명 작성
   - 심사 기간: 1-3일 (첫 제출은 더 길 수 있음)

### 2.3 확장프로그램 업데이트
1. manifest.json 버전 업데이트
2. 변경사항 테스트
3. 새 ZIP 파일 생성
4. Chrome Web Store에서 업데이트 제출

## 3. 사용자 설치 가이드

### 3.1 Electron 앱 설치
**Windows:**
```bash
# .exe 파일 실행
flux-collector-0.1.0-setup.exe
```

**macOS:**
```bash
# .dmg 파일 열고 앱을 Applications로 드래그
open flux-collector-0.1.0.dmg
```

**Linux:**
```bash
# .deb (Ubuntu/Debian)
sudo dpkg -i flux-collector_0.1.0_amd64.deb

# .rpm (Fedora/CentOS)
sudo rpm -i flux-collector-0.1.0.x86_64.rpm
```

### 3.2 Chrome 확장프로그램 설치
1. Chrome Web Store에서 "Flux Collector" 검색
2. "Chrome에 추가" 클릭
3. 권한 승인

### 3.3 연동 설정
1. Electron 앱 실행 (자동으로 localhost:3737에서 서버 시작)
2. Chrome 확장프로그램 아이콘 클릭해서 연결 확인
3. 웹페이지에서 수집하고 싶은 콘텐츠 클릭

## 4. 보안 고려사항

### 4.1 로컬 통신
- localhost:3737 HTTP API는 로컬 전용
- 외부 접근 차단됨
- HTTPS 불필요 (로컬 통신이므로)

### 4.2 Chrome 확장프로그램 권한
- activeTab: 현재 탭에서만 동작
- storage: 설정 저장용
- contextMenus: 우클릭 메뉴
- host_permissions: 모든 사이트 (콘텐츠 수집용)

## 5. 문제 해결

### 5.1 연결 문제
```bash
# Electron 앱 서버 상태 확인
curl http://localhost:3737/status

# 포트 사용 확인
netstat -an | grep 3737
```

### 5.2 빌드 오류
```bash
# 캐시 정리
npm cache clean --force
rm -rf node_modules package-lock.json
npm install

# Electron rebuild
npm run rebuild
```

## 6. 버전 관리 전략

### 6.1 버전 형식
- 정식: `1.0.0`
- 베타: `1.0.0-beta.1`
- 알파: `0.1.0-alpha`

### 6.2 업데이트 주기
- 주요 기능: Minor 버전 (0.x.0)
- 버그 수정: Patch 버전 (0.0.x)
- 대규모 변경: Major 버전 (x.0.0)

## 7. 모니터링
- GitHub Releases 다운로드 수 확인
- Chrome Web Store 설치 수/리뷰 확인
- 사용자 피드백 수집

## 8. 향후 계획
- [ ] 자동 업데이트 기능 추가
- [ ] 다국어 지원
- [ ] 더 많은 브라우저 지원 (Firefox, Edge)
- [ ] 모바일 앱 개발 