// netlify/functions/authorize-token.js
const { Client } = require('pg');

exports.handler = async (event) => {
  const token = event.queryStringParameters.token;

  if (!token) {
    return { statusCode: 400, body: JSON.stringify({ error: 'No token provided' }) };
  }

  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();

  try {
    const res = await client.query(
      `SELECT * FROM access_tokens 
       WHERE token = $1 AND used = false AND expires_at > NOW()`,
      [token]
    );

    if (res.rows.length === 0) {
      return { statusCode: 401, body: JSON.stringify({ error: 'Invalid or expired token' }) };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true })
    };
  } finally {
    await client.end();
  }
};
