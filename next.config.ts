import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['your-supabase-storage-domain.supabase.co'], // Add your Supabase storage domain
  },
};

export default nextConfig;