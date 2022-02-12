module.exports = {
  apps: [
    {
      name: "app",
      script: "./node_modules/nuxt/bin/nuxt.js",
      cwd: "./app",
      args: "start",
    },
    {
      name: "api",
      script: "./build/src/index.js",
      cwd: "./api",
    },
    {
      name: "www",
      script: "./build/src/index.js",
      cwd: "./www",
    },
  ],
};
