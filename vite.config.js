import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  /*server: {
    proxy: {
      "/api": {
        target: "https://api.opensubtitles.com",
        changeOrigin: true,
        secure: false,
        headers: {
          "Api-Key": "j0HWhfDIHxcE0qcPCUpnOIZUh4D1sU61",
        },
      },
    },
  },*/
});
