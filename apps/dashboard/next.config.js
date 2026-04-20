/** @type {import('next').NextConfig} */
const nextConfig = {
    allowedDevOrigins: ["10.0.0.*"],
    output: "standalone",
    // @/ alias for dashboard-local components
    // (tsconfig handles the alias; next.config doesn't need a redirect rule)
    experimental: {
        // Enable React 19 server actions
        serverActions: { allowedOrigins: ["localhost:3000"] },
    },
    images: {
        remotePatterns: [
            // Local MinIO dev
            {
                protocol: "http",
                hostname: "localhost",
                port: "9000",
                pathname: "/**",
            },
            {
                protocol: "http",
                hostname: "minio",
                port: "9000",
                pathname: "/**",
            },
            // Production CDN (wildcard for any nishchinto CDN host)
            {
                protocol: "https",
                hostname: "*.nishchinto.com.bd",
                pathname: "/**",
            },
        ],
    },
};

export default nextConfig;
