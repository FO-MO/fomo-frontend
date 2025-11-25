import { getAuthTokenCookie } from "../cookies";

// Strapi profile helper functions
const STRAPI_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export interface StudentProfile {
  documentId?: string;
  id?: number;
  studentId: string;
  name: string;
  email?: string;
  about?: string;
  college?: string;
  course?: string;
  graduationYear?: string;
  location?: string;
  skills?: string[];
  interests?: string[];
  followers?: string[];
  following?: string[];
  profilePic?: {
    id: number;
    url: string;
    name: string;
  } | null;
  backgroundImg?: {
    id: number;
    url: string;
    name: string;
  } | null;
  createdAt?: string;
  updatedAt?: string;
  user?: {
    id: number;
    email: string;
    username: string;
  };
  projects?: Record<string, unknown>[];
  clubs?: Record<string, unknown>[];
  internships?: Record<string, unknown>[];
}

export interface CreateProfileData {
  studentId: string;
  name: string;
  email?: string;
  about?: string;
  college?: string;
  course?: string;
  graduationYear?: string;
  location?: string;
  skills?: string[];
  interests?: string[];
  profilePic?: number; // Media ID
  backgroundImage?: number; // Media ID
}

/**
 * Fetch student profile by studentId (user's documentId or id)
 */
export async function getStudentProfile(
  studentId: string,
  token: string
): Promise<StudentProfile | null> {
  try {
    const res = await fetch(
      `${STRAPI_URL}/api/student-profiles?filters[studentId][$eq]=${encodeURIComponent(
        studentId
      )}&populate=*`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    if (!res.ok) return null;
    const json = await res.json();
    console.log("Fetched student profile:", json);
    return json?.data?.[0] || null;
  } catch (err) {
    console.error("Failed to fetch student profile:", err);
    return null;
  }
}

/**
 * Create a new student profile
 */
export async function createStudentProfile(
  data: CreateProfileData,
  token: string
): Promise<StudentProfile | null> {
  try {
    const res = await fetch(`${STRAPI_URL}/api/student-profiles`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ data }),
    });
    if (!res.ok) {
      console.error("Failed to create profile:", await res.text());
      return null;
    }
    const json = await res.json();
    return json?.data || null;
  } catch (err) {
    console.error("Failed to create student profile:", err);
    return null;
  }
}

/**
 * Update an existing student profile
 */
export async function updateStudentProfile(
  documentId: string,
  data: Partial<CreateProfileData>,
  token: string
): Promise<StudentProfile | null> {
  try {
    const res = await fetch(
      `${STRAPI_URL}/api/student-profiles/${documentId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ data }),
      }
    );
    if (!res.ok) {
      console.error("Failed to update profile:", await res.text());
      return null;
    }
    const json = await res.json();
    return json?.data || null;
  } catch (err) {
    console.error("Failed to update student profile:", err);
    return null;
  }
}

/**
 * Upload a file to Strapi
 */
export async function uploadFile(
  file: File,
  token: string
): Promise<{ id: number; url: string } | null> {
  try {
    console.log("Uploading file to Strapi:", file.name, file.type, file.size);

    const formData = new FormData();
    formData.append("files", file);

    const res = await fetch(`${STRAPI_URL}/api/upload`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error(
        "Failed to upload file. Status:",
        res.status,
        "Response:",
        errorText
      );
      return null;
    }

    const json = await res.json();
    console.log("Upload response:", json);

    if (Array.isArray(json) && json[0]) {
      return { id: json[0].id, url: json[0].url };
    }

    console.error("Unexpected upload response format:", json);
    return null;
  } catch (err) {
    console.error("Failed to upload file:", err);
    return null;
  }
}

/**
 * Check if a user has completed their profile
 */
export async function hasCompletedProfile(
  studentId: string,
  token: string
): Promise<boolean> {
  const profile = await getStudentProfile(studentId, token);
  if (!profile) return false;

  // Check if required fields are filled
  return !!(
    profile.name &&
    profile.college &&
    profile.course &&
    profile.graduationYear &&
    profile.about
  );
}

// ============= EMPLOYER PROFILE FUNCTIONS =============

interface MediaFile {
  id: number;
  url: string;
  name: string;
}

interface UserInfo {
  id: number;
  email: string;
  username: string;
}

export interface EmployerProfile {
  documentId?: string;
  id?: number;
  employerId: string;
  name: string;
  email?: string;
  phone?: string;
  phoneNumber?: string;
  country_code?: string;
  description?: string;
  website?: string;
  industry?: string;
  location?: string;
  noOfEmployers?: number;
  specialties?: string;
  profilePic?: MediaFile;
  backgroundImg?: MediaFile;
  createdAt?: string;
  updatedAt?: string;
  user?: UserInfo;
}

export interface CreateEmployerProfileData {
  employerId: string;
  name: string;
  email?: string;
  phone?: string;
  description?: string;
  website?: string;
  industry?: string;
  location?: string;
  noOfEmployers?: number;
  specialties?: string;
  profilePic?: number; // Media ID
  backgroundImg?: number; // Media ID
}

/**
 * Fetch employer profile by employerId (user's documentId or id)
 */
export async function getEmployerProfile(
  employerId: string,
  token: string = getAuthTokenCookie() || ""
): Promise<EmployerProfile | null> {
  try {
    const res = await fetch(
      `${STRAPI_URL}/api/employer-profiles?filters[employerId][$eq]=${encodeURIComponent(
        employerId
      )}&populate=*`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    if (!res.ok) return null;
    const json = await res.json();
    console.log("Fetched employer profile:", json);
    return json?.data?.[0] || null;
  } catch (err) {
    console.error("Failed to fetch employer profile:", err);
    return null;
  }
}

/**
 * Create a new employer profile
 */
export async function createEmployerProfile(
  data: CreateEmployerProfileData,
  token: string
): Promise<EmployerProfile | null> {
  try {
    const res = await fetch(`${STRAPI_URL}/api/employer-profiles`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ data }),
    });
    if (!res.ok) {
      console.error("Failed to create employer profile:", await res.text());
      return null;
    }
    const json = await res.json();
    return json?.data || null;
  } catch (err) {
    console.error("Failed to create employer profile:", err);
    return null;
  }
}

/**
 * Update an existing employer profile
 */
export async function updateEmployerProfile(
  documentId: string,
  data: Partial<CreateEmployerProfileData>,
  token: string
): Promise<EmployerProfile | null> {
  try {
    const res = await fetch(
      `${STRAPI_URL}/api/employer-profiles/${documentId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ data }),
      }
    );
    if (!res.ok) {
      console.error("Failed to update employer profile:", await res.text());
      return null;
    }
    const json = await res.json();
    return json?.data || null;
  } catch (err) {
    console.error("Failed to update employer profile:", err);
    return null;
  }
}
