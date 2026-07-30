const nextConfig = {
  async rewrites() {
    return [{ source: '/', destination: '/site/index.html' }];
  },
};
export default nextConfig;
