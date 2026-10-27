import { DOCTORS } from '../server/apiRouter.ts';

export default function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const { specialty, city, query } = req.query || {};
  let filtered = [...DOCTORS];

  if (specialty && typeof specialty === 'string' && specialty !== 'All Specialties' && specialty !== 'all') {
    filtered = filtered.filter((d) => d.specialty.toLowerCase() === specialty.toLowerCase());
  }

  if (city && typeof city === 'string' && city !== 'All Cities' && city !== 'all') {
    filtered = filtered.filter((d) => d.city.toLowerCase() === city.toLowerCase());
  }

  if (query && typeof query === 'string' && query.trim()) {
    const q = query.toLowerCase();
    filtered = filtered.filter(
      (d) =>
        d.name.toLowerCase().includes(q) ||
        d.specialty.toLowerCase().includes(q) ||
        d.hospital.toLowerCase().includes(q) ||
        d.tags.some((t) => t.toLowerCase().includes(q))
    );
  }

  return res.status(200).json({ success: true, count: filtered.length, doctors: filtered });
}
