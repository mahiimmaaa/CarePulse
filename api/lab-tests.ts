import { LAB_TESTS } from '../server/apiRouter.ts';

export default function handler(_req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  return res.status(200).json({ success: true, count: LAB_TESTS.length, tests: LAB_TESTS });
}
