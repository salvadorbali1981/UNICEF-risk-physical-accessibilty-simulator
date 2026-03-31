exports.handler = async (event) => {
  if (event.httpMethod !== "POST") return { statusCode: 405 };

  const { messages, system, token } = JSON.parse(event.body || "{}");

  if (!token || token !== process.env.SESSION_TOKEN) {
    return { statusCode: 401, body: "Unauthorized" };
  }

  const body = { model: "claude-sonnet-4-20250514", max_tokens: 1000, messages };
  if (system) body.system = system;

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) return { statusCode: res.status, body: await res.text() };

  const data = await res.json();
  const text = data.content.map(b => b.type === "text" ? b.text : "").join("");
  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text })
  };
};
