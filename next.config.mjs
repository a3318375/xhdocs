import { createMDX } from 'fumadocs-mdx/next';

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const config = {
  output: 'export',
  // 局域网里从别的机器访问 dev server 时，放行 HMR 与字体等 /_next 资源
  allowedDevOrigins: ['192.168.5.4', '192.168.5.213', '*.local'],
  reactStrictMode: true,
  // static export has no /_next/image optimizer endpoint -> emit plain <img>
  images: {
    unoptimized: true,
  },
};

export default withMDX(config);
