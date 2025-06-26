import { getPlanetsForUI } from '@/utils/db/db';

export async function GET() {
  try {
    const result = getPlanetsForUI();
    return Response.json({ status: 200, data: result });
  } catch (err) {
    return Response.json({ status: 500, error: 'Failed to process planets' });
  }
}
