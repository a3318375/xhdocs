import { createMDX } from 'fumadocs-mdx/next';

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const config = {
  output: 'export',
  reactStrictMode: true,
  // static export has no /_next/image optimizer endpoint -> emit plain <img>
  images: {
    unoptimized: true,
  },
};

export default withMDX(config);
