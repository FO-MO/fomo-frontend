// Minimal Strapi auth helper for client-side usage
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export async function fetchData(
  token: string | null,
  endpoint: string
): Promise<any> {
  const res = await fetch(`${BACKEND_URL}/api/${endpoint}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
}
