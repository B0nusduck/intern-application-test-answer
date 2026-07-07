const sql = require('mssql');

const config = {
  user: process.env.SQL_SERVER_USER,
  password: process.env.SQL_SERVER_PASSWORD,
  server: process.env.SQL_SERVER_HOST || 'localhost',
  port: process.env.SQL_SERVER_PORT ? Number(process.env.SQL_SERVER_PORT) : undefined,
  database: process.env.SQL_SERVER_DATABASE || 'todoappdb',
  options: {
    encrypt: process.env.SQL_SERVER_ENCRYPT === 'true',
    trustServerCertificate: true,
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  },
};

let pool;

async function getSqlPool() {
  if (!pool) {
    pool = await sql.connect(config);
  }

  return pool;
}

async function closeSqlPool() {
  if (pool) {
    await pool.close();
    pool = null;
  }
}

module.exports = {
  getSqlPool,
  closeSqlPool,
};
