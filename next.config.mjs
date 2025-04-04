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
};

export default nextConfig;
