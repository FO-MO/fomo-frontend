"use client";
// utils/fetchFromBackend.ts
export async function fetchFromBackend(
  endpoint: string,
  {
    backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL ||
      "https://tbs9k5m4-1337.inc1.devtunnels.ms",
    token = localStorage.getItem("fomo_token"),
    options = {},
  }: {
    backendUrl?: string;
    token?: string | null;
    options?: RequestInit;
  } = {}
) {
  try {
    const res = await fetch(`${backendUrl}/api/${endpoint}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
      ...options,
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch ${endpoint}: ${res.statusText}`);
    }

    const data = await res.json();
    console.log(`Fetched ${endpoint}:`, data.data);
    return data.data;
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error);
    throw error;
  }
}

export const backendurl =
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  "https://tbs9k5m4-1337.inc1.devtunnels.ms";
