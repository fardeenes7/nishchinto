/** @type {import('next').NextConfig} */
const nextConfig = {
    allowedDevOrigins: ["10.0.0.*"],
    output: "standalone",
    images: {
        remotePatterns: [
            {
                protocol: "http",
                hostname: "localhost",
                port: "9000",
                pathname: "/**"
            },
            {
                protocol: "http",
                hostname: "minio",
                port: "9000",
                pathname: "/**"
            },
            {
                protocol: "https",
                hostname: "*.mohajon.io",
                pathname: "/**"
            },
            {
                protocol: "https",
                hostname: "*.mohajon.store",
                pathname: "/**"
            }
        ]
    }
};

export default nextConfig;
