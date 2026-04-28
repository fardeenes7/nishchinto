/** @type {import('next').NextConfig} */
const nextConfig = {
    allowedDevOrigins: ["10.0.0.*"],
    output: "standalone",
    images: {
        remotePatterns: [
            // Local MinIO dev
            {
                protocol: "https",
                hostname: "pub-e2b230a09fe84a5f8c19ed9f8d02cc09.r2.dev",
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
