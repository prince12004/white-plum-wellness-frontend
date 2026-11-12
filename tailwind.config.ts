import type { Config } from 'tailwindcss';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const preset = require('@white/config/tailwind-preset');

const config: Config = {
  presets: [preset],
  content: [
    './src/**/*.{ts,tsx}',
    '../../packages/ui/src/**/*.{ts,tsx}',
    // The production server keeps its own packages/ copy inside this app (see deploy/ecosystem.config.js).
    './packages/ui/src/**/*.{ts,tsx}',
  ],
};

export default config;
