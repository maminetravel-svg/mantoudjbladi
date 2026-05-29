module.exports = {
  apps: [
    {
      name: 'mantoudj-bladi-api',
      script: './dist/index.js',
      cwd: '/var/www/mantoudj-bladi/backend',
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      watch: false,
      max_memory_restart: '500M',
      env_production: {
        NODE_ENV: 'production',
        PORT: 3001,
        JWT_SECRET: 'rflydz2026_super_secure_key_mantoudj_bladi',
        MONGODB_URI: 'mongodb://localhost:27017/mantoudj_bladi',
        FRONTEND_URL: 'https://mantoudjfellahbladi.com',
        API_URL: 'https://mantoudjfellahbladi.com'
      },
      error_file: '/var/log/mantoudj/error.log',
      out_file: '/var/log/mantoudj/out.log',
    },
  ],
}
