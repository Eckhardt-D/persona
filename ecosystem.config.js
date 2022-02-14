module.exports = {
  apps: [
    {
      name: "app",
      script: "./node_modules/nuxt/bin/nuxt.js",
      cwd: "./packages/app",
      instances: 2,
      exec_mode: "cluster",
      args: "start",
      env_production: {
        NODE_ENV: "production",
      }
    },
    {
      name: "api",
      script: "./build/src/index.js",
      cwd: "./packages/api",
      instances: 2,
      exec_mode: "cluster",
      env_production: {
        NODE_ENV: "production",
      }
    },
    {
      name: "www",
      script: "./build/src/index.js",
      cwd: "./packages/www",
      instances: 2,
      exec_mode: "cluster",
      env_production: {
        NODE_ENV: "production",
      },
    },
  ],
};
