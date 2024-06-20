/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "userpic.codeforces.org",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

module.exports = nextConfig;
