import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed',
    });
  }

  const apiKey = process.env.CHAT_API_KEY;
  const baseUrl = (
    process.env.CHAT_API_URL || 'https://api.dify.ai/v1'
  ).replace(/\/+$/, '');

  if (!apiKey) {
    return res.status(500).json({
      success: false,
      error: 'Chat API key is not configured on the server.',
    });
  }

  const { message, conversationId, userId } = req.body || {};

  if (typeof message !== 'string' || !message.trim()) {
    return res.status(400).json({
      success: false,
      error: 'Please enter a message.',
    });
  }

  try {
    const response = await fetch(`${baseUrl}/chat-messages`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: {},
        query: message.trim(),
        response_mode: 'blocking',
        conversation_id: conversationId || '',
        user: userId || 'carepulse-patient',
      }),
    });

    const result = (await response.json()) as any;

    if (!response.ok) {
      console.error('Dify request failed:', response.status, result);

      return res.status(502).json({
        success: false,
        error: 'The chatbot service could not process your request.',
      });
    }

    return res.status(200).json({
      success: true,
      answer: result.answer || 'Sorry, I could not generate a response.',
      conversation_id: result.conversation_id || '',
      message_id: result.id || '',
      created_at: result.created_at || Math.floor(Date.now() / 1000),
      provider: 'dify',
      isEmergencyAlert: false,
    });
  } catch (error) {
    console.error('Chat endpoint error:', error);

    return res.status(500).json({
      success: false,
      error: 'Unable to connect to the chatbot service.',
    });
  }
}
