import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default ({ mode }) => {
  // Load env file based on `mode` in `vite dev` or `vite build`
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

  return defineConfig({
    base: "/EnrollmentAnalytics/",
    plugins: [react()],
  });
};
