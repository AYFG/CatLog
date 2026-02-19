module.exports = {
  apps: [
    {
      name: "catLogBackend",
      script: "./dist/app.js",
      instances: "2",
      exec_mode: "cluster",
    },
  ],
};
