exports.handler = async (event) => {
  const body = JSON.parse(event.body);
  const submittedCode = body.code;

  const validCodes = ['ABC123', 'XYZ999', 'SEKRET42'];

  if (validCodes.includes(submittedCode)) {
    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, path: "/tajna-sciezka" }),
    };
  } else {
    return {
      statusCode: 401,
      body: JSON.stringify({ success: false, message: "Kod nieprawidłowy" }),
    };
  }
};