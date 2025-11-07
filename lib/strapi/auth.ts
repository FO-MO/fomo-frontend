// Minimal Strapi auth helper for client-side usage
const STRAPI_URL =
  process.env.BACKEND_URL || "https://tbs9k5m4-1337.inc1.devtunnels.ms"; //change it later

export async function strapiLogin(
  identifier: string,
  password: string
): Promise<any> {
  const res = await fetch(`${STRAPI_URL}/api/auth/local`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ identifier, password }),
  });
  return res.json();
}

export async function strapiRegister(
  username: string,
  email: string,
  password: string
): Promise<any> {
  const res = await fetch(`${STRAPI_URL}/api/auth/local/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email, password }),
  });
  return res.json();
}

export function setAuthToken(token: string, maxAge = 60 * 60 * 24 * 7): void {
  // Set a cookie accessible to client (not HttpOnly). For production consider setting cookies from server with HttpOnly.
  document.cookie = `fomo_token=${token}; path=/; max-age=${maxAge}; samesite=lax`;
  try {
    localStorage.setItem("fomo_token", token);
  } catch {}
}

export function removeAuthToken(): void {
  document.cookie = `fomo_token=; path=/; max-age=0; samesite=lax`;
  try {
    localStorage.removeItem("fomo_token");
  } catch {}
}

export function getAuthToken(): string | null {
  try {
    // Prefer localStorage for ease
    const t = localStorage.getItem("fomo_token");
    console.log("Retrieved token from localStorage:", t);
    if (t) return t;
  } catch {}
  const match = document.cookie.match(new RegExp("(^| )fomo_token=([^;]+)"));
  return match ? match[2] : null;
}

export async function fetchMe(token: string): Promise<any> {
  const res = await fetch(`${STRAPI_URL}/api/users/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
}
