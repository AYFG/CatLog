module.exports = {
  apps: [
    {
      name: "catLogBackend",
      script: "./dist/app.js",
      instances: "max",
      exec_mode: "cluster",
    },
  ],
};
