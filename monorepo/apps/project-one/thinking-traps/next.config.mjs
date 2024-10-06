import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: "out",  // Setting the output directory to 'out'
  output: "export",  // Configuring for static export
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.output.publicPath = path.join(__dirname, "out");
    }
    return config;
  },
};

export default nextConfig;
