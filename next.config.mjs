/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // wikipedia.org
    remotePatterns: [
      {
        protocol: "https",
        hostname: "upload.wikimedia.org",
        port: "",
      },
    ],
  },
};

export default nextConfig;
