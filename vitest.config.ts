import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    watch: false,
    coverage: {
      provider: 'v8',
      enabled: true,
      thresholds: {
        100: true,
      },
      exclude: [
        'src/__test__/**',
        '**/index.ts',
        '**/*.config.ts',
        '**/*.interface.ts',
        '**/*.type.ts',
        '**/*.enum.ts',
        '**/*.error.ts',
        'src-exists.cjs',
      ],
    },
  },
});
