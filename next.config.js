/** @type {import('next').NextConfig} */
const { createProxyMiddleware } = require("http-proxy-middleware");
module.exports = {
  env: {
    DB_CONNECTION: process.env.DB_CONNECTION,
    DB_HOST: process.env.DB_HOST,
    DB_PORT: process.env.DB_PORT,
    DB_DATABASE: process.env.DB_DATABASE,
    DB_USERNAME: process.env.DB_USERNAME,
    DB_PASSWORD: process.env.DB_PASSWORD,

    API_PREFIX: process.env.API_PREFIX,
    API_VERSION: process.env.API_VERSION,
    API_ROUTE_PREFIX: process.env.API_ROUTE_PREFIX,

    JWT_SECRET: process.env.JWT_SECRET || "default-secret-key",
  },
  async rewrites() {
    return [
      {
        source:
          "/:header*" +
          `/` +
          process.env.API_PREFIX +
          `/` +
          process.env.API_VERSION +
          "/:path*", // 要代理的路径
        destination:
          "http://111.230.66.45:4321/" +
          process.env.API_PREFIX +
          "/" +
          process.env.API_VERSION +
          "/:path*", // 要代理的目标地址
      },
    ];
  },
};
