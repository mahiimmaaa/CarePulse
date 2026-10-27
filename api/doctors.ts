import { DOCTORS } from '../server/apiRouter.ts';

export default function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const { specialty, city, query } = req.query || {};

  const targetCity = (typeof city === 'string' && city) ? city : 'Bangalore';
  const isBangalore = targetCity.toLowerCase() === 'bangalore' || targetCity.toLowerCase() === 'all cities';

  if (!isBangalore) {
    return res.status(200).json({
      success: true,
      count: 0,
      citySupported: false,
      message: `Doctors in ${targetCity} are launching soon! We currently support verified doctors in Bangalore.`,
      doctors: [],
    });
  }

  let filtered = [...DOCTORS];

  if (specialty && typeof specialty === 'string' && specialty !== 'All Specialties' && specialty !== 'all') {
    filtered = filtered.filter((d) => d.specialty.toLowerCase() === specialty.toLowerCase());
  }

  if (query && typeof query === 'string' && query.trim()) {
    const q = query.toLowerCase();
    filtered = filtered.filter(
      (d) =>
        d.name.toLowerCase().includes(q) ||
        d.specialty.toLowerCase().includes(q) ||
        d.hospital.toLowerCase().includes(q) ||
        d.location.toLowerCase().includes(q) ||
        d.tags.some((t) => t.toLowerCase().includes(q))
    );
  }

  return res.status(200).json({
    success: true,
    count: filtered.length,
    citySupported: true,
    doctors: filtered,
  });
}
