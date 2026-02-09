"use client";
/*
 * @deprecated - This entire file is deprecated in favor of Supabase functions
 * Use functions from lib/supabase/database.ts instead
 * This file is kept temporarily for backward compatibility during migration
 */
import axios from "axios";
import { getAuthTokenCookie } from "./cookies";

//JSON---->
/*
 * @deprecated - Use Supabase database functions instead. See lib/supabase/database.ts
 * This function is kept for backward compatibility but should be migrated to Supabase
 */
export async function fetchFromBackend(
  endpoint: string,
  {
    backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL,
    token = getAuthTokenCookie(),
    options = {},
  }: {
    backendUrl?: string;
    token?: string | null;
    options?: Record<string, unknown>;
  } = {},
) {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        ...((options.headers as Record<string, string>) || {}),
      },
      ...options,
    };

    const response = await axios.get(`${backendUrl}/api/${endpoint}`, config);

    console.log(`Fetched ${endpoint}:`, response.data.data);
    return response.data.data;
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error);
    throw error;
  }
}

/*
 * @deprecated - Use Supabase database functions instead. See lib/supabase/database.ts
 * This function is kept for backward compatibility but should be migrated to Supabase
 */
export async function postFetchFromBackend(
  endpoint: string,
  payload: Record<string, unknown>,
  {
    backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL,
    token = getAuthTokenCookie(),
  }: {
    backendUrl?: string;
    token?: string | null;
  } = {},
) {
  try {
    console.log(`🚀 POST to ${endpoint}:`, payload);

    const response = await axios.post(
      `${backendUrl}/api/${endpoint}`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );

    console.log(`📡 Response from ${endpoint}:`, response.data);
    console.log(`✅ Successfully posted to ${endpoint}:`, response.data.data);
    return response.data; // Return full response for POST requests
  } catch (error) {
    console.error(`💥 Error posting to ${endpoint}:`, error);
    throw error;
  }
}

/*
 * @deprecated - Use Supabase database functions instead. See lib/supabase/database.ts
 * Use deleteJob() or deleteGlobalJobPosting() from lib/supabase/database.ts
 */
export async function deletecollegejobposting(id: string) {
  const token = getAuthTokenCookie();
  try {
    const response = await axios.delete(
      `${backendurl}/collegejobpostings/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    console.log("Deleted:", response.data);
  } catch (err) {
    console.log(err);
  }
}

/*
 * @deprecated - Use Supabase database functions instead. See lib/supabase/database.ts
 * Use deleteGlobalJobPosting() from lib/supabase/database.ts
 */
export async function deleteglobaljobposting(id: string) {
  const token = getAuthTokenCookie();

  // Try both possible endpoints
  const endpoints = [`${backendurl}/api/globaljobpostings/${id}`];

  for (const endpoint of endpoints) {
    try {
      console.log("Attempting to delete global job posting with ID:", id);
      console.log("Using URL:", endpoint);
      console.log("Token exists:", token ? "yes" : "no");

      const response = await axios.delete(endpoint, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Delete response:", response.data);
      return response.data;
    } catch (err) {
      console.log(`Failed with endpoint ${endpoint}:`, err);
      if (axios.isAxiosError(err)) {
        console.log("Status:", err.response?.status);
        console.log("Response data:", err.response?.data);
      }

      // If this is the last endpoint, throw the error
      if (endpoint === endpoints[endpoints.length - 1]) {
        throw err;
      }
    }
  }
}

/*
 * @deprecated - Use Supabase database functions instead. See lib/supabase/database.ts
 * Use updateGlobalJobPosting() from lib/supabase/database.ts
 */
export async function putglobaljobposting(
  id: string,
  payload: Record<string, unknown>,
) {
  const token = getAuthTokenCookie();
  try {
    console.log(`🔄 PUT to globaljobpostings/${id}:`, payload);

    const response = await axios.put(
      `${backendurl}/api/globaljobpostings/${id}`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );

    console.log(`📡 PUT Response:`, response.data);
    return response.data;
  } catch (err) {
    console.error("Error updating global job posting:", err);
    if (axios.isAxiosError(err)) {
      console.log("Status:", err.response?.status);
      console.log("Response data:", err.response?.data);
    }
    throw err;
  }
}

/*
 * @deprecated - Use Supabase database functions instead. See lib/supabase/database.ts
 * Legacy backend URL for backward compatibility
 */
export const backendurl =
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  "https://tbs9k5m4-1337.inc1.devtunnels.ms";
