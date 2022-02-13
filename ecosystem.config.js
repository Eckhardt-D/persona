module.exports = {
  apps: [
    {
      name: "app",
      script: "./node_modules/nuxt/bin/nuxt.js",
      cwd: "./app",
      instances: 2,
      exec_mode: "cluster",
      args: "start",
    },
    {
      name: "api",
      script: "./build/src/index.js",
      cwd: "./api",
      instances: 2,
      exec_mode: "cluster",
    },
    {
      name: "www",
      script: "./build/src/index.js",
      cwd: "./www",
      instances: 2,
      exec_mode: "cluster",
    },
  ],
};
