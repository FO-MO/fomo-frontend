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

export async function postData(
  token: string | null,
  endpoint: string,
  data: any
): Promise<any> {
  const res = await fetch(`${BACKEND_URL}/api/${endpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function putData(
  token: string | null,
  endpoint: string,
  data: any
): Promise<any> {
  const res = await fetch(`${BACKEND_URL}/api/${endpoint}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  return res.json();
}
