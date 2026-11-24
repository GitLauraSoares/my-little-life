export default async function handler(req, res) {
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  if (req.method !== "POST") return res.status(405).json({ error: "Método não permitido." });

  const expectedPassword = process.env.APP_PASSWORD;
  if (!expectedPassword) return res.status(503).json({ error: "O administrador ainda não configurou APP_PASSWORD no servidor." });
  if (req.headers["x-app-password"] !== expectedPassword) {
    return res.status(401).json({ error: "Senha do dashboard incorreta." });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return res.status(503).json({ error: "OPENAI_API_KEY não configurada no servidor." });

  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    const messages = Array.isArray(body?.messages) ? body.messages.slice(-12) : [];
    if (!messages.length || messages.some(m => !["user", "assistant"].includes(m.role) || typeof m.content !== "string")) {
      return res.status(400).json({ error: "Histórico de mensagens inválido." });
    }
    const input = messages.map(m => ({ role: m.role, content: m.content.slice(0, 5000) }));
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: { "Authorization": `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-6.2-sol",
        instructions: "Você é a assistente pessoal do My Little Life, um planner em português brasileiro. Seja acolhedora, clara, prática e organizada. Ajude com planejamento, estudos, programação, rotina, ideias, orçamento e reflexão. Não afirme que consegue ver os dados do dashboard, a menos que eles sejam enviados explicitamente na conversa. Não peça nem armazene senhas, números completos de cartão ou credenciais. Para dúvidas financeiras, ajude a organizar e calcular, sem fingir ser consultora financeira. Para temas bíblicos, seja respeitosa e diferencie texto bíblico de interpretação.",
        input,
        max_output_tokens: 700
      })
    });
    const data = await response.json();
    if (!response.ok) return res.status(response.status).json({ error: data?.error?.message || "Falha ao consultar a OpenAI." });
    const reply = data.output?.flatMap(item => item.content || []).filter(c => c.type === "output_text").map(c => c.text).join("\n") || "";
    return res.status(200).json({ reply });
  } catch (error) {
    return res.status(500).json({ error: "Erro interno ao processar a mensagem." });
  }
}