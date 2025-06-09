// netlify/functions/verify-code.js
const { Client } = require('pg');
const { v4: uuidv4 } = require('uuid');

exports.handler = async (event) => {
  const { code } = JSON.parse(event.body || '{}');

  if (!code) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'No code provided' })
    };
  }

  const client = new Client({ connectionString: process.env.NETLIFY_DATABASE_URL });
  await client.connect();

  try {
    const res = await client.query('SELECT * FROM access_codes WHERE code = $1', [code]);

    if (res.rows.length === 0) {
      return { statusCode: 401, body: JSON.stringify({ error: 'Invalid code' }) };
    }

    const token = uuidv4();

    const now = new Date();
    const expiresAt = new Date(now.getTime() + 60 * 60 * 1000);

    await client.query(
      'INSERT INTO access_tokens (token, code, expires_at) VALUES ($1, $2, $3)',
      [token, code, expiresAt]
    );

    return {
      statusCode: 200,
      body: JSON.stringify({ redirect: `/ticket-form?token=${token}` })
    };
  } finally {
    await client.end();
  }
};
