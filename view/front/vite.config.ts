import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";


export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  let baseUrl = '/'
  if (mode === 'development') {
    baseUrl = env.VITE_BASE_URL || '/'
  } else if (mode === 'production') {
    baseUrl = env.VITE_BASE_URL || '/'
  }
  return{
  base: baseUrl, // <-- set the base URL here
  plugins: [
    react(),
    svgr({
      svgrOptions: {
        icon: true,
        exportType: "named",
        namedExport: "ReactComponent",
      },
    }),
  ],
}
});
