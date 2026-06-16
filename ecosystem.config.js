/** @type {import('pm2').StartOptions} */
module.exports = {
  apps: [
    {
      name: "namkeen420",
      script: "./node_modules/.bin/next",
      args: "start",
      cwd: "/home/ubuntu/namkeen420",
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "512M",
      env_production: {
        NODE_ENV: "production",
        PORT: 3000,
      },
    },
  ],
};
