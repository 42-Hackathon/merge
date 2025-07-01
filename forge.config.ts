import type { ForgeConfig } from '@electron-forge/shared-types';
import { MakerSquirrel } from '@electron-forge/maker-squirrel';
import { MakerZIP } from '@electron-forge/maker-zip';
import { MakerDeb } from '@electron-forge/maker-deb';
import { VitePlugin } from '@electron-forge/plugin-vite';
import { FusesPlugin } from '@electron-forge/plugin-fuses';
import { FuseV1Options, FuseVersion } from '@electron/fuses';

const config: ForgeConfig = {
  packagerConfig: {
    asar: true,
    name: 'Flux',
    executableName: 'flux',
    appBundleId: 'com.flux.app',
    appCategoryType: 'public.app-category.productivity',
    win32metadata: {
      CompanyName: 'Flux Team',
      ProductName: 'Flux',
    },
  },
  rebuildConfig: {},
  makers: [
    // Windows installer (.exe)
    new MakerSquirrel({
      name: 'flux',
      setupExe: 'flux-setup.exe',
      setupIcon: 'assets/icon.ico', // 아이콘 파일이 있다면
    }),
    // macOS ZIP (.zip) - GitHub에서 다운로드하기 좋음
    new MakerZIP({}, ['darwin']),
    // Linux DEB package (선택사항)
    new MakerDeb({
      options: {
        name: 'flux',
        productName: 'Flux',
        genericName: 'AI-Powered Knowledge Hub',
        description: 'Flux는 흩어져 있는 당신의 지식과 아이디어를 한 곳에 모아, AI와 함께 탐색하고, 다듬고, 새로운 인사이트를 발견할 수 있도록 돕는 차세대 지식 관리 도구입니다.',
        categories: ['Office', 'Utility'],
      },
    }),
  ],
  plugins: [
    new VitePlugin({
      // `build` can specify multiple entry builds, which can be Main process, Preload scripts, Worker process, etc.
      // If you are familiar with Vite configuration, it will look really familiar.
      build: [
        {
          // `entry` is just an alias for `build.lib.entry` in the corresponding file of `config`.
          entry: 'src/main.ts',
          config: 'vite.main.config.ts',
          target: 'main',
        },
        {
          entry: 'src/preload.ts',
          config: 'vite.preload.config.ts',
          target: 'preload',
        },
      ],
      renderer: [
        {
          name: 'main_window',
          config: 'vite.renderer.config.ts',
        },
      ],
    }),
    // Fuses are used to enable/disable various Electron functionality
    // at package time, before code signing the application
    new FusesPlugin({
      version: FuseVersion.V1,
      [FuseV1Options.RunAsNode]: false,
      [FuseV1Options.EnableCookieEncryption]: true,
      [FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
      [FuseV1Options.EnableNodeCliInspectArguments]: false,
      [FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: true,
      [FuseV1Options.OnlyLoadAppFromAsar]: true,
    }),
  ],
};

export default config;
