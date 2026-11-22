import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: process.env.NODE_ENV === "production" ? "export" : undefined,
  trailingSlash: true,
  // GitHub Pages 是纯静态托管，图片不经过 Next 的优化服务
  images: { unoptimized: true },
};

export default nextConfig;
