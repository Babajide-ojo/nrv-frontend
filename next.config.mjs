/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['res.cloudinary.com', 's3-alpha-sig.figma.com', 'avataaars.io'],
      },
      webpack(config, { isServer }) {
        if (!isServer) {
          // Handle SVG imports as React components using @svgr/webpack
          config.module.rules.push({
            test: /\.svg$/,
            use: ['@svgr/webpack'],
          });
        }
        return config;
      },
      eslint: {
        // Warning: This allows production builds to successfully complete even if
        // your project has ESLint errors.
        ignoreDuringBuilds: true,
      },
};

export default nextConfig;
