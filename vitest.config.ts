import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    watch: false,
    coverage: {
      enabled: true,
      thresholds: {
        100: true,
      },
      exclude: [
        'src/__test__/**',
        'src/stories/**',
        '.storybook',
        '**/index.ts',
        '**/*.config.ts',
        '**/abstract-*.ts',
        '**/*.interface.ts',
        '**/*.type.ts',
        '**/*.enum.ts',
        '**/*.error.ts',
        'src-exists.cjs',
      ],
    },
  },
});
