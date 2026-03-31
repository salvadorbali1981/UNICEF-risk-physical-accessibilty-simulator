exports.handler = async (event) => {
  if (event.httpMethod !== "POST") return { statusCode: 405 };

  const { password, embedToken } = JSON.parse(event.body || "{}");

  const validPassword  = password   && password   === process.env.ACCESS_PASSWORD;
  const validEmbed     = embedToken && embedToken  === process.env.EMBED_TOKEN;

  if (validPassword || validEmbed) {
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: process.env.SESSION_TOKEN })
    };
  }

  return { statusCode: 401, body: "Unauthorized" };
};
