import { chatService } from '../server/chatService.ts';

export default function handler(_req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const status = chatService.getStatus();
  return res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'CarePulse Healthcare Platform',
    chatbot: status,
  });
}
