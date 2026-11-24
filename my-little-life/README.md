# My Little Life — Dashboard pessoal

Projeto estático + função serverless para conversar com a OpenAI Responses API.

## Estrutura
- `index.html`: dashboard completo, responsivo e com módulos.
- `api/chat.js`: backend seguro para chamar a OpenAI sem expor a chave no navegador.
- `vercel.json`: configuração de rotas para Vercel.
- `.env.example`: variáveis necessárias.

## Hospedar na Vercel
1. Descompacte o ZIP e envie a pasta para um repositório GitHub.
2. Na Vercel, importe o repositório.
3. Em **Settings → Environment Variables**, configure:
   - `OPENAI_API_KEY`: sua chave secreta da API OpenAI.
   - `APP_PASSWORD`: crie uma senha forte para proteger o endpoint de chat.
   - `OPENAI_MODEL`: opcional; padrão `gpt-6.2-sol`.
4. Faça Deploy.
5. Abra o endereço publicado. Ao enviar a primeira mensagem no chat, informe a senha `APP_PASSWORD`.

**Importante:** não coloque a chave OpenAI em `index.html`, JavaScript do navegador, GitHub ou variáveis `VITE_`/`NEXT_PUBLIC_`. A chave deve existir somente no servidor. A API é cobrada separadamente da assinatura ChatGPT; consulte https://developers.openai.com/api/docs/pricing.

## Desenvolvimento local
Requer Node.js e Vercel CLI:
```bash
npm install
npm i -g vercel
cp .env.example .env
# edite .env com suas credenciais
vercel dev
```
Acesse o endereço local mostrado pelo Vercel.

## Dados e privacidade
- Tarefas, finanças, agenda, projetos, notas, favoritos e devocionais ficam no `localStorage` do navegador/dispositivo. Não são sincronizados entre dispositivos e podem ser apagados ao limpar os dados do navegador.
- O histórico do chat fica na memória da página durante a sessão.
- O endpoint de chat exige `APP_PASSWORD`. Para um app público/multiusuário, implemente autenticação real, rate limiting persistente e armazenamento seguro.
- Não armazene dados bancários completos ou informações sensíveis no planner.

## Versículo diário
O módulo devocional consulta `https://api.midvash.com/v1/votd`, uma API bíblica externa. Isso **não** usa a conexão do plugin A-Z Holy Bible dentro do ChatGPT: plugins conectados ao ChatGPT não são automaticamente disponibilizados a sites externos. A disponibilidade e a tradução dependem do provedor; confira a atribuição/licença exibida pela API antes de redistribuir texto bíblico.

## Limitações desta versão
- O chat é um assistente via OpenAI API, não uma janela da conta ChatGPT, não herda sua assinatura, memórias nem histórico do ChatGPT.
- O dashboard ainda é local ao navegador. Para sincronização e backup na nuvem, acrescente banco de dados e login (por exemplo, Supabase).
