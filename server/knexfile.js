require('dotenv').config();

function parseDatabaseUrl(url) {
  if (!url) return null;
  const parsed = new URL(url);
  return {
    host: parsed.hostname,
    port: parseInt(parsed.port || '5432'),
    user: parsed.username,
    password: parsed.password,
    database: parsed.pathname.replace(/^\//, ''),
  };
}

const fromUrl = parseDatabaseUrl(process.env.DATABASE_URL);

module.exports = {
  client: 'pg',
  connection: fromUrl || {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_NAME || 'mobile_code_server',
  },
  pool: {
    min: 2,
    max: 10,
  },
  migrations: {
    directory: './migrations',
  },
};
